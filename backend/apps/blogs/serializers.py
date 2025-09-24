from rest_framework import serializers
from .models import Blog
from apps.authentication.serializers import UserSerializer


class BlogListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    excerpt = serializers.CharField(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ('id', 'title', 'excerpt', 'image', 'author', 'created_at', 'likes_count', 'comments_count')

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()


class BlogDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ('id', 'title', 'content', 'image', 'author', 'created_at', 'updated_at', 'likes_count', 'comments_count')

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()


class BlogCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ('title', 'content', 'image')

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)