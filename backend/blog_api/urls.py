from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from django.db import connection
import uuid
from datetime import datetime

# ========================================
# 🔧 DATABASE HELPER FUNCTIONS
# ========================================

def get_user_by_email(email):
    """Get user from Supabase by email"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT id, username, email, password, name, created_at 
            FROM public.users 
            WHERE email = %s AND is_active = true
        """, [email])
        row = cursor.fetchone()
        if row:
            return {
                'id': str(row[0]),
                'username': row[1],
                'email': row[2],
                'password': row[3],
                'name': row[4],
                'created_at': row[5]
            }
    return None

def get_user_by_id(user_id):
    """Get user from Supabase by ID"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT id, username, email, name, created_at 
            FROM public.users 
            WHERE id = %s AND is_active = true
        """, [user_id])
        row = cursor.fetchone()
        if row:
            return {
                'id': str(row[0]),
                'username': row[1],
                'email': row[2],
                'name': row[3],
                'created_at': row[4]
            }
    return None

def create_user_in_supabase(username, email, password, name):
    """Create new user in Supabase"""
    user_id = str(uuid.uuid4())
    hashed_password = make_password(password)
    
    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO public.users (id, username, email, password, name, created_at) 
            VALUES (%s, %s, %s, %s, %s, NOW())
            RETURNING id, username, email, name, created_at
        """, [user_id, username, email, hashed_password, name])
        row = cursor.fetchone()
        if row:
            return {
                'id': str(row[0]),
                'username': row[1],
                'email': row[2],
                'name': row[3],
                'created_at': row[4]
            }
    return None

# ========================================
# 🌐 API ENDPOINTS
# ========================================

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """API Root - Shows all available endpoints"""
    return Response({
        'message': '🚀 Blog API v1.0 - Supabase Integration Working!',
        'timestamp': datetime.now().isoformat(),
        'endpoints': {
            'authentication': {
                'login': 'POST /api/auth/login/',
                'signup': 'POST /api/auth/signup/',
            },
            'blogs': {
                'list_create': 'GET|POST /api/blogs/',
                'detail': 'GET|PUT|DELETE /api/blogs/{id}/',
                'like': 'POST|DELETE /api/blogs/{id}/like/',
                'wishlist': 'POST|DELETE /api/blogs/{id}/wishlist/',
            },
            'user': {
                'profile': 'GET|PUT /api/user/profile/',
                'wishlist': 'GET /api/user/wishlist/',
            }
        },
        'database': 'Connected to Supabase PostgreSQL',
        'cors': 'Configured for frontend (localhost:5173)',
        'status': 'All systems operational ✅'
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """User Login - POST only"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'error': 'Email and password are required'
        }, status=400)
    
    # Get user from Supabase
    user_data = get_user_by_email(email)
    if not user_data:
        return Response({
            'error': 'Invalid email or password'
        }, status=401)
    
    # Verify password
    if not check_password(password, user_data['password']):
        return Response({
            'error': 'Invalid email or password'
        }, status=401)
    
    # Create or get Django user for JWT
    django_user, created = User.objects.get_or_create(
        username=user_data['username'],
        defaults={
            'email': user_data['email'],
            'first_name': user_data['name'] or '',
            'is_active': True
        }
    )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(django_user)
    
    return Response({
        'id': user_data['id'],
        'username': user_data['username'],
        'email': user_data['email'],
        'name': user_data['name'],
        'token': str(refresh.access_token),
        'refresh': str(refresh),
        'message': 'Login successful!'
    }, status=200)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """User Signup - POST only"""
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name', '')
    
    # Validation
    if not username or not email or not password:
        return Response({
            'error': 'Username, email, and password are required'
        }, status=400)
    
    if len(password) < 6:
        return Response({
            'error': 'Password must be at least 6 characters long'
        }, status=400)
    
    # Check if user already exists
    if get_user_by_email(email):
        return Response({
            'error': 'Email already exists'
        }, status=400)
    
    # Create user in Supabase
    user_data = create_user_in_supabase(username, email, password, name)
    if not user_data:
        return Response({
            'error': 'Failed to create user. Please try again.'
        }, status=500)
    
    # Create Django user for JWT
    django_user = User.objects.create_user(
        username=username,
        email=email,
        first_name=name,
        password=password
    )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(django_user)
    
    return Response({
        'id': user_data['id'],
        'username': user_data['username'],
        'email': user_data['email'],
        'name': user_data['name'],
        'token': str(refresh.access_token),
        'refresh': str(refresh),
        'message': 'Registration successful!'
    }, status=201)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def blogs_view(request):
    """Blog List/Create - GET and POST with detailed debugging"""
    
    if request.method == 'GET':
        try:
            # Test database connection first
            with connection.cursor() as cursor:
                # Check if tables exist
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_type = 'BASE TABLE'
                    ORDER BY table_name
                """)
                tables = [row[0] for row in cursor.fetchall()]
                
                # Count records in each table
                cursor.execute("SELECT COUNT(*) FROM public.users")
                users_count = cursor.fetchone()[0]
                
                cursor.execute("SELECT COUNT(*) FROM public.blogs")
                blogs_count = cursor.fetchone()[0]
                
                # If no blogs, return debug info
                if blogs_count == 0:
                    return Response({
                        'count': 0,
                        'results': [],
                        'debug_info': {
                            'message': 'Connected to Supabase but no blogs found yet',
                            'database_connection': 'SUCCESS ✅',
                            'tables_found': tables,
                            'users_count': users_count,
                            'blogs_count': blogs_count,
                            'suggestion': 'Run the SQL insert commands to add test data'
                        }
                    })
                
                # Get current user if authenticated
                current_user_id = None
                if request.user.is_authenticated:
                    try:
                        user_data = get_user_by_email(request.user.email)
                        current_user_id = user_data['id'] if user_data else None
                    except:
                        pass
                
                # Fetch blogs with all details
                cursor.execute("""
                    SELECT 
                        b.id, b.title, b.content, b.excerpt, b.image, 
                        b.created_at, b.updated_at, b.view_count, b.is_published,
                        u.id as author_id, u.username, u.name, u.email,
                        COALESCE((SELECT COUNT(*) FROM public.likes l WHERE l.blog_id = b.id), 0) as likes_count,
                        COALESCE((SELECT COUNT(*) FROM public.comments c WHERE c.blog_id = b.id), 0) as comments_count,
                        CASE 
                            WHEN %s IS NOT NULL THEN 
                                EXISTS(SELECT 1 FROM public.likes l WHERE l.blog_id = b.id AND l.user_id = %s::uuid)
                            ELSE false 
                        END as user_liked,
                        CASE 
                            WHEN %s IS NOT NULL THEN 
                                EXISTS(SELECT 1 FROM public.wishlist w WHERE w.blog_id = b.id AND w.user_id = %s::uuid)
                            ELSE false 
                        END as user_wishlisted
                    FROM public.blogs b
                    JOIN public.users u ON b.author_id = u.id
                    WHERE b.is_published = true
                    ORDER BY b.created_at DESC
                    LIMIT 15
                """, [current_user_id, current_user_id, current_user_id, current_user_id])
                
                rows = cursor.fetchall()
                blogs = []
                
                for row in rows:
                    # Generate excerpt if not exists
                    excerpt = row[3]
                    if not excerpt and row[2]:  # If no excerpt, create from content
                        content_text = row[2][:200] + '...' if len(row[2]) > 200 else row[2]
                        excerpt = content_text
                    
                    blog = {
                        'id': str(row[0]),
                        'title': row[1],
                        'content': row[2],
                        'excerpt': excerpt,
                        'image': row[4],
                        'created_at': row[5].isoformat() if row[5] else None,
                        'updated_at': row[6].isoformat() if row[6] else None,
                        'view_count': row[7] or 0,
                        'is_published': row[8],
                        'author': {
                            'id': str(row[9]),
                            'username': row[10],
                            'name': row[11] or row[10],  # Use username if name is empty
                            'email': row[12]
                        },
                        'likes_count': row[13] or 0,
                        'comments_count': row[14] or 0,
                        'user_liked': bool(row[15]) if current_user_id else False,
                        'user_wishlisted': bool(row[16]) if current_user_id else False,
                    }
                    blogs.append(blog)
                
                return Response({
                    'count': len(blogs),
                    'results': blogs,
                    'debug_info': {
                        'message': f'Successfully loaded {len(blogs)} blogs from Supabase!',
                        'database_connection': 'SUCCESS ✅',
                        'total_users': users_count,
                        'total_blogs': blogs_count,
                        'current_user_authenticated': bool(current_user_id),
                        'current_user_id': current_user_id
                    }
                })
                
        except Exception as e:
            return Response({
                'count': 0,
                'results': [],
                'error': {
                    'message': 'Database connection failed',
                    'details': str(e),
                    'suggestion': 'Check your DATABASE_URL in .env file'
                }
            }, status=500)
    
    elif request.method == 'POST':
        # Create new blog (requires authentication)
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required to create blogs'
            }, status=401)
        
        # Get current user
        user_data = get_user_by_email(request.user.email)
        if not user_data:
            return Response({
                'error': 'User not found'
            }, status=404)
        
        title = request.data.get('title')
        content = request.data.get('content')
        image = request.data.get('image', '')
        
        if not title or not content:
            return Response({
                'error': 'Title and content are required'
            }, status=400)
        
        if len(title) < 5 or len(content) < 50:
            return Response({
                'error': 'Title must be at least 5 characters and content at least 50 characters'
            }, status=400)
        
        # Create blog in Supabase
        blog_id = str(uuid.uuid4())
        excerpt = content[:200] + '...' if len(content) > 200 else content
        
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO public.blogs (id, title, content, excerpt, image, author_id, is_published, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, true, NOW(), NOW())
                RETURNING id, title, content, excerpt, image, created_at, updated_at
            """, [blog_id, title, content, excerpt, image, user_data['id']])
            row = cursor.fetchone()
        
        return Response({
            'id': str(row[0]),
            'title': row[1],
            'content': row[2],
            'excerpt': row[3],
            'image': row[4],
            'created_at': row[5].isoformat(),
            'updated_at': row[6].isoformat(),
            'author': {
                'id': user_data['id'],
                'username': user_data['username'],
                'name': user_data['name'] or user_data['username'],
            },
            'likes_count': 0,
            'comments_count': 0,
            'user_liked': False,
            'user_wishlisted': False,
            'message': 'Blog created successfully!'
        }, status=201)

@api_view(['GET'])
@permission_classes([AllowAny])
def blog_detail_view(request, blog_id):
    """Blog Detail - GET only for now"""
    
    # Get current user if authenticated
    current_user_id = None
    if request.user.is_authenticated:
        user_data = get_user_by_email(request.user.email)
        current_user_id = user_data['id'] if user_data else None
    
    with connection.cursor() as cursor:
        # Increment view count
        cursor.execute("UPDATE public.blogs SET view_count = view_count + 1 WHERE id = %s", [blog_id])
        
        # Get blog details
        cursor.execute("""
            SELECT 
                b.id, b.title, b.content, b.excerpt, b.image, 
                b.created_at, b.updated_at, b.view_count,
                u.id as author_id, u.username, u.name, u.email,
                COALESCE((SELECT COUNT(*) FROM public.likes l WHERE l.blog_id = b.id), 0) as likes_count,
                COALESCE((SELECT COUNT(*) FROM public.comments c WHERE c.blog_id = b.id), 0) as comments_count,
                CASE 
                    WHEN %s IS NOT NULL THEN 
                        EXISTS(SELECT 1 FROM public.likes l WHERE l.blog_id = b.id AND l.user_id = %s::uuid)
                    ELSE false 
                END as user_liked,
                CASE 
                    WHEN %s IS NOT NULL THEN 
                        EXISTS(SELECT 1 FROM public.wishlist w WHERE w.blog_id = b.id AND w.user_id = %s::uuid)
                    ELSE false 
                END as user_wishlisted
            FROM public.blogs b
            JOIN public.users u ON b.author_id = u.id
            WHERE b.id = %s AND b.is_published = true
        """, [current_user_id, current_user_id, current_user_id, current_user_id, blog_id])
        
        row = cursor.fetchone()
        if not row:
            return Response({
                'error': 'Blog not found'
            }, status=404)
        
        blog = {
            'id': str(row[0]),
            'title': row[1],
            'content': row[2],
            'excerpt': row[3],
            'image': row[4],
            'created_at': row[5].isoformat(),
            'updated_at': row[6].isoformat(),
            'view_count': row[7],
            'author': {
                'id': str(row[8]),
                'username': row[9],
                'name': row[10] or row[9],
                'email': row[11]
            },
            'likes_count': row[12],
            'comments_count': row[13],
            'user_liked': bool(row[14]) if current_user_id else False,
            'user_wishlisted': bool(row[15]) if current_user_id else False,
        }
    
    return Response(blog)

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_like_view(request, blog_id):
    """Toggle Like - POST to like, DELETE to unlike"""
    
    # Get current user
    user_data = get_user_by_email(request.user.email)
    if not user_data:
        return Response({'error': 'User not found'}, status=404)
    
    with connection.cursor() as cursor:
        if request.method == 'POST':
            # Like the blog
            like_id = str(uuid.uuid4())
            try:
                cursor.execute("""
                    INSERT INTO public.likes (id, user_id, blog_id, created_at)
                    VALUES (%s, %s, %s, NOW())
                """, [like_id, user_data['id'], blog_id])
                
                # Get updated like count
                cursor.execute("SELECT COUNT(*) FROM public.likes WHERE blog_id = %s", [blog_id])
                likes_count = cursor.fetchone()[0]
                
                return Response({
                    'likes_count': likes_count,
                    'user_liked': True,
                    'message': 'Blog liked!'
                })
            except:
                return Response({'error': 'Already liked'}, status=400)
                
        elif request.method == 'DELETE':
            # Unlike the blog
            cursor.execute("""
                DELETE FROM public.likes 
                WHERE user_id = %s AND blog_id = %s
            """, [user_data['id'], blog_id])
            
            # Get updated like count
            cursor.execute("SELECT COUNT(*) FROM public.likes WHERE blog_id = %s", [blog_id])
            likes_count = cursor.fetchone()[0]
            
            return Response({
                'likes_count': likes_count,
                'user_liked': False,
                'message': 'Blog unliked!'
            })

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_wishlist_view(request, blog_id):
    """Toggle Wishlist - POST to add, DELETE to remove"""
    
    # Get current user
    user_data = get_user_by_email(request.user.email)
    if not user_data:
        return Response({'error': 'User not found'}, status=404)
    
    with connection.cursor() as cursor:
        if request.method == 'POST':
            # Add to wishlist
            wishlist_id = str(uuid.uuid4())
            try:
                cursor.execute("""
                    INSERT INTO public.wishlist (id, user_id, blog_id, created_at)
                    VALUES (%s, %s, %s, NOW())
                """, [wishlist_id, user_data['id'], blog_id])
                
                return Response({
                    'user_wishlisted': True,
                    'message': 'Added to wishlist!'
                })
            except:
                return Response({'error': 'Already in wishlist'}, status=400)
                
        elif request.method == 'DELETE':
            # Remove from wishlist
            cursor.execute("""
                DELETE FROM public.wishlist 
                WHERE user_id = %s AND blog_id = %s
            """, [user_data['id'], blog_id])
            
            return Response({
                'user_wishlisted': False,
                'message': 'Removed from wishlist!'
            })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """User Profile - GET only"""
    
    user_data = get_user_by_email(request.user.email)
    if not user_data:
        return Response({'error': 'User not found'}, status=404)
    
    # Get user's blog count
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM public.blogs WHERE author_id = %s", [user_data['id']])
        blogs_count = cursor.fetchone()[0]
    
    return Response({
        'id': user_data['id'],
        'username': user_data['username'],
        'email': user_data['email'],
        'name': user_data['name'],
        'created_at': user_data['created_at'].isoformat(),
        'blogs_count': blogs_count,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_wishlist_view(request):
    """User Wishlist - GET only"""
    
    user_data = get_user_by_email(request.user.email)
    if not user_data:
        return Response({'error': 'User not found'}, status=404)
    
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                b.id, b.title, b.content, b.excerpt, b.image, 
                b.created_at, u.username, u.name
            FROM public.wishlist w
            JOIN public.blogs b ON w.blog_id = b.id
            JOIN public.users u ON b.author_id = u.id
            WHERE w.user_id = %s
            ORDER BY w.created_at DESC
        """, [user_data['id']])
        
        rows = cursor.fetchall()
        blogs = []
        
        for row in rows:
            excerpt = row[3] or (row[2][:200] + '...' if len(row[2]) > 200 else row[2])
            
            blogs.append({
                'id': str(row[0]),
                'title': row[1],
                'content': row[2],
                'excerpt': excerpt,
                'image': row[4],
                'created_at': row[5].isoformat(),
                'author': {
                    'username': row[6],
                    'name': row[7] or row[6]
                }
            })
    
    return Response({
        'count': len(blogs),
        'results': blogs,
        'message': f'Found {len(blogs)} blogs in your wishlist'
    })

# ========================================
# 🌐 URL PATTERNS
# ========================================

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # API Root
    path('api/', api_root, name='api-root'),
    
    # ✅ Authentication Endpoints
    path('api/auth/login/', login_view, name='auth-login'),       # POST /api/auth/login/
    path('api/auth/signup/', signup_view, name='auth-signup'),    # POST /api/auth/signup/
    path('api/login/', login_view, name='login-alt'),             # POST /api/login/ (alternative)
    path('api/signup/', signup_view, name='signup-alt'),          # POST /api/signup/ (alternative)
    
    # ✅ Blog Endpoints
    path('api/blogs/', blogs_view, name='blogs'),                          # GET|POST /api/blogs/
    path('api/blogs/<uuid:blog_id>/', blog_detail_view, name='blog-detail'), # GET /api/blogs/{id}/
    path('api/blogs/<uuid:blog_id>/like/', toggle_like_view, name='toggle-like'),         # POST|DELETE /api/blogs/{id}/like/
    path('api/blogs/<uuid:blog_id>/wishlist/', toggle_wishlist_view, name='toggle-wishlist'), # POST|DELETE /api/blogs/{id}/wishlist/
    
    # ✅ User Endpoints
    path('api/user/profile/', user_profile_view, name='user-profile'),     # GET /api/user/profile/
    path('api/user/wishlist/', user_wishlist_view, name='user-wishlist'),  # GET /api/user/wishlist/
]

# Static files for development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)