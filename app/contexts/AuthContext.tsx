'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '../lib/supabase';
import type { Types } from '../lib/supabase';
import { toast } from 'react-hot-toast';

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
    asaasId?: string;
  };
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (email: string, firstName: string, lastName: string, userType: string, password: string) => Promise<boolean>;
  loginWithSocial: (provider: 'google' | 'facebook' | 'apple') => Promise<boolean>;
  registerWithSocial: (provider: 'google' | 'facebook' | 'apple', userType: string) => Promise<boolean>;
  logout: () => void;
  updateSubscriptionStatus: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseClient();

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

  // Função para verificar status da assinatura
  const checkSubscriptionStatus = async (userId: string): Promise<{
    active: boolean;
    planoId?: string;
    expiracao?: string;
    asaasId?: string;
  }> => {
    try {
      // DESATIVADO TEMPORARIAMENTE: API Asaas para verificar assinatura
      // Retornar uma assinatura ativa simulada para todos os usuários
      console.log('Asaas temporariamente desativado: retornando assinatura ativa para', userId);
      
      return {
        active: true,
        planoId: 'premium', // Plano simulado
        expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias a partir de agora
        asaasId: 'asaas_temp_disabled'
      };
      
      /* CÓDIGO ORIGINAL COMENTADO
      // Chamar API para verificar status da assinatura
      const response = await fetch(`/api/assinaturas/status?userId=${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao verificar assinatura');
      }
      
      return {
        active: data.active,
        planoId: data.planoId,
        expiracao: data.expiracao,
        asaasId: data.asaasId
      };
      */
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error);
      // Retornar status padrão (ativo para desenvolvimento)
      return { 
        active: true,
        planoId: 'basic'
      };
    }
  };

  // Função para atualizar o status da assinatura
  const updateSubscriptionStatus = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // DESATIVADO TEMPORARIAMENTE: verificação real de assinatura
      // Simular uma assinatura ativa
      const subscription = {
        active: true,
        planoId: user.subscription?.planoId || 'premium',
        expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        asaasId: 'asaas_temp_disabled'
      };
      
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
      
      return true; // Sempre retorna true no modo de desenvolvimento
    } catch (error) {
      console.error('Erro ao atualizar status da assinatura:', error);
      return true; // Retorna true mesmo com erro no modo de desenvolvimento
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Iniciando processo de login', { email });
      
      // Validações básicas
      if (!email || !password) {
        toast.error('Email e senha são obrigatórios');
        return false;
      }
      
      // Verificar se é o login de admin
      if (email === 'admin@permutem.com.br' && password === 'admin123') {
        console.log('Login de administrador aprovado');
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
      
      // Em um ambiente de produção, fazer login via Supabase
      console.log('Tentando login no Supabase Auth');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Erro ao autenticar no Supabase:', error);
        
        // Verificar se o erro é de email não confirmado 
        if (error.message.includes('Email not confirmed')) {
          toast.error('Email não confirmado. Verifique sua caixa de entrada ou spam.');
          
          // APENAS PARA DESENVOLVIMENTO: Permitir login mesmo sem confirmação de email
          if (process.env.NODE_ENV === 'development') {
            try {
              console.log('Ambiente de desenvolvimento: tentando buscar usuário mesmo sem confirmação de email');
              
              // Buscar perfil do usuário no Supabase
              const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', email)
                .single();
                
              if (userError || !userData) {
                console.error('Erro ao buscar perfil do usuário não confirmado:', userError);
                throw error; // Manter o erro original
              }
              
              // Criar objeto de usuário (mesmo sem email confirmado)
              const loggedUser: User = {
                id: userData.id,
                firstName: userData.primeiro_nome,
                lastName: userData.ultimo_nome,
                email: userData.email,
                userType: userData.tipo_usuario,
                // Definir uma assinatura ativa por padrão (Asaas desativado temporariamente)
                subscription: {
                  active: true,
                  planoId: 'premium',
                  expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                  asaasId: 'asaas_temp_disabled'
                }
              };
              
              if (rememberMe) {
                localStorage.setItem('permutem_user', JSON.stringify(loggedUser));
              } else {
                sessionStorage.setItem('permutem_user', JSON.stringify(loggedUser));
                localStorage.removeItem('permutem_user');
              }
              
              setUser(loggedUser);
              toast.success('Login bem-sucedido (modo de desenvolvimento)');
              return true;
            } catch (bypassError) {
              console.error('Erro ao tentar bypassar email não confirmado:', bypassError);
              // Continua para o tratamento normal de erro
            }
          }
        }
        
        throw error;
      }
      
      if (!data?.user) {
        console.error('Login com sucesso, mas sem dados de usuário', data);
        toast.error('Erro ao recuperar dados do usuário');
        return false;
      }
      
      console.log('Autenticação Supabase bem-sucedida, buscando perfil do usuário');
      
      // Se login bem-sucedido, buscar mais informações do usuário
      try {
        // Buscar perfil do usuário no Supabase
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (userError) {
          console.error('Erro ao buscar perfil do usuário:', userError);
          
          // Se o perfil não existir, podemos criar um
          if (userError.code === 'PGRST116') { // not found
            console.log('Perfil de usuário não encontrado, tentando criar um básico');
            
            // Extrair nome do email
            const nameParts = email.split('@')[0].split('.');
            const firstName = nameParts[0] || 'Usuário';
            const lastName = nameParts[1] || 'Permutem';
            
            const { error: createError } = await supabase
              .from('usuarios')
              .insert([{
                id: data.user.id,
                email: data.user.email,
                primeiro_nome: firstName,
                ultimo_nome: lastName,
                tipo_usuario: 'proprietario',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);
              
            if (createError) {
              console.error('Erro ao criar perfil básico:', createError);
              throw createError;
            }
            
            // Usar dados básicos criados
            const loggedUser: User = {
              id: data.user.id,
              firstName: firstName,
              lastName: lastName,
              email: data.user.email!,
              userType: 'proprietario',
              // Definir uma assinatura ativa por padrão (Asaas desativado temporariamente)
              subscription: {
                active: true,
                planoId: 'premium',
                expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                asaasId: 'asaas_temp_disabled'
              }
            };
            
            // Salvar usuário no storage apropriado de acordo com "lembrar-me"
            if (rememberMe) {
              localStorage.setItem('permutem_user', JSON.stringify(loggedUser));
            } else {
              sessionStorage.setItem('permutem_user', JSON.stringify(loggedUser));
              localStorage.removeItem('permutem_user');
            }
            
            setUser(loggedUser);
            return true;
          }
          
          throw userError;
        }
        
        if (!userData) {
          console.error('Perfil do usuário não encontrado mas sem erro');
          toast.error('Perfil de usuário não encontrado');
          return false;
        }
        
        console.log('Perfil de usuário encontrado:', userData);
        
        // Criar objeto de usuário
        const loggedUser: User = {
          id: data.user.id,
          firstName: userData.primeiro_nome,
          lastName: userData.ultimo_nome,
          email: userData.email,
          userType: userData.tipo_usuario,
          // Definir uma assinatura ativa por padrão (Asaas desativado temporariamente)
          subscription: {
            active: true,
            planoId: 'premium', // Plano simulado
            expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            asaasId: 'asaas_temp_disabled'
          }
        };
        
        // DESATIVADO TEMPORARIAMENTE: Verificação de assinatura real
        // const subscription = await checkSubscriptionStatus(loggedUser.id);
        // loggedUser.subscription = subscription;
        
        // Salvar usuário no storage apropriado de acordo com "lembrar-me"
        if (rememberMe) {
          localStorage.setItem('permutem_user', JSON.stringify(loggedUser));
        } else {
          sessionStorage.setItem('permutem_user', JSON.stringify(loggedUser));
          // Limpa localStorage caso exista
          localStorage.removeItem('permutem_user');
        }
        
        setUser(loggedUser);
        return true;
      } catch (userError) {
        console.error('Erro ao processar dados do usuário após login:', userError);
        toast.error('Erro ao carregar seu perfil. Por favor, tente novamente.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao realizar login', error);
      // Exibir mensagem para o usuário
      toast.error('Credenciais inválidas. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, firstName: string, lastName: string, userType: string, password: string): Promise<boolean> => {
    console.log(`Iniciando registro para ${email} como ${userType}`);
    
    try {
      // Validação básica
      if (!email || !firstName || !lastName || !userType || !password) {
        console.error('Dados incompletos para registro');
        toast.error('Por favor, preencha todos os campos');
        return false;
      }
      
      // Verificar se o tipo de usuário é válido
      if (userType !== 'proprietario' && userType !== 'corretor' && userType !== 'admin') {
        console.error('Tipo de usuário inválido:', userType);
        toast.error('Tipo de usuário inválido');
        return false;
      }
      
      // Criar usuário no Supabase
      console.log('Tentando criar usuário no Supabase...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Erro ao criar usuário:', error);
        
        // Tratar diferentes tipos de erro
        if (error.message.includes('already registered')) {
          toast.error('Este email já está cadastrado. Por favor, tente fazer login.');
        } else if (error.message.includes('password')) {
          toast.error('A senha deve ter pelo menos 6 caracteres.');
        } else if (error.message.includes('email')) {
          toast.error('Email inválido. Por favor, verifique o endereço informado.');
        } else {
          toast.error(`Não foi possível completar o cadastro: ${error.message}`);
        }
        
        return false;
      }
      
      if (!data.user?.id) {
        console.error('ID do usuário não gerado após registro');
        toast.error('Erro ao criar sua conta. Por favor, tente novamente.');
        return false;
      }
      
      console.log(`Usuário criado com sucesso! ID: ${data.user.id}`);
      
      // Criar perfil do usuário
      try {
        console.log('Criando perfil do usuário na tabela "usuarios"...');
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert([
            {
              id: data.user.id,
              email: email,
              primeiro_nome: firstName,
              ultimo_nome: lastName,
              tipo_usuario: userType as 'proprietario' | 'corretor' | 'admin',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
        
        if (profileError) {
          console.error('Erro ao criar perfil do usuário:', profileError);
          
          // Tentar reverter a criação do usuário
          try {
            await supabase.auth.admin.deleteUser(data.user.id);
            console.log('Usuário removido após falha na criação do perfil');
          } catch (deleteError) {
            console.error('Não foi possível reverter criação do usuário:', deleteError);
          }
          
          toast.error('Não foi possível completar seu cadastro. Por favor, tente novamente.');
          return false;
        }
        
        console.log('Perfil do usuário criado com sucesso!');
        
        // Criar objeto de usuário
        const newUser: User = {
          id: data.user.id,
          firstName,
          lastName,
          email,
          userType: userType as 'proprietario' | 'corretor' | 'admin',
          // Asaas temporariamente desativado - definir assinatura ativa por padrão
          subscription: {
            active: true,
            planoId: 'premium',
            expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            asaasId: 'asaas_temp_disabled'
          }
        };
        
        // Salvar usuário na sessão
        sessionStorage.setItem('permutem_user', JSON.stringify(newUser));
        setUser(newUser);
        
        toast.success('Conta criada com sucesso!');
        return true;
      } catch (profileError) {
        console.error('Erro não tratado ao criar perfil:', profileError);
        toast.error('Erro ao criar seu perfil. Por favor, tente novamente.');
        return false;
      }
    } catch (error) {
      console.error('Erro não tratado no processo de registro:', error);
      toast.error('Erro inesperado ao criar sua conta. Por favor, tente novamente.');
      return false;
    }
  };

  // Função de login com redes sociais
  const loginWithSocial = async (provider: 'google' | 'facebook' | 'apple'): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log(`Iniciando login com ${provider}`);
      
      let providerUrl: Types.Provider;
      if (provider === 'google') {
        providerUrl = 'google';
      } else if (provider === 'facebook') {
        providerUrl = 'facebook';
      } else if (provider === 'apple') {
        providerUrl = 'apple';
      } else {
        throw new Error(`Provedor não suportado: ${provider}`);
      }
      
      // Iniciar fluxo de autenticação OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: providerUrl,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        console.error(`Erro ao iniciar login com ${provider}:`, error);
        toast.error(`Não foi possível iniciar login com ${provider}.`);
        return false;
      }
      
      // Supabase redirecionará o usuário para o provedor escolhido
      // O retorno será tratado no callback URL
      console.log(`Login com ${provider} iniciado, redirecionando...`, data);
      
      // Como o usuário será redirecionado, retornamos true aqui
      // O fluxo completo será tratado na página de callback
      return true;
    } catch (error) {
      console.error(`Erro ao processar login com ${provider}:`, error);
      toast.error(`Ocorreu um erro durante o login com ${provider}.`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função de registro com redes sociais
  const registerWithSocial = async (provider: 'google' | 'facebook' | 'apple', userType: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log(`Iniciando registro com ${provider} como ${userType}`);
      
      // Verificar se o tipo de usuário é válido
      if (userType !== 'proprietario' && userType !== 'corretor' && userType !== 'admin') {
        console.error('Tipo de usuário inválido:', userType);
        toast.error('Tipo de usuário inválido');
        return false;
      }
      
      let providerUrl: Types.Provider;
      if (provider === 'google') {
        providerUrl = 'google';
      } else if (provider === 'facebook') {
        providerUrl = 'facebook';
      } else if (provider === 'apple') {
        providerUrl = 'apple';
      } else {
        throw new Error(`Provedor não suportado: ${provider}`);
      }
      
      // Armazenar o tipo de usuário no localStorage para recuperar após o callback
      localStorage.setItem('permutem_signup_usertype', userType);
      
      // Iniciar fluxo de autenticação OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: providerUrl,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?signup=true`,
        }
      });
      
      if (error) {
        console.error(`Erro ao iniciar registro com ${provider}:`, error);
        toast.error(`Não foi possível iniciar registro com ${provider}.`);
        return false;
      }
      
      // Supabase redirecionará o usuário para o provedor escolhido
      // O retorno será tratado no callback URL
      console.log(`Registro com ${provider} iniciado, redirecionando...`, data);
      
      // Como o usuário será redirecionado, retornamos true aqui
      // O fluxo completo será tratado na página de callback
      return true;
    } catch (error) {
      console.error(`Erro ao processar registro com ${provider}:`, error);
      toast.error(`Ocorreu um erro durante o registro com ${provider}.`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      // Remover dados de sessão do storage
      localStorage.removeItem('permutem_user');
      sessionStorage.removeItem('permutem_user');
      
      // Fazer logout no Supabase
      supabase.auth.signOut();
    }
    
    // Limpar estado
    setUser(null);
    
    // Redirecionar para home
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
      loginWithSocial,
      registerWithSocial,
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