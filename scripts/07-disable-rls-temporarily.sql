-- Temporarily disable RLS to get the app working
-- Run this in your Supabase SQL Editor

-- Disable Row Level Security temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Authenticated users can read all users" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.users;
DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can read own loyalty" ON public.loyalty;
DROP POLICY IF EXISTS "Users can insert own loyalty" ON public.loyalty;
DROP POLICY IF EXISTS "Users can update own loyalty" ON public.loyalty;
DROP POLICY IF EXISTS "Users can delete own loyalty" ON public.loyalty;
DROP POLICY IF EXISTS "Admin can manage all users" ON public.users;
DROP POLICY IF EXISTS "Admin can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin can manage all loyalty" ON public.loyalty;

-- Grant full permissions to authenticated users
GRANT ALL PRIVILEGES ON public.users TO authenticated;
GRANT ALL PRIVILEGES ON public.bookings TO authenticated;
GRANT ALL PRIVILEGES ON public.loyalty TO authenticated;

-- Also grant to anon for testing
GRANT ALL PRIVILEGES ON public.users TO anon;
GRANT ALL PRIVILEGES ON public.bookings TO anon;
GRANT ALL PRIVILEGES ON public.loyalty TO anon;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON SCHEMA public TO anon, authenticated;
