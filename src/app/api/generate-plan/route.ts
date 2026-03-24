import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import generatePlan, { regeneratePlan, swapMeals, getWeekDates } from "@/lib/planGenerator";

interface PlanTemplate {
  id: string;
  userId: string;
  name: string;
  planData: any[];
  targetCalories: number;
  createdAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    
    const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");
    const weekStart = getWeekDates(offset)[0];
    
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    const targetCalories = profile?.daily_calories || 2000;
    const restrictions = profile?.dietary_restrictions || [];
    
    const { data: existing } = await supabase.from("weekly_plans").select("*").eq("user_id", user.id).eq("week_start", weekStart).single();
    
    if (existing) {
      return NextResponse.json({ 
        weekStart, 
        plan: existing.planData, 
        targetCalories: existing.total_calories 
      });
    }
    
    const plan = generatePlan({ targetCalories, dietaryRestrictions: restrictions });
    
    return NextResponse.json({ weekStart, plan, targetCalories });
  } catch (error) {
    console.error("Generate plan GET error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    const targetCalories = profile?.daily_calories || 2000;
    const restrictions = profile?.dietary_restrictions || [];
    
    const plan = generatePlan({ targetCalories, dietaryRestrictions: restrictions });
    const weekStart = getWeekDates(0)[0];
    
    await supabase.from("weekly_plans").upsert({ 
      user_id: user.id, 
      week_start: weekStart, 
      planData: plan, 
      total_calories: targetCalories 
    }, { onConflict: "user_id,week_start" });
    
    return NextResponse.json({ weekStart, plan, targetCalories });
  } catch (error) {
    console.error("Generate plan POST error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Regenerate a day or entire week
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    
    const body = await request.json();
    const { weekStart, dayIndex, action } = body;
    
    // Get existing plan
    const { data: existing } = await supabase.from("weekly_plans").select("*").eq("user_id", user.id).eq("week_start", weekStart).single();
    if (!existing) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
    }
    
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    const targetCalories = profile?.daily_calories || 2000;
    const restrictions = profile?.dietary_restrictions || [];
    
    let newPlan: any[];
    
    if (action === "regenerate-day" && typeof dayIndex === "number") {
      // Regenerate single day
      newPlan = regeneratePlan(existing.planData, dayIndex, { targetCalories, dietaryRestrictions: restrictions });
    } else if (action === "regenerate-week") {
      // Regenerate entire week
      newPlan = generatePlan({ targetCalories, dietaryRestrictions: restrictions });
    } else {
      return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
    }
    
    // Update database
    await supabase.from("weekly_plans").upsert({ 
      user_id: user.id, 
      week_start: weekStart, 
      planData: newPlan, 
      total_calories: targetCalories 
    }, { onConflict: "user_id,week_start" });
    
    return NextResponse.json({ weekStart, plan: newPlan, targetCalories });
  } catch (error) {
    console.error("Regenerate plan error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Swap meals between days
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    
    const body = await request.json();
    const { weekStart, dayIndex1, dayIndex2, mealType } = body;
    
    // Get existing plan
    const { data: existing } = await supabase.from("weekly_plans").select("*").eq("user_id", user.id).eq("week_start", weekStart).single();
    if (!existing) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
    }
    
    // Swap meals
    const newPlan = swapMeals(existing.planData, dayIndex1, dayIndex2, mealType);
    
    // Update database
    await supabase.from("weekly_plans").upsert({ 
      user_id: user.id, 
      week_start: weekStart, 
      planData: newPlan, 
      total_calories: existing.total_calories 
    }, { onConflict: "user_id,week_start" });
    
    return NextResponse.json({ weekStart, plan: newPlan, targetCalories: existing.total_calories });
  } catch (error) {
    console.error("Swap meals error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
