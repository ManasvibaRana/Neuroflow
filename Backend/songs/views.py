from django.http import JsonResponse
from .models import Song   

def get_songs(request):
    songs = Song.objects.all()
    data = []
    for song in songs:
        data.append({
            'id': song.id,
            'name': song.name,
            'url': request.build_absolute_uri(song.url),
        })
    return JsonResponse(data, safe=False)
