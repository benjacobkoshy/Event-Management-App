from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class CustomerProfile(models.Model):
    LIVE = 0
    DELETE = 1
    DELETE_CHOICES = (
        (LIVE, 'Live'),
        (DELETE, 'Delete'),
    )

    # Fields
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile"
    )
    name = models.CharField(max_length=100)
    address = models.TextField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    place = models.CharField(max_length=50, blank=True)
    pin = models.CharField(max_length=10)
    dob = models.DateField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)  # For e-store customer verification
    
    GENDER_CHOICES = (
    ('male', 'Male'),
    ('female', 'Female'),
    )
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)


    # Role choices
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('organizer', 'Organizer'),
    )
    role = models.CharField(
        max_length=20, choices=ROLE_CHOICES, default='customer'
    )

    # Meta information
    deleted_status = models.IntegerField(
        choices=DELETE_CHOICES, default=LIVE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # String representation
    def __str__(self):
        return self.user.username
    
