// Base de datos de recetas reales con productos de supermercados españoles
// Mercadona, Lidl, Aldi, Family Cash

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  difficulty: "Fácil" | "Media" | "Difícil";
  tags: string[];
  supermarket: "Mercadona" | "Lidl" | "Aldi" | "Family Cash";
  image: string;
  mealType: ("desayuno" | "comida" | "cena" | "snack")[];
}

export interface Ingredient {
  item: string;
  amount: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  supermarket?: string;
}

export interface SupermarketProduct {
  name: string;
  brand: string;
  price: number;
  unit: string;
  supermarket: string;
  barcode?: string;
  category?: string;
  caloriesPer100g?: number;
  proteinPer100g?: number;
  carbsPer100g?: number;
  fatPer100g?: number;
}

export const RECIPES: Recipe[] = [
  {
    id: "m1",
    name: "Ensalada de pollo Mercadona",
    description: "Ensalada fresca con pollo a la plancha, ideal para menú semanal.",
    ingredients: [
      { item: "Pechuga de pollo", amount: "300g", supermarket: "Mercadona" },
      { item: "Mix de ensalada fresca", amount: "200g", supermarket: "Mercadona" },
      { item: "Tomates cherry", amount: "150g", supermarket: "Mercadona" },
      { item: "Queso feta", amount: "100g", supermarket: "Mercadona" },
      { item: "Aceitunas negras", amount: "80g", supermarket: "Mercadona" },
      { item: "Aceite de oliva virgen extra", amount: "30ml", supermarket: "Mercadona" },
    ],
    instructions: [
      "Corta la pechuga en tiras y cocínala a la plancha 5 min por lado.",
      "Lava el mix de ensalada y sécala.",
      "Corta los tomates cherry por la mitad.",
      "Coloca la ensalada en un bowl, añade el pollo, tomates, queso y aceitunas.",
      "Aliña con aceite de oliva, sal y vinagre al gusto.",
    ],
    prepTime: 15,
    cookTime: 10,
    servings: 2,
    calories: 420,
    protein: 38,
    carbs: 12,
    fat: 24,
    difficulty: "Fácil",
    tags: ["Alto en proteína", "Bajo en carbs", "Sin gluten"],
    supermarket: "Mercadona",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600",
    mealType: ["comida", "cena"],
  },
  {
    id: "m2",
    name: "Pechuga de pollo al horno con verduras",
    description: "Menú saludable y bajo en calorías para toda la semana.",
    ingredients: [
      { item: "Pechuga de pollo", amount: "500g", supermarket: "Mercadona" },
      { item: "Brócoli", amount: "300g", supermarket: "Mercadona" },
      { item: "Zanahorias", amount: "200g", supermarket: "Mercadona" },
      { item: "Patatas", amount: "400g", supermarket: "Mercadona" },
      { item: "Aceite de oliva", amount: "40ml", supermarket: "Mercadona" },
      { item: "Especias provenzales", amount: "10g", supermarket: "Mercadona" },
    ],
    instructions: [
      "Precalienta el horno a 200°C.",
      "Corta las verduras en trozos grandes.",
      "Coloca el pollo en el centro de la bandeja y las verduras alrededor.",
      "Riega con aceite y espolvorea las especias.",
      "Hornea durante 35-40 minutos hasta que el pollo esté hecho.",
    ],
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    calories: 380,
    protein: 42,
    carbs: 28,
    fat: 12,
    difficulty: "Fácil",
    tags: ["Meal prep", "Bajo en grasa", "Alto en proteína"],
    supermarket: "Mercadona",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
    mealType: ["comida", "cena"],
  },
  {
    id: "m3",
    name: "Tortilla de patatas",
    description: "Tortilla clásica española con patatas y huevos de Mercadona.",
    ingredients: [
      { item: "Huevos", amount: "4 unidades", supermarket: "Mercadona" },
      { item: "Patatas", amount: "400g", supermarket: "Mercadona" },
      { item: "Cebolla", amount: "100g", supermarket: "Mercadona" },
      { item: "Aceite de oliva", amount: "100ml", supermarket: "Mercadona" },
      { item: "Sal", amount: "al gusto", supermarket: "Mercadona" },
    ],
    instructions: [
      "Pela y corta las patatas en rodajas finas.",
      "Sofríe las patatas y la cebolla en aceite abundante.",
      "Bate los huevos y mézclalos con las patatas.",
      "Cuaja la tortilla por ambos lados.",
      "Sirve caliente o fría.",
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    calories: 350,
    protein: 15,
    carbs: 35,
    fat: 18,
    difficulty: "Fácil",
    tags: ["Clásico", "Español", "Bajo coste"],
    supermarket: "Mercadona",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600",
    mealType: ["comida", "cena"],
  },
  {
    id: "m4",
    name: "Lentejas con verduras",
    description: "Guiso de lentejas con verduras de temporada.",
    ingredients: [
      { item: "Lentejas pardinas", amount: "400g", supermarket: "Mercadona" },
      { item: "Zanahoria", amount: "200g", supermarket: "Mercadona" },
      { item: "Patata", amount: "300g", supermarket: "Mercadona" },
      { item: "Cebolla", amount: "150g", supermarket: "Mercadona" },
      { item: "Ajo", amount: "3 dientes", supermarket: "Mercadona" },
      { item: "Aceite de oliva", amount: "40ml", supermarket: "Mercadona" },
    ],
    instructions: [
      "Pica las verduras y sofríelas.",
      "Añade las lentejas y cubre con agua.",
      "Cocina a fuego medio 40 minutos.",
      "Añade sal y especias al gusto.",
      "Sirve caliente.",
    ],
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    calories: 320,
    protein: 18,
    carbs: 48,
    fat: 8,
    difficulty: "Fácil",
    tags: ["Vegetariano", "Alto en fibra", "Barato"],
    supermarket: "Mercadona",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600",
    mealType: ["comida", "cena"],
  },
  {
    id: "l1",
    name: "Salmón al vapor con limón",
    description: "Salmón fresco cocido al vapor con vegetales, rico en omega-3.",
    ingredients: [
      { item: "Filetes de salmón", amount: "400g", supermarket: "Lidl" },
      { item: "Brócoli", amount: "250g", supermarket: "Lidl" },
      { item: "Zanahorias baby", amount: "150g", supermarket: "Lidl" },
      { item: "Limón", amount: "1 unidad", supermarket: "Lidl" },
      { item: "Mantequilla", amount: "20g", supermarket: "Lidl" },
      { item: "Eneldo fresco", amount: "10g", supermarket: "Lidl" },
    ],
    instructions: [
      "Coloca los filetes de salmón en la vaporera.",
      "Añade el brócoli y zanahorias debajo.",
      "Exprime medio limón sobre el salmón.",
      "Cocina al vapor durante 15-18 minutos.",
      "Sirve con mantequilla derretida y eneldo.",
    ],
    prepTime: 10,
    cookTime: 18,
    servings: 2,
    calories: 450,
    protein: 40,
    carbs: 10,
    fat: 28,
    difficulty: "Fácil",
    tags: ["Alto en omega-3", "Keto", "Sin lactosa"],
    supermarket: "Lidl",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
    mealType: ["comida", "cena"],
  },
  {
    id: "l2",
    name: "Bowl de quinoa y aguacate",
    description: "Bowl vegetariano nutritivo con quinoa, aguacate y vegetales.",
    ingredients: [
      { item: "Quinoa", amount: "200g", supermarket: "Lidl" },
      { item: "Aguacate", amount: "1 unidad", supermarket: "Lidl" },
      { item: "Garbanzos cocidos", amount: "200g", supermarket: "Lidl" },
      { item: "Tomates", amount: "150g", supermarket: "Lidl" },
      { item: "Pepino", amount: "100g", supermarket: "Lidl" },
      { item: "Cebolla roja", amount: "50g", supermarket: "Lidl" },
      { item: "Salsa de soja", amount: "30ml", supermarket: "Lidl" },
    ],
    instructions: [
      "Cocina la quinoa según las instrucciones del paquete.",
      "Corta el aguacate, tomates, pepino y cebolla en dados.",
      "Escurre los garbanzos.",
      "Coloca la quinoa en un bowl y añade los vegetales encima.",
      "Aliña con salsa de soja y sirve.",
    ],
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    calories: 520,
    protein: 18,
    carbs: 62,
    fat: 24,
    difficulty: "Fácil",
    tags: ["Vegano", "Alto en fibra", "Energético"],
    supermarket: "Lidl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    mealType: ["comida", "cena"],
  },
  {
    id: "l3",
    name: "Ensalada César con pollo",
    description: "Ensalada clásica César con pollo a la plancha.",
    ingredients: [
      { item: "Pechuga de pollo", amount: "300g", supermarket: "Lidl" },
      { item: "Lechuga romana", amount: "200g", supermarket: "Lidl" },
      { item: "Queso parmesano", amount: "50g", supermarket: "Lidl" },
      { item: "Crutones", amount: "50g", supermarket: "Lidl" },
      { item: "Salsa César", amount: "60ml", supermarket: "Lidl" },
    ],
    instructions: [
      "Cocina el pollo a la plancha con aceite.",
      "Trocea la lechuga romana.",
      "Corta el pollo en tiras.",
      "Mezcla la lechuga con la salsa César.",
      "Añade el pollo, queso y crutones por encima.",
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    calories: 420,
    protein: 38,
    carbs: 18,
    fat: 24,
    difficulty: "Fácil",
    tags: ["Clásico", "Alto en proteína", "Rápido"],
    supermarket: "Lidl",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600",
    mealType: ["comida", "cena"],
  },
  {
    id: "a1",
    name: "Tacos de pavo bajos en grasa",
    description: "Tacos mexicanos saludables con carne de pavo y vegetales frescos.",
    ingredients: [
      { item: "Carne de pavo molida", amount: "400g", supermarket: "Aldi" },
      { item: "Tortillas de trigo integral", amount: "8 unidades", supermarket: "Aldi" },
      { item: "Lechuga romana", amount: "150g", supermarket: "Aldi" },
      { item: "Tomates", amount: "200g", supermarket: "Aldi" },
      { item: "Aguacate", amount: "1 unidad", supermarket: "Aldi" },
      { item: "Salsa picante", amount: "50ml", supermarket: "Aldi" },
    ],
    instructions: [
      "Cocina la carne de pavo sazonada con comino y pimentón.",
      "Calienta las tortillas en el microondas.",
      "Pica la lechuga, tomates y cebolla finamente.",
      "Prepara el guacamole con el aguacate.",
      "Monta los tacos con la carne y vegetales.",
    ],
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    calories: 380,
    protein: 32,
    carbs: 35,
    fat: 14,
    difficulty: "Fácil",
    tags: ["Mexicano", "Alto en proteína", "Bajo en grasa"],
    supermarket: "Aldi",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600",
    mealType: ["comida", "cena"],
  },
  {
    id: "a2",
    name: "Pollo stir-fry con arroz integral",
    description: "Plato oriental saludable con pollo, vegetales y arroz integral.",
    ingredients: [
      { item: "Pechuga de pollo", amount: "400g", supermarket: "Aldi" },
      { item: "Arroz integral", amount: "300g", supermarket: "Aldi" },
      { item: "Pimientos mixtos", amount: "250g", supermarket: "Aldi" },
      { item: "Brotes de soja", amount: "150g", supermarket: "Aldi" },
      { item: "Salsa de ostras", amount: "60ml", supermarket: "Aldi" },
      { item: "Aceite de sésamo", amount: "20ml", supermarket: "Aldi" },
    ],
    instructions: [
      "Cocina el arroz integral según las instrucciones.",
      "Corta el pollo y los pimientos en tiras.",
      "Saltea el pollo en aceite de sésamo.",
      "Añade los pimientos y brotes de soja.",
      "Agrega la salsa de ostras y sirve sobre el arroz.",
    ],
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    calories: 480,
    protein: 38,
    carbs: 48,
    fat: 16,
    difficulty: "Media",
    tags: ["Oriental", "Alto en proteína", "Equilibrado"],
    supermarket: "Aldi",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600",
    mealType: ["comida", "cena"],
  },
  {
    id: "a3",
    name: "Yogur griego con granola y frutas",
    description: "Desayuno proteico con yogur griego, granola y frutas frescas.",
    ingredients: [
      { item: "Yogur griego natural", amount: "200g", supermarket: "Aldi" },
      { item: "Granola", amount: "50g", supermarket: "Aldi" },
      { item: "Plátano", amount: "1 unidad", supermarket: "Aldi" },
      { item: "Miel", amount: "15g", supermarket: "Aldi" },
      { item: "Arándanos", amount: "50g", supermarket: "Aldi" },
    ],
    instructions: [
      "Coloca el yogur griego en un bowl.",
      "Añade la granola por encima.",
      "Corta el plátano en rodajas.",
      "Decora con los arándanos y la miel.",
    ],
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 320,
    protein: 15,
    carbs: 48,
    fat: 10,
    difficulty: "Fácil",
    tags: ["Desayuno", "Proteico", "Rápido"],
    supermarket: "Aldi",
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600",
    mealType: ["desayuno", "snack"],
  },
  {
    id: "f1",
    name: "Macarrones con atún y tomate",
    description: "Pasta italiana clásica con atún fresco y salsa de tomate casera.",
    ingredients: [
      { item: "Macarrones", amount: "400g", supermarket: "Family Cash" },
      { item: "Atún fresco", amount: "300g", supermarket: "Family Cash" },
      { item: "Tomates triturados", amount: "400g", supermarket: "Family Cash" },
      { item: "Cebolla", amount: "100g", supermarket: "Family Cash" },
      { item: "Ajo", amount: "2 dientes", supermarket: "Family Cash" },
      { item: "Aceite de oliva", amount: "40ml", supermarket: "Family Cash" },
    ],
    instructions: [
      "Cocina los macarrones en agua con sal.",
      "Sofríe la cebolla y el ajo en aceite de oliva.",
      "Añade los tomates triturados y cocina 15 minutos.",
      "Corta el atún en dados y añádelo al sofrito.",
      "Sirve la pasta con la salsa por encima.",
    ],
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    calories: 520,
    protein: 35,
    carbs: 65,
    fat: 14,
    difficulty: "Fácil",
    tags: ["Italiano", "Rápido", "Atún"],
    supermarket: "Family Cash",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600",
    mealType: ["comida", "cena"],
  },
  {
    id: "f2",
    name: "Smoothie de frutos rojos",
    description: "Batido nutritivo de frutos rojos con leche de almendras.",
    ingredients: [
      { item: "Fresas", amount: "150g", supermarket: "Family Cash" },
      { item: "Arándanos", amount: "100g", supermarket: "Family Cash" },
      { item: "Plátano congelado", amount: "1 unidad", supermarket: "Family Cash" },
      { item: "Leche de almendras", amount: "200ml", supermarket: "Family Cash" },
      { item: "Miel", amount: "10g", supermarket: "Family Cash" },
    ],
    instructions: [
      "Añade todos los ingredientes a la batidora.",
      "Tritura hasta obtener una textura suave.",
      "Vierte en un vaso alto.",
      "Decora con unas fresas por encima.",
    ],
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 220,
    protein: 5,
    carbs: 42,
    fat: 4,
    difficulty: "Fácil",
    tags: ["Desayuno", "Vegano", "Antioxidantes"],
    supermarket: "Family Cash",
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600",
    mealType: ["desayuno", "snack"],
  },
  {
    id: "f3",
    name: "Revuelto de espinacas con queso",
    description: "Desayuno o cena ligera con espinacas frescas y huevo.",
    ingredients: [
      { item: "Huevos", amount: "3 unidades", supermarket: "Family Cash" },
      { item: "Espinacas frescas", amount: "200g", supermarket: "Family Cash" },
      { item: "Queso de cabra", amount: "50g", supermarket: "Family Cash" },
      { item: "Aceite de oliva", amount: "20ml", supermarket: "Family Cash" },
      { item: "Sal y pimienta", amount: "al gusto", supermarket: "Family Cash" },
    ],
    instructions: [
      "Bate los huevos y sazona con sal y pimienta.",
      "Sofríe las espinacas en aceite de oliva.",
      "Añade los huevos batidos.",
      "Cocina removiendo suavemente.",
      "Sirve con queso de cabra desmenuzado.",
    ],
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    calories: 280,
    protein: 18,
    carbs: 4,
    fat: 22,
    difficulty: "Fácil",
    tags: ["Bajo en carbs", "Alto en proteína", "Rápido"],
    supermarket: "Family Cash",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600",
    mealType: ["desayuno", "cena"],
  },
  {
    id: "f4",
    name: "Pechuga de pollo a la plancha con ensalada",
    description: "Comida baja en calorías con pollo y ensalada fresca.",
    ingredients: [
      { item: "Pechuga de pollo", amount: "300g", supermarket: "Family Cash" },
      { item: "Lechuga iceberg", amount: "200g", supermarket: "Family Cash" },
      { item: "Tomate", amount: "150g", supermarket: "Family Cash" },
      { item: "Cebolla", amount: "80g", supermarket: "Family Cash" },
      { item: "Aceite de oliva", amount: "30ml", supermarket: "Family Cash" },
      { item: "Limón", amount: "1 unidad", supermarket: "Family Cash" },
    ],
    instructions: [
      "Sazona la pechuga con sal y pimienta.",
      "Cocina a la plancha 5-6 minutos por lado.",
      "Lava y corta la lechuga y el tomate.",
      "Mezcla las verduras con aceite y limón.",
      "Sirve el pollo sobre la ensalada.",
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    calories: 320,
    protein: 40,
    carbs: 10,
    fat: 14,
    difficulty: "Fácil",
    tags: ["Bajo en calorías", "Alto en proteína", "Fitness"],
    supermarket: "Family Cash",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
    mealType: ["comida", "cena"],
  },
];

// Helper function to generate shopping list from recipes
export function generateWeeklyShoppingList(recipes: Recipe[]): Ingredient[] {
  const ingredientMap = new Map<string, Ingredient>();
  
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      const key = ing.item.toLowerCase();
      if (ingredientMap.has(key)) {
        const existing = ingredientMap.get(key)!;
        existing.amount = `${existing.amount} + ${ing.amount}`;
      } else {
        ingredientMap.set(key, { ...ing });
      }
    });
  });
  
  return Array.from(ingredientMap.values());
}

// Filter functions
export function filterRecipesBySupermarket(supermarket: string): Recipe[] {
  if (supermarket === "Todos") return RECIPES;
  return RECIPES.filter((r) => r.supermarket === supermarket);
}

export function filterRecipesByMealType(mealType: string): Recipe[] {
  if (mealType === "Todos") return RECIPES;
  return RECIPES.filter((r) => r.mealType.includes(mealType as any));
}

export function searchRecipes(query: string): Recipe[] {
  const lowerQuery = query.toLowerCase();
  return RECIPES.filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}

// Products for API
export const SUPERMARKET_PRODUCTS: SupermarketProduct[] = [
  { name: "Pechuga de pollo", brand: "Mercadona", price: 4.95, unit: "kg", supermarket: "Mercadona" },
  { name: "Huevos", brand: "Mercadona", price: 2.35, unit: "12", supermarket: "Mercadona" },
  { name: "Leche semidesnatada", brand: "Mercadona", price: 1.19, unit: "1L", supermarket: "Mercadona" },
  { name: "Salmón fresco", brand: "Lidl", price: 7.95, unit: "kg", supermarket: "Lidl" },
  { name: "Yogur griego", brand: "Aldi", price: 1.45, unit: "500g", supermarket: "Aldi" },
];
