// Nutrition calculation functions

export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active";
export type Goal = "lose" | "maintain" | "gain";
export type Speed = "slow" | "medium" | "fast";

// Calculate Basal Metabolic Rate (Mifflin-St Jeor)
export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  if (gender === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

// Calculate Total Daily Energy Expenditure
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const factors: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  return Math.round(bmr * factors[activityLevel]);
}

// Calculate daily calories based on goal
export function calculateDailyCalories(tdee: number, goal: Goal, speed: Speed): number {
  const adjustments: Record<Goal, Record<Speed, number>> = {
    lose: { slow: 0.10, medium: 0.15, fast: 0.25 },
    maintain: { slow: 0, medium: 0, fast: 0 },
    gain: { slow: 0.10, medium: 0.15, fast: 0.20 },
  };
  const adjustment = adjustments[goal][speed];
  return Math.round(tdee * (1 - adjustment));
}

// Distribute macros based on goal
export function distributeMacros(calories: number, goal: Goal): { protein_g: number; carbs_g: number; fat_g: number } {
  const ratios: Record<Goal, { protein: number; carbs: number; fat: number }> = {
    lose: { protein: 0.40, carbs: 0.30, fat: 0.30 },
    maintain: { protein: 0.30, carbs: 0.40, fat: 0.30 },
    gain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
  };
  const ratio = ratios[goal];
  return {
    protein_g: Math.round((calories * ratio.protein) / 4),
    carbs_g: Math.round((calories * ratio.carbs) / 4),
    fat_g: Math.round((calories * ratio.fat) / 9),
  };
}

// Activity level labels in Spanish
export const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentario",
  lightly_active: "Ligeramente activo",
  moderately_active: "Moderadamente activo",
  very_active: "Muy activo",
  extra_active: "Extremadamente activo",
};

// Goal labels in Spanish
export const goalLabels: Record<Goal, string> = {
  lose: "Perder peso",
  maintain: "Mantener peso",
  gain: "Ganar peso",
};

// Speed labels in Spanish
export const speedLabels: Record<Speed, string> = {
  slow: "Lento (0.5kg/semana)",
  medium: "Medio (1kg/semana)",
  fast: "Rápido (1.5kg/semana)",
};
