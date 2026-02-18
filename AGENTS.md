# AGENTS.md

Guide for AI coding agents working in the RefZone codebase.

## Build/Lint/Test Commands

```bash
# Development
pnpm dev                 # Start Next.js dev server

# Build
pnpm build               # Build for production
pnpm start               # Start production server

# Linting
pnpm lint                # Run ESLint (uses next/core-web-vitals)

# No test framework configured - add tests with:
# pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
# Then use: pnpm vitest run <test-file-pattern>
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, RSC)
- **Runtime**: React 19, TypeScript 5
- **Styling**: Tailwind CSS v4, shadcn/ui (New York style)
- **Package Manager**: pnpm 9.15.4
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq SDK, AI SDK
- **Mobile**: Capacitor
- **Icons**: Lucide React

## Code Style Guidelines

### Imports
- Use path aliases: `@/components`, `@/lib`, `@/hooks`
- Group imports: React, external libs, internal aliases, types
- Use `import * as React from 'react'` (not `import React from 'react'`)
- Import types with `import type { ... }`

### TypeScript
- Enable strict mode (configured in tsconfig.json)
- Use explicit return types for exported functions
- Prefer interface over type for object shapes
- Use `Readonly<>` for immutable props

### Naming Conventions
- Components: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useMobile.ts`)
- Utilities: camelCase (e.g., `cn.ts`, `activityLogger.ts`)
- Constants: UPPER_SNAKE_CASE for module-level constants
- Files: Match export name (e.g., `button.tsx` exports `Button`)

### Component Patterns
- Use function declarations for components: `function Button({ ... })`
- Props interface named with `Props` suffix or component name
- Use `asChild` pattern with Radix Slot for composability
- shadcn/ui components use CVA (class-variance-authority) for variants

### Styling
- Use Tailwind CSS v4 syntax: `@import "tailwindcss"`
- Theme colors via CSS variables (see `app/globals.css`)
- Brand colors: purple (#9114af), pink (#ff5eb8)
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Always use double quotes in className strings

### Error Handling
- API routes: wrap in try/catch, return NextResponse.json with error
- Console errors with prefix: `console.error("[v0] Error message:", error)`
- Use Zod for runtime validation
- Never expose sensitive error details to client

### API Routes
- Use `route.ts` files in `app/api/<route>/`
- Use `NextResponse.json()` for responses
- Parse request body with `await req.json()`
- No Vercel-specific exports (e.g., `maxDuration`) - app is self-hosted

### File Structure
```
app/
  api/           # API routes
  <page>/        # Page routes with page.tsx, layout.tsx
  globals.css    # Global styles, Tailwind config
components/
  ui/            # shadcn/ui components
  <feature>/     # Feature-specific components
lib/
  supabase/      # Database clients
  utils.ts       # Utility functions (cn, etc.)
hooks/
  use-<name>.ts  # Custom React hooks
```

### Environment Variables
- Client-side: `NEXT_PUBLIC_` prefix
- Server-side: No prefix required
- Never commit .env files

### Git
- Use conventional commits
- No pre-commit hooks configured
- Run `pnpm lint` before committing
