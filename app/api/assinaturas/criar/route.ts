import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicialização do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simulação do cliente Asaas - será substituído pela API real
const mockAsaasAPI = {
  createSubscription: async (data: any) => {
    // Simulação de uma resposta da API
    return {
      id: `sub_${Date.now()}`,
      customer: data.customer,
      value: data.value,
      nextDueDate: data.nextDueDate,
      cycle: data.cycle,
      status: 'ACTIVE',
      billingType: data.billingType,
      description: data.description
    };
  },
  createCustomer: async (data: any) => {
    // Simulação de uma resposta da API
    return {
      id: `cus_${Date.now()}`,
      name: data.name,
      email: data.email,
      cpfCnpj: data.cpfCnpj,
      mobilePhone: data.mobilePhone,
      postalCode: data.postalCode
    };
  }
};

export async function POST(req: Request) {
  try {
    // Extrair dados do corpo da requisição
    const body = await req.json();
    const {
      usuarioId,
      planoId,
      precoTotal,
      periodoCobranca,
      nomeUsuario,
      emailUsuario,
      cpfCnpj,
      telefone,
      enderecoCompleto,
      tipoPlano
    } = body;

    // Verificar dados obrigatórios
    if (!usuarioId || !planoId || !precoTotal || !nomeUsuario || !emailUsuario) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Dados incompletos para criação da assinatura' 
        }, 
        { status: 400 }
      );
    }

    // Converter período de cobrança para o formato do Asaas
    const ciclo = periodoCobranca === 'mensal' ? 'MONTHLY' : 'YEARLY';

    // 1. Criar ou verificar o cliente no Asaas
    const customerData = {
      name: nomeUsuario,
      email: emailUsuario,
      cpfCnpj: cpfCnpj || '00000000000', // Campo obrigatório, usando valor padrão se não fornecido
      mobilePhone: telefone,
      postalCode: enderecoCompleto?.cep,
      address: enderecoCompleto?.logradouro,
      addressNumber: enderecoCompleto?.numero,
      complement: enderecoCompleto?.complemento,
      province: enderecoCompleto?.bairro,
      city: enderecoCompleto?.cidade,
      state: enderecoCompleto?.uf
    };

    // Chamada para API do Asaas (simulada por enquanto)
    const customerResponse = await mockAsaasAPI.createCustomer(customerData);
    const customerAsaasId = customerResponse.id;

    // 2. Criar a assinatura no Asaas
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 1); // Cobrança para o dia seguinte

    const asaasSubscriptionData = {
      customer: customerAsaasId,
      billingType: 'CREDIT_CARD', // ou outros tipos: BOLETO, PIX
      value: precoTotal,
      nextDueDate: nextDueDate.toISOString().split('T')[0],
      cycle: ciclo,
      description: `Assinatura Plano ${planoId} - Permutem`
    };

    const subscriptionResponse = await mockAsaasAPI.createSubscription(asaasSubscriptionData);

    // 3. Salvar a assinatura no Supabase
    const { data: supabaseData, error: subscriptionError } = await supabase
      .from('assinaturas')
      .insert([
        {
          user_id: usuarioId,
          plano_id: planoId,
          asaas_id: subscriptionResponse.id,
          asaas_customer_id: customerAsaasId,
          valor: precoTotal,
          status: 'active',
          periodo_cobranca: periodoCobranca,
          proximo_vencimento: nextDueDate.toISOString(),
          data_inicio: new Date().toISOString(),
          renovacao_automatica: true
        }
      ])
      .select();

    if (subscriptionError) {
      console.error('Erro ao salvar assinatura no Supabase:', subscriptionError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Erro ao salvar os dados da assinatura' 
        }, 
        { status: 500 }
      );
    }

    // 4. Retornar resposta de sucesso com URL para checkout
    return NextResponse.json({
      success: true,
      asaasSubscriptionId: subscriptionResponse.id,
      checkoutUrl: `/checkout-success?session_id=${subscriptionResponse.id}`
    });

  } catch (error) {
    console.error('Erro ao processar assinatura:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao processar assinatura'
      },
      { status: 500 }
    );
  }
} 