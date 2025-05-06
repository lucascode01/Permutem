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

// GET - Listar imóveis do usuário logado
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
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Parâmetros de filtro
    const status = searchParams.get('status');
    const tipo = searchParams.get('tipo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Calcular offset para paginação
    const offset = (page - 1) * limit;
    
    // Consulta base
    let query = supabase
      .from('imoveis')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);
    
    // Aplicar filtros
    if (status) {
      query = query.eq('status', status);
    }
    
    if (tipo) {
      query = query.eq('tipo', tipo);
    }
    
    // Aplicar paginação
    query = query.range(offset, offset + limit - 1);
    
    // Ordenar por data de criação (mais recentes primeiro)
    query = query.order('criado_em', { ascending: false });
    
    // Executar consulta
    const { data: imoveis, error, count } = await query;
    
    if (error) {
      console.error('Erro ao buscar imóveis do usuário:', error);
      return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 });
    }
    
    // Obter dados adicionais - número de propostas recebidas para cada imóvel
    const imoveisComDadosAdicionais = await Promise.all(
      imoveis.map(async (imovel) => {
        // Contar propostas recebidas para o imóvel
        const { count: propostasCount, error: propostasError } = await supabase
          .from('propostas')
          .select('*', { count: 'exact', head: true })
          .eq('imovel_destino_id', imovel.id);
          
        return {
          ...imovel,
          propostas_recebidas: propostasError ? 0 : propostasCount || 0
        };
      })
    );
    
    // Calcular estatísticas gerais
    const imoveisAtivos = imoveis.filter(i => i.status === 'ativo').length;
    const imoveisInativos = imoveis.filter(i => i.status === 'inativo').length;
    const imoveisVendidos = imoveis.filter(i => i.status === 'vendido').length;
    const imoveisPermutados = imoveis.filter(i => i.status === 'permutado').length;
    
    const totalVisualizacoes = imoveis.reduce((total, imovel) => total + (imovel.visualizacoes || 0), 0);
    
    // Retornar resultados com metadados
    return NextResponse.json({
      imoveis: imoveisComDadosAdicionais,
      estatisticas: {
        total: count || 0,
        ativos: imoveisAtivos,
        inativos: imoveisInativos,
        vendidos: imoveisVendidos,
        permutados: imoveisPermutados,
        totalVisualizacoes
      },
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0
      }
    });
    
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 