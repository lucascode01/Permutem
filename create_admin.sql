-- Script para criar conta de admin
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Primeiro, vamos verificar se a tabela usuarios existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'usuarios'
) as tabela_existe;

-- 2. Se a tabela existe, vamos inserir o admin
-- Nota: O ID será gerado automaticamente pelo Supabase Auth
INSERT INTO usuarios (
  id,
  email,
  primeiro_nome,
  ultimo_nome,
  tipo_usuario,
  telefone,
  criado_em,
  atualizado_em
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- ID temporário, será substituído pelo ID real do Supabase Auth
  'admin@permutem.com.br',
  'Admin',
  'Sistema',
  'admin',
  '(11) 99999-9999',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  primeiro_nome = EXCLUDED.primeiro_nome,
  ultimo_nome = EXCLUDED.ultimo_nome,
  tipo_usuario = EXCLUDED.tipo_usuario,
  telefone = EXCLUDED.telefone,
  atualizado_em = NOW();

-- 3. Verificar se o admin foi criado
SELECT 
  id,
  email,
  primeiro_nome,
  ultimo_nome,
  tipo_usuario,
  criado_em
FROM usuarios 
WHERE email = 'admin@permutem.com.br';

-- 4. Criar função para facilitar a criação de admins
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_first_name TEXT,
  admin_last_name TEXT,
  admin_phone TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- Inserir ou atualizar o admin
  INSERT INTO usuarios (
    email,
    primeiro_nome,
    ultimo_nome,
    tipo_usuario,
    telefone,
    criado_em,
    atualizado_em
  ) VALUES (
    admin_email,
    admin_first_name,
    admin_last_name,
    'admin',
    admin_phone,
    NOW(),
    NOW()
  ) ON CONFLICT (email) DO UPDATE SET
    primeiro_nome = EXCLUDED.primeiro_nome,
    ultimo_nome = EXCLUDED.ultimo_nome,
    tipo_usuario = EXCLUDED.tipo_usuario,
    telefone = EXCLUDED.telefone,
    atualizado_em = NOW()
  RETURNING id INTO admin_id;
  
  RETURN 'Admin criado com ID: ' || admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar admin usando a função
SELECT create_admin_user(
  'admin@permutem.com.br',
  'Admin',
  'Sistema',
  '(11) 99999-9999'
);

-- 6. Listar todos os usuários admin
SELECT 
  id,
  email,
  primeiro_nome,
  ultimo_nome,
  tipo_usuario,
  criado_em
FROM usuarios 
WHERE tipo_usuario = 'admin'
ORDER BY criado_em DESC; 