// Configuração do cliente Supabase
// Em desenvolvimento, usa mock; em produção, usa Supabase real

import { createClient } from '@supabase/supabase-js';

// Configuração para desenvolvimento
const devConfig = {
  supabaseUrl: 'https://pclnvditmctgsktdzlta.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbG52ZGl0bWN0Z3NrdGR6bHRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzQ0MzAsImV4cCI6MjA2MzI1MDQzMH0.ECUVBH5l7EyZTcKkh6iLiip8C-h_G3PIq9eY7teHArk'
};

// URL e chave do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || devConfig.supabaseUrl;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || devConfig.supabaseKey;

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock de dados para desenvolvimento
const mockUser = {
  id: 'mock-user-id',
  email: 'dev@permutem.com',
  user_metadata: {
    primeiro_nome: 'Desenvolvedor',
    ultimo_nome: 'Permutem',
    tipo_usuario: 'proprietario'
  }
};

const mockUserProfile = {
  id: 'mock-user-id',
  email: 'dev@permutem.com',
  primeiro_nome: 'Desenvolvedor',
  ultimo_nome: 'Permutem',
  tipo_usuario: 'proprietario' as const,
  telefone: '(11) 99999-9999',
  cpf_cnpj: '123.456.789-00',
  data_nascimento: '1990-01-01',
  foto_perfil: null,
  status: 'ativo' as const,
  endereco: {
    cep: '01234-567',
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Centro',
    cidade: 'São Paulo',
    uf: 'SP'
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser
};

// Se estamos em desenvolvimento e não há configuração do Supabase, usar mock
if (process.env.NODE_ENV === 'development' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.log('🔧 Usando Supabase Mock para desenvolvimento local');
  console.log('📧 Email de teste: dev@permutem.com');
  console.log('🔑 Senha de teste: 123456');
  
  // Sobrescrever métodos do auth
  Object.defineProperty(supabase.auth, 'getSession', {
    value: async () => ({ data: { session: mockSession }, error: null }),
    writable: true
  });

  Object.defineProperty(supabase.auth, 'signInWithPassword', {
    value: async (credentials: { email: string; password: string }) => {
      if (credentials.email === 'dev@permutem.com' && credentials.password === '123456') {
        return { data: { user: mockUser, session: mockSession }, error: null };
      }
      return { data: { user: null, session: null }, error: { message: 'Credenciais inválidas' } };
    },
    writable: true
  });

  Object.defineProperty(supabase.auth, 'signUp', {
    value: async (userData: any) => {
      return { data: { user: mockUser, session: mockSession }, error: null };
    },
    writable: true
  });

  Object.defineProperty(supabase.auth, 'signOut', {
    value: async () => {
      return { error: null };
    },
    writable: true
  });

  Object.defineProperty(supabase.auth, 'resetPasswordForEmail', {
    value: async (email: string) => {
      return { data: {}, error: null };
    },
    writable: true
  });

  Object.defineProperty(supabase.auth, 'onAuthStateChange', {
    value: (callback: any) => {
      // Simular mudança de estado
      setTimeout(() => callback('SIGNED_IN', mockSession), 100);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    writable: true
  });

  // Sobrescrever método from
  Object.defineProperty(supabase, 'from', {
    value: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: string) => ({
          single: async () => {
            if (table === 'usuarios' && column === 'id') {
              return { data: mockUserProfile, error: null };
            }
            return { data: null, error: { code: 'PGRST116' } };
          }
        })
      }),
      insert: (data: any) => ({
        eq: (column: string, value: string) => ({
          single: async () => ({ data: mockUserProfile, error: null })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: string) => ({
          single: async () => ({ data: mockUserProfile, error: null })
        })
      })
    }),
    writable: true
  });
}

export { supabase }; 