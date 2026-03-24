import { SUPERMARKET_PRODUCTS } from "@/data/recipes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supermarket = searchParams.get("supermarket");
  const search = searchParams.get("search");

  let products = [...SUPERMARKET_PRODUCTS];

  if (supermarket) {
    products = products.filter(p => p.supermarket === supermarket);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower)
    );
  }

  return NextResponse.json({ products, total: products.length });
}
