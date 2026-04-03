import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { z } from 'zod';

// Esquema de validación para registro de usuario
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  age: z.number().int().min(13, 'Debes tener al menos 13 años').max(120).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).optional(),
  goal: z.enum(['lose', 'maintain', 'gain']).optional(),
  speed: z.enum(['slow', 'normal', 'fast']).optional(),
  dailyCalories: z.number().positive().optional(),
  preferredMeals: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional()
});

// WORKAROUND: Supabase Auth API está fallando, usamos service role directo
// Ver: https://supabase.com/docs/guides/auth/admin-users

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: "Datos inválidos", 
        details: validationResult.error.errors 
      }, { status: 400 });
    }
    
    const { email, password, name, age, gender, weight, height, activityLevel, goal, speed, dailyCalories, preferredMeals, restrictions } = validationResult.data;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!serviceKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY no configurada');
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 });
    }

    // Crear usuario con service role key (bypass email confirmation)
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, serviceKey);



    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        name: name || email.split("@")[0],
      }
    });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ 
        error: "Error al crear usuario: " + authError.message,
        details: authError 
      }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "No se pudo crear el usuario" }, { status: 400 });
    }

    // El trigger handle_new_user() crea el perfil automáticamente (id, email, name)
    // Esperar un momento para que el trigger se ejecute
    await new Promise(resolve => setTimeout(resolve, 500));

    // Actualizar perfil con datos adicionales (el trigger ya creó el básico)
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        age: age || null,
        gender: gender || null,
        weight_kg: weight || null,
        height_cm: height || null,
        activity_level: activityLevel || null,
        goal: goal || null,
        speed: speed || null,
        daily_calories: dailyCalories || null,
        preferred_meals: preferredMeals || 4,
        dietary_restrictions: restrictions || [],
      })
      .eq("id", authData.user.id);

    if (updateError) {
      console.error("Profile update failed:", updateError);
      // Rollback: eliminar usuario si falla la actualización
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ 
        error: "Error al actualizar perfil: " + updateError.message 
      }, { status: 400 });
    }

    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: name,
      },
      message: "Usuario creado exitosamente. Ahora puedes iniciar sesión.",
    });

  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ 
      error: "Error interno del servidor",
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Endpoint de registro - usar POST",
    note: "Workaround activo: usa admin.createUser con service role"
  });
}
