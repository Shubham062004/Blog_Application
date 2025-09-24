from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
import json


class AuthenticationTestCase(APITestCase):
    
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }
    
    def test_user_registration(self):
        """Test user registration"""
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['email'], self.user_data['email'])
        self.assertEqual(response.data['username'], self.user_data['username'])
    
    def test_user_login(self):
        """Test user login"""
        # First register a user
        User.objects.create_user(**self.user_data)
        
        login_data = {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
    
    def test_invalid_login(self):
        """Test login with invalid credentials"""
        login_data = {
            'email': 'invalid@example.com',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)