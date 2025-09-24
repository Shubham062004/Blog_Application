from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import User
import uuid

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'password')
        extra_kwargs = {
            'id': {'read_only': True}
        }
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['password'] = make_password(password)
        user = User.objects.create(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError('Email and password are required.')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('No user found with this email.')
        
        # Authenticate using username (Django requirement)
        authenticated_user = authenticate(username=user.username, password=password)
        
        if not authenticated_user:
            raise serializers.ValidationError('Invalid password.')
        
        if not authenticated_user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        
        attrs['user'] = authenticated_user
        return attrs
