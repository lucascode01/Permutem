'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkSubscriptionStatus } from '../lib/checkout';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'proprietario' | 'corretor' | 'admin';
  subscription?: {
    active: boolean;
    planoId?: string;
    expiracao?: string;
  };
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string, userType: string) => Promise<boolean>;
  logout: () => void;
  updateSubscriptionStatus: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Verificar se estamos no cliente e montar o componente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Verificar se o usuário está logado ao iniciar
  useEffect(() => {
    const checkUserAuth = async () => {
      // Evitar execução no servidor
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        const storedUser = localStorage.getItem('permutem_user');
        const sessionUser = sessionStorage.getItem('permutem_user');
        let userData = null;

        if (storedUser) {
          // Usuário salvo no localStorage (lembrar-me ativado)
          userData = JSON.parse(storedUser);
        } else if (sessionUser) {
          // Usuário salvo no sessionStorage (lembrar-me desativado)
          userData = JSON.parse(sessionUser);
        }

        if (userData) {
          // Verificar assinatura
          const subscription = await checkSubscriptionStatus(userData.id);
          userData.subscription = subscription;
          setUser(userData);

          // Atualizar nos storages com info de assinatura
          if (storedUser) {
            localStorage.setItem('permutem_user', JSON.stringify(userData));
          } else if (sessionUser) {
            sessionStorage.setItem('permutem_user', JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isMounted) {
      checkUserAuth();
    }
  }, [isMounted]);

  // Propriedade calculada para verificar se o usuário está autenticado
  const isAuthenticated = user !== null;
  
  // Propriedade para verificar se o usuário tem assinatura ativa
  const hasActiveSubscription = user?.subscription?.active || user?.userType === 'admin' || false;

  // Função para atualizar o status da assinatura
  const updateSubscriptionStatus = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const subscription = await checkSubscriptionStatus(user.id);
      const updatedUser = {
        ...user,
        subscription
      };
      
      setUser(updatedUser);
      
      // Atualizar nos storages
      const inLocalStorage = localStorage.getItem('permutem_user');
      const inSessionStorage = sessionStorage.getItem('permutem_user');
      
      if (inLocalStorage) {
        localStorage.setItem('permutem_user', JSON.stringify(updatedUser));
      }
      
      if (inSessionStorage) {
        sessionStorage.setItem('permutem_user', JSON.stringify(updatedUser));
      }
      
      return subscription.active;
    } catch (error) {
      console.error('Erro ao atualizar status da assinatura:', error);
      return false;
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Verificar se é o login de admin
      if (email === 'admin@permutem.com.br' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin1',
          firstName: 'Admin',
          lastName: 'Sistema',
          email: 'admin@permutem.com.br',
          userType: 'admin',
          subscription: { active: true }
        };
        
        if (rememberMe) {
          localStorage.setItem('permutem_user', JSON.stringify(adminUser));
        } else {
          sessionStorage.setItem('permutem_user', JSON.stringify(adminUser));
          localStorage.removeItem('permutem_user');
        }
        
        setUser(adminUser);
        return true;
      }
      
      // Simulação de verificação de credenciais para usuários normais
      if (email && password) {
        // Criar um usuário simulado
        const mockUser: User = {
          id: '1',
          firstName: email.split('@')[0],
          lastName: 'Usuário',
          email,
          userType: 'proprietario',
        };

        // Verificar assinatura
        const subscription = await checkSubscriptionStatus(mockUser.id);
        mockUser.subscription = subscription;

        // Salvar usuário no storage apropriado de acordo com "lembrar-me"
        if (rememberMe) {
          localStorage.setItem('permutem_user', JSON.stringify(mockUser));
        } else {
          sessionStorage.setItem('permutem_user', JSON.stringify(mockUser));
          // Limpa localStorage caso exista
          localStorage.removeItem('permutem_user');
        }
        
        setUser(mockUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao realizar login', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string,
    userType: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulação de cadastro (em um projeto real, use API)
      if (firstName && lastName && email && password) {
        // Criar um usuário simulado
        const mockUser: User = {
          id: '1',
          firstName,
          lastName,
          email,
          userType: userType as 'proprietario' | 'corretor' | 'admin',
          subscription: { active: false }
        };

        // Salvar usuário no sessionStorage por padrão após registro
        sessionStorage.setItem('permutem_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao realizar cadastro', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('permutem_user');
      sessionStorage.removeItem('permutem_user');
    }
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated, 
      hasActiveSubscription,
      login, 
      register, 
      logout,
      updateSubscriptionStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 