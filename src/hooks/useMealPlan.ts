"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface MealPlan {
  date: string;
  dayName: string;
  meals: Array<{
    meal_type: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    emoji?: string;
    ingredients?: string[];
  }>;
  totalCalories: number;
}

interface UseMealPlanOptions {
  userId: string;
  weekStart?: string;
}

export function useMealPlan({ userId, weekStart }: UseMealPlanOptions) {
  const [plan, setPlan] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetCalories, setTargetCalories] = useState<number>(2000);

  const fetchPlan = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const url = weekStart 
        ? `/api/generate-plan?weekStart=${encodeURIComponent(weekStart)}`
        : '/api/generate-plan';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error fetching meal plan");
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setPlan(data.plan || []);
      setTargetCalories(data.targetCalories || 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading meal plan");
    } finally {
      setLoading(false);
    }
  }, [userId, weekStart]);

  const createPlan = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error("Error creating meal plan");
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setPlan(data.plan || []);
      setTargetCalories(data.targetCalories || 2000);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating meal plan");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return {
    plan,
    loading,
    error,
    targetCalories,
    fetchPlan,
    createPlan,
  };
}
