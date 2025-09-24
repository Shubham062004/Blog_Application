import { Blog, User, Comment } from '@/types';

export const mockUser: User = {
  id: '1',
  username: 'johndoe',
  email: 'john@example.com',
  name: 'John Doe',
  profile_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
};

export const mockAuthors = [
  {
    id: '1',
    username: 'johndoe',
    name: 'John Doe',
    profile_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  },
  {
    id: '2',
    username: 'janesmith',
    name: 'Jane Smith',
    profile_photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
  },
  {
    id: '3',
    username: 'mikebrown',
    name: 'Mike Brown',
    profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  }
];

export const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    excerpt: 'Learn how to build modern web applications using React with TypeScript. This comprehensive guide covers everything from setup to advanced patterns.',
    content: `# Getting Started with React and TypeScript

React and TypeScript make a powerful combination for building modern web applications. In this article, we'll explore how to set up a new project and leverage TypeScript's type safety features.

## Why TypeScript?

TypeScript brings static type checking to JavaScript, which helps catch errors early in development and provides better IDE support with intelligent code completion.

## Setting Up Your Project

First, create a new React project with TypeScript support:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

This creates a new React application with TypeScript configuration already set up.

## Key Benefits

1. **Type Safety**: Catch errors at compile time
2. **Better IDE Support**: Enhanced autocomplete and refactoring
3. **Improved Documentation**: Types serve as documentation
4. **Easier Refactoring**: Confident code changes with type checking

## Conclusion

TypeScript and React together provide a robust foundation for building scalable web applications. Start small and gradually adopt more advanced TypeScript features as you become comfortable.`,
    cover_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    author: mockAuthors[0],
    created_at: '2024-01-15T10:30:00Z',
    like_count: 24,
    comment_count: 8,
    is_liked: true,
    is_wishlisted: false
  },
  {
    id: '2',
    title: 'Building Responsive Web Design with Tailwind CSS',
    excerpt: 'Master the art of responsive design using Tailwind CSS utility classes. Create beautiful, mobile-first layouts that work across all devices.',
    content: `# Building Responsive Web Design with Tailwind CSS

Tailwind CSS revolutionizes how we approach responsive web design with its utility-first approach and mobile-first responsive system.

## Mobile-First Approach

Tailwind CSS follows a mobile-first responsive design philosophy. This means you start by designing for mobile devices and then scale up to larger screens.

## Responsive Utilities

Tailwind provides responsive utilities for every style in the framework:

\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- This div is full width on mobile, half width on medium screens, and one-third width on large screens -->
</div>
\`\`\`

## Breakpoint System

The default breakpoints are:
- sm: 640px
- md: 768px  
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Best Practices

1. Start with mobile design
2. Use appropriate breakpoints
3. Test on real devices
4. Consider touch interactions

Responsive design is essential in today's multi-device world, and Tailwind CSS makes it easier than ever.`,
    cover_image_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
    author: mockAuthors[1],
    created_at: '2024-01-12T14:20:00Z',
    like_count: 18,
    comment_count: 5,
    is_liked: false,
    is_wishlisted: true
  },
  {
    id: '3',
    title: 'Modern JavaScript ES6+ Features You Should Know',
    excerpt: 'Explore the latest JavaScript features that make your code more concise, readable, and powerful. From arrow functions to async/await.',
    content: `# Modern JavaScript ES6+ Features You Should Know

JavaScript has evolved significantly with ES6 and later versions. Let's explore the most important features that every developer should master.

## Arrow Functions

Arrow functions provide a more concise syntax for writing functions:

\`\`\`javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;
\`\`\`

## Destructuring

Extract values from arrays or objects:

\`\`\`javascript
// Array destructuring
const [first, second] = [1, 2];

// Object destructuring
const { name, age } = { name: 'John', age: 30 };
\`\`\`

## Template Literals

Create strings with embedded expressions:

\`\`\`javascript
const name = 'World';
const greeting = \`Hello, \${name}!\`;
\`\`\`

## Async/Await

Handle asynchronous operations more elegantly:

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

These features make JavaScript more powerful and enjoyable to work with.`,
    cover_image_url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop',
    author: mockAuthors[2],
    created_at: '2024-01-10T09:15:00Z',
    like_count: 32,
    comment_count: 12,
    is_liked: true,
    is_wishlisted: true
  },
  {
    id: '4',
    title: 'Understanding React Hooks and State Management',
    excerpt: 'Deep dive into React Hooks and learn how to manage component state effectively. From useState to custom hooks.',
    content: `# Understanding React Hooks and State Management

React Hooks revolutionized how we write React components by allowing us to use state and other React features in functional components.

## useState Hook

The most basic hook for managing component state:

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

Handle side effects in your components:

\`\`\`javascript
import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []); // Empty dependency array means this runs once
  
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
\`\`\`

## Custom Hooks

Create reusable stateful logic:

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}
\`\`\`

## Rules of Hooks

1. Only call hooks at the top level
2. Only call hooks from React functions
3. Use the ESLint plugin for hooks

Hooks make React components more powerful and reusable while keeping them simple.`,
    cover_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    author: mockAuthors[0],
    created_at: '2024-01-08T16:45:00Z',
    like_count: 28,
    comment_count: 15,
    is_liked: false,
    is_wishlisted: false
  },
  {
    id: '5',
    title: 'CSS Grid vs Flexbox: When to Use Which',
    excerpt: 'Learn the differences between CSS Grid and Flexbox, and discover when to use each layout system for optimal results.',
    content: `# CSS Grid vs Flexbox: When to Use Which

Both CSS Grid and Flexbox are powerful layout systems, but they serve different purposes. Understanding when to use each will make you a more effective developer.

## Flexbox: One-Dimensional Layout

Flexbox is designed for one-dimensional layouts - either rows or columns:

\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

### Best Use Cases for Flexbox:
- Navigation bars
- Centering content
- Equal height columns
- Distributing space between items

## CSS Grid: Two-Dimensional Layout

CSS Grid is designed for two-dimensional layouts - both rows and columns:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}
\`\`\`

### Best Use Cases for CSS Grid:
- Page layouts
- Complex grid systems
- Overlapping content
- Asymmetrical layouts

## When to Use Which

**Use Flexbox when:**
- Working with one dimension
- Need to align items
- Want to distribute space
- Building navigation components

**Use CSS Grid when:**
- Creating page layouts
- Need precise control over rows and columns
- Building complex layouts
- Working with overlapping content

## Can You Use Both?

Absolutely! They work great together:

\`\`\`css
.page-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
}

.navigation {
  display: flex;
  justify-content: space-between;
}
\`\`\`

The key is understanding that they solve different problems and can complement each other perfectly.`,
    cover_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    author: mockAuthors[1],
    created_at: '2024-01-05T11:30:00Z',
    like_count: 21,
    comment_count: 7,
    is_liked: true,
    is_wishlisted: false
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Great article! This really helped me understand the differences between TypeScript and regular JavaScript.',
    author: mockAuthors[1],
    created_at: '2024-01-15T12:30:00Z'
  },
  {
    id: '2',
    content: 'I\'ve been using React for a while but never tried TypeScript. This makes me want to give it a shot!',
    author: mockAuthors[2],
    created_at: '2024-01-15T14:15:00Z'
  },
  {
    id: '3',
    content: 'The setup instructions were spot on. Had my TypeScript React project running in minutes.',
    author: {
      id: '4',
      username: 'sarah_dev',
      name: 'Sarah Wilson',
      profile_photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    },
    created_at: '2024-01-15T16:45:00Z'
  }
];

export const mockWishlistedBlogs = mockBlogs.filter(blog => blog.is_wishlisted);
export const mockUserBlogs = mockBlogs.filter(blog => blog.author.id === mockUser.id);