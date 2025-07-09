from django.db import models
from journal.models import JournalEntry  

# class JournalImage(models.Model):
#     journal = models.ForeignKey(JournalEntry, on_delete=models.CASCADE, related_name='images')
#     image = models.ImageField(upload_to='journal_images/')

#     def __str__(self):
#         return f"Image for Journal {self.journal.id}"

class JournalImage(models.Model):
    journal = models.ForeignKey(JournalEntry, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='journal_images/')
    caption = models.CharField(max_length=255, blank=True)  # <- ✨ NEW
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for Journal {self.journal.id}"
