import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateBMR, calculateTDEE, calculateDailyCalories, distributeMacros, type Gender, type ActivityLevel, type Goal, type Speed } from "@/lib/nutrition/calculations";

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Calculate macros if profile has necessary data
    if (profile && profile.weight_kg && profile.height_cm && profile.age && profile.gender) {
      const bmr = calculateBMR(profile.weight_kg, profile.height_cm, profile.age, profile.gender as Gender);
      const tdee = calculateTDEE(bmr, profile.activity_level as ActivityLevel);
      const dailyCalories = calculateDailyCalories(tdee, (profile.goal || 'maintain') as Goal, (profile.speed || 'medium') as Speed);
      const macros = distributeMacros(dailyCalories, (profile.goal || 'maintain') as Goal, profile.weight_kg);
      
      return NextResponse.json({
        ...profile,
        daily_calories: profile.daily_calories || dailyCalories,
        macros,
      });
    }

    return NextResponse.json(profile);

  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const updates = await request.json();

    // Calculate macros before saving
    if (updates.weight_kg && updates.height_cm && updates.age && updates.gender) {
      const bmr = calculateBMR(updates.weight_kg, updates.height_cm, updates.age, updates.gender as Gender);
      const tdee = calculateTDEE(bmr, (updates.activity_level || 'moderately_active') as ActivityLevel);
      const dailyCalories = calculateDailyCalories(tdee, (updates.goal || 'maintain') as Goal, (updates.speed || 'medium') as Speed);
      const macros = distributeMacros(dailyCalories, (updates.goal || 'maintain') as Goal, updates.weight_kg);
      
      updates.daily_calories = dailyCalories;
      updates.macros = macros;
    }

    const { data, error, status } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116' || status === 404) {
        const insertData = {
          id: user.id,
          email: user.email,
          ...updates
        };
        
        const { data: insertResult, error: insertError } = await supabase
          .from("profiles")
          .insert(insertData)
          .select()
          .single();
        
        if (insertError) {
          return NextResponse.json({ 
            error: "No se pudo guardar el perfil: " + insertError.message,
            code: insertError.code 
          }, { status: 400 });
        }
        
        return NextResponse.json(insertResult);
      }
      
      return NextResponse.json({ 
        error: error.message,
        code: error.code 
      }, { status: 400 });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: "Error interno: " + error.message }, { status: 500 });
  }
}
