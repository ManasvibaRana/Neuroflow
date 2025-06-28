from django.contrib import admin
from .models import JournalEntry

@admin.register(JournalEntry)
class JournalAdmin(admin.ModelAdmin):
    list_display = ("user", "date", "emotion_1", "score_1", "emotion_2", "score_2", "emotion_3", "score_3","top_emotion_sentences")
    search_fields = ("user__username", "journal_text")
    list_filter = ("emotion_1", "date")
    ordering = ("-created_at",)
    readonly_fields = (
        "user", "date", "created_at", "journal_text",
        "emotion_1", "score_1", "emotion_2", "score_2", "emotion_3", "score_3",
        "top_emotion_sentences"
    )
