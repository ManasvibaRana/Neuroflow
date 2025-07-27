from rest_framework import viewsets, status
from rest_framework.response import Response
from django.utils import timezone

from .models import Productivity
from .serializers import ProductivitySerializer
from users.utils import update_streak # 1. Import the streak function

class ProductivityViewSet(viewsets.ModelViewSet):
    queryset = Productivity.objects.all()
    serializer_class = ProductivitySerializer

    def get_queryset(self):
        # No changes needed here
        queryset = super().get_queryset()
        user = self.request.query_params.get('user')
        today = timezone.now().date()

        if user:
            queryset = queryset.filter(user__userid=user)
        if self.request.query_params.get('pending') == 'true':
            queryset = queryset.filter(status=False, date__lt=today)
        elif self.request.query_params.get('today') == 'true':
            queryset = queryset.filter(date=today)

        return queryset

    def create(self, request, *args, **kwargs):
        # No changes needed here, as creating a task doesn't affect the streak
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()

        # 2. Check if this update is marking the task as complete
        is_marking_complete = request.data.get('status') is True and instance.status is False

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer) # This calls instance.save(), which runs your scoring logic

        # 3. If the task was just completed, trigger the streak logic
        if is_marking_complete:
            update_streak(instance.user)

        # 4. Add the current streak to the response for the frontend
        response_data = serializer.data
        
        # Refresh the user object to get the latest streak value
        instance.user.refresh_from_db() 
        response_data['current_streak'] = instance.user.streak

        return Response(response_data)