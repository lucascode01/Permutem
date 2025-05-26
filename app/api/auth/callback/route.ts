import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from '@/app/lib/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  
  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Troca o código por uma sessão
    await supabase.auth.exchangeCodeForSession(code);
    
    // Redireciona para a página adequada
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }
  
  // Se não houver código, redireciona para a home
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 