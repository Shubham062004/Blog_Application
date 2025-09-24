from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer, UserLoginSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh_token = serializer.validated_data.get('token')
        
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'token': refresh_token
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        return Response({
            'id': serializer.validated_data['id'],
            'username': serializer.validated_data['username'],
            'email': serializer.validated_data['email'],
            'token': serializer.validated_data['token']
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)