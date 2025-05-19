# Technology Stack

## Frontend

### Core Technologies
- **Next.js 15.2.4**: React framework for server-rendered applications
  - Enables server-side rendering and static site generation
  - File-based routing system
  - API routes for backend functionality
- **React 19**: UI library for building component-based interfaces
- **TypeScript**: Static typing for better developer experience and code quality

### UI Components & Styling
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
  - Custom theme configuration
  - Responsive design utilities
- **Radix UI**: Unstyled, accessible UI components
  - Used for dialogs, dropdowns, tooltips, etc.
- **Class Variance Authority (CVA)**: For type-safe component variants
- **Tailwind Merge**: Utility to merge Tailwind classes conditionally

### State Management
- **React Context API**: For global state management
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation for forms and API data

### Drag & Drop
- **dnd-kit**: Modern drag-and-drop toolkit
  - Used for the page builder interface
  - Supports sortable lists and reorderable components

### Data Fetching
- **Server Components**: For data fetching on the server
- **SWR/React Query**: Client-side data fetching and caching (if implemented)

## Backend

### Core
- **Next.js API Routes**: For serverless API endpoints
- **Supabase**: Backend-as-a-Service
  - Authentication
  - Database (PostgreSQL)
  - Storage
  - Real-time subscriptions

### Database (Supabase/PostgreSQL)
- **Tables**:
  - `pages`: Website pages and their configurations
  - `sections`: Reusable content sections
  - `products`: Menu items
  - `categories`: Product categories
  - `orders`: Customer orders
  - `users`: System users and permissions

### Authentication
- **Supabase Auth**: For user authentication
  - Email/password
  - Social logins (Google, etc.)
  - JWT-based sessions

## Development Tools

### Build & Package Management
- **npm/pnpm**: Package management
- **TypeScript 5.x**: Type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Testing
- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Cypress**: E2E testing (if implemented)

### Deployment
- **Vercel**: For hosting the Next.js application
- **Supabase Edge Functions**: For serverless functions

## DevOps

### Version Control
- **Git**: Source code versioning
- **GitHub/GitLab**: Code hosting and CI/CD

### CI/CD
- **GitHub Actions/GitLab CI**: For automated testing and deployment
- **Preview Deployments**: For testing before production

### Monitoring
- **Sentry**: Error tracking
- **Vercel Analytics**: Performance monitoring
- **LogRocket**: Session replay and logging

## Justification of Technology Choices

### Next.js
- **Why**: Provides excellent developer experience, server-side rendering, and API routes in a single framework
- **Benefits**:
  - Improved SEO with server-side rendering
  - Built-in routing and API endpoints
  - Automatic code splitting
  - Image optimization

### Supabase
- **Why**: Open-source Firebase alternative with PostgreSQL
- **Benefits**:
  - Real-time subscriptions
  - Built-in authentication
  - Row-level security
  - Self-hosting option

### Tailwind CSS
- **Why**: Utility-first CSS framework for rapid UI development
- **Benefits**:
  - Consistent design system
  - Responsive design utilities
  - No need to switch between files
  - Small bundle size with PurgeCSS

### TypeScript
- **Why**: Static typing for JavaScript
- **Benefits**:
  - Better developer experience with autocomplete
  - Catch errors at compile time
  - Self-documenting code
  - Easier refactoring

## Versioning

- **Node.js**: ^18.0.0
- **npm**: ^9.0.0
- **Next.js**: 15.2.4
- **React**: ^19.0.0
- **TypeScript**: ^5.0.0
- **Supabase**: ^2.49.4

## Environment Variables

Required environment variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Other
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
