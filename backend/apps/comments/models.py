import uuid
from django.db import models
from django.contrib.auth import get_user_model
from apps.blogs.models import Blog

User = get_user_model()

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, db_column='blog_id')
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'comments'
        ordering = ['-created_at']

