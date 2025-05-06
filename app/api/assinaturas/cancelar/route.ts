import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicialização do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simulação do cliente Asaas - será substituído pela API real
const mockAsaasAPI = {
  cancelSubscription: async (subscriptionId: string) => {
    // Simulação de resposta
    return {
      id: subscriptionId,
      status: 'INACTIVE',
      deleted: true
    };
  }
};

export async function POST(req: Request) {
  try {
    // Extrair dados do corpo da requisição
    const body = await req.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        message: 'ID do usuário é obrigatório' 
      }, { status: 400 });
    }
    
    // Buscar a assinatura atual do usuário
    const { data: subscription, error: subscriptionError } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('data_inicio', { ascending: false })
      .limit(1)
      .single();
    
    if (subscriptionError || !subscription) {
      return NextResponse.json({ 
        success: false,
        message: 'Assinatura ativa não encontrada' 
      }, { status: 404 });
    }
    
    // Cancelar a assinatura no Asaas
    try {
      // Chamada para API do Asaas (simulada)
      await mockAsaasAPI.cancelSubscription(subscription.asaas_id);
      
      // Atualizar o status no Supabase
      const { error: updateError } = await supabase
        .from('assinaturas')
        .update({
          status: 'canceled',
          renovacao_automatica: false,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', subscription.id);
      
      if (updateError) {
        throw new Error('Erro ao atualizar status da assinatura no banco de dados');
      }
      
      // Retornar sucesso
      return NextResponse.json({
        success: true,
        message: 'Assinatura cancelada com sucesso. Você terá acesso ao plano até o final do período atual.'
      });
      
    } catch (cancelError) {
      console.error('Erro ao cancelar assinatura no Asaas:', cancelError);
      return NextResponse.json({ 
        success: false,
        message: 'Erro ao cancelar assinatura' 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Erro ao processar cancelamento de assinatura:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Erro ao processar solicitação'
    }, { status: 500 });
  }
} 