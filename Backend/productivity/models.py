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
    day = models.CharField(max_length=20, blank=True) # Made blank=True for robustness

    score = models.IntegerField(default=0)
    reflection = models.TextField(blank=True)

    def _str_(self):
        return f"{self.task} - {self.user.userid}"

    def calculate_score(self):
        # NOTE: This function is now only called by save() when a task is first completed.
        base_score = 100

        # ⭐ NEW PENALTY LOGIC: Weights are based on the task's quadrant.
        penalty_weights = {
            'DO':       {'hour': 10,  'minute': 1, 'day': 10}, # Urgent & Important: Lowest penalty
            'DECIDE':   {'hour': 15, 'minute': 1, 'day': 20}, # Not Urgent & Important: Medium penalty
            'DELEGATE': {'hour': 25, 'minute': 2, 'day': 30}, # Urgent & Not Important: High penalty
            'DELETE':   {'hour': 35, 'minute': 3, 'day': 40}  # Not Urgent & Not Important: Highest penalty
        }
        weights = penalty_weights.get(self.type_of_task, penalty_weights['DECIDE'])

        penalty = 0

        # 1. Penalty for taking more time than ideal
        if self.net_time and self.net_time.total_seconds() < 0:
            over_time = abs(self.net_time)
            hours_over = over_time.total_seconds() // 3600
            minutes_over = (over_time.total_seconds() % 3600) // 60
            penalty += int(hours_over) * weights['hour']
            penalty += int(minutes_over) * weights['minute']

        # 2. Penalty for completing the task late
        # We use the current date, which is safe because this function
        # is only called at the exact moment of completion.
        completion_date = timezone.now().date()
        days_late = (completion_date - self.date).days
        if days_late > 0:
            penalty += days_late * weights['day']

        self.score = max(base_score - penalty, 0)

    def save(self, *args, **kwargs):
        # ⭐ NEW SAVE LOGIC: Checks the task's status before saving.
        _original_status = False
        if self.pk: # If the object is not new
            _original_status = Productivity.objects.get(pk=self.pk).status

        # Update derivative fields
        if self.date and not self.day:
            self.day = self.date.strftime("%A")
        if self.ideal_time and self.taken_time:
            self.net_time = self.ideal_time - self.taken_time

        is_being_completed = self.status and not _original_status
        is_being_reopened = not self.status and _original_status

        if is_being_completed:
            # If status changes from False -> True, calculate the score.
            self.calculate_score()
        elif is_being_reopened:
            # If status changes from True -> False, reset the score.
            self.score = 0
        elif not self.pk:
            # If it's a new, incomplete task, ensure score is 0.
            self.score = 0
        # If the task was already complete, we do nothing, preserving the original score.

        super().save(*args, **kwargs)