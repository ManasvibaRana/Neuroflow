from django.urls import path
from .views import analyze_journal_only, save_journal,get_today_journal

urlpatterns = [
    path("analyze/", analyze_journal_only),
    path("save/", save_journal),
    path('today/<str:userid>/', get_today_journal, name='get-today-journal'),  
]
