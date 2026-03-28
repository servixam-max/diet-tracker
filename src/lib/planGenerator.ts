// Plan Generator v2 - Fetch recipes from Supabase at runtime
// Works in both server and client contexts

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

interface GeneratedMeal {
  recipeId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  supermarket: string;
  emoji: string;
  ingredients: string[];
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
  excludedRecipeIds?: string[];
}

const CALORIE_DISTRIBUTION = {
  breakfast: 0.20,
  lunch: 0.35,
  snack: 0.15,
  dinner: 0.30,
};

const mealTypeEmojis: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  snack: "🍂",
  dinner: "🌙",
};

// Fetch recipes from Supabase
async function fetchRecipes(): Promise<Recipe[]> {
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
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

function filterRecipesByRestrictions(recipes: Recipe[], restrictions: string[]): Recipe[] {
  if (!restrictions || restrictions.length === 0) return recipes;
  
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

export async function generatePlan(options: PlanGeneratorOptions): Promise<GeneratedDay[]> {
  const { targetCalories, dietaryRestrictions = [], excludedRecipeIds = [] } = options;
  const dates = getWeekDates(0);
  
  // Fetch recipes from Supabase
  const allRecipes = await fetchRecipes();
  console.log(`Fetched ${allRecipes.length} recipes from Supabase`);
  
  // Calculate target calories per meal type
  const targets = {
    breakfast: Math.round(targetCalories * CALORIE_DISTRIBUTION.breakfast),
    lunch: Math.round(targetCalories * CALORIE_DISTRIBUTION.lunch),
    snack: Math.round(targetCalories * CALORIE_DISTRIBUTION.snack),
    dinner: Math.round(targetCalories * CALORIE_DISTRIBUTION.dinner),
  };
  
  // Filter recipes
  let recipes = filterRecipesByRestrictions(allRecipes, dietaryRestrictions);
  recipes = recipes.filter(r => !excludedRecipeIds.includes(r.id));
  
  console.log(`After filtering: ${recipes.length} recipes`);
  
  // Group by meal type (using tags)
  // Note: DB only has tags: desayuno, snack, vegetariano, saludable, rápido, etc.
  // No "comida", "almuerzo", "merienda", "cena" tags exist
  const byMealType: Record<string, Recipe[]> = {
    breakfast: recipes.filter(r => r.tags?.some(t => t.toLowerCase().includes("desayuno")) || false),
    lunch: recipes.filter(r => 
      !r.tags?.some(t => t.toLowerCase().includes("desayuno")) && 
      !r.tags?.some(t => t.toLowerCase().includes("snack"))
    ), // Lunch = not breakfast, not snack
    snack: recipes.filter(r => r.tags?.some(t => t.toLowerCase().includes("snack")) || false),
    dinner: recipes.filter(r => 
      !r.tags?.some(t => t.toLowerCase().includes("desayuno")) && 
      !r.tags?.some(t => t.toLowerCase().includes("snack"))
    ), // Dinner = same as lunch pool
  };
  
  console.log('Recipes by meal type:', {
    breakfast: byMealType.breakfast.length,
    lunch: byMealType.lunch.length,
    snack: byMealType.snack.length,
    dinner: byMealType.dinner.length,
  });
  
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
        
        // Constraint 2: No repeated supermarket twice in a day
        if (daySupermarkets.has(r.supermarket)) {
          // Allow if no other option
          const otherOptions = byMealType[mealType].filter(r2 => !daySupermarkets.has(r2.supermarket));
          if (otherOptions.length > 0) return false;
        }
        
        return true;
      });
      
      // Pick recipe closest to target calories
      const selected = pickClosestToTarget(availableRecipes, targetCal);
      
      if (selected) {
        dayMeals.push({
          recipeId: selected.id,
          name: selected.name,
          calories: selected.calories,
          protein: selected.protein_g,
          carbs: selected.carbs_g,
          fat: selected.fat_g,
          meal_type: mealType,
          emoji: mealTypeEmojis[mealType],
          ingredients: selected.ingredients.map(i => i.item),
          supermarket: selected.supermarket,
        });
        
        // Update state
        state.usedRecipeIds.add(selected.id);
        state.recipeCounts[selected.id] = (state.recipeCounts[selected.id] || 0) + 1;
        daySupermarkets.add(selected.supermarket);
      }
    }
    
    return {
      date,
      dayName: getDayName(date),
      meals: dayMeals,
      totalCalories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
      totalProtein: dayMeals.reduce((sum, m) => sum + m.protein, 0),
    };
  });
}

// Helper functions
function getWeekDates(offset: number = 0): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset + (offset * 7));
  monday.setHours(0, 0, 0, 0);
  
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[date.getDay()];
}

// Utility functions for plan manipulation
export async function regeneratePlan(plan: GeneratedDay[], dayIndex: number, options: PlanGeneratorOptions): Promise<GeneratedDay[]> {
  // Simple regeneration - just create a new plan
  return await generatePlan(options);
}

export function swapMeals(plan: GeneratedDay[], dayIndex1: number, dayIndex2: number, mealType: string): GeneratedDay[] {
  const newPlan = JSON.parse(JSON.stringify(plan));
  const day1: GeneratedDay = newPlan[dayIndex1];
  const day2: GeneratedDay = newPlan[dayIndex2];
  
  const meal1Index = day1.meals.findIndex((m: GeneratedMeal) => m.meal_type === mealType);
  const meal2Index = day2.meals.findIndex((m: GeneratedMeal) => m.meal_type === mealType);
  
  if (meal1Index >= 0 && meal2Index >= 0) {
    const temp = day1.meals[meal1Index];
    day1.meals[meal1Index] = day2.meals[meal2Index];
    day2.meals[meal2Index] = temp;
  }
  
  return newPlan;
}

export { getWeekDates };
