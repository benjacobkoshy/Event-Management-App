from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated

from .models import CustomerProfile

from rest_framework_simplejwt.tokens import RefreshToken

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated access to this endpoint
def signup(request):
    """
    User signup endpoint that creates a new user, their profile, and issues JWT tokens.
    """
    try:
        data = request.data
        print(data)
        name = data.get('name')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        

        # Validate required fields
        if not all([name, username, email, password, role]):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create user and profile within a transaction
        with transaction.atomic():
            user = User.objects.create_user(username=username, email=email, password=password)
            CustomerProfile.objects.create(user=user, name=name, role=role)

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Return response with access and refresh tokens
        return Response({
            'message': 'User created successfully',
            'access_token': access_token,
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': role,
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Error occurred: {e}")  # Log for debugging
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):

    try:
        # Parse request data
        data = request.data
        print(data)
        username_or_email = data.get('email')
        password = data.get('password')

        # Validate email and password presence
        if not username_or_email or not password:
            return Response(
                {'error': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate user
        try:
            if '@' in username_or_email:  # Determine if input is an email
                user = User.objects.get(email=username_or_email)
                username = user.username
            else:
                username = username_or_email
        except User.DoesNotExist:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)

        # print(user.profile.role)
        if user is None:
            return Response(
                {'error': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Return success response with tokens
        return Response(
            {
                'message': 'Login successful.',
                'access_token': access_token,
                'refresh_token': str(refresh),
                'role':user.profile.role,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        print(f"Error occurred during login: {e}")
        return Response(
            {'error': 'An unexpected error occurred. Please try again later.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def user_details(request):
    user = request.user  # Get the logged-in user
    user_profile = getattr(user, 'profile', None)  # Safely get the profile

    if request.method == 'GET':
        try:
            # Retrieve basic user details
            user_data = {
                "name": user_profile.name if user_profile else "",
                "username": user.username,
                "email": user.email,
                "address": user_profile.address if user_profile else "",
                "phone": user_profile.phone_number if user_profile else "",
                "place": user_profile.place if user_profile else "",
                "pin": user_profile.pin if user_profile else "",
                "dob": user_profile.dob if user_profile else None,
                "gender": user_profile.gender if user_profile else "",
            }
            return Response(user_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"message": "An error occurred while fetching the profile data.", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    if request.method == 'POST':
        try:
            data = request.data
            address = data.get('address')
            phone_number = data.get('phone')
            place = data.get('place')
            pin = data.get('pin')
            dob = data.get('dob')
            gender = data.get('gender')

            with transaction.atomic():
                # Create or update the profile
                profile, created = CustomerProfile.objects.get_or_create(user=user)
                profile.address = address or profile.address
                profile.phone_number = phone_number or profile.phone_number
                profile.place = place or profile.place
                profile.pin = pin or profile.pin
                profile.dob = dob or profile.dob
                profile.gender = gender or profile.gender
                profile.is_verified = True
                profile.save()

            return Response(
                {'message': 'Profile updated successfully.'},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"message": "An error occurred while updating the profile.", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
