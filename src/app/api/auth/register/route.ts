import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, age, gender, weight, height, activityLevel, goal, speed, dailyCalories, preferredMeals, restrictions } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const supabase = await createClient();

    // Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Error al crear usuario" }, { status: 400 });
    }

    // Create profile in public.profiles
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      name: name || email.split("@")[0],
      age: age || null,
      gender: gender || null,
      weight_kg: weight || null,
      height_cm: height || null,
      activity_level: activityLevel || null,
      goal: goal || null,
      speed: speed || null,
      daily_calories: dailyCalories || null,
      preferred_meals: preferredMeals || 4,
      dietary_restrictions: restrictions || [],
    });

    if (profileError) {
      return NextResponse.json({ error: "Error al crear perfil: " + profileError.message }, { status: 400 });
    }

    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: name,
      },
      session: authData.session,
    });

  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
