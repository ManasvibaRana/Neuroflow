from django.urls import path
from .views import analyze_journal_only, save_journal 

urlpatterns = [
    path("analyze/", analyze_journal_only),
    path("save/", save_journal),
]
