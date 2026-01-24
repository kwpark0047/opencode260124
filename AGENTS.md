# AGENTS.md - Small Business Tracker

This document provides guidelines for coding agents working on the Small Business Tracker project.

## Project Overview

**Small Business Tracker** (소상공인 정보 트래커) is a Next.js application that automatically collects and manages small business information from public data portals.

### Tech Stack
- **Framework**: Next.js 14.2.15 with App Router
- **Frontend**: React 18.3.1, TypeScript 5.6.3
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS 3.4.13
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: Supabase + Next.js API Routes
- **Deployment**: Vercel

## Build & Development Commands

### Development
```bash
# Start development server
npm run dev
# or
bun dev

# Type checking (runs during build)
npm run build  # Includes TypeScript compilation
```

### Build Commands
```bash
# Production build
npm run build

# Preview production build
npm run preview
npm start  # Same as preview
```

### Database Commands
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database
npx tsx prisma/seed.ts

# View database in Prisma Studio
npx prisma studio
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── businesses/        # Business-related pages
│   ├── admin/             # Admin pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/            # Reusable React components
├── lib/                  # Utility libraries
│   ├── api/              # API client utilities
│   ├── repositories/     # Data repository pattern
│   ├── db.ts            # Database connection
│   ├── supabase.ts      # Supabase client
│   └── logger.ts        # Logging utilities
├── types/               # TypeScript type definitions
└── workers/            # Background workers

prisma/
├── schema.prisma        # Database schema
├── migrations/         # Database migrations
└── seed.ts            # Database seeding
```

## Code Style Guidelines

### Import Organization
```typescript
// 1. React/Next.js imports
import { ReactNode } from 'react';
import type { Metadata } from 'next';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';

// 3. Internal imports (use @/* path alias)
import { Navbar } from '@/components/Navbar';
import { BusinessRepository } from '@/lib/repositories/business.repository';
import type { Business } from '@/types/api';
```

### Naming Conventions
- **Components**: PascalCase (`BusinessCard`, `StatsGrid`)
- **Functions/Variables**: camelCase (`getBusinessData`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `DEFAULT_PAGE_SIZE`)
- **Files**: kebab-case for components (`business-card.tsx`), camelCase for utilities (`businessRepository.ts`)

### TypeScript Rules
- Use `interface` for object shapes, `type` for unions/primitives
- Explicit return types for API routes and public functions
- Prefer `const` over `let` when possible
- Use proper generics with constraint types

### React Component Patterns
```typescript
// Function components with proper typing
interface ComponentProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function Component({ title, description, children }: ComponentProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-gray-600">{description}</p>}
      {children}
    </div>
  );
}
```

### API Routes (Next.js App Router)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { BusinessRepository } from '@/lib/repositories/business.repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const businesses = await BusinessRepository.findMany({ page, limit });
    
    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Failed to fetch businesses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Database Patterns (Prisma)

### Repository Pattern
```typescript
// lib/repositories/business.repository.ts
import { prisma } from '@/lib/db';
import type { Business, BusinessStatus } from '@prisma/client';

export class BusinessRepository {
  static async findMany(options: {
    page?: number;
    limit?: number;
    status?: BusinessStatus;
  }) {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;
    
    return prisma.business.findMany({
      where: status ? { status } : undefined,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
  
  static async findById(id: string) {
    return prisma.business.findUnique({
      where: { id },
      include: {
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }
}
```

## Data Fetching Patterns (React Query)

```typescript
// hooks/useBusinesses.ts
import { useQuery } from '@tanstack/react-query';
import { BusinessRepository } from '@/lib/repositories/business.repository';

export function useBusinesses(options: {
  page?: number;
  limit?: number;
  status?: BusinessStatus;
}) {
  return useQuery({
    queryKey: ['businesses', options],
    queryFn: () => BusinessRepository.findMany(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## Error Handling

### API Errors
- Always catch and log errors in API routes
- Return appropriate HTTP status codes
- Use consistent error response format: `{ error: string }`

### Client-side Errors
- Use React Query's `error` state for API errors
- Implement error boundaries for component-level error handling
- Log errors with context for debugging

## Styling (Tailwind CSS)

### Component Styling Patterns
```typescript
// Use clsx for conditional classes
import { clsx } from 'clsx';

interface CardProps {
  variant?: 'default' | 'outlined';
  className?: string;
}

export function Card({ variant = 'default', className, children }: CardProps) {
  return (
    <div
      className={clsx(
        'p-4 rounded-lg',
        {
          'bg-white shadow-sm': variant === 'default',
          'border border-gray-200': variant === 'outlined',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
```

### Responsive Design
- Mobile-first approach
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)
- Maintain consistent spacing using Tailwind's scale

## Environment Variables

### Required Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Application URL for authentication
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key

## Testing

**Note**: No testing framework is currently configured. Consider setting up:
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright or Cypress
- **API Tests**: Supertest for API routes

## Deployment

### Vercel Deployment
```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Environment Setup
- Configure environment variables in Vercel dashboard
- Ensure Prisma migrations run on deploy
- Set up proper CORS for API routes

## Korean Language Support

- UI text should be in Korean
- Database schema uses English field names with Korean comments
- Error messages should be user-friendly in Korean
- Date/time formatting should follow Korean conventions

## Performance Considerations

- Use React Query for caching API responses
- Implement proper pagination for large datasets
- Use Next.js Image optimization for images
- Leverage Vercel's Edge Network for static assets
- Consider database indexing for frequently queried fields

## Security

- Validate all user inputs
- Use parameterized queries (Prisma handles this)
- Implement proper authentication/authorization
- Sanitize data before database operations
- Use HTTPS in production