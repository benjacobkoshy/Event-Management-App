from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters import rest_framework as filters
from django.shortcuts import get_object_or_404
from .models import Event
from .serializers import EventSerializer, BookingSerializer
from authentication.models import CustomerProfile
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from .models import Booking


class EventCreateView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def post(self, request):
        # Ensure the user has a profile
        try:
            organizer = request.user.profile
        except CustomerProfile.DoesNotExist:
            return Response({"message": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['organizer'] = organizer.id  # Add the organizer ID to the data

        serializer = EventSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Event created successfully.",
                "event": serializer.data
            }, status=status.HTTP_201_CREATED)
        
        # Debugging: Print the serializer errors
        # print("Serializer Errors:", serializer.errors)

        return Response({
            "message": "Failed to create event.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)




class EventFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    city = filters.CharFilter(field_name='city', lookup_expr='icontains')
    tags = filters.CharFilter(field_name='tags', lookup_expr='icontains')
    start_date = filters.DateFilter(field_name='start_date', lookup_expr='gte')  # Greater than or equal to
    end_date = filters.DateFilter(field_name='end_date', lookup_expr='lte')  # Less than or equal to

    class Meta:
        model = Event
        fields = ['name', 'city', 'tags', 'start_date', 'end_date']


class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allow unauthenticated users to read
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = EventFilter
    search_fields = ['name', 'description', 'tags']

    def get_queryset(self):
        """
        Optionally restricts the returned events by filtering against
        query parameters in the URL.
        """
        queryset = self.queryset

        # Apply filters based on the query parameters
        return queryset


from django.http import JsonResponse, Http404
from .models import Event
from .serializers import EventSerializer

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def event_details(request, event_id):
    try:
        # Fetch the event by ID
        event = Event.objects.get(id=event_id)
        user = request.user
        user_profile = user.profile
        is_verifed = user_profile.is_verified

        # Serialize the event data
        serializer = EventSerializer(event)
        event_data = serializer.data

        # Handle the `tags` field based on its type
        if isinstance(event.tags, str):  # If tags are stored as a comma-separated string
            tags = event.tags.split(',') if event.tags else []
        else:
            # If tags is a ManyToManyField or similar
            tags = [tag.name for tag in event.tags.all()] if hasattr(event, 'tags') else []

        # Add additional/computed fields
        additional_data = {
            "ticketsLeft": event.tickets_left,
            "organizerContact": event.contact_email,  # Already in serializer
            "tags": tags,
            "is_verified": is_verifed,
        }

        # Combine serialized data with additional fields
        data = {**event_data, **additional_data}

        return JsonResponse(data, safe=False)
    except Event.DoesNotExist:
        raise Http404("Event not found")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_list(request):
    user = request.user
    # print(user)
    user_profile = get_object_or_404(CustomerProfile, user=user)

    bookings = Booking.objects.filter(customer=user_profile)

    if bookings.exists():
        serializer = BookingSerializer(bookings, many=True)
        # print(serializer.data)
        return JsonResponse({"bookings": serializer.data}, status=200)
    else:
        return JsonResponse({"message": "Nothing to show"}, status=200)
    

import stripe
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Set your secret key (make sure this is securely stored in settings.py)
stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
def create_payment_intent(request):
    if request.method == 'POST':
        try:
            data = request.data
            amount = data.get('amount')  # Amount in cents
            # print(amount)
            # Create PaymentIntent
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="inr",  # Or use "inr" if you're using INR
                payment_method_types=["card"],
            )

            # Return the client secret for the PaymentIntent
            # print("clientSecret", intent.client_secret, "id", intent.id)
            return Response({"client_secret": intent.client_secret, "id": intent.id})

        except Exception as e:
            return Response({"error": str(e)}, status=400)


from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Event, Booking, CustomerProfile

@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view(['POST'])  # 🔹 Change GET to POST
def save_booking(request):
    try:
        data = request.data  # ✅ Correct way to read request data in DRF
        event_id = data.get('event_id')
        amount_paid = data.get('amount_paid')
        tickets_booked = data.get('tickets')

        # 🔹 Validate input data
        if not all([event_id, amount_paid, tickets_booked]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        # 🔹 Get event & customer
        event = get_object_or_404(Event, id=event_id)
        customer = get_object_or_404(CustomerProfile, user=request.user)

        event.tickets_left -= tickets_booked
        event.save()
        # 🔹 Save booking in database
        booking = Booking.objects.create(
            event=event,
            customer=customer,
            tickets_booked=tickets_booked,
            total_price=amount_paid,
        )

        return JsonResponse({
            'message': 'Booking saved successfully',
            'booking_id': booking.id,
            'event_name': event.name,
            'tickets_booked': booking.tickets_booked,
            'total_price': str(booking.total_price),
            'status': booking.status
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': f'Error saving booking: {str(e)}'}, status=500)
    

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import Event
from .serializers import EventSerializer

@api_view(['POST'])  # POST because we may need authentication in headers
@permission_classes([IsAuthenticated])
def list_organizer_event(request):
    try:
        # Get the authenticated user
        user = request.user
        
        # Ensure the user has an associated profile
        if not hasattr(user, 'profile'):
            return JsonResponse({'error': 'User profile not found.'}, status=400)
        
        # Get organizer profile linked to the user
        organizer_profile = user.profile
        
        # Fetch only events created by this organizer and order by 'created_at'
        events = Event.objects.filter(organizer=organizer_profile).order_by('-created_at')

        # Serialize event data
        serializer = EventSerializer(events, many=True)
        # print(serializer.data)
        # Return serialized event data
        return JsonResponse({'events': serializer.data}, status=200)

    except Exception as e:
        # Log the error in the server logs for debugging
        print(f"Error fetching events: {str(e)}")
        return JsonResponse({'error': f'Error fetching events: {str(e)}'}, status=500)
