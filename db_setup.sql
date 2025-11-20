-- Create the users table
create table public.users (
  id text primary key,
  username text not null,
  score bigint default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Create policies
-- Allow anyone to read scores (for leaderboard)
create policy "Enable read access for all users"
on public.users for select
using (true);

-- Allow anyone to insert/update their own score (simplified for this demo)
-- In a real app, you'd use auth.uid() but here we use client-generated IDs or just allow anon updates for simplicity
create policy "Enable insert for all users"
on public.users for insert
with check (true);

create policy "Enable update for all users"
on public.users for update
using (true);

-- Create a realtime publication so we can listen to changes (optional but cool)
alter publication supabase_realtime add table public.users;
