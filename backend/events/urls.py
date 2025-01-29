from django.urls import path
from .views import EventCreateView, EventListView, event_details, booking_list, create_payment_intent, save_booking, list_organizer_event

urlpatterns = [
    path('create/', EventCreateView.as_view(), name='event-create'),
    path('events/', EventListView.as_view(), name='event-list'),
    path('event-details/<int:event_id>/', event_details, name='event-details'),
    path('booking-list/',booking_list,name='booking'),
    path('create-payment-intent/',create_payment_intent, name="create-payment-intent"),
    path('save-booking/',save_booking, name="create-payment-intent"),
    path('list-organizer-event/',list_organizer_event),


]
