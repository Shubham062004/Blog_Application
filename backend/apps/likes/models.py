import uuid
from django.db import models
from django.contrib.auth import get_user_model
from apps.blogs.models import Blog

User = get_user_model()

class Like(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, db_column='blog_id')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'likes'
        unique_together = ('user', 'blog')

