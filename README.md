# Veriqraft
**Where quality meets creation.**

Veriqraft is a React + TypeScript learning platform for software quality engineering, automation and practical AI. Supabase provides authentication, PostgreSQL, Row Level Security and the assessment Edge Function.

## Stack
- React 19 + TypeScript + Vite
- Supabase Auth and PostgreSQL
- Supabase Edge Functions for server-side assessment grading and certificate issuance
- Vercel deployment

## Local setup
1. Install Node.js 20.19+ or 22.12+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add the Supabase project URL and publishable key.
4. Run `npm run dev`.
5. Run `npm run build` to type-check and create a production build.

## Supabase
The schema migration is in `supabase/schema.sql`. The `complete-assessment` Edge Function validates the signed-in user, enrollment and lesson completion, grades answers on the server, and issues a certificate after a passing score. Do not expose the Supabase service-role key in the browser.

## Vercel environment variables
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for Production, Preview and Development, then deploy the `main` branch.

## Current scope
Authentication, profiles, course catalogue, enrollment, lesson progress, server-graded assessments, certificate issuance/lookup and inquiry submission are implemented. Paid checkout, transactional email/SMTP, admin console and video hosting require their respective provider credentials/configuration before they can be enabled in production.
