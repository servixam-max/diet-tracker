-- ============================================
-- DIET TRACKER - SUPABASE SCHEMA SETUP
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Drop existing tables if they exist (CAREFUL - deletes data!)
-- DROP TABLE IF EXISTS food_log CASCADE;
-- DROP TABLE IF EXISTS weekly_plans CASCADE;
-- DROP TABLE IF EXISTS weight_history CASCADE;
-- DROP TABLE IF EXISTS measurements CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (main user table)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  age INTEGER,
  gender TEXT,
  weight_kg DECIMAL,
  height_cm INTEGER,
  activity_level TEXT,
  goal TEXT,
  speed TEXT,
  daily_calories INTEGER DEFAULT 2000,
  preferred_meals INTEGER DEFAULT 4,
  dietary_restrictions TEXT[] DEFAULT '{}',
  target_calories INTEGER DEFAULT 2000,
  target_protein_g INTEGER DEFAULT 150,
  target_carbs_g INTEGER DEFAULT 200,
  target_fat_g INTEGER DEFAULT 65,
  water_goal INTEGER DEFAULT 8,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food log table
CREATE TABLE IF NOT EXISTS food_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL,
  description TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein_g DECIMAL DEFAULT 0,
  carbs_g DECIMAL DEFAULT 0,
  fat_g DECIMAL DEFAULT 0,
  image_url TEXT,
  source TEXT DEFAULT 'manual',
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly plans table
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  plan_data JSONB NOT NULL,
  target_calories INTEGER DEFAULT 2000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Weight history table
CREATE TABLE IF NOT EXISTS weight_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL NOT NULL,
  recorded_at DATE DEFAULT CURRENT_DATE
);

-- Measurements table
CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chest_cm DECIMAL,
  waist_cm DECIMAL,
  hips_cm DECIMAL,
  arm_cm DECIMAL,
  thigh_cm DECIMAL,
  recorded_at DATE DEFAULT CURRENT_DATE
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for food_log
DROP POLICY IF EXISTS "Users can view own food_log" ON food_log;
CREATE POLICY "Users can view own food_log" ON food_log FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own food_log" ON food_log;
CREATE POLICY "Users can insert own food_log" ON food_log FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own food_log" ON food_log;
CREATE POLICY "Users can delete own food_log" ON food_log FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for weekly_plans
DROP POLICY IF EXISTS "Users can view own weekly_plans" ON weekly_plans;
CREATE POLICY "Users can view own weekly_plans" ON weekly_plans FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own weekly_plans" ON weekly_plans;
CREATE POLICY "Users can insert own weekly_plans" ON weekly_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own weekly_plans" ON weekly_plans;
CREATE POLICY "Users can update own weekly_plans" ON weekly_plans FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for weight_history
DROP POLICY IF EXISTS "Users can view own weight_history" ON weight_history;
CREATE POLICY "Users can view own weight_history" ON weight_history FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own weight_history" ON weight_history;
CREATE POLICY "Users can insert own weight_history" ON weight_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for measurements
DROP POLICY IF EXISTS "Users can view own measurements" ON measurements;
CREATE POLICY "Users can view own measurements" ON measurements FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own measurements" ON measurements;
CREATE POLICY "Users can insert own measurements" ON measurements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable realtime for profiles (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

SELECT 'Setup complete!' as status;
