import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodImage } from "@/lib/ollama";

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const result = await analyzeFoodImage(image);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Food analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed", name: "Plato detectado", calories: 300, protein_g: 20, carbs_g: 30, fat_g: 15, ingredients: [], allergens: [] },
      { status: 500 }
    );
  }
}
