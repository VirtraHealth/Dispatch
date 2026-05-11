-- Run this in Supabase SQL editor to create the database schema

-- Users (created on first Google sign in)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  google_access_token text,
  google_refresh_token text,
  created_at timestamptz default now()
);

-- User settings
create table if not exists user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique,
  folder_ids text[] default '{}',
  folder_names text[] default '{}',
  delivery_email text not null default '',
  frequency text default 'daily',
  delivery_hour int default 7,
  timezone text default 'America/Los_Angeles',
  personal_instructions text,
  onboarding_context text,
  is_active boolean default true,
  updated_at timestamptz default now()
);

-- Digest history
create table if not exists digests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  sent_at timestamptz default now(),
  subject text,
  body_html text,
  body_text text,
  docs_read text[] default '{}',
  doc_count int default 0,
  status text default 'sent',
  feedback text
);

-- Indexes
create index if not exists idx_user_settings_user_id on user_settings(user_id);
create index if not exists idx_digests_user_id on digests(user_id);
create index if not exists idx_digests_sent_at on digests(sent_at desc);

-- Row Level Security
alter table users enable row level security;
alter table user_settings enable row level security;
alter table digests enable row level security;

-- Service role bypasses RLS (used by server-side admin client)
-- No policies needed for service role access
