-- Fix admin status for wmuhdharith@gmail.com
-- This script ensures the admin user exists and has proper admin privileges

DO $$
DECLARE
    admin_user_id UUID;
    admin_exists BOOLEAN := FALSE;
BEGIN
    -- Check if admin user exists in auth.users
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'wmuhdharith@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        admin_exists := TRUE;
        RAISE NOTICE 'Admin user found in auth.users: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user NOT found in auth.users!';
        RAISE NOTICE 'Please sign up with wmuhdharith@gmail.com first';
        RETURN;
    END IF;
    
    -- Ensure admin user exists in public.users
    INSERT INTO public.users (id, name, email, created_at, updated_at)
    VALUES (
        admin_user_id,
        'Haji Manap',
        'wmuhdharith@gmail.com',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        name = 'Haji Manap',
        email = 'wmuhdharith@gmail.com',
        updated_at = NOW();
    
    RAISE NOTICE 'Admin user record ensured in public.users';
    
    -- Ensure admin loyalty record exists
    INSERT INTO public.loyalty (user_id, cut_count, free_cut_earned, created_at, updated_at)
    VALUES (
        admin_user_id,
        0,
        false,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        updated_at = NOW();
    
    RAISE NOTICE 'Admin loyalty record ensured';
    
    -- Show admin status
    RAISE NOTICE 'Admin setup complete!';
    
END $$;

-- Verify admin user setup
SELECT 
    'Admin User Verification' as info,
    au.email as auth_email,
    pu.name as public_name,
    pu.email as public_email,
    l.cut_count,
    l.free_cut_earned
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
LEFT JOIN public.loyalty l ON au.id = l.user_id
WHERE au.email = 'wmuhdharith@gmail.com';
