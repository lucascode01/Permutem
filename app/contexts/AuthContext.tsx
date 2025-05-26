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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlanoAtivo, setIsPlanoAtivo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há uma sessão ativa
    const initializeAuth = async () => {
      setLoading(true);
      
      // Obter sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setSession(session);
        setUser(session.user);
        
        // Buscar perfil do usuário
        if (session.user) {
          const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (data && !error) {
            setUserProfile(data as Usuario);
          }
        }
      }
      
      setLoading(false);
    };

    initializeAuth();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const { data } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (data) {
            setUserProfile(data as Usuario);
          }
        } else {
          setUserProfile(null);
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
    
    // Cadastrar no auth do Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Desativar a necessidade de confirmação de e-mail
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          primeiro_nome: userData.primeiro_nome || '',
          ultimo_nome: userData.ultimo_nome || '',
          tipo_usuario: userData.tipo_usuario || 'proprietario',
        }
      }
    });
    
    if (!error && data.user) {
      // Criar perfil do usuário na tabela 'usuarios'
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert({
          id: data.user.id,
          email: email,
          primeiro_nome: userData.primeiro_nome || '',
          ultimo_nome: userData.ultimo_nome || '',
          tipo_usuario: userData.tipo_usuario || 'proprietario',
        });
        
      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
      } else {
        // Após criar o perfil, autenticar automaticamente o usuário
        // Isso faz com que não seja necessário confirmar o e-mail
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('Erro ao autenticar após cadastro:', signInError);
        }
      }
    }
    
    setLoading(false);
    return { data, error };
  };

  // Função para login
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return { data, error };
  };

  // Função para login com provedores sociais
  const signInWithProvider = async (provider: 'google' | 'facebook' | 'apple') => {
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // Função para logout
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Função para resetar senha
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    return { data, error };
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