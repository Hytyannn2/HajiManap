-- Fix admin status for wmuhdharith@gmail.com
-- This script ensures the admin user exists and has proper access

-- First, let's check if the admin user exists in auth.users
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Try to find the admin user
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'wmuhdharith@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Admin user exists, ensure they have a proper user record
        INSERT INTO public.users (id, email, full_name, phone, created_at)
        VALUES (
            admin_user_id,
            'wmuhdharith@gmail.com',
            'Admin User',
            '',
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            full_name = COALESCE(NULLIF(users.full_name, ''), EXCLUDED.full_name);
        
        -- Ensure admin has a loyalty record
        INSERT INTO public.loyalty (user_id, cuts_completed, free_cut_earned)
        VALUES (admin_user_id, 0, false)
        ON CONFLICT (user_id) DO NOTHING;
        
        RAISE NOTICE 'Admin user setup completed for: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user not found in auth.users. Please sign up with wmuhdharith@gmail.com first.';
    END IF;
END $$;

-- Verify the setup
SELECT 
    u.id,
    u.email,
    u.full_name,
    l.cuts_completed,
    l.free_cut_earned,
    'Admin user verified' as status
FROM public.users u
LEFT JOIN public.loyalty l ON u.id = l.user_id
WHERE u.email = 'wmuhdharith@gmail.com';
