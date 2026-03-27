-- Fix RLS policies for food_logs table
-- Run this in Supabase Dashboard SQL Editor

-- Enable RLS on food_logs
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert own food logs" ON public.food_logs;
DROP POLICY IF EXISTS "Users can view own food logs" ON public.food_logs;
DROP POLICY IF EXISTS "Users can delete own food logs" ON public.food_logs;
DROP POLICY IF EXISTS "Users can update own food logs" ON public.food_logs;

-- Policy 1: Users can insert their own food logs
CREATE POLICY "Users can insert own food logs"
ON public.food_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Users can view their own food logs
CREATE POLICY "Users can view own food logs"
ON public.food_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 3: Users can delete their own food logs
CREATE POLICY "Users can delete own food logs"
ON public.food_logs
FOR DELETE
USING (auth.uid() = user_id);

-- Policy 4: Users can update their own food logs
CREATE POLICY "Users can update own food logs"
ON public.food_logs
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Verify policies were created
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'food_logs';
