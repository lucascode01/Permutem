'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { checkSubscriptionStatus, changePlan, getPlanName, getPlanPrice } from '@/app/lib/checkout';
import { StarIcon, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Definição dos planos
const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 29.90,
    color: '#3B82F6',
    features: [
      { name: 'Até 2 anúncios ativos', included: true },
      { name: 'Suporte por email', included: true },
      { name: 'Filtros básicos', included: true },
      { name: 'Destaque nos resultados', included: false },
      { name: 'Estatísticas avançadas', included: false },
      { name: 'Suporte prioritário', included: false },
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49.90,
    color: '#8B5CF6',
    features: [
      { name: 'Até 5 anúncios ativos', included: true },
      { name: 'Suporte por email', included: true },
      { name: 'Filtros básicos', included: true },
      { name: 'Destaque nos resultados', included: true },
      { name: 'Estatísticas de visualização', included: true },
      { name: 'Suporte prioritário', included: true },
    ]
  },
  {
    id: 'professional',
    name: 'Profissional',
    price: 79.90,
    color: '#4CAF50',
    features: [
      { name: 'Anúncios ilimitados', included: true },
      { name: 'Suporte por email', included: true },
      { name: 'Filtros avançados', included: true },
      { name: 'Destaque máximo nos resultados', included: true },
      { name: 'Estatísticas avançadas', included: true },
      { name: 'Suporte prioritário 24/7', included: true },
      { name: 'Acesso antecipado a novos recursos', included: true },
    ]
  }
];

export default function AlterarPlanoPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingPlan, setChangingPlan] = useState(false);

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Verificar status da assinatura atual
    const fetchSubscriptionStatus = async () => {
      if (!user) return;
      
      try {
        const status = await checkSubscriptionStatus(user.id);
        setCurrentPlan(status.planoId || null);
      } catch (error) {
        console.error('Erro ao verificar status da assinatura:', error);
        toast.error('Não foi possível carregar as informações do seu plano.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [isAuthenticated, isLoading, user, router]);

  const handleChangePlan = async (newPlanId: string) => {
    if (!user || !currentPlan) return;
    
    // Se for o plano atual, não faz nada
    if (currentPlan.includes(newPlanId)) {
      toast.error('Você já está inscrito neste plano.');
      return;
    }
    
    setChangingPlan(true);
    
    try {
      const result = await changePlan(user.id, newPlanId);
      
      if (result.success) {
        if (result.checkoutUrl) {
          // Upgrade de plano - redirecionar para checkout
          router.push(result.checkoutUrl);
        } else {
          // Downgrade - aplicado para o próximo ciclo
          toast.success('Seu plano será alterado na próxima renovação!');
          router.push('/dashboard/plano-ativo');
        }
      } else {
        toast.error(result.error || 'Ocorreu um erro ao alterar o plano.');
      }
    } catch (error) {
      console.error('Erro ao alterar plano:', error);
      toast.error('Ocorreu um erro ao alterar o plano. Tente novamente mais tarde.');
    } finally {
      setChangingPlan(false);
    }
  };

  // Determinar plano atual
  const getCurrentPlanName = () => {
    if (!currentPlan) return 'Nenhum';
    return getPlanName(currentPlan);
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Alterar Plano</h1>
        <Link
          href="/dashboard/plano-ativo"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          Voltar ao meu plano <ChevronRight className="ml-1 w-4 h-4" />
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Seu plano atual: {getCurrentPlanName()}</h2>
            <p className="text-gray-600">
              Escolha um novo plano abaixo. 
              {currentPlan && (
                <>
                  {' '}Ao fazer upgrade, você pagará apenas a diferença proporcional ao período restante do seu plano atual.
                  Se escolher um plano de menor valor, a alteração será aplicada na próxima renovação.
                </>
              )}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan?.includes(plan.id);
              const isUpgrade = currentPlan 
                ? getPlanPrice(plan.id) > getPlanPrice(currentPlan) 
                : false;
              const isDowngrade = currentPlan 
                ? getPlanPrice(plan.id) < getPlanPrice(currentPlan) 
                : false;
              
              return (
                <div 
                  key={plan.id}
                  className={`border rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md ${
                    isCurrentPlan ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                >
                  <div style={{ backgroundColor: plan.color }} className="px-6 py-4 text-white">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      {isCurrentPlan && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-blue-800">
                          Plano Atual
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">R$ {plan.price.toFixed(2)}</span>
                      <span className="text-sm opacity-90">/mês</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          {feature.included ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleChangePlan(plan.id)}
                      disabled={changingPlan || isCurrentPlan}
                      className={`w-full py-2 px-4 rounded-md transition-colors ${
                        isCurrentPlan
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : isUpgrade
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : isDowngrade
                              ? 'bg-orange-600 text-white hover:bg-orange-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {changingPlan 
                        ? 'Processando...'
                        : isCurrentPlan
                          ? 'Plano Atual'
                          : isUpgrade
                            ? 'Fazer Upgrade'
                            : isDowngrade
                              ? 'Fazer Downgrade'
                              : 'Escolher Plano'
                      }
                    </button>
                    
                    {isUpgrade && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        *Você pagará apenas a diferença proporcional
                      </p>
                    )}
                    {isDowngrade && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        *Alteração efetiva na próxima renovação
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Informações sobre a alteração de plano</h3>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>• Ao fazer upgrade, você pagará apenas a diferença proporcional ao tempo restante da sua assinatura atual.</p>
              <p>• Ao fazer downgrade, seu plano atual permanecerá ativo até o final do período, e o novo plano será aplicado na próxima renovação.</p>
              <p>• Você pode cancelar a qualquer momento, mas não haverá reembolso pelo período não utilizado.</p>
              <p>• Todos os planos são renovados automaticamente ao final do período.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 