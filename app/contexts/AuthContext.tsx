'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Usuario } from '@/app/lib/types';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: Usuario | null;
  loading: boolean;
  isLoading: boolean;
  isPlanoAtivo: boolean;
  signUp: (email: string, password: string, userData: Partial<Usuario>) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signInWithProvider: (provider: 'google' | 'facebook' | 'apple') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  updatePassword: (password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  updateProfile: (data: Partial<Usuario>) => Promise<{
    error: Error | null;
    data: any;
  }>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlanoAtivo, setIsPlanoAtivo] = useState(false);
  const router = useRouter();

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
      
      return data as Usuario;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  // Função para verificar se o usuário tem plano ativo
  const checkPlanoAtivo = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('assinaturas')
        .select('status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      
      return !error && data;
    } catch (error) {
      console.error('Erro ao verificar plano ativo:', error);
      return false;
    }
  };

  // Função para atualizar perfil do usuário
  const refreshUserProfile = async () => {
    if (!user) return;
    
    const profile = await fetchUserProfile(user.id);
    setUserProfile(profile);
    
    if (profile) {
      const planoAtivo = await checkPlanoAtivo(user.id);
      setIsPlanoAtivo(!!planoAtivo);
    }
  };

  useEffect(() => {
    // Verificar se há uma sessão ativa
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        // Obter sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          setUser(session.user);
          
          // Buscar perfil do usuário
          if (session.user) {
            const profile = await fetchUserProfile(session.user.id);
            setUserProfile(profile);
            
            if (profile) {
              const planoAtivo = await checkPlanoAtivo(session.user.id);
              setIsPlanoAtivo(!!planoAtivo);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
          
          if (profile) {
            const planoAtivo = await checkPlanoAtivo(session.user.id);
            setIsPlanoAtivo(!!planoAtivo);
          }
        } else {
          setUserProfile(null);
          setIsPlanoAtivo(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função para cadastro de usuário
  const signUp = async (email: string, password: string, userData: Partial<Usuario>) => {
    setLoading(true);
    
    try {
      // Cadastrar no auth do Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            primeiro_nome: userData.primeiro_nome || '',
            ultimo_nome: userData.ultimo_nome || '',
            tipo_usuario: userData.tipo_usuario || 'proprietario',
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Criar perfil do usuário na tabela 'usuarios'
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert({
            id: data.user.id,
            email: email,
            primeiro_nome: userData.primeiro_nome || '',
            ultimo_nome: userData.ultimo_nome || '',
            tipo_usuario: userData.tipo_usuario || 'proprietario',
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString(),
          });
          
        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          throw profileError;
        }
        
        toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast.error(error.message || 'Erro ao criar conta');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Função para login
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast.success('Login realizado com sucesso!');
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Erro ao fazer login');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Função para login com provedores sociais
  const signInWithProvider = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error(`Erro no login com ${provider}:`, error);
      toast.error(`Erro ao fazer login com ${provider}`);
      throw error;
    }
  };

  // Função para logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logout realizado com sucesso!');
      router.push('/');
    } catch (error: any) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  // Função para resetar senha
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Email de recuperação enviado!');
      return { data: null, error: null };
    } catch (error: any) {
      console.error('Erro ao resetar senha:', error);
      toast.error(error.message || 'Erro ao enviar email de recuperação');
      return { data: null, error };
    }
  };

  // Função para atualizar senha
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Senha atualizada com sucesso!');
      return { data: null, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      toast.error(error.message || 'Erro ao atualizar senha');
      return { data: null, error };
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (data: Partial<Usuario>) => {
    if (!user) {
      return { data: null, error: new Error('Usuário não autenticado') };
    }
    
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          ...data,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Atualizar perfil local
      await refreshUserProfile();
      
      toast.success('Perfil atualizado com sucesso!');
      return { data: null, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(error.message || 'Erro ao atualizar perfil');
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    isLoading: loading,
    isPlanoAtivo,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 