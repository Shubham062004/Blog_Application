from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Blog


class BlogTestCase(APITestCase):
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='pass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='pass123'
        )
        
        self.blog = Blog.objects.create(
            title='Test Blog',
            content='This is a test blog content.',
            author=self.user1
        )
        
        self.blog_list_url = reverse('blog-list-create')
        self.blog_detail_url = reverse('blog-detail', kwargs={'pk': self.blog.pk})
    
    def get_token(self, user):
        """Helper method to get JWT token for user"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)
    
    def test_blog_list_public(self):
        """Test that anyone can view blog list"""
        response = self.client.get(self.blog_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_blog_detail_public(self):
        """Test that anyone can view blog detail"""
        response = self.client.get(self.blog_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.blog.title)
    
    def test_create_blog_authenticated(self):
        """Test that authenticated users can create blogs"""
        token = self.get_token(self.user1)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        blog_data = {
            'title': 'New Blog',
            'content': 'This is a new blog content.'
        }
        response = self.client.post(self.blog_list_url, blog_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Blog.objects.count(), 2)
    
    def test_create_blog_unauthenticated(self):
        """Test that unauthenticated users cannot create blogs"""
        blog_data = {
            'title': 'New Blog',
            'content': 'This is a new blog content.'
        }
        response = self.client.post(self.blog_list_url, blog_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_blog_author(self):
        """Test that blog authors can update their blogs"""
        token = self.get_token(self.user1)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        update_data = {
            'title': 'Updated Blog Title',
            'content': 'Updated content.'
        }
        response = self.client.put(self.blog_detail_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.blog.refresh_from_db()
        self.assertEqual(self.blog.title, 'Updated Blog Title')
    
    def test_update_blog_non_author(self):
        """Test that non-authors cannot update blogs"""
        token = self.get_token(self.user2)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        update_data = {
            'title': 'Updated Blog Title',
            'content': 'Updated content.'
        }
        response = self.client.put(self.blog_detail_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_delete_blog_author(self):
        """Test that blog authors can delete their blogs"""
        token = self.get_token(self.user1)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.delete(self.blog_detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Blog.objects.count(), 0)
    
    def test_delete_blog_non_author(self):
        """Test that non-authors cannot delete blogs"""
        token = self.get_token(self.user2)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.delete(self.blog_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)