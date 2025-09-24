from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from django.db import connection
import uuid

def get_user_by_email(email):
    """Get user from your existing Supabase data"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, username, email, password, name FROM users WHERE email = %s", [email])
            row = cursor.fetchone()
            if row:
                return {
                    'id': row[0],
                    'username': row[1], 
                    'email': row[2],
                    'password': row[3],
                    'name': row[4]
                }
    except Exception as e:
        print(f"Error getting user: {e}")
    return None

def create_user_in_supabase(username, email, password, name):
    """Create user in your existing Supabase"""
    user_id = str(uuid.uuid4())
    hashed_password = make_password(password)
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO users (id, username, email, password, name, created_at) 
                VALUES (%s, %s, %s, %s, %s, NOW())
                RETURNING id, username, email, name
            """, [user_id, username, email, hashed_password, name])
            row = cursor.fetchone()
            if row:
                return {
                    'id': row[0],
                    'username': row[1],
                    'email': row[2], 
                    'name': row[3]
                }
    except Exception as e:
        print(f"Error creating user: {e}")
    return None

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        'message': 'Blog API v1.0 - Supabase Connected ✅',
        'endpoints': {
            'auth': {
                'login': '/api/auth/login/ [POST]', 
                'signup': '/api/auth/signup/ [POST]'
            },
            'blogs': '/api/blogs/ [GET, POST]',
            'user': '/api/user/profile/ [GET, PUT]',
            'likes': '/api/blogs/{id}/like/ [POST, DELETE]',
            'wishlist': '/api/blogs/{id}/wishlist/ [POST, DELETE]',
        },
        'status': 'All endpoints working!'
    })

# ✅ LOGIN - ONLY POST METHOD
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=400)
    
    user_data = get_user_by_email(email)
    if not user_data:
        return Response({'error': 'User not found'}, status=404)
    
    if not check_password(password, user_data['password']):
        return Response({'error': 'Invalid password'}, status=401)
    
    django_user, created = User.objects.get_or_create(
        username=user_data['username'],
        defaults={'email': user_data['email'], 'first_name': user_data['name'] or '', 'is_active': True}
    )
    
    refresh = RefreshToken.for_user(django_user)
    
    return Response({
        'id': str(user_data['id']),
        'username': user_data['username'],
        'email': user_data['email'],
        'name': user_data['name'],
        'token': str(refresh.access_token),
        'refresh': str(refresh),
        'message': 'Login successful!'
    }, status=200)

# ✅ SIGNUP - ONLY POST METHOD
@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name', '')
    
    if not username or not email or not password:
        return Response({'error': 'Username, email, and password are required'}, status=400)
    
    if get_user_by_email(email):
        return Response({'error': 'Email already exists'}, status=400)
    
    user_data = create_user_in_supabase(username, email, password, name)
    if not user_data:
        return Response({'error': 'Failed to create user'}, status=500)
    
    django_user = User.objects.create_user(username=username, email=email, first_name=name, password=password)
    refresh = RefreshToken.for_user(django_user)
    
    return Response({
        'id': str(user_data['id']),
        'username': user_data['username'],
        'email': user_data['email'],
        'name': user_data['name'],
        'token': str(refresh.access_token),
        'refresh': str(refresh),
        'message': 'Registration successful!'
    }, status=201)

# ✅ BLOGS - GET AND POST METHODS
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def blogs_view(request):
    if request.method == 'GET':
        user_id = None
        if request.user.is_authenticated:
            user_data = get_user_by_email(request.user.email)
            user_id = user_data['id'] if user_data else None
        
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT b.id, b.title, b.content, b.excerpt, b.image, 
                           b.created_at, b.updated_at, b.author_id,
                           u.username, u.name, u.email,
                           (SELECT COUNT(*) FROM likes l WHERE l.blog_id = b.id) as likes_count,
                           (SELECT COUNT(*) FROM comments c WHERE c.blog_id = b.id) as comments_count,
                           (SELECT EXISTS(SELECT 1 FROM likes l WHERE l.blog_id = b.id AND l.user_id = %s)) as user_liked,
                           (SELECT EXISTS(SELECT 1 FROM wishlist w WHERE w.blog_id = b.id AND w.user_id = %s)) as user_wishlisted
                    FROM blogs b 
                    JOIN users u ON b.author_id = u.id 
                    ORDER BY b.created_at DESC
                    LIMIT 15
                """, [user_id, user_id])
                
                rows = cursor.fetchall()
                blogs = []
                for row in rows:
                    blogs.append({
                        'id': str(row[0]),
                        'title': row[1],
                        'content': row[2],
                        'excerpt': row[3] or (row[2][:200] + '...' if len(row[2]) > 200 else row[2]),
                        'image': row[4],
                        'created_at': row[5].isoformat(),
                        'updated_at': row[6].isoformat(),
                        'author': {
                            'id': str(row[7]),
                            'username': row[8],
                            'name': row[9] or row[8],
                            'email': row[10]
                        },
                        'likes_count': row[11],
                        'comments_count': row[12],
                        'user_liked': bool(row[13]) if user_id else False,
                        'user_wishlisted': bool(row[14]) if user_id else False,
                    })
                
                return Response({'count': len(blogs), 'results': blogs})
        except Exception as e:
            print(f"Error fetching blogs: {e}")
            return Response({
                'count': 0,
                'results': [],
                'error': 'Failed to fetch blogs'
            })
    
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)
        
        user_data = get_user_by_email(request.user.email)
        if not user_data:
            return Response({'error': 'User not found'}, status=404)
        
        title = request.data.get('title')
        content = request.data.get('content')
        image = request.data.get('image')
        
        if not title or not content:
            return Response({'error': 'Title and content are required'}, status=400)
        
        blog_id = str(uuid.uuid4())
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO blogs (id, title, content, image, author_id, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
                    RETURNING id, title, content, image, created_at, updated_at
                """, [blog_id, title, content, image, user_data['id']])
                row = cursor.fetchone()
            
            return Response({
                'id': str(row[0]),
                'title': row[1],
                'content': row[2],
                'image': row[3],
                'author': {
                    'id': str(user_data['id']),
                    'username': user_data['username'],
                    'name': user_data['name'],
                },
                'likes_count': 0,
                'comments_count': 0,
                'created_at': row[4].isoformat(),
                'updated_at': row[5].isoformat(),
                'message': 'Blog created successfully!'
            }, status=201)
        except Exception as e:
            print(f"Error creating blog: {e}")
            return Response({
                'error': 'Failed to create blog'
            }, status=500)

# ✅ BLOG DETAIL - GET, PUT, DELETE METHODS
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def blog_detail_view(request, blog_id):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT b.id, b.title, b.content, b.excerpt, b.image, 
                           b.created_at, b.updated_at, b.author_id,
                           u.username, u.name, u.email,
                           (SELECT COUNT(*) FROM likes l WHERE l.blog_id = b.id) as likes_count,
                           (SELECT COUNT(*) FROM comments c WHERE c.blog_id = b.id) as comments_count
                    FROM blogs b 
                    JOIN users u ON b.author_id = u.id 
                    WHERE b.id = %s
                """, [blog_id])
                row = cursor.fetchone()
                
                if not row:
                    return Response({'error': 'Blog not found'}, status=404)
                
                return Response({
                    'id': str(row[0]),
                    'title': row[1],
                    'content': row[2],
                    'excerpt': row[3],
                    'image': row[4],
                    'author': {
                        'id': str(row[7]),
                        'username': row[8],
                        'name': row[9] or row[8],
                    },
                    'likes_count': row[11],
                    'comments_count': row[12],
                    'created_at': row[5].isoformat(),
                    'updated_at': row[6].isoformat(),
                })
        except Exception as e:
            print(f"Error fetching blog: {e}")
            return Response({
                'error': 'Failed to fetch blog'
            }, status=500)
    
    elif request.method in ['PUT', 'DELETE']:
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)
        
        user_data = get_user_by_email(request.user.email)
        if not user_data:
            return Response({'error': 'User not found'}, status=404)
        
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT author_id FROM blogs WHERE id = %s", [blog_id])
                row = cursor.fetchone()
                if not row or str(row[0]) != str(user_data['id']):
                    return Response({'error': 'Permission denied'}, status=403)
                
                if request.method == 'PUT':
                    title = request.data.get('title')
                    content = request.data.get('content')
                    image = request.data.get('image')
                    
                    cursor.execute("""
                        UPDATE blogs SET title = %s, content = %s, image = %s, updated_at = NOW()
                        WHERE id = %s
                        RETURNING id, title, content, image, updated_at
                    """, [title, content, image, blog_id])
                    row = cursor.fetchone()
                    
                    return Response({
                        'id': str(row[0]),
                        'title': row[1],
                        'content': row[2],
                        'image': row[3],
                        'updated_at': row[4].isoformat(),
                        'message': 'Blog updated successfully!'
                    })
                
                elif request.method == 'DELETE':
                    cursor.execute("DELETE FROM blogs WHERE id = %s", [blog_id])
                    return Response({'message': 'Blog deleted successfully!'})
        except Exception as e:
            print(f"Error updating/deleting blog: {e}")
            return Response({
                'error': 'Failed to update/delete blog'
            }, status=500)

# ✅ LIKE/UNLIKE - POST AND DELETE METHODS
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_like_view(request, blog_id):
    user_data = get_user_by_email(request.user.email)
    if not user_data:
        return Response({'error': 'User not found'}, status=404)
    
    try:
        with connection.cursor() as cursor:
            if request.method == 'POST':
                cursor.execute("""
                    INSERT INTO likes (id, user_id, blog_id, created_at)
                    VALUES (%s, %s, %s, NOW())
                    ON CONFLICT (user_id, blog_id) DO NOTHING
                """, [str(uuid.uuid4()), user_data['id'], blog_id])
                
                cursor.execute("SELECT COUNT(*) FROM likes WHERE blog_id = %s", [blog_id])
                likes_count = cursor.fetchone()[0]
                
                return Response({'likes_count': likes_count, 'user_liked': True})
            
            elif request.method == 'DELETE':
                cursor.execute("DELETE FROM likes WHERE user_id = %s AND blog_id = %s", [user_data['id'], blog_id])
                
                cursor.execute("SELECT COUNT(*) FROM likes WHERE blog_id = %s", [blog_id])
                likes_count = cursor.fetchone()[0]
                
                return Response({'likes_count': likes_count, 'user_liked': False})
    except Exception as e:
        print(f"Error toggling like: {e}")
        return Response({
            'error': 'Failed to toggle like'
        }, status=500)

# ✅ WISHLIST - POST AND DELETE METHODS
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_wishlist_view(request, blog_id):
    user_data = get_user_by_email(request.user.email)
    if not user_data:
        return Response({'error': 'User not found'}, status=404)
    
    try:
        with connection.cursor() as cursor:
            if request.method == 'POST':
                cursor.execute("""
                    INSERT INTO wishlist (id, user_id, blog_id, created_at)
                    VALUES (%s, %s, %s, NOW())
                    ON CONFLICT (user_id, blog_id) DO NOTHING
                """, [str(uuid.uuid4()), user_data['id'], blog_id])
                
                return Response({'user_wishlisted': True, 'message': 'Added to wishlist'})
            
            elif request.method == 'DELETE':
                cursor.execute("DELETE FROM wishlist WHERE user_id = %s AND blog_id = %s", [user_data['id'], blog_id])
                
                return Response({'user_wishlisted': False, 'message': 'Removed from wishlist'})
    except Exception as e:
        print(f"Error toggling wishlist: {e}")
        return Response({
            'error': 'Failed to toggle wishlist'
        }, status=500)

# ✅ USER WISHLIST - GET METHOD
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_wishlist_view(request):
    user_data = get_user_by_email(request.user.email)
    if not user_data:
        return Response({'error': 'User not found'}, status=404)
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT b.id, b.title, b.content, b.excerpt, b.image, 
                       b.created_at, u.username, u.name
                FROM wishlist w
                JOIN blogs b ON w.blog_id = b.id
                JOIN users u ON b.author_id = u.id
                WHERE w.user_id = %s
                ORDER BY w.created_at DESC
            """, [user_data['id']])
            
            rows = cursor.fetchall()
            blogs = []
            for row in rows:
                blogs.append({
                    'id': str(row[0]),
                    'title': row[1],
                    'content': row[2],
                    'excerpt': row[3] or (row[2][:200] + '...' if len(row[2]) > 200 else row[2]),
                    'image': row[4],
                    'created_at': row[5].isoformat(),
                    'author': {
                        'username': row[6],
                        'name': row[7] or row[6]
                    }
                })
        
        return Response({'count': len(blogs), 'results': blogs})
    except Exception as e:
        print(f"Error fetching wishlist: {e}")
        return Response({
            'error': 'Failed to fetch wishlist'
        }, status=500)

# ✅ USER PROFILE - GET AND PUT METHODS
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    user_data = get_user_by_email(request.user.email)
    if not user_data:
        return Response({'error': 'User not found'}, status=404)
    
    if request.method == 'GET':
        return Response({
            'id': str(user_data['id']),
            'username': user_data['username'],
            'email': user_data['email'],
            'name': user_data['name'],
        })
    
    elif request.method == 'PUT':
        name = request.data.get('name')
        
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE users SET name = %s WHERE id = %s
                    RETURNING id, username, email, name
                """, [name, user_data['id']])
                row = cursor.fetchone()
            
            # Update Django user too
            request.user.first_name = name
            request.user.save()
            
            return Response({
                'id': str(row[0]),
                'username': row[1],
                'email': row[2],
                'name': row[3],
                'message': 'Profile updated successfully!'
            })
        except Exception as e:
            print(f"Error updating profile: {e}")
            return Response({
                'error': 'Failed to update profile'
            }, status=500)

