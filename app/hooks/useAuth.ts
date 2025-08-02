'use client';

import { useAuth as useAuthContext } from '@/app/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const auth = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Verificar se há um redirect após login
  useEffect(() => {
    if (auth.user && !auth.loading) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.replace(redirect);
      }
    }
  }, [auth.user, auth.loading, router, searchParams]);

  // Função para verificar se o usuário tem plano ativo
  const checkPlanoAtivo = async () => {
    if (!auth.user) return false;
    
    try {
      const response = await fetch('/api/assinaturas/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.status === 'active';
      }
    } catch (error) {
      console.error('Erro ao verificar plano ativo:', error);
    }
    
    return false;
  };

  // Função para verificar permissões de admin
  const isAdmin = () => {
    return auth.userProfile?.tipo_usuario === 'admin';
  };

  // Função para verificar se é corretor
  const isCorretor = () => {
    return auth.userProfile?.tipo_usuario === 'corretor';
  };

  // Função para verificar se é proprietário
  const isProprietario = () => {
    return auth.userProfile?.tipo_usuario === 'proprietario';
  };

  // Função para login com redirecionamento
  const signInWithRedirect = async (email: string, password: string) => {
    const redirect = searchParams.get('redirect') || '/dashboard';
    
    try {
      const { error } = await auth.signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      toast.success('Login realizado com sucesso!');
      router.push(redirect);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    }
  };

  // Função para logout com confirmação
  const signOutWithConfirm = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await auth.signOut();
      toast.success('Logout realizado com sucesso!');
    }
  };

  // Função para verificar se o usuário pode acessar uma funcionalidade
  const canAccess = (feature: string) => {
    if (!auth.user) return false;
    
    switch (feature) {
      case 'admin':
        return isAdmin();
      case 'corretor':
        return isCorretor() || isAdmin();
      case 'proprietario':
        return isProprietario() || isCorretor() || isAdmin();
      case 'plano_ativo':
        return auth.isPlanoAtivo;
      default:
        return true;
    }
  };

  return {
    ...auth,
    checkPlanoAtivo,
    isAdmin,
    isCorretor,
    isProprietario,
    signInWithRedirect,
    signOutWithConfirm,
    canAccess,
  };
} 