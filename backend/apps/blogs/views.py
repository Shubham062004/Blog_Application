from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Blog
from .serializers import (
    BlogListSerializer, 
    BlogDetailSerializer, 
    BlogCreateUpdateSerializer
)
from .permissions import IsAuthorOrReadOnly


class BlogPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 20


class BlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.all()
    pagination_class = BlogPagination
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BlogCreateUpdateSerializer
        return BlogListSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]


class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    permission_classes = [IsAuthorOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return BlogCreateUpdateSerializer
        return BlogDetailSerializer