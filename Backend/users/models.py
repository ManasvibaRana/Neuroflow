from django.db import models
from django.core.validators import MinLengthValidator

class User(models.Model):
    userid = models.CharField(max_length=50, unique=True, primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, validators=[MinLengthValidator(8)])

    def __str__(self):
        return self.userid
