# Blog API - Django REST Framework Backend

A complete REST API backend for a blog application built with Django REST Framework, featuring JWT authentication, PostgreSQL database, and deployment-ready configuration.

## Features

- **Authentication**: JWT-based user registration and login
- **Blog Management**: Full CRUD operations for blog posts
- **Permissions**: Author-only edit/delete permissions
- **Public Access**: Blog listing and detail views accessible to everyone
- **Pagination**: Configurable pagination for blog listings
- **Database**: PostgreSQL (production), SQLite (development)
- **Deployment Ready**: Docker, Railway, and Heroku support

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login

### Blogs
- `GET /api/blogs/` - List all blogs (public, paginated)
- `GET /api/blogs/{id}/` - Get blog detail (public)
- `POST /api/blogs/` - Create blog (authenticated)
- `PUT /api/blogs/{id}/` - Update blog (author only)
- `DELETE /api/blogs/{id}/` - Delete blog (author only)

## Local Development Setup

### Prerequisites
- Python 3.11+
- PostgreSQL (optional, SQLite fallback available)
- Docker (optional)

### Option 1: Traditional Setup

1. **Clone and setup**
   ```bash
   git clone <your-repo-url>
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   # Edit .env with your settings
   ```

3. **Database Setup**
   ```bash
   # For SQLite (default)
   python manage.py migrate
   
   # For PostgreSQL, set DATABASE_URL in .env first
   python manage.py migrate
   ```

4. **Load Sample Data**
   ```bash
   python manage.py loaddata fixtures/sample_data.json
   ```

5. **Create Superuser (Optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

### Option 2: Docker Setup

1. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This automatically:
   - Sets up PostgreSQL database
   - Runs migrations
   - Loads sample data
   - Starts the development server

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DEBUG` | Enable debug mode | `False` | No |
| `SECRET_KEY` | Django secret key | None | Yes |
| `DATABASE_URL` | PostgreSQL connection string | SQLite fallback | No |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `localhost,127.0.0.1` | No |
| `CORS_ALLOW_ALL_ORIGINS` | Allow all CORS origins | `True` | No |
| `CORS_ALLOWED_ORIGINS` | Specific CORS origins | None | No |
| `REACT_APP_URL` | Frontend URL for CORS | None | No |

## Database Setup

### PostgreSQL (Production/Optional Local)
```bash
# Set in .env file
DATABASE_URL=postgresql://username:password@localhost:5432/blogdb
```

### SQLite (Development Default)
No configuration needed - automatically used when `DATABASE_URL` is not set.

## Testing

```bash
# Run all tests
python manage.py test

# Run with pytest (recommended)
pytest

# Run specific test file
python manage.py test apps.blogs.tests
```

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "securepass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securepass123"
  }'
```

### List Blogs (Public)
```bash
curl -X GET http://localhost:8000/api/blogs/?page=1&page_size=5
```

### Get Blog Detail (Public)
```bash
curl -X GET http://localhost:8000/api/blogs/1/
```

### Create Blog (Authenticated)
```bash
curl -X POST http://localhost:8000/api/blogs/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My New Blog Post",
    "content": "This is the content of my blog post..."
  }'
```

### Update Blog (Author Only)
```bash
curl -X PUT http://localhost:8000/api/blogs/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Blog Title",
    "content": "Updated content..."
  }'
```

### Delete Blog (Author Only)
```bash
curl -X DELETE http://localhost:8000/api/blogs/1/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Deployment

### Railway Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Railway**
   - Connect your GitHub repository
   - Railway auto-detects Django and provides PostgreSQL
   - Set environment variables in Railway dashboard
   - Deploy automatically triggers

3. **Required Railway Environment Variables**
   ```
   DEBUG=False
   SECRET_KEY=your-production-secret-key
   ALLOWED_HOSTS=.railway.app
   ```

### Heroku Deployment

1. **Install Heroku CLI and login**
   ```bash
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-blog-api
   heroku addons:create heroku-postgresql:mini
   ```

3. **Set environment variables**
   ```bash
   heroku config:set DEBUG=False
   heroku config:set SECRET_KEY=your-production-secret-key
   ```

4. **Deploy**
   ```bash
   git push heroku main
   heroku run python manage.py migrate
   heroku run python manage.py loaddata fixtures/sample_data.json
   ```

## Project Structure

```
backend/
├── blog_api/           # Django project settings
├── apps/
│   ├── authentication/  # User auth (register/login)
│   └── blogs/          # Blog CRUD operations
├── fixtures/           # Sample data
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Local development with Docker
└── README.md          # This file
```

## Security Features

- JWT token authentication
- Password validation
- CORS configuration
- Author-only permissions for blog editing
- Environment-based configuration
- Production security headers

## Tech Stack

- **Backend**: Django 4.2, Django REST Framework 3.14
- **Authentication**: djangorestframework-simplejwt
- **Database**: PostgreSQL (production), SQLite (development)
- **Deployment**: Docker, Railway, Heroku support
- **Testing**: pytest, factory-boy

## License

MIT License - feel free to use this code for your projects!