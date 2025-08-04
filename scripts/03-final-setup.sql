-- Final database setup script
-- Run this in your Supabase SQL Editor

-- Drop everything first to start fresh
DROP TRIGGER IF EXISTS on_booking_completed ON public.bookings;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.update_loyalty_on_completion();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.loyalty CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telegram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  service TEXT NOT NULL DEFAULT 'Basic Haircut',
  location TEXT NOT NULL CHECK (location IN ('KK12', 'KK11', 'KK5')),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'completed', 'cancelled')),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loyalty table
CREATE TABLE public.loyalty (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  cut_count INTEGER DEFAULT 0,
  free_cut_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'wmuhdharith@gmail.com'
    )
  );

-- Create policies for bookings table
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'wmuhdharith@gmail.com'
    )
  );

-- Create policies for loyalty table
CREATE POLICY "Users can view own loyalty" ON public.loyalty
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own loyalty" ON public.loyalty
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loyalty" ON public.loyalty
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all loyalty" ON public.loyalty
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'wmuhdharith@gmail.com'
    )
  );

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, telegram)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
    NEW.email,
    NEW.raw_user_meta_data->>'telegram'
  );
  
  INSERT INTO public.loyalty (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update loyalty when booking is completed
CREATE OR REPLACE FUNCTION public.update_loyalty_on_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if status changed to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.loyalty 
    SET 
      cut_count = cut_count + 1,
      free_cut_earned = CASE 
        WHEN (cut_count + 1) % 5 = 0 THEN TRUE 
        ELSE free_cut_earned 
      END,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for loyalty updates
CREATE TRIGGER on_booking_completed
  AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_loyalty_on_completion();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.bookings TO anon, authenticated;
GRANT ALL ON public.loyalty TO anon, authenticated;

-- Insert sample data for testing (optional)
-- You can uncomment these lines after creating a user account

-- INSERT INTO public.users (id, name, email) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Test User', 'test@example.com');

-- INSERT INTO public.loyalty (user_id) 
-- VALUES ('00000000-0000-0000-0000-000000000000');

-- INSERT INTO public.bookings (user_id, service, location, date, time, status, price)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Basic Haircut', 'KK12', '2024-01-15', '20:00', 'completed', 10.00);
