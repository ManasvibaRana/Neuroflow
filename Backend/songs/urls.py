from django.urls import path
from .views import get_songs,get_chime_by_name

urlpatterns = [
    path('songs/', get_songs, name='get_songs'),
     path('api/chime/<str:name>/', get_chime_by_name),
]