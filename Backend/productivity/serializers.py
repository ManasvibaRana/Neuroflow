from rest_framework import serializers
from .models import Productivity

class ProductivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Productivity
        fields = '__all__'
        read_only_fields = ('day', 'net_time')
