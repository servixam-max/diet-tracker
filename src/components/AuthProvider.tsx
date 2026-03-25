"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

interface User {
  id: string;
  email: string;
  name?: string;
  age?: number;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
  goal?: string;
  speed?: string;
  daily_calories?: number;
  preferred_meals?: number;
  dietary_restrictions?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: RegisterData) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  activityLevel?: string;
  goal?: string;
  speed?: string;
  dailyCalories?: number;
  preferredMeals?: number;
  restrictions?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function refreshUser() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setUser(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      setUser({
        id: authUser.id,
        email: authUser.email || "",
        ...profile,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Check for demo mode
    const isDemo = localStorage.getItem('demo-mode') === 'true';
    if (isDemo) {
      const demoUser = localStorage.getItem('demo-user');
      if (demoUser) {
        setUser(JSON.parse(demoUser));
        setLoading(false);
        return;
      }
    }
    
    refreshUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        refreshUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<{ error?: string }> {
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { error: authError.message };
      }

      await refreshUser();
      return {};
    } catch (error) {
      return { error: "Error al iniciar sesión" };
    }
  }

  async function register(data: RegisterData): Promise<{ error?: string }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name },
        },
      });

      if (authError) {
        return { error: authError.message };
      }

      // Create profile in public.profiles
      if (authData?.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: data.email,
          name: data.name || data.email.split("@")[0],
          age: data.age || null,
          gender: data.gender || null,
          weight_kg: data.weight || null,
          height_cm: data.height || null,
          activity_level: data.activityLevel || null,
          goal: data.goal || null,
          speed: data.speed || null,
          daily_calories: data.dailyCalories || null,
          preferred_meals: data.preferredMeals || 4,
          dietary_restrictions: data.restrictions || [],
        });

        if (profileError) {
          return { error: "Error al crear perfil: " + profileError.message };
        }
      }

      // Refresh will be called by onAuthStateChange
      return {};
    } catch (error) {
      return { error: "Error al registrar" };
    }
  }

  async function logout() {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      // Silent fail on logout
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
