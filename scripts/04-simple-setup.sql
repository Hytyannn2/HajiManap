-- Simple setup - run this in Supabase SQL Editor
-- Make sure you're in the correct project!

CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telegram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  service TEXT NOT NULL DEFAULT 'Basic Haircut',
  location TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked',
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.loyalty (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  cut_count INTEGER DEFAULT 0,
  free_cut_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty ENABLE ROW LEVEL SECURITY;

-- Simple policies - allow all for now
CREATE POLICY "Allow all for users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all for bookings" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Allow all for loyalty" ON public.loyalty FOR ALL USING (true);
