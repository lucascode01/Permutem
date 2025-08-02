import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const requestData = await request.json();
    
    const { email, password, primeiro_nome, ultimo_nome, tipo_usuario } = requestData;
    
    console.log('Recebido requisição de registro:', { email, primeiro_nome, ultimo_nome, tipo_usuario });
    
    // Verificar se todos os campos obrigatórios foram fornecidos
    if (!email || !password || !primeiro_nome || !ultimo_nome || !tipo_usuario) {
      console.log('Campos obrigatórios faltando');
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Cadastrar no auth do Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          primeiro_nome,
          ultimo_nome,
          tipo_usuario
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/dashboard`
      }
    });
    
    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }
    
    // Verificar se o usuário foi criado
    if (!authData.user) {
      console.error('Usuário não foi criado no Auth');
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      );
    }
    
    console.log('Usuário criado com sucesso no Auth:', authData.user.id);
    
    // Criar perfil do usuário na tabela 'usuarios'
    const { error: profileError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        email,
        primeiro_nome,
        ultimo_nome,
        tipo_usuario,
      });
      
    if (profileError) {
      console.error('Erro ao criar perfil do usuário:', profileError);
      
      // Tente deletar o usuário do Auth se falhar ao criar o perfil
      try {
        const adminClient = createClient(
          supabaseUrl,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        
        await adminClient.auth.admin.deleteUser(authData.user.id);
        console.log('Usuário removido do Auth após falha ao criar perfil');
      } catch (deleteError) {
        console.error('Erro ao tentar remover usuário do Auth:', deleteError);
      }
      
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }
    
    console.log('Perfil do usuário criado com sucesso');
    
    // Fazer login automático após o cadastro bem-sucedido
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (signInError) {
      console.error('Erro ao fazer login automático após cadastro:', signInError);
    } else {
      console.log('Login automático realizado com sucesso');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Usuário cadastrado com sucesso! Redirecionando para o sistema.',
      userId: authData.user.id
    });
    
  } catch (error: any) {
    console.error('Erro inesperado no registro de usuário:', error);
    
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
} 