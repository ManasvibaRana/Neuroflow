from django.http import JsonResponse
from .models import Song   

def get_songs(request):
    songs = Song.objects.all()
    data = []
    for song in songs:
        if not song.name.endswith("chime"):
            data.append({
                'id': song.id,
                'name': song.name,
                'url': request.build_absolute_uri(song.url),
            })
    return JsonResponse(data, safe=False)

def get_chime_by_name(request, name):
    chime = Song.objects.filter(name__iexact=name).first()
    if chime:
        return JsonResponse({
            'name': chime.name,
            'url': request.build_absolute_uri(chime.url)
        })
    return JsonResponse({'error': 'Chime not found'}, status=404)
