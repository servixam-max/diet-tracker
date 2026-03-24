import { RECIPES, Recipe } from "@/data/recipes";
import { NextResponse } from "next/server";

// GET - Obtener recetas con filtros
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supermarket = searchParams.get("supermarket");
  const mealType = searchParams.get("mealType");
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");
  const difficulty = searchParams.get("difficulty");
  const minCalories = searchParams.get("minCalories");
  const maxCalories = searchParams.get("maxCalories");

  let recipes = [...RECIPES];

  // Filtrar por supermercado
  if (supermarket) {
    const supermarkets = supermarket.split(",") as Recipe["supermarket"][];
    recipes = recipes.filter(r => supermarkets.includes(r.supermarket));
  }

  // Filtrar por tipo de comida
  if (mealType) {
    const mealTypes = mealType.split(",") as Recipe["mealType"];
    recipes = recipes.filter(r => 
      r.mealType.some(m => mealTypes.includes(m))
    );
  }

  // Filtrar por tag
  if (tag) {
    const tags = tag.split(",").map(t => t.toLowerCase());
    recipes = recipes.filter(r => 
      r.tags.some(t => tags.includes(t.toLowerCase()))
    );
  }

  // Buscar por nombre o descripción
  if (search) {
    const searchLower = search.toLowerCase();
    recipes = recipes.filter(r => 
      r.name.toLowerCase().includes(searchLower) ||
      r.description.toLowerCase().includes(searchLower) ||
      r.ingredients.some(i => i.item.toLowerCase().includes(searchLower))
    );
  }

  // Filtrar por dificultad
  if (difficulty) {
    recipes = recipes.filter(r => r.difficulty === difficulty);
  }

  // Filtrar por rango de calorías
  if (minCalories) {
    recipes = recipes.filter(r => r.calories >= parseInt(minCalories));
  }
  if (maxCalories) {
    recipes = recipes.filter(r => r.calories <= parseInt(maxCalories));
  }

  return NextResponse.json({ 
    recipes,
    total: recipes.length,
    filters: {
      supermarket,
      mealType,
      tag,
      search,
      difficulty,
      minCalories,
      maxCalories
    }
  });
}
