import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicialização do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapeamento de status do Asaas para nosso sistema
const statusMappings = {
  PAYMENT_CREATED: 'created',
  PAYMENT_RECEIVED: 'paid',
  PAYMENT_CONFIRMED: 'paid',
  PAYMENT_OVERDUE: 'overdue',
  PAYMENT_REFUNDED: 'refunded',
  PAYMENT_DELETED: 'canceled',
  PAYMENT_UPDATED: 'updated',
  PAYMENT_ANTICIPATED: 'paid',
  SUBSCRIPTION_CREATED: 'active',
  SUBSCRIPTION_UPDATED: 'updated',
  SUBSCRIPTION_CANCELED: 'canceled',
  SUBSCRIPTION_EXPIRED: 'expired',
};

export async function POST(req: Request) {
  try {
    // Verificar se temos a chave secreta para validar o webhook
    const asaasWebhookKey = process.env.ASAAS_WEBHOOK_KEY;
    if (asaasWebhookKey) {
      // Verificar o cabeçalho de assinatura do Asaas
      // Na implementação real, verificar a assinatura do webhook
      const asaasSignature = req.headers.get('asaas-signature');
      if (!asaasSignature) {
        console.error('Assinatura do webhook ausente');
        return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
      }
      
      // Verificar a assinatura (implementação simplificada)
      // Em produção, seria necessário verificar corretamente com HMAC
    }
    
    // Extrair o corpo da requisição
    const evento = await req.json();
    
    // Registrar o evento recebido para depuração
    console.log('Webhook Asaas recebido:', evento);
    
    // Processar com base no tipo de evento
    const eventType = evento.event;
    
    // Se o evento for relacionado a pagamento
    if (eventType.startsWith('PAYMENT_')) {
      await processPaymentEvent(eventType, evento.payment);
    } 
    // Se o evento for relacionado a assinatura
    else if (eventType.startsWith('SUBSCRIPTION_')) {
      await processSubscriptionEvent(eventType, evento.subscription);
    }
    
    // Retornar sucesso
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Erro ao processar webhook do Asaas:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

// Função para processar eventos de pagamento
async function processPaymentEvent(eventType: string, payment: any) {
  try {
    // Mapear status do Asaas para nosso sistema
    const mappedStatus = statusMappings[eventType as keyof typeof statusMappings] || 'unknown';
    
    // Buscar a assinatura correspondente pelo ID externo
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('assinaturas')
      .select('id, user_id')
      .eq('asaas_id', payment.subscription)
      .single();
    
    if (subscriptionError || !subscriptionData) {
      console.error('Assinatura não encontrada:', payment.subscription);
      return;
    }
    
    // Verificar se o pagamento já existe no sistema
    const { data: existingPayment } = await supabase
      .from('pagamentos')
      .select('id')
      .eq('asaas_id', payment.id)
      .single();
    
    // Se o pagamento já existe, atualizar seu status
    if (existingPayment) {
      await supabase
        .from('pagamentos')
        .update({
          status: mappedStatus,
          atualizado_em: new Date().toISOString()
        })
        .eq('asaas_id', payment.id);
    } 
    // Se o pagamento não existe, criar um novo registro
    else {
      await supabase
        .from('pagamentos')
        .insert([
          {
            assinatura_id: subscriptionData.id,
            user_id: subscriptionData.user_id,
            asaas_id: payment.id,
            valor: payment.value,
            status: mappedStatus,
            metodo_pagamento: payment.billingType.toLowerCase(),
            data_pagamento: payment.paymentDate || null,
            data_vencimento: payment.dueDate,
            descricao: payment.description,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          }
        ]);
    }
    
    // Se o pagamento foi confirmado, atualizar a data de próximo vencimento na assinatura
    if (eventType === 'PAYMENT_RECEIVED' || eventType === 'PAYMENT_CONFIRMED') {
      await supabase
        .from('assinaturas')
        .update({
          status: 'active',
          ultimo_pagamento: payment.paymentDate || new Date().toISOString()
        })
        .eq('id', subscriptionData.id);
    }
    
  } catch (error) {
    console.error('Erro ao processar evento de pagamento:', error);
    throw error;
  }
}

// Função para processar eventos de assinatura
async function processSubscriptionEvent(eventType: string, subscription: any) {
  try {
    // Mapear status do Asaas para nosso sistema
    const mappedStatus = statusMappings[eventType as keyof typeof statusMappings] || 'unknown';
    
    // Buscar a assinatura pelo ID externo
    const { data: subscriptionData } = await supabase
      .from('assinaturas')
      .select('id')
      .eq('asaas_id', subscription.id)
      .single();
    
    // Se a assinatura existir, atualizar seu status
    if (subscriptionData) {
      await supabase
        .from('assinaturas')
        .update({
          status: mappedStatus,
          renovacao_automatica: subscription.autoRenew,
          valor: subscription.value,
          proximo_vencimento: subscription.nextDueDate,
          atualizado_em: new Date().toISOString()
        })
        .eq('asaas_id', subscription.id);
    } 
    // Se a assinatura não existir (raro, mas possível em alguns cenários)
    else {
      console.error('Assinatura não encontrada no sistema:', subscription.id);
      // Aqui poderia ter lógica para criar a assinatura ou notificar um administrador
    }
    
  } catch (error) {
    console.error('Erro ao processar evento de assinatura:', error);
    throw error;
  }
} 