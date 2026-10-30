# Veriqraft

**Where quality meets creation.**

A learning and digital quality studio by Muhammad Adil. Veriqraft brings together practical software testing, test automation and AI workflows.

## Included
- Responsive landing page and course catalogue with search and category filters
- Course detail previews and lesson-player demo
- Course-specific final assessments with a 70% pass threshold
- Certificate design with learner name, course title, unique ID, QR code and print-to-PDF
- Certificate lookup UI
- Browser-local demo progress so the experience can be explored without account setup

## Run locally
```bash
npm install
npm run dev
```
Build with `npm run build`.

## Demo vs production
Course progress and certificates currently use browser localStorage. The certificate is deliberately marked **DEMO — NOT A VERIFIED CREDENTIAL**. A local browser record can be edited and is not a trusted public registry. Do not market demo certificates as accredited, independently verified or tamper-proof.

## Before a real launch
1. Create a Supabase project and apply `supabase/schema.sql`.
2. Add Supabase Auth and persist enrolments, lesson progress and assessment attempts.
3. Move answer keys and grading to a server-side Supabase Edge Function.
4. Issue certificates only from the trusted server after checking course completion and a passing score.
5. Serve public verification from the database, including valid, revoked and not-found states.
6. Connect a payment provider using signed server-side webhooks before granting paid access.
7. Add email notifications, admin roles/policies, rate limiting, backups, privacy and terms pages.

Never expose Supabase service-role keys or payment secrets in browser code. Never use private client QA evidence as public course material without permission.
