-- Core By Millie — Supabase Schema
-- Run this in the Supabase SQL editor

-- Membership tiers enum
create type membership_tier as enum (
  'instructor_monthly',
  'studio_small',
  'studio_medium',
  'consumer_monthly',
  'admin'
);

-- Content modality enum
create type content_modality as enum (
  'reformer',
  'mat',
  'barre',
  'sculpt',
  'strength',
  'mobility',
  'wellness'
);

-- Content level enum
create type content_level as enum (
  'beginner',
  'intermediate',
  'advanced',
  'all_levels'
);

-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  stripe_customer_id text unique,
  membership_tier membership_tier,
  subscription_status text default 'inactive', -- active | inactive | past_due | canceled
  subscription_id text,
  current_period_end timestamptz,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Enable row level security
alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Service role can manage all profiles"
  on profiles using (auth.role() = 'service_role');

-- Content items
create table content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  modality content_modality not null,
  level content_level not null default 'all_levels',
  duration_minutes integer,
  vimeo_id text,
  pdf_url text,
  thumbnail_url text,
  tags text[] default '{}',
  -- which tiers can access this content
  access_tiers membership_tier[] not null default '{instructor_monthly,studio_small,studio_medium}',
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table content enable row level security;

-- Members can read published content they have access to
create policy "Members can read accessible published content"
  on content for select
  using (
    is_published = true
    and (
      -- check if user's tier is in access_tiers
      exists (
        select 1 from profiles
        where profiles.id = auth.uid()
        and profiles.membership_tier = any(content.access_tiers)
        and profiles.subscription_status = 'active'
      )
      -- admins can see everything
      or exists (
        select 1 from profiles
        where profiles.id = auth.uid()
        and profiles.is_admin = true
      )
    )
  );

create policy "Admins can manage all content"
  on content for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Favourites
create table favourites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  content_id uuid references content(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, content_id)
);

alter table favourites enable row level security;

create policy "Users manage own favourites"
  on favourites for all using (auth.uid() = user_id);

-- Progress tracking (for consumer portal)
create table progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  content_id uuid references content(id) on delete cascade,
  completed_at timestamptz default now(),
  unique(user_id, content_id)
);

alter table progress enable row level security;

create policy "Users manage own progress"
  on progress for all using (auth.uid() = user_id);

-- Studio seats (for studio tier multi-user access)
create table studio_seats (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  member_id uuid references profiles(id) on delete cascade,
  invited_email text,
  accepted boolean default false,
  created_at timestamptz default now()
);

alter table studio_seats enable row level security;

create policy "Studio owners manage their seats"
  on studio_seats for all using (auth.uid() = owner_id);

create policy "Seat members can read their own seat"
  on studio_seats for select using (auth.uid() = member_id);

-- Trigger to create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
