// Shared types for AddFoodModal sub-components

export interface FoodResult {
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meal_type: string;
  confidence?: number;
}

export interface PresetMeal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: string;
  emoji: string;
  isFavorite?: boolean;
}

export const mealTypes = [
  { value: "breakfast", label: "Desayuno", emoji: "🌅", color: "from-orange-400 to-yellow-500" },
  { value: "lunch", label: "Almuerzo", emoji: "☀️", color: "from-green-400 to-emerald-500" },
  { value: "snack", label: "Merienda", emoji: "🍂", color: "from-purple-400 to-pink-500" },
  { value: "dinner", label: "Cena", emoji: "🌙", color: "from-blue-400 to-indigo-500" },
] as const;

export type TabType = "camera" | "manual" | "presets" | "barcode";
export type CameraFacing = "environment" | "user";
