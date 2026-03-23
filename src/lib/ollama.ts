// Ollama Cloud integration for food analysis

export interface FoodAnalysis {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ingredients: string[];
  allergens: string[];
}

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "https://ollama.cloud";

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysis> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_VISION_MODEL || "llava-llama3",
      prompt: `Analiza esta foto de comida. Identifica:
1) El plato/ingredientes principales
2) Estimación calórica aproximada (kcal)
3) Proteínas, carbohidratos y grasas en gramos
4) Posibles alérgenos (leche, huevos, gluten, frutos secos, etc)

Devuelve SOLO un JSON con este formato exacto, sin texto adicional:
{
  "name": "nombre del plato",
  "calories": 350,
  "protein_g": 25.5,
  "carbs_g": 30.2,
  "fat_g": 12.1,
  "ingredients": ["ingrediente1", "ingrediente2"],
  "allergens": ["leche", "gluten"]
}`,
      images: [base64Image],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.response || data.text || "";

  // Try to extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]) as FoodAnalysis;
  }

  // Fallback if no JSON found
  return {
    name: "Plato detectado",
    calories: 300,
    protein_g: 20,
    carbs_g: 30,
    fat_g: 15,
    ingredients: [],
    allergens: [],
  };
}
