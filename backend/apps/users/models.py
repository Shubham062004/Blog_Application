import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.TextField(blank=True, null=True)
    profile_image = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Django requires username field, but we'll use email for login
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        # Generate username from email if not provided
        if not self.username:
            self.username = self.email.split('@')[0] + str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)
