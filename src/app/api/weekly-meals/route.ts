import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Preset meals database
const PRESET_MEALS = [
  // Breakfasts
  { name: "Avena con plátano y miel", calories: 320, protein: 8, carbs: 58, fat: 6, type: "breakfast", emoji: "🥣" },
  { name: "Yogur griego con granola", calories: 280, protein: 15, carbs: 35, fat: 8, type: "breakfast", emoji: "🥛" },
  { name: "Tostadas integrales con aguacate", calories: 350, protein: 12, carbs: 30, fat: 22, type: "breakfast", emoji: "🍞" },
  { name: "Huevos revueltos con jamón", calories: 380, protein: 25, carbs: 8, fat: 28, type: "breakfast", emoji: "🍳" },
  { name: "Smoothie de frutas rojas", calories: 220, protein: 6, carbs: 42, fat: 4, type: "breakfast", emoji: "🫐" },
  { name: "Pan integral con queso fresco", calories: 240, protein: 12, carbs: 32, fat: 8, type: "breakfast", emoji: "🧀" },
  { name: "Porridge de avena con frutos secos", calories: 310, protein: 10, carbs: 48, fat: 10, type: "breakfast", emoji: "🥣" },
  { name: "Tortilla francesa con tomate", calories: 290, protein: 18, carbs: 6, fat: 22, type: "breakfast", emoji: "🍳" },
  
  // Lunches
  { name: "Pollo a la plancha con quinoa", calories: 485, protein: 42, carbs: 38, fat: 16, type: "lunch", emoji: "🍗" },
  { name: "Salmón al horno con verduras", calories: 520, protein: 38, carbs: 22, fat: 32, type: "lunch", emoji: "🐟" },
  { name: "Ensalada César con pollo", calories: 420, protein: 35, carbs: 18, fat: 24, type: "lunch", emoji: "🥗" },
  { name: "Pasta integral con atún", calories: 480, protein: 32, carbs: 55, fat: 14, type: "lunch", emoji: "🍝" },
  { name: "Arroz con vegetales y tofu", calories: 380, protein: 18, carbs: 52, fat: 12, type: "lunch", emoji: "🍚" },
  { name: "Bocadillo integral de pavo", calories: 360, protein: 28, carbs: 38, fat: 12, type: "lunch", emoji: "🥪" },
  { name: "Lentejas con verduras", calories: 420, protein: 22, carbs: 58, fat: 10, type: "lunch", emoji: "🥘" },
  { name: "Merluza a la romana con ensalada", calories: 450, protein: 36, carbs: 15, fat: 28, type: "lunch", emoji: "🐟" },
  
  // Snacks
  { name: "Manzana con almendras", calories: 195, protein: 5, carbs: 25, fat: 10, type: "snack", emoji: "🍎" },
  { name: "Yogur natural con nueces", calories: 180, protein: 10, carbs: 12, fat: 12, type: "snack", emoji: "🥜" },
  { name: "Hummus con palitos de zanahoria", calories: 150, protein: 6, carbs: 18, fat: 6, type: "snack", emoji: "🥕" },
  { name: "Queso cottage con frutas", calories: 165, protein: 14, carbs: 15, fat: 5, type: "snack", emoji: "🧁" },
  { name: "Batido de proteínas", calories: 220, protein: 25, carbs: 12, fat: 8, type: "snack", emoji: "🥤" },
  { name: "Galletas integrales con aguacate", calories: 180, protein: 4, carbs: 22, fat: 10, type: "snack", emoji: "🍪" },
  { name: "Fruta variada del tiempo", calories: 120, protein: 2, carbs: 28, fat: 1, type: "snack", emoji: "🍇" },
  { name: "Tostada con tomate y aceite", calories: 175, protein: 4, carbs: 22, fat: 8, type: "snack", emoji: "🍅" },
  
  // Dinners
  { name: "Pechuga de pollo con brócoli", calories: 380, protein: 45, carbs: 12, fat: 18, type: "dinner", emoji: "🥦" },
  { name: "Merluza con patatas al horno", calories: 420, protein: 35, carbs: 35, fat: 16, type: "dinner", emoji: "🐟" },
  { name: "Revuelto de gambas y calabacín", calories: 340, protein: 28, carbs: 8, fat: 22, type: "dinner", emoji: "🦐" },
  { name: "Ensalada templada de quinoa", calories: 360, protein: 14, carbs: 42, fat: 16, type: "dinner", emoji: "🥗" },
  { name: "Sopa de verduras con pan integral", calories: 280, protein: 10, carbs: 42, fat: 8, type: "dinner", emoji: "🍲" },
  { name: "Tortilla de patatas", calories: 450, protein: 15, carbs: 35, fat: 28, type: "dinner", emoji: "🥔" },
  { name: "Pechuga de pavo con arroz integral", calories: 400, protein: 40, carbs: 42, fat: 10, type: "dinner", emoji: "🍚" },
  { name: "Verduras salteadas con tofu", calories: 320, protein: 18, carbs: 28, fat: 16, type: "dinner", emoji: "🥬" },
];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // breakfast, lunch, snack, dinner
    const search = searchParams.get("search"); // optional search term

    let meals = PRESET_MEALS;

    // Filter by type if provided
    if (type && ["breakfast", "lunch", "snack", "dinner"].includes(type)) {
      meals = meals.filter(m => m.type === type);
    }

    // Search by name if provided
    if (search) {
      const searchLower = search.toLowerCase();
      meals = meals.filter(m => m.name.toLowerCase().includes(searchLower));
    }

    // Get user's saved meals from profile if exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("favorite_meals")
      .eq("id", user.id)
      .single();

    const favoriteMealNames = profile?.favorite_meals || [];

    // Mark favorite meals
    const mealsWithFavorites = meals.map(meal => ({
      ...meal,
      isFavorite: favoriteMealNames.includes(meal.name),
    }));

    return NextResponse.json({
      meals: mealsWithFavorites,
      total: meals.length,
      byType: {
        breakfast: PRESET_MEALS.filter(m => m.type === "breakfast").length,
        lunch: PRESET_MEALS.filter(m => m.type === "lunch").length,
        snack: PRESET_MEALS.filter(m => m.type === "snack").length,
        dinner: PRESET_MEALS.filter(m => m.type === "dinner").length,
      },
    });

  } catch (error) {
    console.error("Weekly meals GET error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
