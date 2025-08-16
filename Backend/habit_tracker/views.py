# habit_tracker/views.py
from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Habit, HabitJournal
from .serializers import HabitSerializer
from users.models import User
from datetime import date, timedelta

# Define the details for predefined habit packs
PREDEFINED_HABIT_PACKS = {
    'fitness': {
        'name': 'Fitness Quest',
        'description': 'Forge discipline and sculpt your physique.',
        'avatar': '🏋️',
        'theme': 'forest',
    },
    'reading': {
        'name': 'Reading Odyssey',
        'description': 'Journey through new worlds and expand your mind.',
        'avatar': '📚',
        'theme': 'celestial',
    },
    'mindfulness': {
        'name': 'Path of Presence',
        'description': 'Cultivate inner calm and sharpen your focus.',
        'avatar': '🧘',
        'theme': 'ocean',
    },
}


class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    queryset = Habit.objects.all()

    def get_queryset(self):
        """
        Filters habits by user_id for the 'list' action.
        """
        user_id = self.request.query_params.get('user_id')
        if self.action == 'list' and user_id:
            return self.queryset.filter(user__userid=user_id).order_by('-start_date')
        return self.queryset

    def perform_create(self, serializer):
        """
        Creates a new habit.
        """
        user_id = self.request.data.get('user_id')
        pack_id = self.request.data.get('pack_id')

        try:
            user = User.objects.get(userid=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "User not found."})

        if Habit.objects.filter(user=user, completed=False).exists():
            raise serializers.ValidationError({"detail": "An active habit already exists."})

        extra_data = {}
        if pack_id in PREDEFINED_HABIT_PACKS:
            pack_details = PREDEFINED_HABIT_PACKS[pack_id]
            extra_data.update(pack_details)
        
        # Set last_log_date to yesterday to allow logging on day 1
        serializer.save(
            user=user,
            start_date=date.today(),
            last_log_date=date.today() - timedelta(days=1),
            lives=3,
            **extra_data
        )

    def update(self, request, *args, **kwargs):
        """
        Updates a habit, handles daily logging, and manages lives.
        """
        instance = self.get_object()
        journal_data = request.data.get('journal')
        current_day_from_request = request.data.get('current_day', instance.current_day)

        reset_flag = False  # Track if reset happened

        if journal_data:
            days_missed = (date.today() - instance.last_log_date).days

            # 1. Enforce one log per day
            if days_missed == 0:
                return Response({"detail": "You can only log once per day."}, status=status.HTTP_400_BAD_REQUEST)

            # 2. Lose 1 life if ANY day(s) missed
            if days_missed > 1:
                instance.lives -= 1

            # 3. If lives drop to 0 or below after loss → reset immediately
            if instance.lives <= 0:
                instance.current_day = 0
                instance.lives = 3
                instance.journal.all().delete()
                instance.start_date = date.today()
                instance.last_log_date = date.today() - timedelta(days=1)
                instance.save()
                reset_flag = True
                serializer = self.get_serializer(instance)
                data = serializer.data
                data["reset"] = True
                return Response(data, status=status.HTTP_200_OK)

            # 4. Gain a life on milestones (even if you just lost one above)
            if current_day_from_request in [7, 14, 20] and instance.lives < 3:
                instance.lives += 1

            # 5. Save journal entry
            for entry_data in journal_data:
                day = entry_data.get('day')
                entry = entry_data.get('entry')
                if day is not None and entry is not None:
                    HabitJournal.objects.update_or_create(
                        habit=instance,
                        day=day,
                        defaults={'entry': entry}
                    )

            instance.last_log_date = date.today()

        # 6. Update current day
        instance.current_day = current_day_from_request

        # 7. Mark completed if >= 21
        if instance.current_day >= 21:
            instance.completed = True

        instance.save()
        serializer = self.get_serializer(instance)
        data = serializer.data
        data["reset"] = reset_flag
        return Response(data)

    @action(detail=True, methods=['post'])
    def restart(self, request, pk=None):
        """
        Restarts a completed habit.
        """
        try:
            habit_to_restart = self.get_object()

            if not habit_to_restart.completed:
                return Response(
                    {"detail": "Cannot restart a quest that is not completed."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Clear old journal entries
            habit_to_restart.journal.all().delete()

            # Reset habit attributes
            habit_to_restart.start_date = date.today()
            # **FIXED**: Set last_log_date to yesterday to allow logging on the first day
            habit_to_restart.last_log_date = date.today() - timedelta(days=1)
            habit_to_restart.current_day = 0
            habit_to_restart.completed = False
            habit_to_restart.lives = 3
            
            habit_to_restart.save()

            serializer = self.get_serializer(habit_to_restart)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Habit.DoesNotExist:
            return Response({"detail": "Habit to restart not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error during restart: {e}")
            return Response({"detail": "An unexpected server error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)