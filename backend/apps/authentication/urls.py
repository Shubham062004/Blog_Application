from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def auth_info(request):
    return Response({
        'message': 'Authentication endpoints',
        'endpoints': {
            'login': '/api/auth/login/',
            'register': '/api/auth/register/',
        }
    })

urlpatterns = [
    path('', auth_info, name='auth-info'),
    # Add your actual authentication views here
    # path('login/', views.login, name='login'),
    # path('register/', views.register, name='register'),
]