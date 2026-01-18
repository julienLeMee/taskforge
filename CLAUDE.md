# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (runs prisma generate first)
npm run lint     # Run ESLint
npm run start    # Start production server
```

### Database

```bash
npx prisma generate          # Generate Prisma client
npx prisma db push           # Push schema changes to database
npx prisma migrate dev       # Create and apply migrations
npx prisma studio            # Open database GUI
```

## Architecture

TaskFlow is a full-stack task management application built with Next.js App Router.

### Tech Stack
- **Frontend**: Next.js 15 (React 19), TypeScript, Tailwind CSS 4, Shadcn UI
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL (Supabase)
- **Auth**: NextAuth.js 5 (beta) with Credentials, Google, GitHub providers
- **Drag-and-Drop**: @dnd-kit for sortable lists

### Key Directories
- `src/app/` - Pages and API routes (App Router)
- `src/components/ui/` - Shadcn UI components
- `src/lib/auth/` - NextAuth configuration
- `src/lib/validations/` - Zod validation schemas
- `prisma/` - Database schema and migrations

### Database Models
- **User**: Authentication and profile data
- **Task**: Has status (TODO/IN_PROGRESS/WAITING/COMPLETED), priority (LOW/MEDIUM/HIGH/URGENT), timeframe (TODAY/THIS_WEEK/UPCOMING), and order field for drag-and-drop
- **Project**: Has status, nextSteps (JSON), deployment info, and order field for drag-and-drop

### API Route Pattern
All API routes follow this pattern:
```typescript
const session = await auth()
if (!session?.user?.id) {
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
}
// Use Zod for request validation, return NextResponse.json
```

### Path Aliases
- `@/*` maps to `src/*`
- `#/*` maps to root (used for `#/auth.ts`)

### Environment Variables
Required: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `JIRA_HOST`, `JIRA_API_TOKEN`, `JIRA_USER_EMAIL`

## Notes
- UI text is in French
- Dark/light mode via next-themes
- Toast notifications via Sonner
- Tasks and Projects have `order` field for custom ordering with reorder API endpoints
