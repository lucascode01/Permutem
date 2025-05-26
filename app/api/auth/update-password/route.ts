import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const requestData = await request.json();
    
    const { password } = requestData;
    
    if (!password) {
      return NextResponse.json(
        { error: 'Nova senha é obrigatória' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase.auth.updateUser({
      password
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Senha atualizada com sucesso.'
    });
    
  } catch (error: any) {
    console.error('Erro na atualização de senha:', error);
    
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
} 