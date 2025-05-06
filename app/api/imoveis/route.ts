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

// GET - Listar imóveis com filtros
export async function GET(request: NextRequest) {
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
    
    const { searchParams } = new URL(request.url);
    
    // Obtém a sessão do usuário
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // Parâmetros de filtro
    const tipo = searchParams.get('tipo');
    const status = searchParams.get('status');
    const somenteUsuario = searchParams.get('somente_usuario') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Calcula offset para paginação
    const offset = (page - 1) * limit;
    
    // Consulta base
    let query = supabase
      .from('imoveis')
      .select('*', { count: 'exact' });
    
    // Aplicar filtros
    if (somenteUsuario && userId) {
      query = query.eq('user_id', userId);
    } else {
      // Se não for filtrado por usuário, mostrar apenas imóveis ativos
      query = query.eq('status', 'ativo');
    }
    
    if (tipo) {
      query = query.eq('tipo', tipo);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Aplicar paginação
    query = query.range(offset, offset + limit - 1);
    
    // Ordenar por data de criação (mais recentes primeiro)
    query = query.order('criado_em', { ascending: false });
    
    // Executar consulta
    const { data: imoveis, error, count } = await query;
    
    if (error) {
      console.error('Erro ao buscar imóveis:', error);
      return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 });
    }
    
    // Retornar resultados com metadados de paginação
    return NextResponse.json({
      imoveis,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0
      }
    });
    
  } catch (error: any) {
    console.error('Erro ao processar requisição GET imoveis:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo imóvel
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Validar dados mínimos necessários
    const { titulo, descricao, tipo, finalidade, preco, area, endereco } = body;
    
    if (!titulo || !descricao || !tipo || !finalidade || !preco || !area || !endereco) {
      return NextResponse.json(
        { error: 'Dados incompletos. Verifique os campos obrigatórios.' },
        { status: 400 }
      );
    }
    
    // Verificar número de anúncios permitidos pelo plano do usuário
    const { data: assinatura } = await supabase
      .from('assinaturas')
      .select('*, planos(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('criado_em', { ascending: false })
      .limit(1)
      .single();
    
    // Contar quantos imóveis ativos o usuário já tem
    const { count: imoveisAtivos } = await supabase
      .from('imoveis')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'ativo');
    
    // Verificar se o usuário pode criar mais anúncios
    const maxAnuncios = assinatura?.planos?.max_anuncios || 1; // Default: 1 anúncio no plano gratuito
    
    if (imoveisAtivos && imoveisAtivos >= maxAnuncios) {
      return NextResponse.json(
        { 
          error: 'Limite de anúncios atingido para seu plano atual',
          limiteAtingido: true,
          maximoPermitido: maxAnuncios
        },
        { status: 403 }
      );
    }
    
    // Preparar dados para inserção
    const novoImovel = {
      ...body,
      user_id: userId,
      status: 'ativo',
      visualizacoes: 0,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };
    
    // Inserir no banco de dados
    const { data: imovelCriado, error } = await supabase
      .from('imoveis')
      .insert([novoImovel])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar imóvel:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar o imóvel' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      imovel: imovelCriado,
      message: 'Imóvel criado com sucesso'
    });
    
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 