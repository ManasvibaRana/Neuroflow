from rest_framework import serializers
from .models import JournalImage

class JournalImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalImage
        fields = '__all__'
