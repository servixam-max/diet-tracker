// Ollama LOCAL integration for food analysis

export interface FoodAnalysis {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ingredients: string[];
  allergens: string[];
}

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const VISION_MODEL = process.env.OLLAMA_VISION_MODEL || "llava:latest";

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysis> {
  console.log("[Ollama Local] Analyzing with model:", VISION_MODEL);
  console.log("[Ollama Local] Server:", OLLAMA_BASE_URL);
  
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: VISION_MODEL,
        prompt: `You are a nutritionist. Analyze this food photo and respond ONLY with valid JSON in this exact format, no other text:
{
  "name": "dish name in Spanish",
  "calories": number (kcal per serving, no decimals),
  "protein_g": number (grams, 1 decimal),
  "carbs_g": number (grams, 1 decimal),
  "fat_g": number (grams, 1 decimal),
  "ingredients": ["ingredient1", "ingredient2"],
  "allergens": ["milk", "gluten", "nuts"]
}`,
        images: [base64Image.split(',')[1] || base64Image], // Remove data:image/...;base64, prefix if present
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 300,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Ollama Local] API error:", response.status, errorText);
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.response || "";

    console.log("[Ollama Local] Raw response:", text.substring(0, 500));

    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[0]) as FoodAnalysis;
        console.log("[Ollama Local] Parsed result:", result);
        return result;
      } catch (e) {
        console.error("[Ollama Local] JSON parse error:", e);
      }
    }

    // Fallback if no valid JSON found
    console.log("[Ollama Local] Using fallback data");
    return {
      name: "Plato de comida",
      calories: 300,
      protein_g: 20,
      carbs_g: 30,
      fat_g: 15,
      ingredients: ["comida"],
      allergens: [],
    };
  } catch (error) {
    console.error("[Ollama Local] Request failed:", error);
    throw error;
  }
}
