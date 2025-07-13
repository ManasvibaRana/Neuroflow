from django.utils import timezone
from django.db import models
from users.models import User
from datetime import timedelta


class Productivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.CharField(max_length=500)

    TYPE_CHOICES = [
        ('DO', 'Do This'),
        ('DECIDE', 'Decide This'),
        ('DELEGATE', 'Delegate This'),
        ('DELETE', 'Delete This'),
    ]
    type_of_task = models.CharField(max_length=10, choices=TYPE_CHOICES)

    ideal_time = models.DurationField()
    taken_time = models.DurationField(default=timedelta)
    net_time = models.DurationField(blank=True, null=True)

    status = models.BooleanField(default=False)

    date = models.DateField()
    day = models.CharField(max_length=20)

    score = models.IntegerField(default=0)
    reflection = models.TextField(blank=True)

    def __str__(self):
        return f"{self.task} - {self.user.userid}"

    def calculate_score(self):
        base_score = {
            'DO': 100,
            'DECIDE': 75,
            'DELEGATE': 50,
            'DELETE': 25
        }.get(self.type_of_task, 0)

        penalty = 0

        if self.net_time and self.net_time.total_seconds() < 0:
            over_time = abs(self.net_time)
            hours_over = over_time.total_seconds() // 3600
            minutes_over = (over_time.total_seconds() % 3600) // 60
            penalty += int(hours_over) * 10
            penalty += int(minutes_over) * 1

        now = timezone.now().date()
        days_late = (now - self.date).days
        if days_late > 0:
            penalty += days_late * 20

        final_score = max(base_score - penalty, 0)
        self.score = final_score

    def save(self, *args, **kwargs):
        if not self.day:
            self.day = timezone.now().strftime("%A")
        if self.ideal_time and self.taken_time:
            self.net_time = self.ideal_time - self.taken_time

        self.calculate_score() 
        super().save(*args, **kwargs)
