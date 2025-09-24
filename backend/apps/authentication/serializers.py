from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    token = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'token')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        validated_data['token'] = str(refresh.access_token)
        
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    token = serializers.CharField(read_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid email or password.')
            
            user = authenticate(username=user.username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password.')
            
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            attrs['token'] = str(refresh.access_token)
            attrs['id'] = user.id
            attrs['username'] = user.username
            
        else:
            raise serializers.ValidationError('Must include email and password.')

        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')