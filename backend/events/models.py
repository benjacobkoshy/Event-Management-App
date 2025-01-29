from django.db import models
from authentication.models import CustomerProfile
from django.contrib.auth.models import User
# Create your models here.

from django.utils.timezone import now

class Event(models.Model):
    organizer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='organized_events')
    name = models.CharField(max_length=255)
    image_url = models.URLField(blank=True, null=True)  # Add image URL field
    description = models.TextField()
    venue = models.CharField(max_length=255)
    city = models.CharField(max_length=255, null=True)
    zip_code = models.CharField(max_length=255)
    contact_email = models.CharField(max_length=255)
    contact_phone = models.CharField(max_length=255)
    ticket_price = models.DecimalField(max_digits=8, decimal_places=2)
    max_attendees = models.PositiveIntegerField()
    tickets_left = models.IntegerField(null=True, blank=True) 

    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    tags = models.CharField(max_length=255, null=True, blank=True)  # Or use a ManyToManyField with a Tag model
    cancellation_policy = models.TextField(null=True, blank=True)
    
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    start_time = models.CharField(null=True, max_length=20, blank=True)
    end_time = models.CharField(null=True, max_length=20, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def update_status_based_on_date(self):
        """Automatically updates the event's status based on the date."""
        today = now().date()
        if self.end_date and today > self.end_date:
            self.status = 'completed'
        elif self.start_date and today < self.start_date:
            self.status = 'active'
        self.save()


class Booking(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings')
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='bookings')
    tickets_booked = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=[('confirmed', 'Confirmed'), ('canceled', 'Canceled')],
        default='confirmed'
    )

    def __str__(self):
        return f"Booking by {self.customer.user.username} for {self.event.name}"

class Review(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reviews')
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField()  # 1 to 5 scale
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.customer.user.username} for {self.event.name}"


class Payment(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    payment_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=10,
        choices=[('success', 'Success'), ('failed', 'Failed'), ('pending', 'Pending')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for {self.booking.event.name} by {self.booking.customer.user.username}"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username