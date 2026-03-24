import { SUPERMARKET_PRODUCTS, SupermarketProduct } from "@/data/recipes";
import { NextResponse } from "next/server";

// GET - Obtener todos los productos o filtrar por supermercado
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supermarket = searchParams.get("supermarket");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const barcode = searchParams.get("barcode");

  let products = [...SUPERMARKET_PRODUCTS];

  // Filtrar por supermercado
  if (supermarket) {
    const supermarkets = supermarket.split(",") as SupermarketProduct["supermarket"][];
    products = products.filter(p => supermarkets.includes(p.supermarket));
  }

  // Filtrar por categoría
  if (category) {
    products = products.filter(p => p.category === category);
  }

  // Buscar por nombre
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower)
    );
  }

  // Buscar por código de barras
  if (barcode) {
    const product = SUPERMARKET_PRODUCTS.find(p => p.barcode === barcode);
    if (product) {
      return NextResponse.json({ product });
    }
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ 
    products,
    total: products.length 
  });
}

// POST - Verificar producto en OpenFoodFacts API
export async function POST(request: Request) {
  const { barcode } = await request.json();

  if (!barcode) {
    return NextResponse.json({ error: "Barcode requerido" }, { status: 400 });
  }

  // Primero buscar en nuestra base de datos local
  const localProduct = SUPERMARKET_PRODUCTS.find(p => p.barcode === barcode);
  if (localProduct) {
    return NextResponse.json({ 
      product: localProduct,
      source: "local" 
    });
  }

  // Si no está en local, consultar OpenFoodFacts API
  try {
    const response = await fetch(
      `https://es.openfoodfacts.org/api/v2/product/${barcode}.json`,
      {
        headers: {
          "User-Agent": "DietTracker/1.0 (contacto@diettracker.app)"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Producto no encontrado en OpenFoodFacts");
    }

    const data = await response.json();

    if (data.status === 1 && data.product) {
      const offProduct = {
        barcode: data.product.code,
        name: data.product.product_name || data.product.product_name_es || "Producto desconocido",
        brand: data.product.brands || "Sin marca",
        supermarket: "generic" as const,
        category: data.product.categories_tags?.[0]?.replace(/^[a-z]{2}:/, "") || "otros",
        caloriesPer100g: Math.round(data.product.nutriments?.["energy-kcal_100g"] || 0),
        proteinPer100g: Math.round(data.product.nutriments?.proteins_100g || 0),
        carbsPer100g: Math.round(data.product.nutriments?.carbohydrates_100g || 0),
        fatPer100g: Math.round(data.product.nutriments?.fat_100g || 0),
        image: data.product.image_front_small_url || data.product.image_url
      };

      return NextResponse.json({ 
        product: offProduct,
        source: "openfoodfacts"
      });
    }

    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  } catch (error) {
    console.error("Error consultando OpenFoodFacts:", error);
    return NextResponse.json({ 
      error: "Error consultando base de datos externa" 
    }, { status: 500 });
  }
}
