-- Veriqraft production data model. Apply to a Supabase project.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null default '',
 created_at timestamptz not null default now()
);
create table if not exists public.courses (
 id text primary key, title text not null, description text not null default '',
 price_cents integer not null default 0 check(price_cents >= 0),
 published boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.enrollments (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 course_id text not null references public.courses(id),
 status text not null default 'active' check(status in ('active','completed','refunded')),
 enrolled_at timestamptz not null default now(), unique(user_id,course_id)
);
create table if not exists public.lesson_progress (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 course_id text not null references public.courses(id),
 lesson_key text not null, completed_at timestamptz not null default now(),
 unique(user_id,course_id,lesson_key)
);
create table if not exists public.assessment_attempts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 course_id text not null references public.courses(id),
 score integer not null check(score between 0 and 100),
 passed boolean not null, submitted_at timestamptz not null default now()
);
create table if not exists public.certificates (
 id uuid primary key default gen_random_uuid(),
 certificate_code text not null unique,
 user_id uuid not null references auth.users(id),
 course_id text not null references public.courses(id),
 recipient_name text not null,
 score integer not null check(score between 70 and 100),
 issued_at timestamptz not null default now(), revoked_at timestamptz,
 unique(user_id,course_id)
);
create table if not exists public.inquiries (
 id uuid primary key default gen_random_uuid(), name text not null,
 email text not null, topic text not null, message text not null,
 created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.certificates enable row level security;
alter table public.inquiries enable row level security;
create policy "Own profile read" on public.profiles for select to authenticated using(auth.uid()=id);
create policy "Own profile insert" on public.profiles for insert to authenticated with check(auth.uid()=id);
create policy "Own profile update" on public.profiles for update to authenticated using(auth.uid()=id) with check(auth.uid()=id);
create policy "Published courses public" on public.courses for select using(published=true);
create policy "Own enrollments read" on public.enrollments for select to authenticated using(auth.uid()=user_id);
create policy "Own progress read" on public.lesson_progress for select to authenticated using(auth.uid()=user_id);
create policy "Own progress write" on public.lesson_progress for insert to authenticated with check(auth.uid()=user_id);
create policy "Own attempts read" on public.assessment_attempts for select to authenticated using(auth.uid()=user_id);
create policy "Own certificates read" on public.certificates for select to authenticated using(auth.uid()=user_id);
create policy "Public certificate lookup" on public.certificates for select to anon,authenticated using(true);
-- IMPORTANT:
-- Do not grant browser-side insert/update on assessment_attempts or certificates.
-- A trusted Edge Function must grade submitted answers and issue certificates server-side.
-- Add a signed payment webhook before activating paid enrolments.
-- Add admin-only policies based on a server-managed role claim before launching admin tools.
