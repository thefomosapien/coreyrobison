# Corey Robison — Portfolio CMS

A full-stack portfolio website with an admin CMS, built with Next.js 14 (App Router), Supabase, and Tailwind CSS.

## Stack

- **Framework:** Next.js 14 with App Router, TypeScript
- **Database / Auth / Storage:** Supabase
- **Styling:** Tailwind CSS with a warm minimalist design system
- **Deployment:** Vercel-ready

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd coreyrobison
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Run database migrations

Go to your Supabase dashboard → SQL Editor and run the following files in order:

1. `supabase/migrations/001_initial_schema.sql` — Creates all tables, RLS policies, and storage bucket
2. `supabase/seed.sql` — Populates seed data so the site works immediately

### 4. Create an admin user

In the Supabase dashboard → Authentication → Users, create a new user with email and password. This will be your admin login.

### 5. Run the dev server

```bash
npm run dev
```

- **Public portfolio:** [http://localhost:3000](http://localhost:3000)
- **Admin dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)

## Project Structure

```
/app
  /page.tsx                    — Public portfolio (server component, ISR)
  /layout.tsx                  — Root layout with fonts
  /admin
    /login/page.tsx            — Admin login
    /layout.tsx                — Admin layout with sidebar
    /page.tsx                  — Dashboard overview
    /settings/page.tsx         — Edit site settings
    /projects/page.tsx         — Manage projects (CRUD)
    /journey/page.tsx          — Manage journey items (CRUD)
    /about/page.tsx            — Manage about details (CRUD)
    /contact/page.tsx          — Manage contact links (CRUD)
/components
  /portfolio                   — Public site components
  /admin                       — Admin components (Sidebar, Toast)
/lib
  /supabase                    — Supabase client (browser, server, middleware)
  /types.ts                    — TypeScript types
/supabase
  /migrations                  — SQL migration files
  /seed.sql                    — Seed data
```

## Design System

- **Colors:** Cream (#F6F3EE), Navy (#1A1814), Terracotta (#C8553D)
- **Fonts:** DM Serif Display (headings), DM Sans (body)
- **Aesthetic:** Warm minimalism with grain overlay, scroll-triggered animations, frosted glass nav

## Admin Features

- Full CRUD for projects, journey items, about details, and contact links
- Site settings editor for global content
- Image upload to Supabase Storage for custom project visuals
- Visibility toggles for projects and journey items
- Inline validation and toast notifications
- Unsaved changes warnings
- Protected by Supabase Auth (email/password)

## Deployment

Deploy to Vercel by connecting your repository. Add the Supabase environment variables in the Vercel dashboard.

The public site uses ISR with a 60-second revalidation period, so content changes appear quickly while maintaining fast load times.

This is too hard.
