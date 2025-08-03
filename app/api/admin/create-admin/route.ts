import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  try {
    // Verificar autenticação (em produção, use uma chave secreta mais segura)
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.ADMIN_CREATE_SECRET || 'permutem-admin-secret';
    
    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { email, password, firstName, lastName, phone } = body;

    // Validar dados obrigatórios
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ 
        error: 'Email, senha, nome e sobrenome são obrigatórios' 
      }, { status: 400 });
    }

    // Criar cliente Supabase com chave de serviço
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        primeiro_nome: firstName,
        ultimo_nome: lastName,
        tipo_usuario: 'admin'
      }
    });

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError);
      return NextResponse.json({ 
        error: authError.message 
      }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'Erro ao criar usuário' 
      }, { status: 500 });
    }

    // 2. Criar perfil na tabela usuarios
    const { error: profileError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        email: email,
        primeiro_nome: firstName,
        ultimo_nome: lastName,
        tipo_usuario: 'admin',
        telefone: phone || null,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError);
      
      // Se der erro no perfil, deletar o usuário do Auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json({ 
        error: 'Erro ao criar perfil de admin' 
      }, { status: 500 });
    }

    // 3. Verificar se o admin foi criado corretamente
    const { data: adminData, error: checkError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (checkError || !adminData) {
      return NextResponse.json({ 
        error: 'Erro ao verificar admin criado' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin criado com sucesso',
      admin: {
        id: adminData.id,
        email: adminData.email,
        primeiro_nome: adminData.primeiro_nome,
        ultimo_nome: adminData.ultimo_nome,
        tipo_usuario: adminData.tipo_usuario,
        telefone: adminData.telefone
      }
    });

  } catch (error: any) {
    console.error('Erro ao criar admin:', error);
    return NextResponse.json({ 
      error: error.message || 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// GET para listar admins (apenas para verificação)
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.ADMIN_CREATE_SECRET || 'permutem-admin-secret';
    
    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: admins, error } = await supabase
      .from('usuarios')
      .select('id, email, primeiro_nome, ultimo_nome, tipo_usuario, criado_em')
      .eq('tipo_usuario', 'admin')
      .order('criado_em', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      admins: admins || []
    });

  } catch (error: any) {
    console.error('Erro ao listar admins:', error);
    return NextResponse.json({ 
      error: error.message || 'Erro interno do servidor' 
    }, { status: 500 });
  }
} 