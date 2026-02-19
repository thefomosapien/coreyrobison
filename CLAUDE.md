# Corey Robison Portfolio

## Deployment Checklist (Vercel)

When deploying or redeploying to Vercel, ensure these environment variables are set
in the Vercel project dashboard (Settings > Environment Variables) **before** building:

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (e.g. `https://xxxxx.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the **anon / public** key (NOT the service_role secret key)

These are `NEXT_PUBLIC_*` variables, meaning they are **inlined at build time**.
Changing them after a build has no effect — you must redeploy.

Find these values in the Supabase dashboard: Settings > API.

## Tech Stack

- Next.js 14 (App Router)
- Supabase (database + auth)
- Tailwind CSS
- Deployed on Vercel

## Architecture Notes

- The public homepage (`app/page.tsx`) uses a plain `@supabase/supabase-js` client (no cookies/SSR wrapper) since it only reads public data.
- The admin pages (`app/admin/*`) use `@supabase/ssr` with cookies for authenticated access.
- Middleware protects `/admin/*` routes (except `/admin/login`).
