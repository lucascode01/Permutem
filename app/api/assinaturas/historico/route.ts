import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicialização do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: Request) {
  try {
    // Obter userId da URL
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'ID do usuário é obrigatório' 
      }, { status: 400 });
    }
    
    // Opções de paginação
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Consultar o histórico de pagamentos do usuário
    const { data: payments, error, count } = await supabase
      .from('pagamentos')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('data_vencimento', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Erro ao consultar histórico de pagamentos:', error);
      return NextResponse.json({ 
        error: 'Erro ao consultar histórico de pagamentos' 
      }, { status: 500 });
    }
    
    // Formatar os pagamentos para facilitar a exibição
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      assinaturaId: payment.assinatura_id,
      valor: payment.valor,
      status: payment.status,
      metodoPagamento: payment.metodo_pagamento,
      dataPagamento: payment.data_pagamento,
      dataVencimento: payment.data_vencimento,
      descricao: payment.descricao,
      asaasId: payment.asaas_id
    }));
    
    // Consultar a assinatura atual do usuário
    const { data: subscription } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('user_id', userId)
      .order('data_inicio', { ascending: false })
      .limit(1)
      .single();
    
    // Retornar os resultados
    return NextResponse.json({
      payments: formattedPayments,
      subscription: subscription ? {
        id: subscription.id,
        planoId: subscription.plano_id,
        status: subscription.status,
        valor: subscription.valor,
        dataInicio: subscription.data_inicio,
        proximoVencimento: subscription.proximo_vencimento,
        renovacaoAutomatica: subscription.renovacao_automatica
      } : null,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0
      }
    });
    
  } catch (error) {
    console.error('Erro ao processar solicitação de histórico:', error);
    return NextResponse.json({ 
      error: 'Erro ao processar solicitação' 
    }, { status: 500 });
  }
} 