-- Execute este script no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  primeiro_nome TEXT NOT NULL,
  ultimo_nome TEXT NOT NULL,
  tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('proprietario', 'corretor', 'admin')),
  telefone TEXT,
  cpf_cnpj TEXT,
  data_nascimento DATE,
  foto_perfil TEXT,
  endereco JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 