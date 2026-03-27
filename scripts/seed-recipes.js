#!/usr/bin/env node
/**
 * Seed script para importar recetas desde src/data/recipes.ts a Supabase
 * Uso: node scripts/seed-recipes.js
 * eslint-disable-next-line @typescript-eslint/no-require-imports
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fetch = require('node-fetch');

// Configuración
const SUPABASE_URL = 'https://vvtgpztnytpxoacoflas.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGdwenRueXRweG9hY29mbGFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI5MjQ1MSwiZXhwIjoyMDg5ODY4NDUxfQ.fSncV16A130oJzpP3FViH4qX6loLuukOVK3VfAISAHM';

// Recetas de ejemplo (las primeras 20 para testing)
const recipes = [
  {
    name: "Avena nocturna con plátano y miel",
    description: "Desayuno energético preparado la noche anterior",
    prep_time_minutes: 5,
    calories: 350,
    protein_g: 12,
    carbs_g: 58,
    fat_g: 8,
    servings: 1,
    supermarket: "mercadona",
    ingredients: JSON.stringify([
      { item: "Avena", amount: "50g" },
      { item: "Plátano", amount: "1 unidad" },
      { item: "Miel", amount: "1 cucharada" },
      { item: "Yogur griego", amount: "100g" }
    ]),
    instructions: JSON.stringify([
      "Mezcla la avena con el yogur en un recipiente",
      "Añade el plátano en rodajas",
      "Rocía con miel",
      "Refrigera toda la noche",
      "Sirve frío por la mañana"
    ]),
    tags: JSON.stringify(["desayuno", "saludable", "rápido", "vegetariano"])
  },
  {
    name: "Tostada de aguacate y huevo",
    description: "Desayuno proteico y saciante",
    prep_time_minutes: 10,
    calories: 420,
    protein_g: 18,
    carbs_g: 32,
    fat_g: 24,
    servings: 1,
    supermarket: "mercadona",
    ingredients: JSON.stringify([
      { item: "Pan integral", amount: "2 rebanadas" },
      { item: "Aguacate", amount: "1/2 unidad" },
      { item: "Huevos", amount: "2 unidades" },
      { item: "Tomate cherry", amount: "5 unidades" }
    ]),
    instructions: JSON.stringify([
      "Tuesta el pan",
      "Machaca el aguacate con sal y pimienta",
      "Pocha o fríe los huevos",
      "Unta el aguacate en el pan",
      "Coloca los huevos y tomates encima"
    ]),
    tags: JSON.stringify(["desayuno", "proteico", "keto", "rápido"])
  },
  {
    name: "Bowl de yogur con frutos rojos",
    description: "Desayuno ligero y antioxidante",
    prep_time_minutes: 5,
    calories: 280,
    protein_g: 15,
    carbs_g: 35,
    fat_g: 6,
    servings: 1,
    supermarket: "lidl",
    ingredients: JSON.stringify([
      { item: "Yogur griego", amount: "200g" },
      { item: "Frutos rojos", amount: "100g" },
      { item: "Granola", amount: "30g" },
      { item: "Miel", amount: "1 cucharadita" }
    ]),
    instructions: JSON.stringify([
      "Pon el yogur en un bowl",
      "Añade los frutos rojos",
      "Espolvorea la granola",
      "Rocía con miel"
    ]),
    tags: JSON.stringify(["desayuno", "ligero", "antioxidante", "rápido"])
  },
  {
    name: "Pechuga de pollo con quinoa y verduras",
    description: "Comida equilibrada alta en proteína",
    prep_time_minutes: 25,
    calories: 520,
    protein_g: 45,
    carbs_g: 48,
    fat_g: 12,
    servings: 1,
    supermarket: "mercadona",
    ingredients: JSON.stringify([
      { item: "Pechuga de pollo", amount: "200g" },
      { item: "Quinoa", amount: "80g" },
      { item: "Brócoli", amount: "150g" },
      { item: "Zanahoria", amount: "100g" },
      { item: "Aceite de oliva", amount: "1 cucharada" }
    ]),
    instructions: JSON.stringify([
      "Cuece la quinoa según instrucciones del paquete",
      "Sazona y cocina el pollo a la plancha",
      "Cuece al vapor el brócoli y zanahoria",
      "Sirve todo junto con un chorrito de aceite"
    ]),
    tags: JSON.stringify(["comida", "proteico", "equilibrado", "meal-prep"])
  },
  {
    name: "Salmón al horno con boniato",
    description: "Cena rica en omega-3",
    prep_time_minutes: 30,
    calories: 480,
    protein_g: 35,
    carbs_g: 42,
    fat_g: 18,
    servings: 1,
    supermarket: "lidl",
    ingredients: JSON.stringify([
      { item: "Salmón", amount: "150g" },
      { item: "Boniato", amount: "200g" },
      { item: "Espárragos", amount: "100g" },
      { item: "Limón", amount: "1/2 unidad" }
    ]),
    instructions: JSON.stringify([
      "Precalienta el horno a 200°C",
      "Corta el boniato en rodajas y hornéalo 20 min",
      "Sazona el salmón con limón y hierbas",
      "Hornear todo junto 10-12 minutos más"
    ]),
    tags: JSON.stringify(["cena", "omega-3", "saludable", "horno"])
  },
  {
    name: "Ensalada de atún y garbanzos",
    description: "Comida rápida y nutritiva",
    prep_time_minutes: 15,
    calories: 380,
    protein_g: 28,
    carbs_g: 35,
    fat_g: 12,
    servings: 1,
    supermarket: "mercadona",
    ingredients: JSON.stringify([
      { item: "Atún en conserva", amount: "2 latas" },
      { item: "Garbanzos cocidos", amount: "150g" },
      { item: "Lechuga", amount: "100g" },
      { item: "Tomate", amount: "1 unidad" },
      { item: "Cebolla roja", amount: "1/4 unidad" }
    ]),
    instructions: JSON.stringify([
      "Lava y corta la lechuga y tomate",
      "Escurre el atún y garbanzos",
      "Mezcla todos los ingredientes",
      "Aliña con aceite, vinagre y sal"
    ]),
    tags: JSON.stringify(["comida", "rápido", "económico", "proteico"])
  },
  {
    name: "Tortilla francesa con espinacas",
    description: "Cena ligera y proteica",
    prep_time_minutes: 10,
    calories: 320,
    protein_g: 22,
    carbs_g: 8,
    fat_g: 22,
    servings: 1,
    supermarket: "mercadona",
    ingredients: JSON.stringify([
      { item: "Huevos", amount: "3 unidades" },
      { item: "Espinacas frescas", amount: "50g" },
      { item: "Queso fresco", amount: "30g" },
      { item: "Aceite de oliva", amount: "1 cucharadita" }
    ]),
    instructions: JSON.stringify([
      "Bate los huevos con sal",
      "Saltea las espinacas 2 minutos",
      "Añade a los huevos batidos",
      "Cuaja la tortilla en sartén antiadherente",
      "Añade queso fresco por encima"
    ]),
    tags: JSON.stringify(["cena", "ligero", "proteico", "keto"])
  },
  {
    name: "Pasta integral con pavo y verduras",
    description: "Comida completa con carbohidratos complejos",
    prep_time_minutes: 20,
    calories: 550,
    protein_g: 38,
    carbs_g: 62,
    fat_g: 14,
    servings: 1,
    supermarket: "lidl",
    ingredients: JSON.stringify([
      { item: "Pasta integral", amount: "100g" },
      { item: "Pechuga de pavo", amount: "150g" },
      { item: "Calabacín", amount: "150g" },
      { item: "Pimiento rojo", amount: "1/2 unidad" },
      { item: "Tomate triturado", amount: "100g" }
    ]),
    instructions: JSON.stringify([
      "Cuece la pasta según paquete",
      "Corta el pavo y verduras en tiras",
      "Saltea el pavo 5 minutos",
      "Añade verduras y tomate",
      "Mezcla con la pasta cocida"
    ]),
    tags: JSON.stringify(["comida", "pasta", "completo", "meal-prep"])
  },
  {
    name: "Batido de proteínas y plátano",
    description: "Snack post-entreno",
    prep_time_minutes: 5,
    calories: 280,
    protein_g: 25,
    carbs_g: 32,
    fat_g: 4,
    servings: 1,
    supermarket: "familycash",
    ingredients: JSON.stringify([
      { item: "Proteína de suero", amount: "30g" },
      { item: "Plátano", amount: "1 unidad" },
      { item: "Leche", amount: "250ml" },
      { item: "Canela", amount: "1 pizca" }
    ]),
    instructions: JSON.stringify([
      "Pon todos los ingredientes en la batidora",
      "Tritura hasta que quede suave",
      "Sirve inmediatamente"
    ]),
    tags: JSON.stringify(["snack", "post-entreno", "proteico", "rápido"])
  },
  {
    name: "Lentejas con verduras",
    description: "Comida tradicional rica en hierro",
    prep_time_minutes: 45,
    calories: 420,
    protein_g: 22,
    carbs_g: 58,
    fat_g: 8,
    servings: 2,
    supermarket: "mercadona",
    ingredients: JSON.stringify([
      { item: "Lentejas", amount: "200g" },
      { item: "Zanahoria", amount: "2 unidades" },
      { item: "Patata", amount: "1 unidad" },
      { item: "Cebolla", amount: "1/2 unidad" },
      { item: "Ajo", amount: "2 dientes" }
    ]),
    instructions: JSON.stringify([
      "Pon las lentejas en remojo la noche anterior",
      "Sofríe cebolla, ajo y zanahoria picados",
      "Añade las lentejas y cubre con agua",
      "Añade la patata en trozos",
      "Cuece 40 minutos a fuego medio"
    ]),
    tags: JSON.stringify(["comida", "legumbres", "tradicional", "hierro"])
  },
  {
    name: "Revuelto de champiñones",
    description: "Cena baja en carbohidratos",
    prep_time_minutes: 12,
    calories: 240,
    protein_g: 18,
    carbs_g: 6,
    fat_g: 16,
    servings: 1,
    supermarket: "aldi",
    ingredients: JSON.stringify([
      { item: "Huevos", amount: "2 unidades" },
      { item: "Champiñones", amount: "150g" },
      { item: "Ajo", amount: "1 diente" },
      { item: "Perejil", amount: "1 ramita" }
    ]),
    instructions: JSON.stringify([
      "Lamina los champiñones",
      "Saltea con ajo 5 minutos",
      "Añade los huevos batidos",
      "Remueve hasta cuajar",
      "Decora con perejil fresco"
    ]),
    tags: JSON.stringify(["cena", "keto", "bajo-carb", "rápido"])
  },
  {
    name: "Wrap de pollo y lechuga",
    description: "Comida rápida y portátil",
    prep_time_minutes: 15,
    calories: 380,
    protein_g: 32,
    carbs_g: 28,
    fat_g: 14,
    servings: 1,
    supermarket: "mercadona",
    ingredients: JSON.stringify([
      { item: "Tortilla de trigo", amount: "1 unidad" },
      { item: "Pechuga de pollo", amount: "120g" },
      { item: "Lechuga", amount: "50g" },
      { item: "Tomate", amount: "1/2 unidad" },
      { item: "Yogur griego", amount: "2 cucharadas" }
    ]),
    instructions: JSON.stringify([
      "Corta el pollo en tiras y saltéalo",
      "Calienta la tortilla",
      "Unta con yogur griego",
      "Añade pollo, lechuga y tomate",
      "Enrolla bien apretado"
    ]),
    tags: JSON.stringify(["comida", "portátil", "rápido", "proteico"])
  },
  {
    name: "Merluza al vapor con patatas",
    description: "Cena ligera de pescado blanco",
    prep_time_minutes: 25,
    calories: 340,
    protein_g: 32,
    carbs_g: 38,
    fat_g: 4,
    servings: 1,
    supermarket: "lidl",
    ingredients: JSON.stringify([
      { item: "Merluza", amount: "180g" },
      { item: "Patatas", amount: "200g" },
      { item: "Zanahoria", amount: "1 unidad" },
      { item: "Limón", amount: "1/4 unidad" }
    ]),
    instructions: JSON.stringify([
      "Corta patatas y zanahoria en rodajas",
      "Coloca en vaporera",
      "Añade el pescado encima",
      "Cuece 20 minutos",
      "Sirve con limón y sal"
    ]),
    tags: JSON.stringify(["cena", "pescado", "ligero", "vapor"])
  },
  {
    name: "Gambas al ajillo",
    description: "Cena rápida de marisco",
    prep_time_minutes: 10,
    calories: 220,
    protein_g: 24,
    carbs_g: 4,
    fat_g: 12,
    servings: 1,
    supermarket: "mercadona",
    ingredients: JSON.stringify([
      { item: "Gambas peladas", amount: "200g" },
      { item: "Ajo", amount: "4 dientes" },
      { item: "Guindilla", amount: "1 unidad" },
      { item: "Aceite de oliva", amount: "2 cucharadas" }
    ]),
    instructions: JSON.stringify([
      "Lamina los ajos",
      "Calienta aceite en sartén",
      "Añade ajo y guindilla",
      "Cuando doren, añade gambas",
      "Cocina 2-3 minutos por lado"
    ]),
    tags: JSON.stringify(["cena", "marisco", "rápido", "keto"])
  },
  {
    name: "Tofu salteado con verduras",
    description: "Cena vegana rica en proteína vegetal",
    prep_time_minutes: 20,
    calories: 320,
    protein_g: 22,
    carbs_g: 18,
    fat_g: 18,
    servings: 1,
    supermarket: "lidl",
    ingredients: JSON.stringify([
      { item: "Tofu firme", amount: "200g" },
      { item: "Brócoli", amount: "150g" },
      { item: "Pimiento", amount: "1/2 unidad" },
      { item: "Salsa de soja", amount: "2 cucharadas" },
      { item: "Jengibre", amount: "1 trozo" }
    ]),
    instructions: JSON.stringify([
      "Escurre y corta el tofu en cubos",
      "Saltea el tofu hasta dorar",
      "Añade verduras cortadas",
      "Añade soja y jengibre rallado",
      "Cocina 5 minutos más"
    ]),
    tags: JSON.stringify(["cena", "vegano", "tofu", "asiático"])
  },
  {
    name: "Panqueques de avena y plátano",
    description: "Desayuno dulce saludable",
    prep_time_minutes: 15,
    calories: 380,
    protein_g: 14,
    carbs_g: 52,
    fat_g: 12,
    servings: 2,
    supermarket: "mercadona",
    ingredients: JSON.stringify([
      { item: "Avena", amount: "80g" },
      { item: "Plátano", amount: "2 unidades" },
      { item: "Huevos", amount: "2 unidades" },
      { item: "Canela", amount: "1 cucharadita" }
    ]),
    instructions: JSON.stringify([
      "Tritura la avena hasta hacer harina",
      "Machaca los plátanos",
      "Mezcla con huevos y canela",
      "Cuaja en sartén como tortitas",
      "Sirve con fruta fresca"
    ]),
    tags: JSON.stringify(["desayuno", "dulce", "saludable", "sin-azúcar"])
  },
  {
    name: "Arroz integral con verduras",
    description: "Comida vegana completa",
    prep_time_minutes: 30,
    calories: 420,
    protein_g: 12,
    carbs_g: 78,
    fat_g: 8,
    servings: 1,
    supermarket: "aldi",
    ingredients: JSON.stringify([
      { item: "Arroz integral", amount: "100g" },
      { item: "Pimiento", amount: "1 unidad" },
      { item: "Calabacín", amount: "1/2 unidad" },
      { item: "Cebolla", amount: "1/2 unidad" },
      { item: "Tomate", amount: "1 unidad" }
    ]),
    instructions: JSON.stringify([
      "Cuece el arroz 25 minutos",
      "Saltea las verduras picadas",
      "Añade el tomate triturado",
      "Mezcla con el arroz cocido",
      "Sirve caliente"
    ]),
    tags: JSON.stringify(["comida", "vegano", "arroz", "completo"])
  },
  {
    name: "Pavo al horno con patatas",
    description: "Comida tradicional fácil",
    prep_time_minutes: 40,
    calories: 480,
    protein_g: 42,
    carbs_g: 45,
    fat_g: 12,
    servings: 2,
    supermarket: "mercadona",
    ingredients: JSON.stringify([
      { item: "Pechuga de pavo", amount: "300g" },
      { item: "Patatas", amount: "300g" },
      { item: "Cebolla", amount: "1 unidad" },
      { item: "Vino blanco", amount: "50ml" }
    ]),
    instructions: JSON.stringify([
      "Precalienta horno a 180°C",
      "Corta patatas y cebolla",
      "Coloca en bandeja con el pavo",
      "Añade vino y hierbas",
      "Hornear 35-40 minutos"
    ]),
    tags: JSON.stringify(["comida", "horno", "tradicional", "fácil"])
  },
  {
    name: "Ensalada César con pollo",
    description: "Comida clásica rejuvenecida",
    prep_time_minutes: 20,
    calories: 450,
    protein_g: 35,
    carbs_g: 22,
    fat_g: 24,
    servings: 1,
    supermarket: "lidl",
    ingredients: JSON.stringify([
      { item: "Lechuga romana", amount: "150g" },
      { item: "Pechuga de pollo", amount: "150g" },
      { item: "Picatostes", amount: "30g" },
      { item: "Parmesano", amount: "30g" },
      { item: "Salsa césar", amount: "2 cucharadas" }
    ]),
    instructions: JSON.stringify([
      "Corta la lechuga",
      "Cocina el pollo a la plancha",
      "Tuesta los picatostes",
      "Mezcla todo con la salsa",
      "Ralla parmesano por encima"
    ]),
    tags: JSON.stringify(["comida", "ensalada", "clasico", "proteico"])
  },
  {
    name: "Huevos rellenos de atún",
    description: "Cena creativa y proteica",
    prep_time_minutes: 20,
    calories: 320,
    protein_g: 26,
    carbs_g: 6,
    fat_g: 22,
    servings: 2,
    supermarket: "mercadona",
    ingredients: JSON.stringify([
      { item: "Huevos", amount: "4 unidades" },
      { item: "Atún", amount: "2 latas" },
      { item: "Mayonesa ligera", amount: "2 cucharadas" },
      { item: "Pimentón", amount: "1 pizca" }
    ]),
    instructions: JSON.stringify([
      "Cuece los huevos 10 minutos",
      "Enfría y pela",
      "Corta por la mitad y saca yemas",
      "Mezcla yemas con atún y mayonesa",
      "Rellena claras y espolvorea pimentón"
    ]),
    tags: JSON.stringify(["cena", "huevos", "proteico", "keto"])
  }
];

async function seedRecipes() {
  console.log('🌱 Importando recetas a Supabase...\n');
  
  let success = 0;
  let failed = 0;
  
  for (const recipe of recipes) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(recipe)
      });
      
      if (response.ok || response.status === 201) {
        console.log(`✅ ${recipe.name}`);
        success++;
      } else {
        const error = await response.json();
        console.log(`❌ ${recipe.name}: ${error.message || error.code}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${recipe.name}: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Exitosas: ${success}`);
  console.log(`   ❌ Fallidas: ${failed}`);
  console.log(`   📦 Total: ${recipes.length}`);
  
  if (success > 0) {
    console.log(`\n✨ ¡Recetas importadas correctamente!`);
    console.log(`   Verifica en: https://supabase.com/dashboard/project/vvtgpztnytpxoacoflas/table-editor/auth/recipes`);
  }
}

seedRecipes();
