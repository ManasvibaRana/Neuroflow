from rest_framework import serializers
from .models import Productivity

# ✅ Custom ISO 8601 DurationField
class ISO8601DurationField(serializers.DurationField):
    def to_representation(self, value):
        if value is None:
            return None
        total_seconds = int(value.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        return f"PT{hours}H{minutes}M"

class ProductivitySerializer(serializers.ModelSerializer):
    ideal_time = ISO8601DurationField()
    taken_time = ISO8601DurationField()
    net_time = ISO8601DurationField()

    class Meta:
        model = Productivity
        fields = '__all__'
        read_only_fields = ('day', 'net_time')
