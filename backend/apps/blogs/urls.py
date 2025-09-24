from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def blogs_list(request):
    return Response({
        'message': 'Blogs API endpoint',
        'count': 0,
        'results': [],
        'note': 'Blog CRUD endpoints will be implemented here'
    })

urlpatterns = [
    path('', blogs_list, name='blogs-list'),
    # Add your actual blog views here
    # path('', views.BlogListCreateView.as_view(), name='blog-list-create'),
    # path('<int:pk>/', views.BlogDetailView.as_view(), name='blog-detail'),
]