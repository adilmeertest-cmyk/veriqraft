-- Veriqraft schema reference. This schema is already applied to Supabase project njswpsbwvgimfipofhhe.
-- Production migrations are recorded in Supabase as veriqraft_learning_platform and lock_profile_role_updates.
-- Do not expose service-role credentials in browser code.

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id text primary key, slug text unique not null, title text not null,
  category text not null, level text not null, duration text not null,
  price_cents integer not null default 0 check (price_cents >= 0),
  description text not null, outcomes jsonb not null default '[]'::jsonb,
  curriculum jsonb not null default '[]'::jsonb, published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  enrolled_at timestamptz not null default now(), unique(user_id, course_id)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  lesson_id text not null, completed_at timestamptz not null default now(),
  unique(user_id, course_id, lesson_id)
);

create table public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  passed boolean not null, created_at timestamptz not null default now()
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_code text unique not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null references public.courses(id) on delete restrict,
  learner_name text not null, score integer not null check (score between 0 and 100),
  issued_at timestamptz not null default now(), revoked_at timestamptz
);

create table public.certificate_registry (
  certificate_code text primary key references public.certificates(certificate_code) on delete cascade,
  learner_name text not null, course_title text not null,
  score integer not null, issued_at timestamptz not null,
  status text not null default 'valid' check (status in ('valid','revoked'))
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null, email text not null, service text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','in_progress','closed')),
  created_at timestamptz not null default now()
);

-- RLS is enabled on every table. Users can read their own profile, enrollments,
-- lesson progress, assessment attempts and certificates. Published courses and
-- minimal certificate registry fields are public. Inquiry submission is public.
-- Assessment attempts and certificates are written only by the trusted Edge Function.
-- Profile updates are revoked to prevent users from promoting their own role.
-- Server-only service-role key must never be included in VITE_ browser variables.
