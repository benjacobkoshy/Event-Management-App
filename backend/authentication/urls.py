from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . views import signup, login, user_details

urlpatterns = [
    path('sign-up/',signup,name='register'),
    path('login/',login,name='login'),
    path('user-info/', user_details,name='user info'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]