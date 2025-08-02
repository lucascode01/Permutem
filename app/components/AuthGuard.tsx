'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { toast } from 'react-hot-toast';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'corretor' | 'proprietario';
  requirePlanoAtivo?: boolean;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ 
  children, 
  requiredRole, 
  requirePlanoAtivo = false,
  fallback 
}: AuthGuardProps) {
  const { user, loading, userProfile, isPlanoAtivo, canAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Se não há usuário, redirecionar para login
      if (!user) {
        toast.error('Você precisa estar logado para acessar esta página');
        router.push('/login');
        return;
      }

      // Se há um papel específico requerido
      if (requiredRole && !canAccess(requiredRole)) {
        toast.error('Você não tem permissão para acessar esta página');
        router.push('/dashboard');
        return;
      }

      // Se precisa de plano ativo
      if (requirePlanoAtivo && !isPlanoAtivo) {
        toast.error('Você precisa ter um plano ativo para acessar esta funcionalidade');
        router.push('/selecionar-plano');
        return;
      }
    }
  }, [user, loading, userProfile, isPlanoAtivo, requiredRole, requirePlanoAtivo, canAccess, router]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0071ce]"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário, mostrar fallback ou loading
  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0071ce]"></div>
          <p className="mt-4 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se há um papel específico requerido e o usuário não tem permissão
  if (requiredRole && !canAccess(requiredRole)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-[#0071ce] text-white px-6 py-2 rounded-lg hover:bg-[#005fad] transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Se precisa de plano ativo e o usuário não tem
  if (requirePlanoAtivo && !isPlanoAtivo) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Plano Necessário</h2>
          <p className="text-gray-600 mb-4">Você precisa ter um plano ativo para acessar esta funcionalidade.</p>
          <button
            onClick={() => router.push('/selecionar-plano')}
            className="bg-[#0071ce] text-white px-6 py-2 rounded-lg hover:bg-[#005fad] transition-colors"
          >
            Ver Planos
          </button>
        </div>
      </div>
    );
  }

  // Se tudo está ok, renderizar os children
  return <>{children}</>;
} 