# MIM PK Dimoro - Project Instructions

Foundational mandates for all agent interactions in this repository.

## Project Context
- **Tech Stack**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Supabase, Vitest.
- **Domain**: School Management System for MIM PK Dimoro.

## Engineering Standards

### 1. Development Workflow (Superpowers)
- **TDD First**: Always search for existing tests or create new ones before implementing features or fixes. Use `npm test` to verify.
- **Systematic Debugging**: Before fixing a bug, reproduce it with a test case and analyze the root cause.
- **Brainstorming**: For any new feature or architectural change, perform a brainstorming phase to align on design and requirements.
- **Verification**: Never claim a task is complete without running full validation (linting, types, tests).

### 2. Code Conventions
- **TypeScript**: Strict typing is mandatory. Avoid `any`. Use interfaces for data structures.
- **Components**: 
  - Prefer Server Components by default.
  - Use `'use client'` only when necessary for interactivity or hooks.
  - Shadcn/UI components reside in `components/ui/`.
- **Styling**: Tailwind CSS only. Follow the existing color palette and spacing defined in `tailwind.config.ts`.
- **Supabase**: 
  - Use `lib/supabase/server.ts` for Server Components/Actions.
  - Use `lib/supabase/client.ts` for Client Components.
  - Always respect RLS (Row Level Security) patterns.

### 3. Testing
- Framework: Vitest.
- Location: Place tests in `__tests__` directories or alongside the file they test using the `.test.ts(x)` suffix.
- Requirement: All new utility logic and critical business components must have test coverage.

### 4. Git & Commits
- Follow conventional commits if requested, otherwise keep messages concise and "why" focused.
- Do not commit secrets or `.env` files.

### 5. Admin & Mobile-First UI/UX Standards
- **Data Property Invariance**: On administrative record sheets/dossiers, DO NOT put icons on individual key-value data rows. Keep icons strictly on section/card headers for clean left-alignment.
- **Mobile Action Ergonomics**: In 2-column desktop admin layouts, never bury critical actions at the bottom on mobile. Use a Sticky Floating Bottom Action Dock (`fixed bottom-0 lg:hidden`) for primary workflows (e.g., WhatsApp & Status decision) and ensure status is visible in the top header.
- **Mobile Tab Safeguards**: Always apply `shrink-0 whitespace-nowrap min-w-max px-4` on horizontal swipeable pill tabs to prevent text clipping.
- **Mobile Form Touch Safety**: Use `h-10 text-sm sm:h-8 sm:text-xs` for input fields to satisfy touch target guidelines (min. 40px) and prevent iOS Safari auto-zoom.

## Specialized Skills
- Use `nextjs-app-router-patterns` for routing and data fetching.
- Use `nextjs-supabase-auth` for authentication flows.
- Use `shadcn` for UI component management.
- Use `supabase-postgres-best-practices` for database queries and schema changes.

## Shared Knowledge
- Admin routes are protected and located under `/app/admin`.
- Public routes include home, berita, and pendaftaran.
- Configuration for school identity is in `lib/school-config.ts`.
