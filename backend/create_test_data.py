import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_api.settings')
django.setup()

from django.contrib.auth.models import User
from django.db import transaction

def create_test_data():
    """Create test data for local development"""
    
    # Create test users
    users_data = [
        {'username': 'john_doe', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe'},
        {'username': 'jane_smith', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
        {'username': 'mike_wilson', 'email': 'mike@example.com', 'first_name': 'Mike', 'last_name': 'Wilson'},
    ]
    
    with transaction.atomic():
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                print(f"✅ Created user: {user.username}")
            else:
                print(f"👤 User exists: {user.username}")

    print(f"🎉 Test data created! Total users: {User.objects.count()}")

if __name__ == '__main__':
    create_test_data()
