import { describe, it, expect } from 'vitest';
import {
  calculateBMR,
  calculateTDEE,
  calculateDailyCalories,
  distributeMacros,
  getMacroPercentages,
} from '@/lib/nutrition/calculations';

describe('calculateBMR', () => {
  it('should calculate BMR for male (Mifflin-St Jeor)', () => {
    // Male, 80kg, 180cm, 30 years
    // Formula: 10 * 80 + 6.25 * 180 - 5 * 30 + 5 = 800 + 1125 - 150 + 5 = 1780
    const result = calculateBMR(80, 180, 30, 'male');
    expect(result).toBe(1780);
  });

  it('should calculate BMR for female (Mifflin-St Jeor)', () => {
    // Female, 60kg, 165cm, 25 years
    // Formula: 10 * 60 + 6.25 * 165 - 5 * 25 - 161 = 600 + 1031.25 - 125 - 161 = 1345
    const result = calculateBMR(60, 165, 25, 'female');
    expect(result).toBe(1345);
  });

  it('should return higher BMR for males vs females with same stats', () => {
    const maleBMR = calculateBMR(70, 170, 30, 'male');
    const femaleBMR = calculateBMR(70, 170, 30, 'female');
    expect(maleBMR).toBeGreaterThan(femaleBMR);
  });

  it('should decrease BMR with age', () => {
    const young = calculateBMR(70, 170, 20, 'male');
    const old = calculateBMR(70, 170, 50, 'male');
    expect(young).toBeGreaterThan(old);
  });

  it('should increase BMR with more weight', () => {
    const light = calculateBMR(50, 170, 30, 'male');
    const heavy = calculateBMR(100, 170, 30, 'male');
    expect(heavy).toBeGreaterThan(light);
  });

  it('should increase BMR with more height', () => {
    const short = calculateBMR(70, 150, 30, 'male');
    const tall = calculateBMR(70, 200, 30, 'male');
    expect(tall).toBeGreaterThan(short);
  });

  it('should return a rounded integer', () => {
    const result = calculateBMR(73.5, 177, 28, 'male');
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe('calculateTDEE', () => {
  const baseBMR = 1700;

  it('should apply sedentary multiplier (1.2)', () => {
    const result = calculateTDEE(baseBMR, 'sedentary');
    expect(result).toBe(Math.round(1700 * 1.2));
  });

  it('should apply lightly_active multiplier (1.375)', () => {
    const result = calculateTDEE(baseBMR, 'lightly_active');
    expect(result).toBe(Math.round(1700 * 1.375));
  });

  it('should apply moderately_active multiplier (1.55)', () => {
    const result = calculateTDEE(baseBMR, 'moderately_active');
    expect(result).toBe(Math.round(1700 * 1.55));
  });

  it('should apply very_active multiplier (1.725)', () => {
    const result = calculateTDEE(baseBMR, 'very_active');
    expect(result).toBe(Math.round(1700 * 1.725));
  });

  it('should apply extra_active multiplier (1.9)', () => {
    const result = calculateTDEE(baseBMR, 'extra_active');
    expect(result).toBe(Math.round(1700 * 1.9));
  });

  it('should increase with higher activity levels', () => {
    const sedentary = calculateTDEE(baseBMR, 'sedentary');
    const light = calculateTDEE(baseBMR, 'lightly_active');
    const moderate = calculateTDEE(baseBMR, 'moderately_active');
    const very = calculateTDEE(baseBMR, 'very_active');
    const extra = calculateTDEE(baseBMR, 'extra_active');
    expect(sedentary).toBeLessThan(light);
    expect(light).toBeLessThan(moderate);
    expect(moderate).toBeLessThan(very);
    expect(very).toBeLessThan(extra);
  });

  it('should return a rounded integer', () => {
    const result = calculateTDEE(1733, 'moderately_active');
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe('calculateDailyCalories', () => {
  const tdee = 2500;

  describe('weight loss goals', () => {
    it('slow loss should subtract 250', () => {
      expect(calculateDailyCalories(tdee, 'lose', 'slow')).toBe(2250);
    });

    it('medium loss should subtract 500', () => {
      expect(calculateDailyCalories(tdee, 'lose', 'medium')).toBe(2000);
    });

    it('fast loss should subtract 750', () => {
      expect(calculateDailyCalories(tdee, 'lose', 'fast')).toBe(1750);
    });
  });

  describe('maintenance goals', () => {
    it('should return TDEE unchanged for any speed', () => {
      expect(calculateDailyCalories(tdee, 'maintain', 'slow')).toBe(2500);
      expect(calculateDailyCalories(tdee, 'maintain', 'medium')).toBe(2500);
      expect(calculateDailyCalories(tdee, 'maintain', 'fast')).toBe(2500);
    });
  });

  describe('weight gain goals', () => {
    it('slow gain should add 250', () => {
      expect(calculateDailyCalories(tdee, 'gain', 'slow')).toBe(2750);
    });

    it('medium gain should add 500', () => {
      expect(calculateDailyCalories(tdee, 'gain', 'medium')).toBe(3000);
    });

    it('fast gain should add 750', () => {
      expect(calculateDailyCalories(tdee, 'gain', 'fast')).toBe(3250);
    });
  });

  describe('calorie bounds', () => {
    it('should enforce minimum 1200 calories', () => {
      const result = calculateDailyCalories(1300, 'lose', 'fast');
      expect(result).toBe(1200);
    });

    it('should enforce maximum 4000 calories', () => {
      const result = calculateDailyCalories(3800, 'gain', 'fast');
      expect(result).toBe(4000);
    });

    it('should not go below 1200 even with very low TDEE', () => {
      const result = calculateDailyCalories(1000, 'lose', 'fast');
      expect(result).toBeGreaterThanOrEqual(1200);
    });
  });
});

describe('distributeMacros', () => {
  it('should return protein, carbs, and fat in grams', () => {
    const result = distributeMacros(2000, 'maintain', 70);
    expect(result).toHaveProperty('protein_g');
    expect(result).toHaveProperty('carbs_g');
    expect(result).toHaveProperty('fat_g');
  });

  it('should return integer values', () => {
    const result = distributeMacros(2000, 'maintain', 70);
    expect(Number.isInteger(result.protein_g)).toBe(true);
    expect(Number.isInteger(result.carbs_g)).toBe(true);
    expect(Number.isInteger(result.fat_g)).toBe(true);
  });

  it('should use higher protein ratio for weight loss (2.0 g/kg)', () => {
    const result = distributeMacros(2000, 'lose', 80);
    // 2.0 * 80 = 160g protein
    expect(result.protein_g).toBe(160);
  });

  it('should use moderate protein ratio for maintenance (1.4 g/kg)', () => {
    const result = distributeMacros(2000, 'maintain', 80);
    // 1.4 * 80 = 112g protein
    expect(result.protein_g).toBe(112);
  });

  it('should use high protein ratio for muscle gain (1.8 g/kg)', () => {
    const result = distributeMacros(2500, 'gain', 80);
    // 1.8 * 80 = 144g protein
    expect(result.protein_g).toBe(144);
  });

  it('should allocate 0.9 g/kg for fat', () => {
    const result = distributeMacros(2000, 'maintain', 80);
    // 0.9 * 80 = 72g fat
    expect(result.fat_g).toBe(72);
  });

  it('should make carbs fill the remaining calories', () => {
    const result = distributeMacros(2000, 'maintain', 80);
    // protein: 112g * 4cal = 448cal
    // fat: 72g * 9cal = 648cal
    // remaining: 2000 - 448 - 648 = 904cal -> 226g carbs
    expect(result.carbs_g).toBe(226);
  });

  it('should default to 70kg when no weight provided', () => {
    const result = distributeMacros(2000, 'maintain');
    // 1.4 * 70 = 98g protein
    expect(result.protein_g).toBe(98);
  });

  it('should not return negative carb values', () => {
    // Very low calories + high weight = protein+fat could exceed total
    const result = distributeMacros(1200, 'lose', 120);
    expect(result.carbs_g).toBeGreaterThanOrEqual(0);
  });

  it('total macro calories should roughly match the target', () => {
    const target = 2200;
    const result = distributeMacros(target, 'maintain', 75);
    const totalCals = (result.protein_g * 4) + (result.carbs_g * 4) + (result.fat_g * 9);
    expect(Math.abs(totalCals - target)).toBeLessThanOrEqual(50);
  });
});

describe('getMacroPercentages', () => {
  it('should return percentages summing to ~100', () => {
    const result = getMacroPercentages(150, 200, 70);
    const total = result.protein_pct + result.carbs_pct + result.fat_pct;
    // Rounding can cause ±1-2%
    expect(total).toBeGreaterThanOrEqual(98);
    expect(total).toBeLessThanOrEqual(102);
  });

  it('should handle all zeros gracefully (equal split)', () => {
    const result = getMacroPercentages(0, 0, 0);
    expect(result.protein_pct).toBe(33);
    expect(result.carbs_pct).toBe(34);
    expect(result.fat_pct).toBe(33);
  });

  it('should return higher fat percentage for fat-heavy diet', () => {
    // 50g protein * 4 = 200cal, 100g carbs * 4 = 400cal, 150g fat * 9 = 1350cal
    const result = getMacroPercentages(50, 100, 150);
    expect(result.fat_pct).toBeGreaterThan(result.protein_pct);
    expect(result.fat_pct).toBeGreaterThan(result.carbs_pct);
  });

  it('should return rounded integers', () => {
    const result = getMacroPercentages(123, 456, 78);
    expect(Number.isInteger(result.protein_pct)).toBe(true);
    expect(Number.isInteger(result.carbs_pct)).toBe(true);
    expect(Number.isInteger(result.fat_pct)).toBe(true);
  });
});
