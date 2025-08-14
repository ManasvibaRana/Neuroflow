from django.contrib import admin
from .models import Habit, HabitJournal

# Register your models here.
admin.site.register(Habit)
admin.site.register(HabitJournal)