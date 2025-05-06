// Este arquivo integra com a API do Asaas para gerenciamento de assinaturas
// Implementação preparada para a API do Asaas

import { toast } from 'react-hot-toast';

// Tipos para o serviço de pagamento Asaas
export interface CheckoutOptions {
  planoId: string;
  usuarioId: string;
  precoTotal: number;
  tipoPlano: 'proprietario' | 'corretor';
  periodoCobranca: 'mensal' | 'anual';
  nomeUsuario: string;
  emailUsuario: string;
  isUpgrade?: boolean;
  previousPlanId?: string;
  // Dados adicionais necessários para o Asaas
  cpfCnpj?: string;
  telefone?: string;
  enderecoCompleto?: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  planoId: string;
  expiracao: string;
  startDate: string;
  autoRenew: boolean;
  asaasId?: string; // ID da assinatura no Asaas
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  status: 'paid' | 'refunded' | 'failed';
  paymentMethod: 'card' | 'pix' | 'boleto' | 'transfer';
  date: string;
  description: string;
  asaasId?: string; // ID do pagamento no Asaas
}

// Armazenar dados mockados para simular o banco de dados (temporário até integração com Supabase)
const mockSubscriptions = new Map<string, Subscription>();
const mockPayments = new Map<string, Payment[]>();

// Definir preços dos planos
const planPrices = {
  'basic': 29.90,
  'premium': 49.90,
  'professional': 79.90
};

// Função para criar uma sessão de checkout com o Asaas
export async function createCheckoutSession(options: CheckoutOptions): Promise<{ success: boolean; url?: string; error?: string }> {
  // Esta função será atualizada para integrar com a API do Asaas quando disponível
  // Por enquanto, mantemos a simulação para desenvolvimento
  
  try {
    // Simulação de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulação de sucesso (90% para demonstrar tratamento de erros)
    const randomSuccess = Math.random() > 0.1;
    
    if (randomSuccess) {
      // URL simulada - será substituída pela URL do Asaas quando a API estiver disponível
      const checkoutUrl = `/checkout-success?session_id=asaas_${Date.now()}_${options.planoId}`;
      
      // Criar uma assinatura simulada após o pagamento bem-sucedido
      const subscriptionId = `sub_${Date.now()}`;
      const now = new Date();
      const expiration = new Date(now);
      expiration.setDate(expiration.getDate() + (options.periodoCobranca === 'mensal' ? 30 : 365));
      
      // Se for um upgrade, calcular o valor pro-rata
      let finalAmount = options.precoTotal;
      if (options.isUpgrade && options.previousPlanId) {
        // Simulação de preço pro-rata 
        const previousPlanPrice = getPlanPrice(options.previousPlanId);
        const newPlanPrice = getPlanPrice(options.planoId);
        const daysRemaining = getDaysRemaining(options.usuarioId);
        
        // Calcular o crédito baseado nos dias restantes do plano atual
        const creditValue = (previousPlanPrice * daysRemaining) / 30;
        
        // Calcular o valor final a ser cobrado
        finalAmount = newPlanPrice - creditValue;
        
        // Garantir que o valor não seja negativo
        finalAmount = Math.max(0, finalAmount);
      }
      
      // Criar assinatura mock
      const newSubscription: Subscription = {
        id: subscriptionId,
        status: 'active',
        planoId: options.planoId,
        expiracao: expiration.toISOString(),
        startDate: now.toISOString(),
        autoRenew: true,
        asaasId: `asaas_sub_${Date.now()}` // ID simulado do Asaas
      };
      
      // Salvar a assinatura mock temporariamente
      mockSubscriptions.set(options.usuarioId, newSubscription);
      
      // Registrar o pagamento
      const payment: Payment = {
        id: `pay_${Date.now()}`,
        subscriptionId,
        amount: finalAmount,
        status: 'paid',
        paymentMethod: 'card',
        date: now.toISOString(),
        description: options.isUpgrade ? `Upgrade para Plano ${getPlanName(options.planoId)}` : `Assinatura Plano ${getPlanName(options.planoId)}`,
        asaasId: `asaas_pay_${Date.now()}` // ID simulado do Asaas
      };
      
      // Adicionar ao histórico de pagamentos
      const userPayments = mockPayments.get(options.usuarioId) || [];
      userPayments.push(payment);
      mockPayments.set(options.usuarioId, userPayments);
      
      return {
        success: true,
        url: checkoutUrl
      };
    } else {
      throw new Error('Erro simulado no processamento do pagamento');
    }
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// Função para verificar o status da assinatura
export async function checkSubscriptionStatus(userId: string): Promise<{
  active: boolean;
  planoId?: string;
  expiracao?: string;
  autoRenew?: boolean;
  asaasId?: string;
}> {
  // Esta função será atualizada para verificar o status no Asaas via API
  // Quando a API do Asaas estiver disponível, a implementação será atualizada
  
  try {
    // Simulação de processamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Verificar se o usuário tem uma assinatura na simulação
    const subscription = mockSubscriptions.get(userId);
    
    if (subscription) {
      // Verificar se está expirado
      const now = new Date();
      const expirationDate = new Date(subscription.expiracao);
      const isExpired = expirationDate < now;
      
      // Se estiver expirado e autoRenew estiver ativo, renovar
      if (isExpired && subscription.autoRenew) {
        const newExpirationDate = new Date();
        newExpirationDate.setDate(newExpirationDate.getDate() + 30);
        
        // Atualizar a assinatura
        subscription.expiracao = newExpirationDate.toISOString();
        mockSubscriptions.set(userId, subscription);
        
        // Registrar o pagamento da renovação
        const payment: Payment = {
          id: `pay_${Date.now()}`,
          subscriptionId: subscription.id,
          amount: getPlanPrice(subscription.planoId),
          status: 'paid',
          paymentMethod: 'card',
          date: new Date().toISOString(),
          description: `Renovação Plano ${getPlanName(subscription.planoId)}`,
          asaasId: `asaas_pay_${Date.now()}` // ID simulado do Asaas
        };
        
        // Adicionar ao histórico de pagamentos
        const userPayments = mockPayments.get(userId) || [];
        userPayments.push(payment);
        mockPayments.set(userId, userPayments);
        
        return {
          active: true,
          planoId: subscription.planoId,
          expiracao: subscription.expiracao,
          autoRenew: subscription.autoRenew,
          asaasId: subscription.asaasId
        };
      }
      
      // Se estiver expirado e autoRenew estiver desativado, retornar inativo
      if (isExpired && !subscription.autoRenew) {
        return {
          active: false,
          planoId: subscription.planoId,
          expiracao: subscription.expiracao,
          autoRenew: subscription.autoRenew,
          asaasId: subscription.asaasId
        };
      }
      
      // Se não estiver expirado, retornar o status atual
      return {
        active: subscription.status === 'active',
        planoId: subscription.planoId,
        expiracao: subscription.expiracao,
        autoRenew: subscription.autoRenew,
        asaasId: subscription.asaasId
      };
    }
    
    // Se o usuário não tiver assinatura, criar uma assinatura simulada
    const demoSubscription: Subscription = {
      id: `sub_demo_${Date.now()}`,
      status: 'active',
      planoId: 'professional', // Plano profissional por padrão para demonstração
      expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Iniciado há 30 dias
      autoRenew: true,
      asaasId: `asaas_sub_demo_${Date.now()}` // ID simulado do Asaas
    };
    
    // Salvar a assinatura demo
    mockSubscriptions.set(userId, demoSubscription);
    
    // Criar histórico de pagamentos simulado
    const demoPastDate1 = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const demoPastDate2 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const demoPayments: Payment[] = [
      {
        id: `pay_demo_1`,
        subscriptionId: demoSubscription.id,
        amount: getPlanPrice(demoSubscription.planoId),
        status: 'paid',
        paymentMethod: 'card',
        date: demoPastDate1.toISOString(),
        description: `Assinatura Plano ${getPlanName(demoSubscription.planoId)}`,
        asaasId: `asaas_pay_demo_1`
      },
      {
        id: `pay_demo_2`,
        subscriptionId: demoSubscription.id,
        amount: getPlanPrice(demoSubscription.planoId),
        status: 'paid',
        paymentMethod: 'card',
        date: demoPastDate2.toISOString(),
        description: `Renovação Plano ${getPlanName(demoSubscription.planoId)}`,
        asaasId: `asaas_pay_demo_2`
      }
    ];
    
    // Salvar pagamentos demo
    mockPayments.set(userId, demoPayments);
    
    return {
      active: true,
      planoId: demoSubscription.planoId,
      expiracao: demoSubscription.expiracao,
      autoRenew: demoSubscription.autoRenew,
      asaasId: demoSubscription.asaasId
    };
  } catch (error) {
    console.error('Erro ao verificar status da assinatura:', error);
    return { active: false };
  }
}

// Função para cancelar uma assinatura
export async function cancelSubscription(userId: string): Promise<boolean> {
  // Esta função será atualizada para cancelar a assinatura via API do Asaas
  try {
    const subscription = mockSubscriptions.get(userId);
    if (!subscription) return false;
    
    // Atualizar status para cancelado
    subscription.status = 'canceled';
    subscription.autoRenew = false;
    mockSubscriptions.set(userId, subscription);
    
    return true;
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    return false;
  }
}

// Função para obter o histórico de pagamentos
export async function getPaymentHistory(userId: string): Promise<Payment[]> {
  // Esta função será atualizada para buscar do Asaas via API
  return mockPayments.get(userId) || [];
}

// Função para mudar de plano
export async function changePlan(userId: string, newPlanId: string): Promise<{
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}> {
  // Esta função será atualizada para usar a API do Asaas quando disponível
  try {
    const currentSubscription = mockSubscriptions.get(userId);
    
    if (!currentSubscription) {
      return {
        success: false,
        error: 'Assinatura atual não encontrada'
      };
    }
    
    // Verificar se está mudando para o mesmo plano
    if (currentSubscription.planoId === newPlanId) {
      return {
        success: false,
        error: 'Você já está inscrito neste plano'
      };
    }
    
    // Se o plano atual for mais caro que o novo (downgrade)
    const currentPrice = getPlanPrice(currentSubscription.planoId);
    const newPrice = getPlanPrice(newPlanId);
    
    if (newPrice < currentPrice) {
      // Downgrade - ativa no próximo ciclo
      currentSubscription.planoId = newPlanId;
      mockSubscriptions.set(userId, currentSubscription);
      
      return {
        success: true,
        checkoutUrl: `/dashboard?downgrade=true`
      };
    } else {
      // Upgrade - cobra a diferença pro-rata
      // Criar uma nova opção de checkout para upgrade
      const mockUser = {
        id: userId,
        firstName: 'Usuário',
        lastName: 'Teste',
        email: 'usuario@teste.com'
      };
      
      const checkoutOptions: CheckoutOptions = {
        planoId: newPlanId,
        usuarioId: userId,
        precoTotal: newPrice,
        tipoPlano: 'proprietario',
        periodoCobranca: 'mensal',
        nomeUsuario: `${mockUser.firstName} ${mockUser.lastName}`,
        emailUsuario: mockUser.email,
        isUpgrade: true,
        previousPlanId: currentSubscription.planoId
      };
      
      // Criar sessão de checkout para o upgrade
      return await createCheckoutSession(checkoutOptions);
    }
  } catch (error) {
    console.error('Erro ao mudar plano:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// Funções auxiliares
export function getPlanName(planId: string): string {
  const planNames: Record<string, string> = {
    'basic': 'Básico',
    'premium': 'Premium',
    'professional': 'Profissional'
  };
  return planNames[planId] || 'Desconhecido';
}

export function getPlanPrice(planId: string): number {
  return planPrices[planId as keyof typeof planPrices] || 0;
}

export function getDaysRemaining(userId: string): number {
  const subscription = mockSubscriptions.get(userId);
  if (!subscription) return 0;
  
  const now = new Date();
  const expiration = new Date(subscription.expiracao);
  const diffTime = expiration.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
} 