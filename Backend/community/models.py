from django.db import models
from users.models import User  # import your own user model

class Post(models.Model):
    MOOD_CHOICES = [
        ("content", "Content"),
        ("peaceful", "Peaceful"),
        ("growth", "Growth"),
        ("reflective", "Reflective"),
        ("joyful", "Joyful"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    type = models.CharField(max_length=20, choices=MOOD_CHOICES)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.type}"

    @property
    def like_count(self):
        return self.likes.count()


class Like(models.Model):
    post = models.ForeignKey(Post, related_name="likes", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.text[:20]}"
