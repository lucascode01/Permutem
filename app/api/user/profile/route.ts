import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from '@/app/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const requestData = await request.json();
    
    // Validar dados obrigatórios
    if (!requestData.primeiro_nome || !requestData.ultimo_nome || !requestData.email) {
      return NextResponse.json(
        { error: 'Nome, sobrenome e email são obrigatórios' },
        { status: 400 }
      );
    }

    // Atualizar perfil do usuário
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({
        primeiro_nome: requestData.primeiro_nome,
        ultimo_nome: requestData.ultimo_nome,
        email: requestData.email,
        telefone: requestData.telefone || null,
        cpf_cnpj: requestData.cpf_cnpj || null,
        data_nascimento: requestData.data_nascimento || null,
        foto_perfil: requestData.foto_perfil || null,
        endereco: requestData.endereco || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError);
      return NextResponse.json(
        { error: 'Erro ao atualizar perfil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil atualizado com sucesso'
    });

  } catch (error: any) {
    console.error('Erro inesperado ao atualizar perfil:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar perfil do usuário
    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
      return NextResponse.json(
        { error: 'Erro ao buscar perfil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: userProfile
    });

  } catch (error: any) {
    console.error('Erro inesperado ao buscar perfil:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 