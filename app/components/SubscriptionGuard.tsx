'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, hasActiveSubscription } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só verificamos após o carregamento
    if (isLoading) return;

    // Se não estiver autenticado, redirecione para o login
    if (!user) {
      router.push('/login');
      return;
    }

    // Se não tiver assinatura ativa, redirecione para a seleção de planos
    if (!hasActiveSubscription) {
      router.push('/selecionar-plano');
    }
  }, [user, isLoading, hasActiveSubscription, router]);

  // Mostrar um estado de carregamento enquanto verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0071ce] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado ou não tiver assinatura, não renderize nada
  if (!user || !hasActiveSubscription) {
    return null;
  }

  // Se estiver autenticado e tiver assinatura, renderize o conteúdo
  return <>{children}</>;
} 