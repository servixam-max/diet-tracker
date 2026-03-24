import { NextRequest, NextResponse } from "next/server";

// Open Food Facts API - free, no API key needed
const OPEN_FOOD_FACTS_URL = "https://world.openfoodfacts.org/api/v0/product";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const barcode = searchParams.get("barcode");

    if (!barcode) {
      return NextResponse.json({ error: "Barcode required" }, { status: 400 });
    }

    console.log(`[Barcode Lookup] Looking up: ${barcode}`);

    // Call Open Food Facts API
    const response = await fetch(`${OPEN_FOOD_FACTS_URL}/${barcode}.json`, {
      headers: {
        "User-Agent": "DietTracker/1.0 (contact@diettracker.app)",
      },
    });

    if (!response.ok) {
      // If product not found, return mock data for demo
      if (response.status === 404) {
        return NextResponse.json({
          name: "Producto escaneado",
          calories: 150,
          protein: 5,
          carbs: 20,
          fat: 6,
          barcode,
          found: false,
          message: "Producto no encontrado en la base de datos. Se usarán valores estimados.",
        });
      }
      throw new Error(`Open Food Facts API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 0) {
      // Product not found
      return NextResponse.json({
        name: "Producto desconocido",
        calories: 150,
        protein: 5,
        carbs: 20,
        fat: 6,
        barcode,
        found: false,
        message: "Producto no encontrado",
      });
    }

    const product = data.product;

    // Extract nutrition facts (per 100g)
    const nutriments = product.nutriments || {};

    // Calculate calories, protein, carbs, fat
    const calories = Math.round(nutriments["energy-kcal_100g"] || nutriments["energy_100g"] / 4.184 || 0);
    const protein = Math.round((nutriments.proteins_100g || 0) * 10) / 10;
    const carbs = Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10;
    const fat = Math.round((nutriments.fat_100g || 0) * 10) / 10;

    console.log(`[Barcode Lookup] Found: ${product.product_name} - ${calories} kcal`);

    return NextResponse.json({
      name: product.product_name || product.product_name_es || "Producto",
      brand: product.brands || "",
      calories: calories || 150,
      protein: protein || 5,
      carbs: carbs || 20,
      fat: fat || 6,
      barcode,
      found: true,
      image: product.image_small_url || product.image_url || null,
      serving_size: product.serving_size || "100g",
    });

  } catch (error) {
    console.error("[Barcode Lookup] Error:", error);
    return NextResponse.json(
      { 
        error: "Error al buscar el producto",
        name: "Producto",
        calories: 150,
        protein: 5,
        carbs: 20,
        fat: 6,
      },
      { status: 500 }
    );
  }
}
