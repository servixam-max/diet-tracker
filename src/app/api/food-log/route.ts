import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Demo mode - return empty array
    if (!user) {
      return NextResponse.json([]);
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");

    let query = supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (date) {
      query = query.eq("date", date);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data || []);

  } catch (error) {
    console.error("Food log GET error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { meal_type, description, calories, protein_g, carbs_g, fat_g, date, image_url, source } = body;

    if (!meal_type || !description || !calories) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Demo mode - return success without saving
    if (!user) {
      return NextResponse.json({ 
        id: "demo-" + Date.now(),
        meal_type,
        description,
        calories,
        protein_g: protein_g || 0,
        carbs_g: carbs_g || 0,
        fat_g: fat_g || 0,
        date: date || new Date().toISOString().split("T")[0],
        image_url: image_url || "",
        source: source || "demo",
        created_at: new Date().toISOString()
      });
    }

    const { data, error } = await supabase
      .from("food_logs")
      .insert({
        user_id: user.id,
        meal_type,
        description,
        calories,
        protein_g: protein_g || null,
        carbs_g: carbs_g || null,
        fat_g: fat_g || null,
        date: date || new Date().toISOString().split("T")[0],
        image_url: image_url || null,
        source: source || "manual",
      })
      .select()
      .single();

    if (error) {
      console.error("Food log POST error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Food log POST exception:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    // Demo mode - return success
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from("food_logs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Food log DELETE error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
