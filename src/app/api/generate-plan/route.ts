import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PRESET_MEALS = [
  { name: "Avena con plátano y miel", calories: 320, protein: 8, carbs: 58, fat: 6, type: "breakfast", emoji: "🥣", ingredients: ["avena", "plátano", "miel"] },
  { name: "Yogur griego con granola", calories: 280, protein: 15, carbs: 35, fat: 8, type: "breakfast", emoji: "🥛", ingredients: ["yogur griego", "granola"] },
  { name: "Tostadas integrales con aguacate", calories: 350, protein: 12, carbs: 30, fat: 22, type: "breakfast", emoji: "🍞", ingredients: ["pan integral", "aguacate"] },
  { name: "Huevos revueltos con jamón", calories: 380, protein: 25, carbs: 8, fat: 28, type: "breakfast", emoji: "🍳", ingredients: ["huevos", "jamón"] },
  { name: "Smoothie de frutas rojas", calories: 220, protein: 6, carbs: 42, fat: 4, type: "breakfast", emoji: "🫐", ingredients: ["frutos rojos", "yogur"] },
  { name: "Tortilla francesa con tomate", calories: 290, protein: 18, carbs: 6, fat: 22, type: "breakfast", emoji: "🍳", ingredients: ["huevos", "tomate"] },
  { name: "Pollo a la plancha con quinoa", calories: 485, protein: 42, carbs: 38, fat: 16, type: "lunch", emoji: "🍗", ingredients: ["pollo", "quinoa"] },
  { name: "Salmón al horno con verduras", calories: 520, protein: 38, carbs: 22, fat: 32, type: "lunch", emoji: "🐟", ingredients: ["salmón", "verduras"] },
  { name: "Ensalada César con pollo", calories: 420, protein: 35, carbs: 18, fat: 24, type: "lunch", emoji: "🥗", ingredients: ["lechuga", "pollo", "queso"] },
  { name: "Pasta integral con atún", calories: 480, protein: 32, carbs: 55, fat: 14, type: "lunch", emoji: "🍝", ingredients: ["pasta integral", "atún"] },
  { name: "Arroz con vegetales y tofu", calories: 380, protein: 18, carbs: 52, fat: 12, type: "lunch", emoji: "🍚", ingredients: ["arroz", "tofu", "verduras"] },
  { name: "Lentejas con verduras", calories: 420, protein: 22, carbs: 58, fat: 10, type: "lunch", emoji: "🥘", ingredients: ["lentejas", "verduras"] },
  { name: "Manzana con almendras", calories: 195, protein: 5, carbs: 25, fat: 10, type: "snack", emoji: "🍎", ingredients: ["manzana", "almendras"] },
  { name: "Yogur natural con nueces", calories: 180, protein: 10, carbs: 12, fat: 12, type: "snack", emoji: "🥜", ingredients: ["yogur", "nueces"] },
  { name: "Hummus con palitos de zanahoria", calories: 150, protein: 6, carbs: 18, fat: 6, type: "snack", emoji: "🥕", ingredients: ["hummus", "zanahoria"] },
  { name: "Batido de proteínas", calories: 220, protein: 25, carbs: 12, fat: 8, type: "snack", emoji: "🥤", ingredients: ["proteína", "leche"] },
  { name: "Pechuga de pollo con brócoli", calories: 380, protein: 45, carbs: 12, fat: 18, type: "dinner", emoji: "🥦", ingredients: ["pollo", "brócoli"] },
  { name: "Merluza con patatas al horno", calories: 420, protein: 35, carbs: 35, fat: 16, type: "dinner", emoji: "🐟", ingredients: ["merluza", "patatas"] },
  { name: "Revuelto de gambas y calabacín", calories: 340, protein: 28, carbs: 8, fat: 22, type: "dinner", emoji: "🦐", ingredients: ["gambas", "calabacín"] },
  { name: "Ensalada templada de quinoa", calories: 360, protein: 14, carbs: 42, fat: 16, type: "dinner", emoji: "🥗", ingredients: ["quinoa", "verduras"] },
  { name: "Sopa de verduras con pan integral", calories: 280, protein: 10, carbs: 42, fat: 8, type: "dinner", emoji: "🍲", ingredients: ["verduras", "pan integral"] },
  { name: "Pechuga de pavo con arroz integral", calories: 400, protein: 40, carbs: 42, fat: 10, type: "dinner", emoji: "🍚", ingredients: ["pavo", "arroz integral"] },
];

function getWeekDates(offset = 0) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generatePlan(target: number, restrictions: string[] = [], offset = 0) {
  const dates = getWeekDates(offset);
  const dist = { breakfast: 0.25, lunch: 0.40, snack: 0.10, dinner: 0.25 };
  const targets = { breakfast: Math.round(target * dist.breakfast), lunch: Math.round(target * dist.lunch), snack: Math.round(target * dist.snack), dinner: Math.round(target * dist.dinner) };
  
  let meals = [...PRESET_MEALS];
  if (restrictions.includes("Vegetariano")) {
    meals = meals.filter(m => !m.ingredients.some(i => ["pollo", "salmón", "merluza", "jamón", "atún", "gambas", "pavo"].includes(i)));
  }
  
  const byType = (t: string) => shuffle(meals.filter(m => m.type === t));
  const pick = (arr: typeof PRESET_MEALS, t: number) => arr.sort((a, b) => Math.abs(a.calories - t) - Math.abs(b.calories - t))[0];
  const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  
  return dates.map((date, i) => {
    const [bf, lu, sn, di] = [pick(byType("breakfast"), targets.breakfast), pick(byType("lunch"), targets.lunch), pick(byType("snack"), targets.snack), pick(byType("dinner"), targets.dinner)];
    const meals = [bf, lu, sn, di].filter(Boolean).map(m => ({ ...m, meal_type: m.type }));
    return { date, dayName: dayNames[i], meals, totalCalories: meals.reduce((s, m) => s + m.calories, 0) };
  });
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
    if (existing) return NextResponse.json({ weekStart: weekStart, plan: existing.planData, targetCalories: existing.total_calories });
    const plan = generatePlan(targetCalories, restrictions, offset);
    return NextResponse.json({ weekStart: weekStart, plan, targetCalories });
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
    const plan = generatePlan(targetCalories, restrictions, 0);
    const weekStart = getWeekDates(0)[0];
    await supabase.from("weekly_plans").upsert({ user_id: user.id, week_start: weekStart, planData: plan, total_calories: targetCalories }, { onConflict: "user_id,week_start" });
    return NextResponse.json({ weekStart: weekStart, plan, targetCalories });
  } catch (error) {
    console.error("Generate plan POST error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
