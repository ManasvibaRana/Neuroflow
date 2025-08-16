from rest_framework import serializers
from .models import Habit, HabitJournal

class HabitJournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitJournal
        fields = ['day', 'entry']

class HabitSerializer(serializers.ModelSerializer):
    journal = HabitJournalSerializer(many=True, read_only=True)


    class Meta:
        model = Habit
        fields = '__all__'
        read_only_fields = ('user', 'start_date', 'last_log_date')
