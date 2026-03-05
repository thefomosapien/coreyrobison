# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (next lint)
```

No test framework is configured.

## Environment Variables

Requires `.env.local` with two variables (see `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are `NEXT_PUBLIC_*` — inlined at build time. Changing them after a build has no effect; you must redeploy. Find values in Supabase dashboard: Settings > API.

## Architecture

**Next.js 14 App Router** with two distinct areas:

### Public Site (`app/page.tsx`, `app/thoughts/`)
- Server Components with ISR (`revalidate = 60`)
- Uses plain `@supabase/supabase-js` client (`lib/supabase/client.ts`) — no cookies/SSR needed since it only reads public data
- Homepage loads all sections (hero, projects, thoughts, journey, about, contact) via `Promise.all()`

### Admin CMS (`app/admin/*`)
- Client Components (`'use client'`) with `@supabase/ssr` cookie-based auth (`lib/supabase/server.ts`)
- Middleware (`middleware.ts`) protects all `/admin/*` routes except `/admin/login`
- Toast notification system via `ToastProvider` context in admin layout
- Full CRUD for: projects, thoughts, journey items, about details, contact links, site settings
- Deployed projects dashboard (`/admin/projects-dashboard`) tracks side projects with metrics

### API Routes
- `app/api/reactions/route.ts` — Public GET/POST for reaction counts (no auth required)

### Supabase Client Pattern
Three separate clients in `lib/supabase/`:
- `client.ts` — Browser client (public pages)
- `server.ts` — Server client with cookies (admin/server components)
- `middleware.ts` — Session management, auth redirects

## Database

Schema lives in `supabase/migrations/` (run in order via Supabase SQL Editor). Seed data in `supabase/seed.sql`.

Core tables: `site_settings` (single-row), `projects`, `thoughts`, `reactions`, `journey_items`, `about_details`, `contact_links`, `deployed_projects`.

RLS: public read on all tables, public insert/update on `reactions` only, authenticated full access.

Storage: `project-images` bucket (public read, authenticated write).

## Styling

Tailwind CSS with custom design tokens in `tailwind.config.ts`:
- Colors: `bg` (cream variants), `ink` (dark brown variants), `ocean` (teal), `sand` (terracotta), `tide` (green)
- Fonts: `serif` (Instrument Serif), `sans` (Instrument Sans), `pixel` (Silkscreen)
- Max content width: `920px` (`max-w-content`)

Thought categories have predefined color schemes in `lib/categoryStyles.ts`.

## Deployment (Vercel)

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel project Settings > Environment Variables **before** building. Use the anon/public key, NOT the service_role secret.
