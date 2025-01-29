from django.contrib import admin

from .models import Event, Booking, Payment, Wishlist, Review
# Register your models here.

admin.site.register(Event)
admin.site.register(Booking)
admin.site.register(Payment)
admin.site.register(Wishlist)
admin.site.register(Review)