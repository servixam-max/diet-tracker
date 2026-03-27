import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Demo mode - return default profile
    if (!user) {
      return NextResponse.json({
        name: "Usuario Demo",
        daily_calories: 2000,
        macros: { protein: 150, carbs: 200, fat: 65 },
        demo: true
      });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    return NextResponse.json(data || {});

  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...body,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
