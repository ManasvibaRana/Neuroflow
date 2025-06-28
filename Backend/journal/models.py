from django.db import models
from users.models import User # Ensure this import comes from the same app or adjust accordingly

class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Uses userid as PK by default
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    journal_text = models.TextField()

    emotion_1 = models.CharField(max_length=30)
    score_1 = models.FloatField()
    emotion_2 = models.CharField(max_length=30, blank=True, null=True)
    score_2 = models.FloatField(blank=True, null=True)
    emotion_3 = models.CharField(max_length=30, blank=True, null=True)
    score_3 = models.FloatField(blank=True, null=True)

    top_emotion_sentences = models.TextField(help_text="Sentences triggering top emotion")

    def __str__(self):
        return f"{self.user.userid} - {self.date} - {self.emotion_1}"
