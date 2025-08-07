from django.urls import path
from .views import signup
from .views import login
from .views import verify_otp
from .views import send_mail
from .views import get_user_stats

urlpatterns = [
    path('signup/', signup),
    path('login/', login),
    path('verify-otp/',verify_otp),
    path('get-user-stats/', get_user_stats),
]
