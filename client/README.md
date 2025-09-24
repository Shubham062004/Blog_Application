# BlogSpace - Modern Blog Application

A complete, production-ready blog application built with React, TypeScript, and modern web technologies. Features user authentication, blog creation/editing, responsive design, and a beautiful, accessible UI.

## 🚀 Features

- **Authentication**: JWT-based login/signup with secure token storage
- **Blog Management**: Create, read, update, and delete blog posts
- **Rich Content**: HTML content support with live preview
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with smooth animations
- **User Experience**: Toast notifications, loading states, and error handling
- **Accessibility**: Semantic HTML, proper ARIA labels, and keyboard navigation
- **Protected Routes**: Authentication-based access control
- **Pagination**: Efficient blog listing with pagination controls

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Testing**: React Testing Library + Jest
- **State Management**: React Context API
- **Forms**: React Hook Form with validation

## 📁 Project Structure

```
src/
├── api/                 # API clients and configuration
│   ├── axios.ts        # Axios instance with interceptors
│   ├── auth.ts         # Authentication API calls
│   └── blogs.ts        # Blog API calls
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── BlogCard.tsx   # Blog post card component
│   ├── LoadingSpinner.tsx
│   ├── Navbar.tsx     # Navigation component
│   ├── Pagination.tsx # Pagination controls
│   └── ProtectedRoute.tsx
├── contexts/          # React context providers
│   └── AuthContext.tsx
├── hooks/             # Custom React hooks
│   └── use-toast.ts
├── pages/             # Page components
│   ├── BlogDetail.tsx # Individual blog post view
│   ├── BlogForm.tsx   # Create/edit blog form
│   ├── BlogList.tsx   # Blog listing with pagination
│   ├── Login.tsx      # Login page
│   ├── NotFound.tsx   # 404 error page
│   └── Signup.tsx     # Registration page
├── types/             # TypeScript type definitions
│   └── index.ts
├── __tests__/         # Test files
│   └── Login.test.tsx
├── App.tsx           # Main application component
├── index.css         # Global styles and design system
└── main.tsx          # Application entry point
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- A backend API that implements the required endpoints (see API Contract below)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-git-url>
   cd <your-project-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=https://your-api-url.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint

## 🌐 API Contract

The frontend expects a REST API with the following endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Blogs
- `GET /api/blogs?page=1&page_size=5` - Get paginated blog list
- `GET /api/blogs/:id` - Get single blog post
- `POST /api/blogs/` - Create new blog (requires auth)
- `PUT /api/blogs/:id` - Update blog (requires auth + ownership)
- `DELETE /api/blogs/:id` - Delete blog (requires auth + ownership)

### Expected Response Formats

**Login/Register Response:**
```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "token": "jwt-token-here"
}
```

**Blog List Response:**
```json
{
  "count": 42,
  "next": "https://api.example.com/api/blogs?page=2",
  "previous": null,
  "results": [
    {
      "id": 10,
      "title": "Blog Title",
      "excerpt": "First 150 characters...",
      "author": {"id": 1, "username": "alice"},
      "created_at": "2025-09-20T12:34:00Z"
    }
  ]
}
```

**Blog Detail Response:**
```json
{
  "id": 10,
  "title": "Blog Title",
  "content": "<p>Full HTML content</p>",
  "author": {"id": 1, "username": "alice"},
  "created_at": "2025-09-20T12:34:00Z"
}
```

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository** to Vercel
2. **Set build settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Add environment variables** in Vercel dashboard:
   - `VITE_API_URL`: Your production API URL
4. **Deploy**

### Build Configuration

The project is configured for optimal production builds:
- Tree-shaking for minimal bundle size
- Code splitting for better loading performance
- Asset optimization and compression
- TypeScript compilation with strict checks

## 🎨 Design System

The application uses a carefully crafted design system with:

- **Color Palette**: Professional blue-gray theme with semantic color tokens
- **Typography**: Modern font stack with proper hierarchy
- **Components**: Consistent, accessible UI components
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first responsive design

All colors and styles are defined in `src/index.css` using CSS custom properties and can be easily customized.

## ✅ Testing

Run the test suite:

```bash
npm run test
```

The project includes:
- Unit tests for key components
- Integration tests for user flows
- Accessibility testing
- Form validation testing

Example test for the Login component is included in `src/__tests__/Login.test.tsx`.

## 🔐 Authentication Flow

1. User registers/logs in through the auth pages
2. JWT token is stored in localStorage
3. Axios interceptor automatically adds token to requests
4. Protected routes check authentication status
5. 401 responses automatically redirect to login
6. Tokens persist across browser sessions

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first CSS approach
- Flexible navigation (hamburger menu on mobile)
- Optimized touch targets
- Readable typography on all screen sizes
- Efficient mobile data usage

## 🎯 Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Lazy loading and optimized assets
- **Bundle Analysis**: Optimized dependencies and tree-shaking
- **Caching**: Proper HTTP caching headers
- **Fast Loading**: Minimal initial bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Build Errors:**
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run build`

**API Connection Issues:**
- Verify `VITE_API_URL` environment variable
- Check network tab for request/response details
- Ensure backend CORS is configured

**Authentication Issues:**
- Clear localStorage if tokens are corrupted
- Check that backend returns proper JWT format
- Verify API endpoints match the contract

### Getting Help

- Check the browser console for detailed error messages
- Review the network tab for API request/response details
- Ensure your backend API matches the expected contract
- Check that environment variables are properly set

---

**Built with ❤️ using modern web technologies**