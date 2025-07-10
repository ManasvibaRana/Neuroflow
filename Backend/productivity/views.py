from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import Productivity
from .serializers import ProductivitySerializer

class ProductivityViewSet(viewsets.ModelViewSet):
    queryset = Productivity.objects.all()
    serializer_class = ProductivitySerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.query_params.get('user')
        today = timezone.now().date()

        if user:
            queryset = queryset.filter(user__userid=user)

        if self.request.query_params.get('pending') == 'true':
            # show only past incomplete tasks
            queryset = queryset.filter(status=False, date__lt=today)
        elif self.request.query_params.get('today') == 'true':
            # show only today's tasks
            queryset = queryset.filter(date=today)
        # else: return ALL tasks for the user

        return queryset


    def create(self, request, *args, **kwargs):
        print("POST DATA:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("VALIDATION ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
