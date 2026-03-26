import { RECIPES, generateWeeklyShoppingList, Recipe } from "@/data/recipes";
import { NextResponse } from "next/server";

// GET - Generar lista de compra desde recetas
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recipeIds = searchParams.get("recipes");
  const days = searchParams.get("days") || "7";

  // Si se pasan IDs específicos, usar esas recetas
  let selectedRecipes: Recipe[] = [];
  
  if (recipeIds) {
    const ids = recipeIds.split(",");
    selectedRecipes = RECIPES.filter(r => ids.includes(r.id));
  } else {
    // Generar plan semanal automático basado en calorías
    const numDays = parseInt(days);
    
    // Seleccionar recetas variadas para cubrir necesidades calóricas
    const breakfastRecipes = RECIPES.filter(r => r.mealType.includes("desayuno"));
    const lunchRecipes = RECIPES.filter(r => r.mealType.includes("comida"));
    const dinnerRecipes = RECIPES.filter(r => r.mealType.includes("cena"));
    
    // Mezclar aleatoriamente
    const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numDays; i++) {
      // Seleccionar desayuno (~20% calorías)
      const breakfast = shuffle(breakfastRecipes)[0];
      // Seleccionar comida (~35% calorías)
      const lunch = shuffle(lunchRecipes)[0];
      // Seleccionar cena (~30% calorías)
      const dinner = shuffle(dinnerRecipes)[0];
      // Seleccionar snack (~15% calorías)
      const snacks = RECIPES.filter(r => r.mealType.includes("snack"));
      const snack = snacks.length > 0 ? shuffle(snacks)[0] : null;
      
      selectedRecipes.push(breakfast, lunch, dinner);
      if (snack) selectedRecipes.push(snack);
    }
  }

  // Generar lista de compra consolidada
  const shoppingList = generateWeeklyShoppingList(selectedRecipes);

  // Agrupar por supermercado (usar el supermercado de la receta como fallback)
  const groupedBySupermarket: Record<string, typeof shoppingList> = {};
  
  selectedRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      const supermarket = ing.supermarket || recipe.supermarket;
      if (!groupedBySupermarket[supermarket]) {
        groupedBySupermarket[supermarket] = [];
      }
      groupedBySupermarket[supermarket].push(ing);
    });
  });

  return NextResponse.json({
    recipes: selectedRecipes,
    shoppingList,
    groupedBySupermarket,
    totalCalories: selectedRecipes.reduce((sum, r) => sum + r.calories, 0),
    averageCaloriesPerDay: Math.round(
      selectedRecipes.reduce((sum, r) => sum + r.calories, 0) / parseInt(days)
    )
  });
}
