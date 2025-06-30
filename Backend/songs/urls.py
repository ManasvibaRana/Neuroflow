from django.urls import path
from .views import get_songs

urlpatterns = [
    path('songs/', get_songs, name='get_songs'),
]