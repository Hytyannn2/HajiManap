-- Clear all users except admin while preserving data integrity
-- This script safely removes all non-admin users and their associated data

DO $$
DECLARE
    admin_user_id UUID;
    deleted_bookings_count INTEGER;
    deleted_loyalty_count INTEGER;
    deleted_public_users_count INTEGER;
    deleted_auth_users_count INTEGER;
BEGIN
    -- Find the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'wmuhdharith@gmail.com';
    
    -- Check if admin user exists
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found! Aborting cleanup.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Admin user found with ID: %', admin_user_id;
    
    -- Delete non-admin bookings first (due to foreign key constraints)
    DELETE FROM public.bookings 
    WHERE user_id != admin_user_id;
    
    GET DIAGNOSTICS deleted_bookings_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % non-admin bookings', deleted_bookings_count;
    
    -- Delete non-admin loyalty records
    DELETE FROM public.loyalty 
    WHERE user_id != admin_user_id;
    
    GET DIAGNOSTICS deleted_loyalty_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % non-admin loyalty records', deleted_loyalty_count;
    
    -- Delete non-admin users from public.users
    DELETE FROM public.users 
    WHERE id != admin_user_id;
    
    GET DIAGNOSTICS deleted_public_users_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % non-admin users from public.users', deleted_public_users_count;
    
    -- Delete non-admin users from auth.users (this will cascade to related auth tables)
    DELETE FROM auth.users 
    WHERE id != admin_user_id;
    
    GET DIAGNOSTICS deleted_auth_users_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % non-admin users from auth.users', deleted_auth_users_count;
    
    RAISE NOTICE 'Cleanup completed successfully!';
    
END $$;

-- Verification: Show what remains after cleanup
SELECT 'Remaining auth.users' as table_name, count(*) as count FROM auth.users
UNION ALL
SELECT 'Remaining public.users' as table_name, count(*) as count FROM public.users
UNION ALL
SELECT 'Remaining loyalty records' as table_name, count(*) as count FROM public.loyalty
UNION ALL
SELECT 'Remaining bookings' as table_name, count(*) as count FROM public.bookings;

-- Show admin user details
SELECT 
    'Admin User Details' as info,
    u.email,
    pu.name,
    pu.telegram,
    l.cuts_completed,
    l.free_cut_earned,
    l.created_at as loyalty_created
FROM auth.users u
LEFT JOIN public.users pu ON u.id = pu.id
LEFT JOIN public.loyalty l ON u.id = l.user_id
WHERE u.email = 'wmuhdharith@gmail.com';
