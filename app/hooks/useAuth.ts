'use client';

import { useAuth as useAuthContext } from '@/app/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const auth = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Verificar se há um redirect após login
  useEffect(() => {
    if (auth.user && !auth.loading && !isRedirecting) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        setIsRedirecting(true);
        router.replace(redirect);
      }
    }
  }, [auth.user, auth.loading, router, searchParams, isRedirecting]);

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

  // Função para verificar se é usuário premium
  const isPremium = () => {
    return auth.isPlanoAtivo;
  };

  // Função para login com redirecionamento
  const signInWithRedirect = async (email: string, password: string) => {
    const redirect = searchParams.get('redirect') || '/dashboard';
    
    try {
      const { error } = await auth.signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      // O redirecionamento será feito automaticamente pelo useEffect
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    }
  };

  // Função para logout com confirmação
  const signOutWithConfirm = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await auth.signOut();
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
      case 'premium':
        return isPremium();
      case 'plano_ativo':
        return auth.isPlanoAtivo;
      case 'auth':
        return !!auth.user;
      default:
        return true;
    }
  };

  // Função para proteger rotas
  const requireAuth = (redirectTo = '/login') => {
    if (!auth.user && !auth.loading) {
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  // Função para proteger rotas premium
  const requirePremium = (redirectTo = '/planos') => {
    if (!auth.isPlanoAtivo) {
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  // Função para proteger rotas admin
  const requireAdmin = (redirectTo = '/dashboard') => {
    if (!isAdmin()) {
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  // Função para obter nome completo do usuário
  const getUserFullName = () => {
    if (!auth.userProfile) return '';
    
    const firstName = auth.userProfile.primeiro_nome || '';
    const lastName = auth.userProfile.ultimo_nome || '';
    
    return `${firstName} ${lastName}`.trim() || auth.userProfile.email || 'Usuário';
  };

  // Função para obter iniciais do usuário
  const getUserInitials = () => {
    if (!auth.userProfile) return 'U';
    
    const firstName = auth.userProfile.primeiro_nome || '';
    const lastName = auth.userProfile.ultimo_nome || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (auth.userProfile.email) {
      return auth.userProfile.email[0].toUpperCase();
    }
    
    return 'U';
  };

  // Função para verificar se o usuário completou o perfil
  const hasCompleteProfile = () => {
    if (!auth.userProfile) return false;
    
    return !!(
      auth.userProfile.primeiro_nome &&
      auth.userProfile.ultimo_nome &&
      auth.userProfile.telefone
    );
  };

  // Função para forçar atualização do perfil
  const refreshProfile = async () => {
    await auth.refreshUserProfile();
  };

  return {
    ...auth,
    checkPlanoAtivo,
    isAdmin,
    isCorretor,
    isProprietario,
    isPremium,
    signInWithRedirect,
    signOutWithConfirm,
    canAccess,
    requireAuth,
    requirePremium,
    requireAdmin,
    getUserFullName,
    getUserInitials,
    hasCompleteProfile,
    refreshProfile,
    isRedirecting,
  };
} 