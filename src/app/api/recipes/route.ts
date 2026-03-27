import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '500');
    const offset = parseInt(searchParams.get('offset') || '0');
    const supermarket = searchParams.get('supermarket');
    const tag = searchParams.get('tag');
    
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
