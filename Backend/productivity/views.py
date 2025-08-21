from rest_framework import viewsets, status
from rest_framework.response import Response
from django.utils import timezone

from .models import Productivity
from .serializers import ProductivitySerializer
from users.utils import update_streak # 1. Import the streak function
from rest_framework.decorators import api_view
from django.utils.dateparse import parse_date
from users.models import User 

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
    



@api_view(["GET"])
def get_productivity_history(request, userid, date_str):
    try:
        user = User.objects.get(userid=userid)
    except User.DoesNotExist:
        return Response({"error": "Invalid user ID."}, status=401)

    selected_date = parse_date(date_str)
    if not selected_date:
        return Response({"error": "Invalid date format, expected YYYY-MM-DD"}, status=400)

    # Find all tasks for the given user and date
    tasks = Productivity.objects.filter(user=user, date=selected_date)

    if not tasks.exists():
        return Response({"message": "No productivity log found for this date."}, status=404)

    # Serialize the list of tasks
    serializer = ProductivitySerializer(tasks, many=True)
    
    # Return the data in the format the frontend expects
    return Response({
        "date": selected_date.strftime("%Y-%m-%d"),
        "tasks": serializer.data
    })