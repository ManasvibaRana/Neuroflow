from django.db import models
from django.conf import settings  # ✅ correct import!

class Song(models.Model):
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    mp3_file = models.FileField(upload_to='songs/')

    def __str__(self):
        return f"{self.name} by {self.artist}"

    @property
    def url(self):
        return f"{settings.MEDIA_URL}{self.mp3_file}"
