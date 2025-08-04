-- Reset admin loyalty to zero (optional)
-- Only run this if you want to reset the admin's loyalty points

DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Find admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'wmuhdharith@gmail.com';
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found!';
        RETURN;
    END IF;
    
    -- Reset admin loyalty
    UPDATE public.loyalty 
    SET 
        cut_count = 0,
        free_cut_earned = false,
        updated_at = NOW()
    WHERE user_id = admin_user_id;
    
    RAISE NOTICE 'Admin loyalty reset to 0 cuts, no free cut earned';
    
END $$;

-- Verify admin loyalty status
SELECT 'Admin loyalty status:' as info;
SELECT l.cut_count, l.free_cut_earned, l.updated_at, u.name
FROM public.loyalty l
JOIN public.users u ON l.user_id = u.id
WHERE u.email = 'wmuhdharith@gmail.com';
