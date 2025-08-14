# habit_tracker/views.py
from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Habit, HabitJournal
from .serializers import HabitSerializer
from users.models import User
from datetime import date

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
        For predefined quests, it populates the details from a local dictionary.
        For custom quests, it relies on the frontend to send all details.
        """
        user_id = self.request.data.get('user_id')
        pack_id = self.request.data.get('pack_id')

        try:
            user = User.objects.get(userid=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "User not found."})

        if Habit.objects.filter(user=user, completed=False).exists():
            raise serializers.ValidationError({"detail": "An active habit already exists."})

        # Prepare extra data to be injected into the save call for predefined packs
        extra_data = {}
        if pack_id in PREDEFINED_HABIT_PACKS:
            pack_details = PREDEFINED_HABIT_PACKS[pack_id]
            extra_data['name'] = pack_details['name']
            extra_data['description'] = pack_details['description']
            extra_data['avatar'] = pack_details['avatar']
            extra_data['theme'] = pack_details['theme']
        
        # The serializer uses validated_data from the request.
        # We supplement this with user, dates, and predefined pack details.
        serializer.save(
            user=user,
            start_date=date.today(),
            last_log_date=date.today(),
            **extra_data
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        journal_data = request.data.get('journal')
        current_day = request.data.get('current_day', instance.current_day)

        if journal_data:
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
        instance.current_day = current_day

        if instance.current_day >= 21:
            instance.completed = True

        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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

            # Erase previous log entries
            habit_to_restart.journal.all().delete()

            # Reset the habit's state
            habit_to_restart.start_date = date.today()
            habit_to_restart.last_log_date = date.today()
            habit_to_restart.current_day = 0
            habit_to_restart.completed = False
            
            habit_to_restart.save()

            serializer = self.get_serializer(habit_to_restart)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Habit.DoesNotExist:
            return Response({"detail": "Habit to restart not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error during restart: {e}")
            return Response({"detail": "An unexpected server error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)