'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { createCheckoutSession, checkSubscriptionStatus, getPlanName, getPlanPrice, getDaysRemaining } from '@/app/lib/checkout';
import { CreditCard, ArrowRight, CheckCircle, Calendar, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CheckoutUpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  
  // Obter parâmetros da URL
  const fromPlanId = searchParams.get('from');
  const toPlanId = searchParams.get('to');
  
  useEffect(() => {
    // Redirecionar para login se não estiver autenticado
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    
    // Verificar se os parâmetros estão presentes
    if (!fromPlanId || !toPlanId) {
      toast.error('Informações de plano ausentes.');
      router.push('/dashboard/alterar-plano');
      return;
    }
    
    // Verificar status da assinatura atual
    const fetchSubscriptionStatus = async () => {
      if (!user) return;
      
      try {
        const status = await checkSubscriptionStatus(user.id);
        setCurrentPlan(status.planoId || null);
        setExpirationDate(status.expiracao || null);
        
        // Calcular dias restantes
        if (status.expiracao) {
          const days = getDaysRemaining(user.id);
          setDaysRemaining(days);
        }
      } catch (error) {
        console.error('Erro ao verificar status da assinatura:', error);
        toast.error('Não foi possível carregar as informações do seu plano.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptionStatus();
  }, [isLoading, user, router, fromPlanId, toPlanId]);
  
  // Calcular o preço pro-rata
  const calculateProRatedPrice = () => {
    if (!fromPlanId || !toPlanId || daysRemaining === 0) return 0;
    
    const fromPrice = getPlanPrice(fromPlanId);
    const toPrice = getPlanPrice(toPlanId);
    
    // Valor proporcional dos dias restantes do plano atual
    const creditValue = (fromPrice * daysRemaining) / 30;
    
    // Valor a ser cobrado
    const finalValue = toPrice - creditValue;
    
    // Garantir que o valor não seja negativo
    return Math.max(0, finalValue);
  };
  
  const handleCheckout = async () => {
    if (!user || !fromPlanId || !toPlanId) return;
    
    setProcessingPayment(true);
    
    try {
      const checkoutOptions = {
        planoId: toPlanId,
        usuarioId: user.id,
        precoTotal: calculateProRatedPrice(),
        tipoPlano: 'proprietario' as const,
        periodoCobranca: 'mensal' as const,
        nomeUsuario: `${user.user_metadata?.primeiro_nome || ''} ${user.user_metadata?.ultimo_nome || ''}`,
        emailUsuario: user.email || '',
        isUpgrade: true,
        previousPlanId: fromPlanId
      };
      
      const result = await createCheckoutSession(checkoutOptions);
      
      if (result.success && result.url) {
        router.push(result.url);
      } else {
        toast.error(result.error || 'Ocorreu um erro ao processar o pagamento.');
      }
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      toast.error('Ocorreu um erro ao processar o pagamento. Tente novamente mais tarde.');
    } finally {
      setProcessingPayment(false);
    }
  };
  
  // Formatar preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };
  
  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const proRatedPrice = calculateProRatedPrice();
  const fromPlanName = getPlanName(fromPlanId || '');
  const toPlanName = getPlanName(toPlanId || '');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/dashboard/alterar-plano"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowRight className="w-4 h-4 mr-1 transform rotate-180" /> Voltar para seleção de planos
        </Link>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 text-white">
            <h1 className="text-2xl font-bold">Upgrade de Plano</h1>
            <p className="opacity-90">Complete seu upgrade para aproveitar mais recursos</p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="flex-1 text-center">
                <div className="text-lg font-medium text-gray-500">De</div>
                <div className="text-xl font-bold text-gray-800">{fromPlanName}</div>
                <div className="text-sm text-gray-500">{formatPrice(getPlanPrice(fromPlanId || ''))} /mês</div>
              </div>
              
              <ArrowRight className="w-8 h-8 text-blue-500 mx-4" />
              
              <div className="flex-1 text-center">
                <div className="text-lg font-medium text-gray-500">Para</div>
                <div className="text-xl font-bold text-blue-600">{toPlanName}</div>
                <div className="text-sm text-gray-500">{formatPrice(getPlanPrice(toPlanId || ''))} /mês</div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalhes do pagamento</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-600">Plano {toPlanName}</div>
                  <div className="font-medium">{formatPrice(getPlanPrice(toPlanId || ''))}</div>
                </div>
                
                {expirationDate && (
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Dias restantes no plano atual</span>
                    </div>
                    <div className="font-medium">{daysRemaining} dias</div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-600">Crédito do plano atual</div>
                  <div className="font-medium text-red-600">-{formatPrice((getPlanPrice(fromPlanId || '') * daysRemaining) / 30)}</div>
                </div>
                
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center font-semibold">
                  <div>Total a pagar hoje</div>
                  <div className="text-lg text-blue-600">{formatPrice(proRatedPrice)}</div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Acesso imediato ao plano {toPlanName}</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Cobrança proporcional calculada com base nos dias restantes do seu plano atual</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Próxima cobrança regular em {expirationDate ? formatDate(expirationDate) : 'N/A'}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={processingPayment}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center justify-center"
              >
                {processingPayment ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Finalizar Upgrade - {formatPrice(proRatedPrice)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Ao prosseguir, você concorda com os <Link href="/termos" className="text-blue-600 hover:underline">Termos de Serviço</Link> e <Link href="/privacidade" className="text-blue-600 hover:underline">Política de Privacidade</Link>.</p>
        </div>
      </div>
    </div>
  );
} 