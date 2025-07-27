from django.db import models
from django.core.validators import MinLengthValidator
from django.utils import timezone


class User(models.Model):
    userid = models.CharField(max_length=50, unique=True, primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, validators=[MinLengthValidator(8)])
    streak = models.IntegerField(default=0)
    last_streak_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.userid


class PendingUser(models.Model):
    userid = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    hashed_password = models.CharField(max_length=128)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.email
