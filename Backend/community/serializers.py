from rest_framework import serializers
from .models import Post, Comment, Like



class CommentSerializer(serializers.ModelSerializer):
    content = serializers.CharField(source="text")
    userName = serializers.SerializerMethodField()
    userAvatar = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'content', 'date_created', 'userName', 'userAvatar']

    def get_userName(self, obj):
        return obj.user.userid if obj.user else "Anonymous"

    def get_userAvatar(self, obj):
        if obj.user and hasattr(obj.user, 'profile') and obj.user.profile.avatar:
            return obj.user.profile.avatar.url
        return None


class PostSerializer(serializers.ModelSerializer):
    content = serializers.CharField(source="text")
    mood = serializers.CharField(source="type")
    userName = serializers.SerializerMethodField()
    userAvatar = serializers.SerializerMethodField()
    like_count = serializers.IntegerField(source="likes.count", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    userLiked = serializers.SerializerMethodField() 

    class Meta:
        model = Post
        fields = ['id', 'content', 'mood', 'date_created', 'like_count', 'userName', 'userAvatar', 'comments','userLiked']

    def get_userName(self, obj):
        return obj.user.userid if obj.user else "Anonymous"

    def get_userAvatar(self, obj):
        if obj.user and hasattr(obj.user, 'profile') and obj.user.profile.avatar:
            return obj.user.profile.avatar.url
        return None
    
    def get_userLiked(self, obj):
        current_user_id = self.context.get("current_user_id")
        if current_user_id:
            return obj.likes.filter(user__userid=current_user_id).exists()
        return False


# -------------------- Like Serializer --------------------
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'post', 'user', 'date_created']
        read_only_fields = ['id', 'date_created', 'user']
