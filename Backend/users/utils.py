# A utility function to handle streak logic
from django.utils import timezone
from datetime import timedelta
from users.models import User
from journal.models import JournalEntry
from productivity.models import Productivity

def update_streak(user):
    """
    Updates or resets the user's streak based on the existence of
    a journal and a completed productivity task for the current day.
    """
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)

    # 1. Reset streak if the user missed a day.
    if user.last_streak_date and user.last_streak_date < yesterday:
        user.streak = 0
        user.save()

    # 2. If streak was already updated today, do nothing.
    if user.last_streak_date == today:
        return

    # 3. Check if both kinds of tasks are completed for today.
    # A journal entry exists for today
    has_journal_today = JournalEntry.objects.filter(user=user, date=today).exists()
    # At least one productivity task marked as complete (status=True) exists for today
    has_productivity_today = Productivity.objects.filter(user=user, date=today, status=True).exists()

    if has_journal_today and has_productivity_today:
        # 4. Both tasks are done, so update the streak.
        if user.last_streak_date == yesterday:
            user.streak += 1
        else:
            user.streak = 1 # Start a new streak
        
        user.last_streak_date = today
        user.save()