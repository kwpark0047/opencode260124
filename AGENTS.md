# AGENTS.md - Small Business Tracker Project Guide

This document provides essential coding guidelines for AI agents working on the Small Business Tracker project.

## Project Overview

**Small Business Tracker** (소상공인 정보 트래커) is a Next.js 14 application that automatically collects and manages small business information from public data portals.

### Tech Stack
- **Framework**: Next.js 14.2.15 with App Router
- **Language**: TypeScript 5.6.3 (strict mode enabled)
- **Database**: PostgreSQL with Prisma ORM 7.3.0
- **Frontend**: React 18.3.1, Radix UI Themes, Lucide React
- **Styling**: Tailwind CSS 3.4.13
- **Data Fetching**: TanStack Query (React Query) 5.90.19
- **Backend**: Supabase + Next.js API Routes
- **Authentication**: NextAuth 5.0.0-beta.30
- **Logging**: Pino 10.2.1
- **Deployment**: Vercel

## Essential Commands

### Development & Build
```bash
# Development server
npm run dev                    # localhost:3000

# Production build (includes type checking)
npm run build

# Production server
npm start                      # or npm run preview

# Linting
npm run lint                   # ESLint check
```

### Database Operations
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Database viewer
npx prisma studio

# Seed database
npm run prisma:seed            # tsx prisma/seed.ts
```

### Testing
**Current State**: No test framework configured
**Single Test Pattern** (when implemented): `npm test -- --testNamePattern="specific test"`

## Code Style Guidelines

### Import Organization
```typescript
// 1. React/Next.js imports
import { ReactNode } from 'react';
import type { Metadata, NextRequest } from 'next';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import pino from 'pino';

// 3. Internal imports (use @/* path alias)
import { db } from '@/app/lib/db';
import { BusinessRepository } from '@/app/lib/repositories/business.repository';
import { apiLogger } from '@/app/lib/logger';
import type { Business, BusinessStatus } from '@/app/generated/prisma';
```

### Naming Conventions
- **Components**: PascalCase (`BusinessCard`, `StatsGrid`)
- **Files**: kebab-case for components (`business-card.tsx`), camelCase for utilities
- **Functions/Variables**: camelCase (`getBusinessData`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `DEFAULT_PAGE_SIZE`)
- **Database**: English field names with Korean comments

### TypeScript Standards
- Strict mode enabled (`"strict": true` in tsconfig.json)
- Use `interface` for object shapes, `type` for unions/primitives
- Explicit return types for public functions and API routes
- No `any` types - use proper typing
- Path alias: `@/*` points to project root

## Project Structure
```
app/
├── api/                    # API routes (route.ts)
├── components/             # React components
├── lib/                    # Core utilities
│   ├── repositories/       # Repository pattern classes
│   ├── db.ts              # Database connection
│   ├── supabase.ts        # Supabase client
│   └── logger.ts          # Logging utilities
├── generated/prisma/       # Generated Prisma client
└── [pages]/               # App Router pages (page.tsx)

prisma/
├── schema.prisma          # Database schema
├── migrations/           # Database migrations
└── seed.ts              # Database seeding
```

## Repository Pattern (Mandatory)

All database operations MUST use repository classes:

```typescript
export class BusinessRepository {
  async createMany(data: CreateBusinessInput[]) { }
  async search(options: SearchOptions) { }
  async findByBizesId(bizesId: string) { }
  async upsertMany(data: CreateBusinessInput[]) { }
}

export const businessRepository = new BusinessRepository();
```

**Rules:**
- Always use global `db` from `@/app/lib/db`
- Repository pattern is mandatory - no direct database access
- Use `skipDuplicates: true` for bulk operations
- Include proper logging with `dbLogger`

## Logging Standards

Use structured logging with Pino:

```typescript
import { apiLogger, dbLogger, syncLogger } from '@/app/lib/logger';

apiLogger.info({ count: data.length }, 'Processing business data');
dbLogger.error({ error: error.message }, 'Database operation failed');
syncLogger.warn({ dataSource }, 'Sync operation incomplete');
```

**Logger Types:**
- `logger`: Base logger
- `apiLogger`: API endpoints
- `dbLogger`: Database operations
- `syncLogger`: Data synchronization
- `webLogger`: Web requests
- `authLogger`: Authentication
- `notificationLogger`: Notifications

## API Route Patterns

Standard Next.js App Router API structure:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { businessRepository } from '@/app/lib/repositories/business.repository';
import { apiLogger } from '@/app/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const result = await businessRepository.search({ page, limit });
    
    apiLogger.info({ page, limit, count: result.items.length }, 'Businesses retrieved');
    return NextResponse.json(result);
  } catch (error) {
    apiLogger.error({ error: error.message }, 'Failed to fetch businesses');
    return NextResponse.json(
      { error: '조회 실패' },
      { status: 500 }
    );
  }
}
```

## Error Handling

**Requirements:**
- Always use try-catch in API routes
- Return structured error responses with proper HTTP status codes
- User-facing messages in Korean, internal logging in English
- Use structured logging for debugging

## Database Schema (Key Models)

### Business Model
- **Primary Fields**: `bizesId` (unique), `name`, status enums
- **Address**: Both road name and lot number addresses
- **Classification**: 3-tier industry codes (대/중/소분류)
- **Status Tracking**: `BusinessStatus` and `RecordStatus` enums
- **Audit Trail**: Full audit logging with `AuditLog` model

### Key Enums
```typescript
enum BusinessStatus {
  pending, active, inactive, dissolved, pending_renewal
}

enum RecordStatus {
  new, synced, verified
}
```

## React Component Patterns

```typescript
// Function components with proper typing
interface BusinessCardProps {
  business: Business;
  variant?: 'default' | 'compact';
  className?: string;
}

export function BusinessCard({ 
  business, 
  variant = 'default', 
  className 
}: BusinessCardProps) {
  return (
    <div className={clsx('p-4 rounded-lg', className)}>
      <h3 className="font-semibold">{business.name}</h3>
    </div>
  );
}
```

## Data Fetching (React Query)

```typescript
export function useBusinesses(options: {
  page?: number;
  limit?: number;
  status?: BusinessStatus;
}) {
  return useQuery({
    queryKey: ['businesses', options],
    queryFn: () => businessRepository.search(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL  
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Authentication secret
- `LOG_LEVEL` - Logging level (default: 'info')

## Configuration Files

### Key Files
- `tsconfig.json` - TypeScript with strict mode, `@/*` path alias
- `tailwind.config.js` - Tailwind CSS configuration
- `eslint.config.mjs` - ESLint with Next.js rules
- `prisma/schema.prisma` - Database schema with custom output location
- `next.config.js` - Next.js configuration

### Prisma Configuration
```typescript
generator client {
  provider = "prisma-client"
  output   = "app/generated/prisma"  // Custom location
}
```

## Korean Localization

- UI text: Korean
- Code comments: Korean for business logic, English for technical details
- Error messages: Korean (user-facing)
- Variable/function names: English
- Database field names: English with Korean comments

## Development Workflow

1. Install dependencies: `npm install`
2. Set environment variables (copy from `.env.example`)
3. Run database migrations: `npx prisma migrate dev`
4. Generate Prisma client: `npx prisma generate`
5. Seed database: `npm run prisma:seed`
6. Start development: `npm run dev`

## Performance Guidelines

- Use React Query for API response caching
- Implement proper database pagination
- Use Prisma's `skipDuplicates: true` for bulk operations
- Leverage Vercel Edge Network for static assets
- Consider database indexing for frequently queried fields

## Security

- Validate all user inputs
- Use parameterized queries (Prisma handles this)
- Implement proper authentication with NextAuth
- Sanitize data before database operations
- Use HTTPS in production

## Deployment

- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: 18.x or higher
- **Environment Variables**: Configure in Vercel dashboard

## Migration Status Tracking

Use `SyncState` model for tracking data synchronization status:
- Track last sync time, status, and error messages
- Monitor sync counts and new record detection
- Implement retry logic for failed syncs