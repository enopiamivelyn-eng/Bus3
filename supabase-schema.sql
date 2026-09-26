-- ============================================================
-- Bus Ticketing Management System — Supabase schema + seed
-- Mirrors prisma/schema.prisma exactly (UUID text ids, not ints).
-- Safe to re-run: drops and recreates everything.
-- ============================================================

-- ---------- 1. Clean slate ----------
drop table if exists public."Booking" cascade;
drop table if exists public."Trip"    cascade;
drop table if exists public."Route"   cascade;
drop table if exists public."Bus"     cascade;
drop table if exists public."User"    cascade;

-- ---------- 2. Tables ----------
-- Supabase Auth profiles and login-log RLS are set up separately by
-- supabase-auth-migration.sql. This file resets and reseeds the bus tables;
-- do not run it against an existing database unless that reset is intended.

-- Users: admin + passenger accounts
create table public."User" (
  id         text        primary key default gen_random_uuid()::text,
  email      text        not null unique,
  password   text        not null,                       -- sha256(password + salt), see lib/auth/password.ts
  name       text        not null,
  role       text        not null default 'passenger',   -- 'passenger' | 'admin'
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- Buses: the fleet
create table public."Bus" (
  id          text        primary key default gen_random_uuid()::text,
  "busNumber" text        not null unique,
  model       text        not null,
  capacity    integer     not null,
  status      text        not null default 'active',     -- 'active' | 'maintenance' | 'inactive'
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- Routes: origin -> destination with a base fare
create table public."Route" (
  id          text        primary key default gen_random_uuid()::text,
  name        text        not null,
  "fromCity"  text        not null,
  "toCity"    text        not null,
  distance    double precision not null,
  "basePrice" double precision not null,
  duration    text        not null,
  status      text        not null default 'active',     -- 'active' | 'inactive'
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- Trips: a dated departure of a bus on a route
create table public."Trip" (
  id               text        primary key default gen_random_uuid()::text,
  "routeId"        text        not null references public."Route"(id) on delete restrict,
  "busId"          text        not null references public."Bus"(id)   on delete restrict,
  "departureDate"  text        not null,                 -- 'YYYY-MM-DD' (string, as in Prisma)
  "departureTime"  text        not null,                 -- '06:00 AM'
  "arrivalTime"    text        not null,
  price            double precision not null,
  "availableSeats" integer     not null,
  status           text        not null default 'scheduled', -- 'scheduled' | 'boarding' | 'completed' | 'cancelled'
  "createdAt"      timestamptz not null default now(),
  "updatedAt"      timestamptz not null default now()
);

-- Bookings: a passenger's seat on a trip
create table public."Booking" (
  id               text        primary key default gen_random_uuid()::text,
  "userId"         text        not null references public."User"(id) on delete cascade,
  "tripId"         text        not null references public."Trip"(id) on delete cascade,
  "seatNumber"     text        not null,
  "passengerName"  text        not null,
  "passengerEmail" text        not null,
  "passengerPhone" text        not null,
  status           text        not null default 'pending',  -- 'pending' | 'confirmed' | 'cancelled'
  "paymentStatus"  text        not null default 'unpaid',   -- 'unpaid' | 'paid' | 'refunded'
  "paymentMethod"  text,                                    -- 'GCash' | 'Maya' | 'Cash'
  "totalAmount"    double precision not null,
  "bookingDate"    timestamptz not null default now(),
  "createdAt"      timestamptz not null default now(),
  "updatedAt"      timestamptz not null default now()
);

-- ---------- 3. Indexes (match @@index in Prisma) ----------
create index "Trip_routeId_idx"        on public."Trip"("routeId");
create index "Trip_busId_idx"          on public."Trip"("busId");
create index "Trip_departureDate_idx"  on public."Trip"("departureDate");
create index "Booking_userId_idx"      on public."Booking"("userId");
create index "Booking_tripId_idx"      on public."Booking"("tripId");
create index "Booking_status_idx"      on public."Booking"("status");

-- A seat can only be sold once per trip, unless the booking was cancelled.
create unique index "Booking_seat_unique"
  on public."Booking"("tripId", "seatNumber")
  where status <> 'cancelled';

-- ---------- 4. updatedAt triggers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new."updatedAt" = now();
  return new;
end $$;

create trigger trg_user_updated    before update on public."User"    for each row execute function public.set_updated_at();
create trigger trg_bus_updated     before update on public."Bus"     for each row execute function public.set_updated_at();
create trigger trg_route_updated   before update on public."Route"   for each row execute function public.set_updated_at();
create trigger trg_trip_updated    before update on public."Trip"    for each row execute function public.set_updated_at();
create trigger trg_booking_updated before update on public."Booking" for each row execute function public.set_updated_at();

-- ---------- 5. Seed data ----------

-- Passwords are sha256(password + 'SALT_KEY_CHANGE_IN_PRODUCTION'), hex.
-- admin123 -> 8f4b9b0b9c0e1a4a0b2b9f1e4e2a6d3c... (computed to match lib/auth/password.ts)
insert into public."User" (email, password, name, role) values
  ('admin@busticket.com',
   encode(sha256(('admin123' || 'SALT_KEY_CHANGE_IN_PRODUCTION')::bytea), 'hex'),
   'Admin User', 'admin'),
  ('user@test.com',
   encode(sha256(('test123'  || 'SALT_KEY_CHANGE_IN_PRODUCTION')::bytea), 'hex'),
   'Test User', 'passenger')
on conflict (email) do update set password = excluded.password;

-- Buses
insert into public."Bus" ("busNumber", model, capacity, status) values
  ('BUS-001', 'Hino Grand Cruiser', 45, 'active'),
  ('BUS-002', 'Hyundai Universe',   50, 'active'),
  ('BUS-003', 'Daewoo GDW6117',     40, 'active'),
  ('BUS-004', 'Yutong ZK6127',      48, 'maintenance')
on conflict ("busNumber") do nothing;

-- Routes
insert into public."Route" (name, "fromCity", "toCity", distance, "basePrice", duration) values
  ('Cebu-Bato',      'Cebu City', 'Bato',      120.5, 300, '5 hours'),
  ('Cebu-Oslob',     'Cebu City', 'Oslob',     115.0, 200, '5 hours'),
  ('Cebu-Boljoon',   'Cebu City', 'Boljoon',   105.0, 300, '5 hours'),
  ('Cebu-Dalaguete', 'Cebu City', 'Dalaguete',  85.0, 300, '5 hours'),
  ('Cebu-Moalboal',  'Cebu City', 'Moalboal',   89.0, 250, '4 hours'),
  ('Cebu-Argao',     'Cebu City', 'Argao',      67.0, 280, '4.5 hours');

-- Trips: next 7 days x first 4 routes x 3 departures
insert into public."Trip"
  ("routeId", "busId", "departureDate", "departureTime", "arrivalTime", price, "availableSeats", status)
select
  r.id,
  b.id,
  to_char(current_date + offs, 'YYYY-MM-DD'),
  t.dep_time,
  '10:00 PM',
  r."basePrice",
  b.capacity,
  'scheduled'
from generate_series(0, 6) as offs
cross join (select id, "basePrice" from public."Route" order by name limit 4) r
cross join (values ('06:00 AM'), ('08:00 AM'), ('10:00 AM')) as t(dep_time)
cross join lateral (
  select id, capacity from public."Bus"
  where status = 'active'
  order by md5(random()::text) limit 1
) b;

-- One sample booking so "My Bookings" is not empty on first login
insert into public."Booking"
  ("userId", "tripId", "seatNumber", "passengerName", "passengerEmail", "passengerPhone",
   status, "paymentStatus", "paymentMethod", "totalAmount")
select
  u.id,
  t.id,
  'A12',
  'Test User',
  'user@test.com',
  '+63 912 345 6789',
  'confirmed',
  'paid',
  'GCash',
  t.price
from public."User" u
cross join lateral (select id, price from public."Trip" order by "departureDate", "departureTime" limit 1) t
where u.email = 'user@test.com'
on conflict do nothing;

-- Reflect that booking in the trip's seat count
update public."Trip" set "availableSeats" = "availableSeats" - 1
where id = (select id from public."Trip" order by "departureDate", "departureTime" limit 1);

-- ---------- 6. Verify ----------
select 'User'    as table_name, count(*) from public."User"
union all select 'Bus',     count(*) from public."Bus"
union all select 'Route',   count(*) from public."Route"
union all select 'Trip',    count(*) from public."Trip"
union all select 'Booking', count(*) from public."Booking";
