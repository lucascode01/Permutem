import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Inicialização do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lvmiyeudjowgtglwmodz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bWl5ZXVkam93Z3RnbHdtb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDA4NTMsImV4cCI6MjA1ODc3Njg1M30.N0gPGMGXOi2SqGX6pWGWBex1sf_S4YzK2FpE2v2Mkq0';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Função para obter o cliente Supabase
const getSupabaseClient = () => {
  // Verificar se URL está disponível
  if (!supabaseUrl) {
    throw new Error('supabaseUrl is required.');
  }
  
  const cookieStore = cookies();
  const supabaseToken = cookieStore.get('sb-access-token')?.value;
  
  if (supabaseToken) {
    // Cliente autenticado com token do usuário
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${supabaseToken}` } }
    });
  } else {
    // Cliente com role de serviço (apenas para operações do servidor)
    return createClient(supabaseUrl, supabaseServiceKey);
  }
};

// GET - Obter imóvel específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Usar try/catch para capturar erros específicos
    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (error: any) {
      console.error('Erro ao criar cliente Supabase:', error);
      return NextResponse.json({ 
        error: 'Erro de configuração do Supabase: ' + error.message 
      }, { status: 500 });
    }
    
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID do imóvel não fornecido' }, { status: 400 });
    }
    
    // Obter o ID do usuário logado (se houver)
    const { data: { session } } = await supabase.auth.getSession();
    const usuarioLogado = session?.user?.id;
    
    // Buscar o imóvel
    const { data: imovel, error } = await supabase
      .from('imoveis')
      .select('*, usuarios(primeiro_nome, ultimo_nome, email, telefone, foto_perfil)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar imóvel:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar imóvel' },
        { status: 500 }
      );
    }
    
    if (!imovel) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se o imóvel está ativo ou pertence ao usuário logado
    const ehProprietario = usuarioLogado === imovel.user_id;
    
    if (imovel.status !== 'ativo' && !ehProprietario) {
      return NextResponse.json(
        { error: 'Imóvel não disponível' },
        { status: 403 }
      );
    }
    
    // Se não for o proprietário, incrementar contagem de visualizações
    if (!ehProprietario) {
      await supabase
        .from('imoveis')
        .update({ visualizacoes: (imovel.visualizacoes || 0) + 1 })
        .eq('id', id);
    }
    
    return NextResponse.json({ imovel, ehProprietario });
    
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um imóvel existente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient();
    const id = params.id;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID do imóvel não fornecido' }, { status: 400 });
    }
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Verificar se o imóvel existe e pertence ao usuário
    const { data: imovelExistente, error: errorBusca } = await supabase
      .from('imoveis')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (errorBusca) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }
    
    if (imovelExistente.user_id !== userId) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar este imóvel' },
        { status: 403 }
      );
    }
    
    // Preparar dados para atualização
    const dadosAtualizados = {
      ...body,
      atualizado_em: new Date().toISOString()
    };
    
    // Remover campos que não devem ser atualizados pelo cliente
    delete dadosAtualizados.id;
    delete dadosAtualizados.user_id;
    delete dadosAtualizados.criado_em;
    delete dadosAtualizados.visualizacoes;
    
    // Atualizar o imóvel
    const { data: imovelAtualizado, error } = await supabase
      .from('imoveis')
      .update(dadosAtualizados)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar imóvel:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar o imóvel' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      imovel: imovelAtualizado,
      message: 'Imóvel atualizado com sucesso'
    });
    
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Remover um imóvel
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient();
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID do imóvel não fornecido' }, { status: 400 });
    }
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Verificar se o imóvel existe e pertence ao usuário
    const { data: imovelExistente, error: errorBusca } = await supabase
      .from('imoveis')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (errorBusca) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }
    
    if (imovelExistente.user_id !== userId) {
      return NextResponse.json(
        { error: 'Você não tem permissão para excluir este imóvel' },
        { status: 403 }
      );
    }
    
    // Na verdade, vamos apenas marcar como inativo em vez de excluir
    const { error } = await supabase
      .from('imoveis')
      .update({ status: 'inativo', atualizado_em: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir imóvel:', error);
      return NextResponse.json(
        { error: 'Erro ao excluir o imóvel' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Imóvel excluído com sucesso'
    });
    
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 