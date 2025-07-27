from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),  
    path('api/chatbot/', include('chatbot.urls')),
    path("journal/", include("journal.urls")),  
    path('music/', include('songs.urls')), 
    path("journalmedia/", include("journalmedia.urls")),
    path("productivity/", include('productivity.urls'),name='productivity'),
    path('api/analysis/', include('analysis.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
