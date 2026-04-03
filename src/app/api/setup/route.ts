import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Este endpoint ejecuta el schema SQL en Supabase
// IMPORTANTE: Solo para uso inicial, luego se puede borrar
// PROTEGIDO: Solo usuarios autenticados pueden ejecutarlo

const SCHEMA_SQL = `
-- Diet Tracker Database Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female')),
  weight_kg DECIMAL,
  height_cm INTEGER,
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')),
  goal TEXT CHECK (goal IN ('lose', 'maintain', 'gain')),
  speed TEXT CHECK (speed IN ('slow', 'medium', 'fast')),
  daily_calories INTEGER,
  preferred_meals INTEGER DEFAULT 4 CHECK (preferred_meals BETWEEN 3 AND 5),
  dietary_restrictions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time_minutes INTEGER,
  calories INTEGER NOT NULL,
  protein_g DECIMAL,
  carbs_g DECIMAL,
  fat_g DECIMAL,
  servings INTEGER DEFAULT 1,
  supermarket TEXT CHECK (supermarket IN ('mercadona', 'lidl', 'aldi', 'familycash', 'generic')),
  ingredients JSONB DEFAULT '[]',
  instructions TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.weekly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  total_calories INTEGER NOT NULL,
  meals_per_day INTEGER DEFAULT 4,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE TABLE IF NOT EXISTS public.plan_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES public.weekly_plans(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.plan_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_day_id UUID REFERENCES public.plan_days(id) ON DELETE CASCADE,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'snack', 'dinner')),
  recipe_id UUID REFERENCES public.recipes(id),
  planned_calories INTEGER NOT NULL,
  custom_name TEXT,
  custom_calories INTEGER
);

CREATE TABLE IF NOT EXISTS public.food_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'snack', 'dinner')),
  description TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein_g DECIMAL,
  carbs_g DECIMAL,
  fat_g DECIMAL,
  image_url TEXT,
  source TEXT CHECK (source IN ('recipe', 'barcode', 'photo', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.weekly_plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  quantity TEXT,
  unit TEXT,
  supermarket TEXT,
  category TEXT,
  checked BOOLEAN DEFAULT FALSE
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Profiles: own" ON public.profiles;
CREATE POLICY "Profiles: own" ON public.profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Recipes: public" ON public.recipes;
CREATE POLICY "Recipes: public" ON public.recipes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Plans: own" ON public.weekly_plans;
CREATE POLICY "Plans: own" ON public.weekly_plans FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Plan days: own" ON public.plan_days;
CREATE POLICY "Plan days: own" ON public.plan_days FOR ALL USING (
  plan_id IN (SELECT id FROM public.weekly_plans WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Plan meals: own" ON public.plan_meals;
CREATE POLICY "Plan meals: own" ON public.plan_meals FOR ALL USING (
  plan_day_id IN (SELECT id FROM public.plan_days WHERE plan_id IN (SELECT id FROM public.weekly_plans WHERE user_id = auth.uid()))
);

DROP POLICY IF EXISTS "Food logs: own" ON public.food_logs;
CREATE POLICY "Food logs: own" ON public.food_logs FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shopping: own" ON public.shopping_lists;
CREATE POLICY "Shopping: own" ON public.shopping_lists FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shopping items: own" ON public.shopping_items;
CREATE POLICY "Shopping items: own" ON public.shopping_items FOR ALL USING (
  list_id IN (SELECT id FROM public.shopping_lists WHERE user_id = auth.uid())
);
`;

export async function POST() {
  try {
    // 🔒 PROTECCIÓN: Solo usuarios autenticados pueden ejecutar setup
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado - debes iniciar sesión" },
        { status: 401 }
      );
    }

    // Using service role key to bypass RLS for setup
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceKey) {
      return NextResponse.json(
        { error: "Error de configuración del servidor" },
        { status: 500 }
      );
    }

    // Split SQL into individual statements and execute
    const statements = SCHEMA_SQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    const results = [];

    for (const statement of statements) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({ query: statement }),
        });

        results.push({
          statement: statement.substring(0, 50) + '...',
          status: response.ok ? 'ok' : 'error',
        });
      } catch (err: any) {
        results.push({
          statement: statement.substring(0, 50) + '...',
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Schema executed successfully",
      results
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST to this endpoint to execute the database schema",
    instructions: [
      "1. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local",
      "2. POST to this endpoint to create all tables",
      "3. After setup, you can delete this route"
    ]
  });
}
