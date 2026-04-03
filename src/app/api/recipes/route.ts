import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Esquema de validación para parámetros de consulta
const querySchema = z.object({
  limit: z.string().optional().transform(val => {
    const num = parseInt(val || '500');
    return isNaN(num) || num < 1 || num > 1000 ? 500 : num;
  }),
  offset: z.string().optional().transform(val => {
    const num = parseInt(val || '0');
    return isNaN(num) || num < 0 ? 0 : num;
  }),
  supermarket: z.string().optional().transform(val => {
    return val ? val.replace(/[<>"'%;()&+]/g, '').trim() : undefined;
  }),
  tag: z.string().optional().transform(val => {
    return val ? val.replace(/[<>"'%;()&+]/g, '').trim() : undefined;
  })
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const searchParams = request.nextUrl.searchParams;
    
    // Validar parámetros de consulta
    const validationResult = querySchema.safeParse({
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
      supermarket: searchParams.get('supermarket') || undefined,
      tag: searchParams.get('tag') || undefined
    });
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Parámetros inválidos', details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { limit, offset, supermarket, tag } = validationResult.data;
    
    let query = supabase
      .from('recipes')
      .select('*')
      .range(offset, offset + limit - 1);
    
    if (supermarket) {
      query = query.ilike('supermarket', `%${supermarket}%`);
    }
    
    if (tag) {
      query = query.contains('tags', [tag]);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching recipes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in recipes API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
