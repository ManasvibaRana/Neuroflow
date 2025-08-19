from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from users.models import User

from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer, LikeSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-date_created')
    serializer_class = PostSerializer

    

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        # Pass current_user_id from query params or headers (sent from frontend)
        context["current_user_id"] = self.request.data.get("user_id") or self.request.query_params.get("user_id")
        return context

    def perform_create(self, serializer):
        user_id = self.request.data.get("user_id")
        content = self.request.data.get("content")
        mood = self.request.data.get("mood")

        # Validate user_id
        if not user_id:
            raise ValidationError({"user_id": "This field is required."})
        try:
            user = User.objects.get(userid=user_id)
        except User.DoesNotExist:
            raise ValidationError({"user_id": f"No user found with userid={user_id}"})

        # Validate content
        if not content or not content.strip():
            raise ValidationError({"content": "Post content cannot be empty."})

        # Validate mood
        valid_choices = [choice[0] for choice in Post.MOOD_CHOICES]
        if not mood or mood.lower() not in valid_choices:
            raise ValidationError({"mood": f"Invalid mood. Choose from {valid_choices}"})

        serializer.save(
            user=user,
            text=content.strip(),
            type=mood.lower()
        )

    def perform_update(self, serializer):
        user_id = self.request.data.get("user_id")
        content = self.request.data.get("content", serializer.instance.text)
        mood = self.request.data.get("mood", serializer.instance.type)

        # Validate user_id
        if not user_id:
            raise ValidationError({"user_id": "This field is required."})
        try:
            User.objects.get(userid=user_id)
        except User.DoesNotExist:
            raise ValidationError({"user_id": f"No user found with userid={user_id}"})

        # Validate content
        if not content or not str(content).strip():
            raise ValidationError({"content": "Post content cannot be empty."})

        # Validate mood
        valid_choices = [choice[0] for choice in Post.MOOD_CHOICES]
        if mood and mood.lower() not in valid_choices:
            raise ValidationError({"mood": f"Invalid mood. Choose from {valid_choices}"})

        serializer.save(
            text=content.strip(),
            type=mood.lower() if mood else serializer.instance.type
        )

    @action(detail=True, methods=['post'], url_path='like')
    def toggle_like(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        user_id = request.data.get("user_id")

        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(userid=user_id)
        except User.DoesNotExist:
            return Response({"error": "Invalid user_id"}, status=status.HTTP_404_NOT_FOUND)

        like = Like.objects.filter(post=post, user=user).first()
        if like:
            like.delete()
            return Response({"message": "Like removed"}, status=status.HTTP_200_OK)
        else:
            Like.objects.create(post=post, user=user)
            return Response({"message": "Post liked"}, status=status.HTTP_201_CREATED)




class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-date_created')
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        user_id = self.request.data.get("user_id")
        text = self.request.data.get("content")
        post_id = self.request.data.get("post")

        # Validate user
        if not user_id:
            raise ValidationError({"user_id": "This field is required."})
        try:
            user = User.objects.get(userid=user_id)
        except User.DoesNotExist:
            raise ValidationError({"user_id": f"No user found with userid={user_id}"})

        # Validate text
        if not text or not text.strip():
            raise ValidationError({"text": "Comment cannot be empty."})

        # Validate post
        if not post_id:
            raise ValidationError({"post": "Post ID is required."})
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            raise ValidationError({"post": f"No post found with id={post_id}"})

        # Save the comment
        comment = serializer.save(user=user, post=post, text=text.strip())

        # Return the full serialized comment
        self.response_data = CommentSerializer(comment).data

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(self.response_data, status=status.HTTP_201_CREATED, headers=headers)



class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all().order_by('-date_created')
    serializer_class = LikeSerializer

    def perform_create(self, serializer):
        user_id = self.request.data.get("user_id")

        # Validate user_id
        if not user_id:
            raise ValidationError({"user_id": "This field is required."})
        try:
            user = User.objects.get(userid=user_id)
        except User.DoesNotExist:
            raise ValidationError({"user_id": f"No user found with userid={user_id}"})

        serializer.save(user=user)
