from django.utils import timezone
from django.db import models
from django.db import models
from users.models import User  
import math

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
    taken_time = models.DurationField()
    net_time = models.DurationField(blank=True,null=True)

    status = models.BooleanField(default=False)

    date = models.DateField()
    day = models.CharField(max_length=20)

    score = models.IntegerField()
    reflection = models.TextField(blank=True)

    def __str__(self):
        return f"{self.task} - {self.user.userid}"

    def save(self, *args, **kwargs):
        if not self.day:
            self.day = timezone.now().strftime("%A")
        if self.ideal_time and self.taken_time:
            self.net_time = self.ideal_time - self.taken_time 
        super().save(*args, **kwargs)
