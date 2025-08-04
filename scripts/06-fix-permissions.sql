-- Fix RLS permissions
-- Run this in your Supabase SQL Editor

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can manage own data" ON public.users;
DROP POLICY IF EXISTS "Users can manage own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can manage own loyalty" ON public.loyalty;
DROP POLICY IF EXISTS "Admin can manage all users" ON public.users;
DROP POLICY IF EXISTS "Admin can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin can manage all loyalty" ON public.loyalty;

-- Create simple, permissive policies for authenticated users
CREATE POLICY "Authenticated users can read all users" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON public.users
  FOR DELETE USING (auth.uid() = id);

-- Bookings policies
CREATE POLICY "Users can read own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings" ON public.bookings
  FOR DELETE USING (auth.uid() = user_id);

-- Loyalty policies
CREATE POLICY "Users can read own loyalty" ON public.loyalty
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loyalty" ON public.loyalty
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loyalty" ON public.loyalty
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own loyalty" ON public.loyalty
  FOR DELETE USING (auth.uid() = user_id);

-- Admin policies (for wmuhdharith@gmail.com)
CREATE POLICY "Admin can manage all users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'wmuhdharith@gmail.com'
    )
  );

CREATE POLICY "Admin can manage all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'wmuhdharith@gmail.com'
    )
  );

CREATE POLICY "Admin can manage all loyalty" ON public.loyalty
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'wmuhdharith@gmail.com'
    )
  );

-- Grant explicit permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.loyalty TO authenticated;

-- Also grant to anon for public access if needed
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.bookings TO anon;
GRANT SELECT ON public.loyalty TO anon;
