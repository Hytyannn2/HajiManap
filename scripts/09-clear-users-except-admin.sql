-- Clear all users except admin (wmuhdharith@gmail.com)
-- Run this in your Supabase SQL Editor

-- First, let's identify the admin user ID
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'wmuhdharith@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Delete all bookings for non-admin users
        DELETE FROM public.bookings 
        WHERE user_id != admin_user_id;
        
        -- Delete all loyalty records for non-admin users
        DELETE FROM public.loyalty 
        WHERE user_id != admin_user_id;
        
        -- Delete all users from public.users except admin
        DELETE FROM public.users 
        WHERE id != admin_user_id;
        
        -- Delete all auth users except admin
        -- Note: This will cascade and clean up related auth data
        DELETE FROM auth.users 
        WHERE id != admin_user_id;
        
        RAISE NOTICE 'Successfully cleared all users except admin (%)!', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user not found! No users were deleted.';
    END IF;
END $$;

-- Verify the cleanup
SELECT 
    'auth.users' as table_name,
    COUNT(*) as remaining_records,
    STRING_AGG(email, ', ') as remaining_emails
FROM auth.users
UNION ALL
SELECT 
    'public.users' as table_name,
    COUNT(*) as remaining_records,
    STRING_AGG(email, ', ') as remaining_emails
FROM public.users
UNION ALL
SELECT 
    'public.bookings' as table_name,
    COUNT(*) as remaining_records,
    'N/A' as remaining_emails
FROM public.bookings
UNION ALL
SELECT 
    'public.loyalty' as table_name,
    COUNT(*) as remaining_records,
    'N/A' as remaining_emails
FROM public.loyalty;
