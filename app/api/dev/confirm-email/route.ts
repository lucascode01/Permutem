import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from '@/app/lib/supabase';

export async function POST(req: NextRequest) {
  // Verificar se estamos em ambiente de desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Esta API só está disponível em ambiente de desenvolvimento' },
      { status: 403 }
    );
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Buscar usuários (usando listUsers pois getUserByEmail não existe)
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      return NextResponse.json(
        { error: `Erro ao listar usuários: ${usersError.message}` },
        { status: 500 }
      );
    }
    
    // Encontrar usuário com o email desejado
    const user = usersData?.users?.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se o email já está confirmado
    if (user.email_confirmed_at) {
      return NextResponse.json(
        { message: 'Email já está confirmado' },
        { status: 200 }
      );
    }
    
    // Atualizar usuário para confirmar email
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );
    
    if (updateError) {
      return NextResponse.json(
        { error: `Erro ao confirmar email: ${updateError.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: `Email ${email} confirmado com sucesso!` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao confirmar email:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
} 