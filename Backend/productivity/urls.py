from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductivityViewSet, get_productivity_history # 1. Import the new view

router = DefaultRouter()
router.register(r'', ProductivityViewSet, basename='productivity')

# 2. Add a new urlpatterns list for your custom history URL
urlpatterns = [
    path("history/<str:userid>/<str:date_str>/", get_productivity_history, name="get-productivity-history"),
]

# 3. Add the router's URLs to your urlpatterns
urlpatterns += router.urls