-- Optional: Reset admin loyalty data to start fresh
-- Run this AFTER the user cleanup if you want to reset admin's loyalty too

-- Reset admin loyalty to zero (optional)
UPDATE public.loyalty 
SET 
    cut_count = 0,
    free_cut_earned = false,
    updated_at = NOW()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'wmuhdharith@gmail.com'
);

-- Verify admin loyalty reset
SELECT 
    u.email,
    l.cut_count,
    l.free_cut_earned,
    l.updated_at
FROM public.loyalty l
JOIN auth.users u ON l.user_id = u.id
WHERE u.email = 'wmuhdharith@gmail.com';
