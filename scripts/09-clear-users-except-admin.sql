-- Clear all users except admin (wmuhdharith@gmail.com)
-- This script safely removes all non-admin users and their associated data

DO $$
DECLARE
    admin_user_id UUID;
    deleted_bookings_count INTEGER;
    deleted_loyalty_count INTEGER;
    deleted_public_users_count INTEGER;
    deleted_auth_users_count INTEGER;
BEGIN
    -- Find admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'wmuhdharith@gmail.com';
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found! Aborting cleanup.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Admin user ID: %', admin_user_id;
    
    -- Delete non-admin bookings
    DELETE FROM public.bookings 
    WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_bookings_count = ROW_COUNT;
    
    -- Delete non-admin loyalty records
    DELETE FROM public.loyalty 
    WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_loyalty_count = ROW_COUNT;
    
    -- Delete non-admin users from public.users
    DELETE FROM public.users 
    WHERE id != admin_user_id;
    GET DIAGNOSTICS deleted_public_users_count = ROW_COUNT;
    
    -- Delete non-admin users from auth.users
    DELETE FROM auth.users 
    WHERE id != admin_user_id;
    GET DIAGNOSTICS deleted_auth_users_count = ROW_COUNT;
    
    -- Show results
    RAISE NOTICE 'Cleanup completed:';
    RAISE NOTICE '- Deleted % bookings', deleted_bookings_count;
    RAISE NOTICE '- Deleted % loyalty records', deleted_loyalty_count;
    RAISE NOTICE '- Deleted % public users', deleted_public_users_count;
    RAISE NOTICE '- Deleted % auth users', deleted_auth_users_count;
    
END $$;

-- Verify what remains
SELECT 'Remaining users:' as info;
SELECT u.email, u.created_at, p.name
FROM auth.users u
LEFT JOIN public.users p ON u.id = p.id
ORDER BY u.created_at;

SELECT 'Remaining bookings:' as info;
SELECT COUNT(*) as booking_count FROM public.bookings;

SELECT 'Remaining loyalty records:' as info;
SELECT COUNT(*) as loyalty_count FROM public.loyalty;
