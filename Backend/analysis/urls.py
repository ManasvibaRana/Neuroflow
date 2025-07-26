from django.urls import path
from .views import analysis_view
from .views import streak_and_badge

urlpatterns = [
    path('', analysis_view, name='analysis'),
    path('streak_badge/', streak_and_badge),
]
