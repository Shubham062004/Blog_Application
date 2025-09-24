from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def user_info(request):
    return Response({
        'message': 'User profile endpoints',
        'endpoints': {
            'profile': '/api/user/me/',
        }
    })

urlpatterns = [
    path('me/', user_info, name='user-info'),
]

