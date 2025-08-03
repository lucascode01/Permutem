'use client';

import React from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requirePremium?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function RequireAuth({
  children,
  requireAuth = true,
  requirePremium = false,
  requireAdmin = false,
  redirectTo,
  fallback
}: RequireAuthProps) {
  const { user, loading, isPlanoAtivo, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Verificar se precisa de autenticação
    if (requireAuth && !user) {
      router.push(redirectTo || '/login');
      return;
    }

    // Verificar se precisa de plano premium
    if (requirePremium && !isPlanoAtivo) {
      router.push(redirectTo || '/planos');
      return;
    }

    // Verificar se precisa de permissão de admin
    if (requireAdmin && !isAdmin()) {
      router.push(redirectTo || '/dashboard');
      return;
    }
  }, [user, loading, isPlanoAtivo, requireAuth, requirePremium, requireAdmin, redirectTo, router]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0071ce]"></div>
      </div>
    );
  }

  // Verificar se tem todas as permissões necessárias
  const hasAccess = 
    (!requireAuth || user) &&
    (!requirePremium || isPlanoAtivo) &&
    (!requireAdmin || isAdmin());

  if (!hasAccess) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-4">
            Você não tem permissão para acessar esta página.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#0071ce] text-white px-6 py-2 rounded-lg hover:bg-[#005fad] transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 