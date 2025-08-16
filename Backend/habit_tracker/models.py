# habit_tracker/models.py
from django.db import models
from users.models import User

class Habit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pack_id = models.CharField(max_length=50)
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    avatar = models.CharField(max_length=10, blank=True, null=True)
    theme = models.CharField(max_length=50, blank=True, null=True)
    start_date = models.DateField()
    current_day = models.IntegerField(default=0)
    last_log_date = models.DateField()
    completed = models.BooleanField(default=False)
    lives = models.IntegerField(default=3)

    def __str__(self):
        return f"{self.user.userid} - {self.pack_id}"


class HabitJournal(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='journal')
    day = models.IntegerField()
    entry = models.TextField()

    class Meta:
        unique_together = ('habit', 'day')