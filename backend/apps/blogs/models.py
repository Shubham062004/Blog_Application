import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Blog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.TextField()
    content = models.TextField()
    excerpt = models.TextField(blank=True, null=True)
    image = models.TextField(blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, db_column='author_id')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'blogs'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title