// Nutrition calculation functions
// Based on established sports nutrition guidelines

export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active";
export type Goal = "lose" | "maintain" | "gain";
export type Speed = "slow" | "medium" | "fast";

// Calculate Basal Metabolic Rate (Mifflin-St Jeor Equation)
export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  if (gender === "male") {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
}

// Calculate Total Daily Energy Expenditure (TDEE)
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  // Activity multipliers (standard accepted values)
  const factors: Record<ActivityLevel, number> = {
    sedentary: 1.2,        // Little or no exercise
    lightly_active: 1.375, // Light exercise 1-3 days/week
    moderately_active: 1.55, // Moderate exercise 3-5 days/week
    very_active: 1.725,    // Hard exercise 6-7 days/week
    extra_active: 1.9,     // Very hard exercise / physical job
  };
  return Math.round(bmr * factors[activityLevel]);
}

// Calculate daily calorie target based on goal
// Weight loss: 500g/week = ~500 cal deficit/day = 3500/week
// Weight gain: 500g/week = ~500 cal surplus/day
export function calculateDailyCalories(tdee: number, goal: Goal, speed: Speed): number {
  // Calorie deficit/surplus per day for each speed
  const calorieAdjustments: Record<Goal, Record<Speed, number>> = {
    lose: { 
      slow: -250,   // ~0.25kg/week loss
      medium: -500, // ~0.5kg/week loss  
      fast: -750    // ~0.75kg/week loss
    },
    maintain: { 
      slow: 0,
      medium: 0,
      fast: 0 
    },
    gain: { 
      slow: 250,    // ~0.25kg/week gain
      medium: 500,  // ~0.5kg/week gain
      fast: 750     // ~0.75kg/week gain
    },
  };
  
  const adjustment = calorieAdjustments[goal][speed];
  const targetCalories = tdee + adjustment;
  
  // Ensure minimum calories for basic bodily functions
  const minCalories = 1200;
  const maxCalories = 4000;
  
  return Math.max(minCalories, Math.min(maxCalories, Math.round(targetCalories)));
}

// Distribute macros based on goal and body weight
// Protein and fat needs are based on body weight, not calorie percentage
export function distributeMacros(calories: number, goal: Goal, weightKg?: number): { 
  protein_g: number; 
  carbs_g: number; 
  fat_g: number 
} {
  if (!weightKg) {
    weightKg = 70; // Default fallback
  }

  // Protein: 1.6-2.2g per kg for weight loss/muscle gain, 1.2-1.6g for maintenance
  const proteinPerKg: Record<Goal, number> = {
    lose: 2.0,      // Higher protein during deficit to preserve muscle
    maintain: 1.4,  // Moderate protein for maintenance
    gain: 1.8,      // High protein for muscle building
  };
  
  // Fat: 0.8-1g per kg body weight for hormonal health
  const fatPerKg = 0.9;
  
  // Calculate protein and fat in grams
  const protein_g = Math.round(weightKg * proteinPerKg[goal]);
  const fat_g = Math.round(weightKg * fatPerKg);
  
  // Calculate calories from protein and fat
  const proteinCalories = protein_g * 4;  // 4 cal per gram of protein
  const fatCalories = fat_g * 9;          // 9 cal per gram of fat
  
  // Remaining calories for carbs
  const carbsCalories = Math.max(0, calories - proteinCalories - fatCalories);
  const carbs_g = Math.round(carbsCalories / 4); // 4 cal per gram of carbs
  
  // Verify total adds up
  const totalCalories = (protein_g * 4) + (carbs_g * 4) + (fat_g * 9);
  
  // If there's a mismatch > 50 calories, adjust carbs
  if (Math.abs(totalCalories - calories) > 50) {
    const adjustedCarbsCalories = calories - (protein_g * 4) - (fat_g * 9);
    return {
      protein_g,
      carbs_g: Math.max(0, Math.round(adjustedCarbsCalories / 4)),
      fat_g,
    };
  }
  
  return {
    protein_g,
    carbs_g,
    fat_g,
  };
}

// Calculate macronutrient percentages (for display purposes)
export function getMacroPercentages(protein_g: number, carbs_g: number, fat_g: number): {
  protein_pct: number;
  carbs_pct: number;
  fat_pct: number;
} {
  const proteinCal = protein_g * 4;
  const carbsCal = carbs_g * 4;
  const fatCal = fat_g * 9;
  const total = proteinCal + carbsCal + fatCal;
  
  if (total === 0) {
    return { protein_pct: 33, carbs_pct: 34, fat_pct: 33 };
  }
  
  return {
    protein_pct: Math.round((proteinCal / total) * 100),
    carbs_pct: Math.round((carbsCal / total) * 100),
    fat_pct: Math.round((fatCal / total) * 100),
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
  gain: "Ganar músculo",
};

// Speed labels with weekly weight change targets
export const speedLabels: Record<Speed, string> = {
  slow: "Suave (~0.25kg/semana)",
  medium: "Normal (~0.5kg/semana)",
  fast: "Intenso (~0.75kg/semana)",
};

// Get goal description
export const goalDescriptions: Record<Goal, string> = {
  lose: "Perder grasa de forma saludable",
  maintain: "Mantener mi peso actual",
  gain: "Ganar músculo y fuerza",
};

// Activity descriptions
export const activityDescriptions: Record<ActivityLevel, string> = {
  sedentary: "Poco o ningún ejercicio",
  lightly_active: "Ejercicio ligero 1-3 días/semana",
  moderately_active: "Ejercicio moderado 3-5 días/semana",
  very_active: "Ejercicio intenso 6-7 días/semana",
  extra_active: "Atleta o trabajo físico muy duro",
};
