// Este é um arquivo simulado para demonstrar a integração com Stripe
// Em um ambiente de produção, isso seria substituído por uma API real

import { toast } from 'react-hot-toast';

// Tipos para o serviço de pagamento
export interface CheckoutOptions {
  planoId: string;
  usuarioId: string;
  precoTotal: number;
  tipoPlano: 'proprietario' | 'corretor';
  periodoCobranca: 'mensal';
  nomeUsuario: string;
  emailUsuario: string;
  isUpgrade?: boolean;
  previousPlanId?: string;
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  planoId: string;
  expiracao: string;
  startDate: string;
  autoRenew: boolean;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  status: 'paid' | 'refunded' | 'failed';
  paymentMethod: 'card' | 'pix' | 'transfer';
  date: string;
  description: string;
}

// Armazenar dados mockados para simular o banco de dados
const mockSubscriptions = new Map<string, Subscription>();
const mockPayments = new Map<string, Payment[]>();

// Definir preços dos planos
const planPrices = {
  'basic': 29.90,
  'premium': 49.90,
  'professional': 79.90
};

// Função mockada para simular a criação de uma sessão de checkout
export async function createCheckoutSession(options: CheckoutOptions): Promise<{ success: boolean; url?: string; error?: string }> {
  // Simulação de processamento
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // Em um ambiente real, esta seria uma chamada à API do Stripe
    // Simular 90% de sucesso para demonstrar tratamento de erros
    const randomSuccess = Math.random() > 0.1;
    
    if (randomSuccess) {
      // Simular URL de redirecionamento do Stripe
      const checkoutUrl = `/checkout-success?session_id=mock_${Date.now()}_${options.planoId}`;
      
      // Criar uma assinatura mock após o pagamento bem-sucedido
      const subscriptionId = `sub_${Date.now()}`;
      const now = new Date();
      const expiration = new Date(now);
      expiration.setDate(expiration.getDate() + 30); // 30 dias de assinatura
      
      // Se for um upgrade, calcular o valor pro-rata
      let finalAmount = options.precoTotal;
      if (options.isUpgrade && options.previousPlanId) {
        // Simulação de preço pro-rata (valor do novo plano - valor do plano anterior)
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
        autoRenew: true
      };
      
      // Salvar a assinatura mock
      mockSubscriptions.set(options.usuarioId, newSubscription);
      
      // Registrar o pagamento
      const payment: Payment = {
        id: `pay_${Date.now()}`,
        subscriptionId,
        amount: finalAmount,
        status: 'paid',
        paymentMethod: 'card',
        date: now.toISOString(),
        description: options.isUpgrade ? `Upgrade para Plano ${getPlanName(options.planoId)}` : `Assinatura Plano ${getPlanName(options.planoId)}`
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

// Função para simular a verificação do status da assinatura
export async function checkSubscriptionStatus(userId: string): Promise<{
  active: boolean;
  planoId?: string;
  expiracao?: string;
  autoRenew?: boolean;
}> {
  // Simulação de processamento
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Verificar se o usuário tem uma assinatura no mock
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
        description: `Renovação Plano ${getPlanName(subscription.planoId)}`
      };
      
      // Adicionar ao histórico de pagamentos
      const userPayments = mockPayments.get(userId) || [];
      userPayments.push(payment);
      mockPayments.set(userId, userPayments);
      
      return {
        active: true,
        planoId: subscription.planoId,
        expiracao: subscription.expiracao,
        autoRenew: subscription.autoRenew
      };
    }
    
    // Se estiver expirado e autoRenew estiver desativado, retornar inativo
    if (isExpired && !subscription.autoRenew) {
      return {
        active: false,
        planoId: subscription.planoId,
        expiracao: subscription.expiracao,
        autoRenew: subscription.autoRenew
      };
    }
    
    // Se não estiver expirado, retornar o status atual
    return {
      active: subscription.status === 'active',
      planoId: subscription.planoId,
      expiracao: subscription.expiracao,
      autoRenew: subscription.autoRenew
    };
  }
  
  // Se o usuário não tiver assinatura, criar uma assinatura mock para demonstração
  const demoSubscription: Subscription = {
    id: `sub_demo_${Date.now()}`,
    status: 'active',
    planoId: 'professional', // Plano profissional por padrão para demonstração
    expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Iniciado há 30 dias
    autoRenew: true
  };
  
  // Salvar a assinatura demo
  mockSubscriptions.set(userId, demoSubscription);
  
  // Criar histórico de pagamentos mockado
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
      description: `Assinatura Plano ${getPlanName(demoSubscription.planoId)}`
    },
    {
      id: `pay_demo_2`,
      subscriptionId: demoSubscription.id,
      amount: getPlanPrice(demoSubscription.planoId),
      status: 'paid',
      paymentMethod: 'card',
      date: demoPastDate2.toISOString(),
      description: `Renovação Plano ${getPlanName(demoSubscription.planoId)}`
    }
  ];
  
  // Salvar pagamentos demo
  mockPayments.set(userId, demoPayments);
  
  return {
    active: true,
    planoId: demoSubscription.planoId,
    expiracao: demoSubscription.expiracao,
    autoRenew: demoSubscription.autoRenew
  };
}

// Função para simular o cancelamento de uma assinatura
export async function cancelSubscription(userId: string): Promise<boolean> {
  // Simulação de processamento
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  try {
    const subscription = mockSubscriptions.get(userId);
    
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }
    
    // Desativar renovação automática, mas manter acesso até o final do período
    subscription.autoRenew = false;
    mockSubscriptions.set(userId, subscription);
    
    toast.success('Assinatura cancelada com sucesso. Você terá acesso ao plano até o final do período atual.');
    return true;
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    toast.error('Erro ao cancelar assinatura. Por favor, tente novamente.');
    return false;
  }
}

// Função para obter o histórico de pagamentos
export async function getPaymentHistory(userId: string): Promise<Payment[]> {
  // Simulação de processamento
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Retornar o histórico de pagamentos ou um array vazio
  return mockPayments.get(userId) || [];
}

// Função para simular a troca de plano
export async function changePlan(userId: string, newPlanId: string): Promise<{
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}> {
  // Simulação de processamento
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const subscription = mockSubscriptions.get(userId);
    
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }
    
    const currentPlanPrice = getPlanPrice(subscription.planoId);
    const newPlanPrice = getPlanPrice(newPlanId);
    
    // Se o novo plano for mais caro, cobrar a diferença
    if (newPlanPrice > currentPlanPrice) {
      // Criar uma sessão de checkout para o upgrade
      const options: CheckoutOptions = {
        planoId: newPlanId,
        usuarioId: userId,
        precoTotal: newPlanPrice - currentPlanPrice, // Cobrar apenas a diferença
        tipoPlano: 'proprietario', // Mock simplificado
        periodoCobranca: 'mensal',
        nomeUsuario: 'Usuário Demo',
        emailUsuario: 'usuario@exemplo.com',
        isUpgrade: true,
        previousPlanId: subscription.planoId
      };
      
      // Retornar URL para checkout
      return {
        success: true,
        checkoutUrl: `/checkout-upgrade?from=${subscription.planoId}&to=${newPlanId}`
      };
    }
    
    // Se o novo plano for mais barato (downgrade), aplicar na próxima renovação
    // Atualizar o plano para o próximo ciclo
    subscription.planoId = newPlanId;
    mockSubscriptions.set(userId, subscription);
    
    toast.success('Seu plano será alterado na próxima renovação.');
    return { success: true };
  } catch (error) {
    console.error('Erro ao alterar plano:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// Função para obter o nome do plano a partir do ID
export function getPlanName(planId: string): string {
  if (planId.includes('basic')) return 'Básico';
  if (planId.includes('premium')) return 'Premium';
  if (planId.includes('professional') || planId.includes('profissional')) return 'Profissional';
  return 'Desconhecido';
}

// Função para obter o preço do plano a partir do ID
export function getPlanPrice(planId: string): number {
  if (planId.includes('basic')) return planPrices.basic;
  if (planId.includes('premium')) return planPrices.premium;
  if (planId.includes('professional') || planId.includes('profissional')) return planPrices.professional;
  return 0;
}

// Função para obter dias restantes da assinatura
export function getDaysRemaining(userId: string): number {
  const subscription = mockSubscriptions.get(userId);
  
  if (!subscription) return 0;
  
  const now = new Date();
  const expirationDate = new Date(subscription.expiracao);
  
  // Calcular diferença em dias
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
} 