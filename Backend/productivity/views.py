from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

from .models import Productivity
from .serializers import ProductivitySerializer

class ProductivityViewSet(viewsets.ModelViewSet):
    queryset = Productivity.objects.all()
    serializer_class = ProductivitySerializer

    def create(self, request, *args, **kwargs):
        print("POST DATA:", request.data)  # 👈 log incoming data
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("VALIDATION ERRORS:", serializer.errors)  # 👈 log why it fails
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
