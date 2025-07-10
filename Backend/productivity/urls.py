from rest_framework.routers import DefaultRouter
from .views import ProductivityViewSet

router = DefaultRouter()
router.register(r'', ProductivityViewSet)  # Empty string means base

urlpatterns = router.urls