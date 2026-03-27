-- Complete RLS fix for profiles table
-- This allows users to:
-- 1. Insert their own profile during signup
-- 2. Read their own profile
-- 3. Update their own profile

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Profiles: insert on signup" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: select own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: update own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: insert own" ON public.profiles;

-- Policy 1: Users can insert their own profile (during signup)
CREATE POLICY "Profiles: insert own"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy 2: Users can read their own profile
CREATE POLICY "Profiles: select own"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy 3: Users can update their own profile
CREATE POLICY "Profiles: update own"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 4: Allow public read access to basic profile info (optional, for social features)
-- CREATE POLICY "Profiles: public read"
-- ON public.profiles
-- FOR SELECT
-- USING (true);

-- Verify policies
SELECT policyname, cmd FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles';
