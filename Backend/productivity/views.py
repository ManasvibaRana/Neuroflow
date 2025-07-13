from rest_framework import viewsets, status
from rest_framework.response import Response
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
            queryset = queryset.filter(status=False, date__lt=today)
        elif self.request.query_params.get('today') == 'true':
            queryset = queryset.filter(date=today)

        return queryset

    def create(self, request, *args, **kwargs):
        print("POST DATA:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("VALIDATION ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # If marking complete: recalculate net_time & score
        if serializer.validated_data.get('status') == True:
            instance.taken_time = serializer.validated_data.get('taken_time', instance.taken_time)
            instance.net_time = instance.ideal_time - instance.taken_time
            instance.status = True
            instance.calculate_score()
            instance.save()

        self.perform_update(serializer)
        return Response(serializer.data)
