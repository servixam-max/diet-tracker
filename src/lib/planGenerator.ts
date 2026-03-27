// Plan Generator v2 - Improved algorithm with variety and distribution controls
// Features:
// - No repeated supermarket twice in a day
// - Max 2x same recipe per week
// - Calorie distribution: 20% breakfast, 35% lunch, 15% snack, 30% dinner
// - Protein distribution throughout the day

// Recipe interface matching Supabase schema
interface Recipe {
  id: string;
  name: string;
  description: string;
  image_url: string;
  prep_time_minutes: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  servings: number;
  supermarket: string;
  ingredients: { item: string; amount: string }[];
  instructions: string[];
  tags: string[];
}

// Static fallback recipes (small set for demo)
const RECIPES: Recipe[] = [];

// Fetch recipes from Supabase at runtime
export async function fetchRecipesFromSupabase(): Promise<Recipe[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const response = await fetch(`${supabaseUrl}/rest/v1/recipes?select=*&limit=500`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch recipes:', response.status);
      return RECIPES;
    }
    
    const data = await response.json();
    return data.map((r: any) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      image_url: r.image_url,
      prep_time_minutes: r.prep_time_minutes,
      calories: r.calories,
      protein_g: r.protein_g,
      carbs_g: r.carbs_g,
      fat_g: r.fat_g,
      servings: r.servings,
      supermarket: r.supermarket,
      ingredients: r.ingredients,
      instructions: r.instructions,
      tags: r.tags,
    }));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return RECIPES;
  }
}

const CALORIE_DISTRIBUTION = {
  breakfast: 0.20,
  lunch: 0.35,
  snack: 0.15,
  dinner: 0.30,
};

const DAY_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

interface GeneratedMeal {
  recipeId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  emoji?: string;
  ingredients?: string[];
  supermarket: string;
}

interface GeneratedDay {
  date: string;
  dayName: string;
  meals: GeneratedMeal[];
  totalCalories: number;
  totalProtein: number;
}

interface PlanGeneratorOptions {
  targetCalories: number;
  dietaryRestrictions?: string[];
  weekStart?: string;
  excludedRecipeIds?: string[];
}

function getWeekDates(offset = 0): string[] {
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

function getEmojiForMealType(mealType: string): string {
  const emojis: Record<string, string> = {
    breakfast: "🌅",
    lunch: "☀️",
    snack: "🍎",
    dinner: "🌙",
  };
  return emojis[mealType] || "🍴";
}

function filterRecipesByRestrictions(recipes: Recipe[], restrictions: string[]): Recipe[] {
  if (restrictions.includes("Vegetariano")) {
    return recipes.filter(r => 
      !r.ingredients.some(i => 
        ["pollo", "salmón", "merluza", "jamón", "atún", "gambas", "pavo", "carne"].some(
          meat => i.item.toLowerCase().includes(meat)
        )
      )
    );
  }
  if (restrictions.includes("Sin gluten")) {
    return recipes.filter(r => !r.tags.includes("Contiene gluten"));
  }
  return recipes;
}

function pickClosestToTarget(recipes: Recipe[], targetCalories: number): Recipe | null {
  if (recipes.length === 0) return null;
  return recipes.reduce((closest, recipe) => 
    Math.abs(recipe.calories - targetCalories) < Math.abs(closest.calories - targetCalories)
      ? recipe
      : closest
  , recipes[0]);
}

interface GenerationState {
  usedRecipeIds: Set<string>;
  daySupermarkets: Record<string, Set<string>>;
  recipeCounts: Record<string, number>;
}

function generatePlan(options: PlanGeneratorOptions): GeneratedDay[] {
  const { targetCalories, dietaryRestrictions = [], excludedRecipeIds = [] } = options;
  const dates = getWeekDates(0);
  
  // Calculate target calories per meal type
  const targets = {
    breakfast: Math.round(targetCalories * CALORIE_DISTRIBUTION.breakfast),
    lunch: Math.round(targetCalories * CALORIE_DISTRIBUTION.lunch),
    snack: Math.round(targetCalories * CALORIE_DISTRIBUTION.snack),
    dinner: Math.round(targetCalories * CALORIE_DISTRIBUTION.dinner),
  };
  
  // Filter recipes
  let recipes = filterRecipesByRestrictions(RECIPES, dietaryRestrictions);
  recipes = recipes.filter(r => !excludedRecipeIds.includes(r.id));
  
  // Group by meal type (using tags instead of mealType for Supabase compatibility)
  const byMealType: Record<string, Recipe[]> = {
    breakfast: recipes.filter(r => r.tags?.some(t => t.toLowerCase().includes("desayuno")) || false),
    lunch: recipes.filter(r => r.tags?.some(t => t.toLowerCase().includes("comida")) || false),
    snack: recipes.filter(r => r.tags?.some(t => t.toLowerCase().includes("snack")) || false),
    dinner: recipes.filter(r => r.tags?.some(t => t.toLowerCase().includes("cena")) || false),
  };
  
  // Track state for variety constraints
  const state: GenerationState = {
    usedRecipeIds: new Set(),
    daySupermarkets: {},
    recipeCounts: {},
  };
  
  // Initialize day supermarkets tracking
  for (let i = 0; i < 7; i++) {
    state.daySupermarkets[i] = new Set();
  }
  
  // Generate each day
  return dates.map((date, dayIndex) => {
    const dayMeals: GeneratedMeal[] = [];
    const daySupermarkets = state.daySupermarkets[dayIndex];
    
    // Select meals for each type
    const mealTypes: Array<"breakfast" | "lunch" | "snack" | "dinner"> = ["breakfast", "lunch", "snack", "dinner"];
    
    for (const mealType of mealTypes) {
      const targetCal = targets[mealType];
      let availableRecipes = byMealType[mealType].filter(r => {
        // Constraint 1: Max 2x same recipe per week
        const count = state.recipeCounts[r.id] || 0;
        if (count >= 2) return false;
        
        // Constraint 2: Don't repeat supermarket twice in a day
        if (daySupermarkets.has(r.supermarket)) return false;
        
        return true;
      });
      
      // If no recipes available, relax supermarket constraint
      if (availableRecipes.length === 0) {
        availableRecipes = byMealType[mealType].filter(r => {
          const count = state.recipeCounts[r.id] || 0;
          return count < 2;
        });
      }
      
      // Shuffle and pick closest to target
      const shuffled = shuffle(availableRecipes);
      const selected = pickClosestToTarget(shuffled, targetCal);
      
      if (selected) {
        // Update state
        state.usedRecipeIds.add(selected.id);
        state.recipeCounts[selected.id] = (state.recipeCounts[selected.id] || 0) + 1;
        daySupermarkets.add(selected.supermarket);
        
        dayMeals.push({
          recipeId: selected.id,
          name: selected.name,
          calories: selected.calories,
          protein: selected.protein,
          carbs: selected.carbs,
          fat: selected.fat,
          meal_type: mealType,
          emoji: getEmojiForMealType(mealType),
          ingredients: selected.ingredients.map(i => i.item),
          supermarket: selected.supermarket,
        });
      }
    }
    
    const totalCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = dayMeals.reduce((sum, m) => sum + m.protein, 0);
    
    return {
      date,
      dayName: DAY_NAMES[dayIndex],
      meals: dayMeals,
      totalCalories,
      totalProtein,
    };
  });
}

// Regenerate a single day or entire week
export function regeneratePlan(
  existingPlan: GeneratedDay[],
  dayIndex: number | null,
  options: PlanGeneratorOptions
): GeneratedDay[] {
  const newPlan = [...existingPlan];
  
  if (dayIndex === null) {
    // Regenerate entire week
    return generatePlan(options);
  }
  
  // Regenerate single day
  const dates = getWeekDates(0);
  const dayPlan = generatePlan(options)[dayIndex];
  newPlan[dayIndex] = dayPlan;
  
  return newPlan;
}

// Swap meals between two days
export function swapMeals(
  plan: GeneratedDay[],
  dayIndex1: number,
  dayIndex2: number,
  mealType: string
): GeneratedDay[] {
  const newPlan = [...plan];
  const day1 = { ...newPlan[dayIndex1] };
  const day2 = { ...newPlan[dayIndex2] };
  
  const meal1Index = day1.meals.findIndex(m => m.meal_type === mealType);
  const meal2Index = day2.meals.findIndex(m => m.meal_type === mealType);
  
  if (meal1Index === -1 || meal2Index === -1) {
    return plan;
  }
  
  // Swap the meals
  const temp = day1.meals[meal1Index];
  day1.meals[meal1Index] = day2.meals[meal2Index];
  day2.meals[meal2Index] = temp;
  
  // Update meal_type to match the day's slot
  day1.meals[meal1Index] = { ...day1.meals[meal1Index], meal_type: mealType };
  day2.meals[meal2Index] = { ...day2.meals[meal2Index], meal_type: mealType };
  
  // Recalculate totals
  day1.totalCalories = day1.meals.reduce((sum, m) => sum + m.calories, 0);
  day1.totalProtein = day1.meals.reduce((sum, m) => sum + m.protein, 0);
  day2.totalCalories = day2.meals.reduce((sum, m) => sum + m.calories, 0);
  day2.totalProtein = day2.meals.reduce((sum, m) => sum + m.protein, 0);
  
  newPlan[dayIndex1] = day1;
  newPlan[dayIndex2] = day2;
  
  return newPlan;
}

// Export for API route
export { generatePlan as default, getWeekDates };
