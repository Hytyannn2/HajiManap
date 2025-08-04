-- Optional: Reset admin loyalty points to zero
-- Run this only if you want to reset the admin's loyalty progress

DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Find the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'wmuhdharith@gmail.com';
    
    -- Check if admin user exists
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found!';
        RETURN;
    END IF;
    
    -- Reset admin loyalty
    UPDATE public.loyalty 
    SET 
        cuts_completed = 0,
        free_cut_earned = false,
        updated_at = NOW()
    WHERE user_id = admin_user_id;
    
    RAISE NOTICE 'Admin loyalty reset to 0 cuts completed, no free cut earned';
    
END $$;

-- Verification: Show admin loyalty status
SELECT 
    'Admin Loyalty Status' as info,
    u.email,
    l.cuts_completed,
    l.free_cut_earned,
    l.updated_at
FROM auth.users u
JOIN public.loyalty l ON u.id = l.user_id
WHERE u.email = 'wmuhdharith@gmail.com';
