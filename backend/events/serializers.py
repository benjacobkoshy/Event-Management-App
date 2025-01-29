from rest_framework import serializers
from .models import Event, Booking
from authentication.models import CustomerProfile\


class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.PrimaryKeyRelatedField(queryset=CustomerProfile.objects.all())

    class Meta:
        model = Event
        fields = ['id','name', 'description', 'start_date', 'end_date', 'start_time', 'end_time', 
                  'venue', 'city', 'zip_code', 'contact_email', 'contact_phone', 'ticket_price', 'tickets_left',
                  'max_attendees', 'tags', 'cancellation_policy', 'image_url', 'organizer']


class BookingSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='event.name', read_only=True)

    class Meta:
        model = Booking
        fields = ['name', 'tickets_booked', 'total_price', 'booking_date', 'status']
