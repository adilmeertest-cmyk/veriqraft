# Veriqraft
**Where quality meets creation.**

React 19 + TypeScript + Vite learning platform using Supabase Auth, PostgreSQL, Row Level Security and a server-side assessment Edge Function.

## Local setup
1. Install Node.js 20.19+ or 22.12+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set the Supabase URL and publishable key.
4. Run `npm run dev`; run `npm run build` for a type-check and production build.

## Vercel
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for Production, Preview and Development. Deploy the `main` branch.

## Production scope
Authentication, profiles, courses, enrollment, lesson progress, server-graded assessments, certificate issuance/lookup and inquiry submission are implemented. Paid checkout, transactional email/SMTP, admin console and video hosting require provider credentials/configuration before activation. Never expose a Supabase service-role key in browser code.