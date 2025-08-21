from django.urls import path
from .views import analyze_journal_only, save_journal,get_today_journal,get_journal_history

urlpatterns = [
    path("analyze/", analyze_journal_only),
    path("save/", save_journal),
    path('today/<str:userid>/', get_today_journal, name='get-today-journal'), 
    path("history/<str:userid>/<str:date_str>/", get_journal_history, name="get-journal-history"), 

]
