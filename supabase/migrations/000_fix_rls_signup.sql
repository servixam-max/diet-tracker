-- Fix RLS policy for user registration
-- Run this in Supabase Dashboard: https://supabase.com/dashboard/project/vvtgpztnytpxoacoflas/sql/new

-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Profiles: insert on signup" ON public.profiles;

-- Create policy for user signup (insert their own profile)
CREATE POLICY "Profiles: insert on signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Verify the policy was created
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles' 
AND policyname LIKE '%signup%';
