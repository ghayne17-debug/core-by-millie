-- Core By Millie — Private Booking Schema
-- Run this in the Supabase SQL editor (safe to run once).
--
-- Model: Amelia adds individual dated availability slots (date + start time + duration).
-- Visitors book a slot as a request (no online payment). A slot with a booking
-- disappears from the public list. Amelia reviews bookings in the admin.

-- ---------------------------------------------------------------------------
-- Availability slots
-- ---------------------------------------------------------------------------
create table if not exists private_slots (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  start_time time not null,
  duration_minutes integer not null default 60,
  label text,                       -- optional public description, e.g. "In-studio · Reformer"
  created_at timestamptz default now()
);

create index if not exists private_slots_date_idx on private_slots (slot_date, start_time);

alter table private_slots enable row level security;

-- Slot info is not sensitive; anyone may read it. Availability/future filtering
-- is applied in the query, not the policy.
create policy "Anyone can read slots"
  on private_slots for select
  using (true);

create policy "Admins manage slots"
  on private_slots for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- ---------------------------------------------------------------------------
-- Bookings (one per slot — the unique constraint prevents double-booking)
-- ---------------------------------------------------------------------------
create table if not exists private_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null unique references private_slots(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  message text,
  created_at timestamptz default now()
);

alter table private_bookings enable row level security;

-- Bookings contain customer contact details — readable/writable by admins only.
-- Public bookings are created server-side via the service-role key (bypasses RLS),
-- so no public insert policy is required or wanted here.
create policy "Admins manage bookings"
  on private_bookings for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );
