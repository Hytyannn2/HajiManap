-- Add OUTSIDE PASUM location to the database
-- Run this in your Supabase SQL Editor

-- Update the check constraint to include the new location
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_location_check;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_location_check 
CHECK (location IN ('KK12', 'KK11', 'KK5', 'OUTSIDE PASUM'));

-- Update any existing bookings if needed (optional)
-- This is just in case there are any constraint issues
