'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { cancelSubscription, checkSubscriptionStatus } from '@/app/lib/checkout';
import { CircleCheck, Clock, Calendar, CreditCard, Shield, AlertTriangle } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function PlanoAtivoPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [subscription, setSubscription] = useState<{
    status: string;
    plan_id: string;
    expires_at: string;
  } | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    // Verificar status da assinatura
    if (user) {
      const fetchSubscriptionStatus = async () => {
        try {
          const status = await checkSubscriptionStatus(user.id);
          // Converter o formato retornado para o formato esperado pelo estado
          setSubscription({
            status: status.active ? 'active' : 'inactive',
            plan_id: status.planoId || '',
            expires_at: status.expiracao || ''
          });
        } catch (error) {
          console.error('Erro ao verificar status da assinatura:', error);
          toast.error('Não foi possível carregar as informações do seu plano.');
        }
      };

      fetchSubscriptionStatus();
    }
  }, [isLoading, user, router]);

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    setCancelLoading(true);
    try {
      await cancelSubscription(user.id);
      toast.success('Assinatura cancelada com sucesso!');
      setShowCancelConfirm(false);
      
      // Atualizar status da assinatura após cancelamento
      const status = await checkSubscriptionStatus(user.id);
      // Converter o formato retornado para o formato esperado pelo estado
      setSubscription({
        status: status.active ? 'active' : 'inactive',
        plan_id: status.planoId || '',
        expires_at: status.expiracao || ''
      });
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      toast.error('Não foi possível cancelar sua assinatura. Tente novamente mais tarde.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Calcular dias restantes
  const getDaysRemaining = () => {
    if (!subscription?.expires_at) return 0;
    try {
      const expiresAt = parseISO(subscription.expires_at);
      return Math.max(0, differenceInDays(expiresAt, new Date()));
    } catch (error) {
      return 0;
    }
  };

  // Formatar data de expiração
  const formatExpirationDate = () => {
    if (!subscription?.expires_at) return 'Não disponível';
    try {
      return format(parseISO(subscription.expires_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Determinar plano com base no ID
  const getPlanDetails = () => {
    const planId = subscription?.plan_id || '';

    if (planId.includes('basic')) {
      return {
        name: 'Básico',
        price: 'R$ 29,90',
        color: '#3B82F6', // Azul
        features: [
          'Até 2 anúncios ativos',
          'Suporte por email',
          'Filtros básicos'
        ]
      };
    } else if (planId.includes('premium')) {
      return {
        name: 'Premium',
        price: 'R$ 49,90',
        color: '#8B5CF6', // Roxo
        features: [
          'Até 5 anúncios ativos',
          'Destaque nos resultados',
          'Suporte prioritário',
          'Estatísticas de visualização'
        ]
      };
    } else {
      return {
        name: 'Profissional',
        price: 'R$ 79,90',
        color: '#4CAF50', // Verde
        features: [
          'Anúncios ilimitados',
          'Destaque máximo nos resultados',
          'Suporte prioritário 24/7',
          'Estatísticas avançadas',
          'Acesso antecipado a novos recursos'
        ]
      };
    }
  };

  const planDetails = getPlanDetails();
  const daysRemaining = getDaysRemaining();
  const expirationDate = formatExpirationDate();
  const isActive = subscription?.status === 'active';

  if (isLoading) {
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
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Meu Plano</h1>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isActive ? (
          <>
            {/* Cabeçalho do plano */}
            <div style={{ backgroundColor: planDetails.color }} className="px-6 py-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-blue-600 mb-3">
                    Plano Ativo
                  </span>
                  <h1 className="text-3xl font-bold mb-2">Plano {planDetails.name}</h1>
                  <p className="text-xl opacity-90">{planDetails.price}/mês</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium">Expira em</div>
                  <div className="text-2xl font-bold mb-1">{daysRemaining} dias</div>
                  <div className="text-sm opacity-80">{expirationDate}</div>
                </div>
              </div>
            </div>

            {/* Detalhes da assinatura */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2" /> Status da Assinatura
                  </h3>
                  <div className="flex items-center text-green-600 font-medium">
                    <CircleCheck className="w-5 h-5 mr-2" /> Ativa
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Sua assinatura está ativa e será renovada automaticamente no próximo período.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2" /> Próxima Cobrança
                  </h3>
                  <div className="font-medium text-gray-900">{expirationDate}</div>
                  <p className="text-sm text-gray-600 mt-2">
                    Cobraremos o valor de {planDetails.price} na data acima para renovar sua assinatura.
                  </p>
                </div>
              </div>

              {/* Recursos do plano */}
              <div className="mb-8">
                <h3 className="font-medium text-gray-800 mb-4">Recursos Inclusos</h3>
                <ul className="space-y-3">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CircleCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ações */}
              <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between">
                <div>
                  <Link
                    href="/ajuda/planos"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center"
                  >
                    <span>Ver detalhes dos planos</span>
                  </Link>
                </div>
                <div className="mt-4 sm:mt-0 space-x-3">
                  <Link
                    href="/dashboard/alterar-plano"
                    className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
                  >
                    Alterar Plano
                  </Link>
                  {!showCancelConfirm ? (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="inline-flex items-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50"
                    >
                      Cancelar Assinatura
                    </button>
                  ) : (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={cancelLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      {cancelLoading ? 'Cancelando...' : 'Confirmar Cancelamento'}
                    </button>
                  )}
                </div>
              </div>

              {showCancelConfirm && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Tem certeza que deseja cancelar?</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Você perderá acesso aos recursos premium ao final do período atual. 
                        Considere alterar para um plano menor antes de cancelar.
                      </p>
                      <div className="mt-3 flex space-x-3">
                        <button
                          onClick={() => setShowCancelConfirm(false)}
                          className="text-sm font-medium text-gray-700"
                        >
                          Voltar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Nenhum plano ativo</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Você não possui um plano ativo no momento. Ative um plano para desbloquear todos os recursos da plataforma.
            </p>
            <Link
              href="/dashboard/escolher-plano"
              className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Ver planos disponíveis
            </Link>
          </div>
        )}
      </div>

      {/* Histórico de pagamentos */}
      {isActive && (
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-800">Histórico de Pagamentos</h2>
          </div>
          <div className="divide-y">
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Plano {planDetails.name}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">{planDetails.price}</p>
                <p className="text-sm text-green-600">Pago</p>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Plano {planDetails.name}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">{planDetails.price}</p>
                <p className="text-sm text-green-600">Pago</p>
              </div>
            </div>
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              <Link href="/dashboard/historico-completo" className="text-blue-600 hover:text-blue-800">
                Ver histórico completo
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 