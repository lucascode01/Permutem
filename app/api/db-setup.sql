-- PARTE 1: REMOVER TODAS AS POLÍTICAS EXISTENTES

-- Remover as políticas existentes para a tabela usuarios
DROP POLICY IF EXISTS "Permitir inserção durante registro" ON "usuarios";
DROP POLICY IF EXISTS "Usuários veem apenas seus próprios dados" ON "usuarios";
DROP POLICY IF EXISTS "Usuários atualizam apenas seus próprios dados" ON "usuarios";
DROP POLICY IF EXISTS "Usuários removem apenas seus próprios dados" ON "usuarios";
DROP POLICY IF EXISTS "Permitir qualquer inserção - desenvolvimento" ON "usuarios";
DROP POLICY IF EXISTS "Permitir leitura de dados - desenvolvimento" ON "usuarios";
DROP POLICY IF EXISTS "Permitir atualização de dados - desenvolvimento" ON "usuarios";
DROP POLICY IF EXISTS "Enable" ON "usuarios";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "usuarios";
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON "usuarios";
DROP POLICY IF EXISTS "Enable read access for all users" ON "usuarios";

-- Remover políticas existentes para storage
DROP POLICY IF EXISTS "Permitir que usuários autenticados criem buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Permitir que usuários autenticados listem buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Permitir que usuários anônimos listem buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Permitir upload de imagens em imoveis" ON storage.objects;
DROP POLICY IF EXISTS "Permitir visualização de imagens em imoveis" ON storage.objects;
DROP POLICY IF EXISTS "Permitir visualização pública de imagens em imoveis" ON storage.objects;
DROP POLICY IF EXISTS "Permitir visualização anônima de imagens em imoveis" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização de imagens em imoveis" ON storage.objects;
DROP POLICY IF EXISTS "Permitir exclusão de imagens em imoveis" ON storage.objects;
DROP POLICY IF EXISTS "policy_nome" ON storage.objects;
DROP POLICY IF EXISTS "politica_upload" ON storage.objects;
DROP POLICY IF EXISTS "Permitir_uploads_pasta_privada" ON storage.objects;
DROP POLICY IF EXISTS "Permitir_uploads_pasta_usuario" ON storage.objects;
DROP POLICY IF EXISTS "Acesso_individual_usuario" ON storage.objects;

-- PARTE 2: CONFIGURAÇÃO DAS POLÍTICAS DE SEGURANÇA PARA A TABELA USUARIOS

-- Garantir que RLS está habilitado
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Recriar as políticas necessárias
-- Política para INSERÇÃO durante registro
CREATE POLICY "Permitir inserção durante registro" ON "usuarios"
FOR INSERT TO public
WITH CHECK (true);

-- Política para SELEÇÃO (leitura)
CREATE POLICY "Usuários veem apenas seus próprios dados" ON "usuarios"
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Política para UPDATE (atualização)
CREATE POLICY "Usuários atualizam apenas seus próprios dados" ON "usuarios"
FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- Política para REMOÇÃO (delete)
CREATE POLICY "Usuários removem apenas seus próprios dados" ON "usuarios"
FOR DELETE TO authenticated
USING (auth.uid() = id);

-- PARTE 3: CONFIGURAÇÃO DA TABELA DE PLANOS

-- Remover completamente a tabela planos e recriar com a estrutura correta
DROP TABLE IF EXISTS planos;

-- Criar a tabela planos do zero com tipo_usuario como TEXT
CREATE TABLE planos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor_mensal NUMERIC(10,2) NOT NULL,
  valor_anual NUMERIC(10,2) NOT NULL,
  max_anuncios INTEGER NOT NULL,
  recursos TEXT[] NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  ordem INTEGER NOT NULL,
  destaque BOOLEAN NOT NULL DEFAULT FALSE,
  tipo_usuario TEXT NOT NULL,  -- Este é um campo TEXT, não um array
  periodo TEXT NOT NULL DEFAULT 'mensal',
  preco NUMERIC(10,2) NOT NULL,
  limite_imoveis INTEGER,
  preco_personalizado BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir planos para proprietários
INSERT INTO planos (id, nome, descricao, valor_mensal, valor_anual, max_anuncios, recursos, ativo, ordem, destaque, tipo_usuario, periodo, preco, limite_imoveis)
VALUES
  ('basic-prop', 'Básico', 'Plano básico para proprietários de imóveis', 29.90, 299.00, 1,
   ARRAY['1 imóvel', 'Visibilidade básica', 'Suporte por email'],
   TRUE, 1, FALSE, 'proprietario', 'mensal', 29.90, 1),
   
  ('standard-prop', 'Standard', 'Plano padrão para proprietários de imóveis', 49.90, 499.00, 3,
   ARRAY['3 imóveis', 'Destaque na busca', 'Suporte prioritário', 'Estatísticas de visualização'],
   TRUE, 2, TRUE, 'proprietario', 'mensal', 49.90, 3),
   
  ('premium-prop', 'Premium', 'Plano premium para proprietários de imóveis', 79.90, 799.00, 10,
   ARRAY['10 imóveis', 'Destaque máximo', 'Suporte VIP', 'Estatísticas avançadas', 'Propostas ilimitadas'],
   TRUE, 3, FALSE, 'proprietario', 'mensal', 79.90, 10);

-- Inserir planos para corretores
INSERT INTO planos (id, nome, descricao, valor_mensal, valor_anual, max_anuncios, recursos, ativo, ordem, destaque, tipo_usuario, periodo, preco, limite_imoveis)
VALUES
  ('basic-corretor', 'Corretor Iniciante', 'Plano para corretores iniciantes', 59.90, 599.00, 5,
   ARRAY['5 imóveis', 'Painel de clientes', 'Suporte por email'],
   TRUE, 1, FALSE, 'corretor', 'mensal', 59.90, 5),
   
  ('standard-corretor', 'Corretor Profissional', 'Plano ideal para corretores', 99.90, 999.00, 15,
   ARRAY['15 imóveis', 'Destaque na busca', 'Painel de clientes avançado', 'Suporte prioritário'],
   TRUE, 2, TRUE, 'corretor', 'mensal', 99.90, 15),
   
  ('premium-corretor', 'Corretor Elite', 'Plano premium para corretores', 149.90, 1499.00, 30,
   ARRAY['30 imóveis', 'Destaque máximo', 'CRM completo', 'Suporte VIP', 'Estatísticas avançadas', 'Exportação de dados'],
   TRUE, 3, FALSE, 'corretor', 'mensal', 149.90, 30);

-- Inserir plano para administradores
INSERT INTO planos (id, nome, descricao, valor_mensal, valor_anual, max_anuncios, recursos, ativo, ordem, destaque, tipo_usuario, periodo, preco, limite_imoveis)
VALUES
  ('admin', 'Administrador', 'Plano para administradores do sistema', 0.00, 0.00, 999999,
   ARRAY['Acesso completo', 'Recursos administrativos', 'Controle total do sistema'],
   TRUE, 1, FALSE, 'admin', 'mensal', 0.00, 999999);

-- PARTE 4: CRIAÇÃO DA TABELA IMOVEIS

-- Remover a tabela imoveis se existir
DROP TABLE IF EXISTS imoveis CASCADE;

-- Criar a tabela imoveis
CREATE TABLE imoveis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('apartamento', 'casa', 'terreno', 'comercial', 'rural', 'outro')),
  finalidade TEXT NOT NULL CHECK (finalidade IN ('permuta', 'venda', 'ambos')),
  preco NUMERIC(15,2) NOT NULL,
  area NUMERIC(10,2) NOT NULL,
  quartos INTEGER,
  banheiros INTEGER,
  vagas INTEGER,
  endereco JSONB NOT NULL,
  caracteristicas TEXT[],
  fotos TEXT[],
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'vendido', 'permutado')),
  destaque BOOLEAN NOT NULL DEFAULT FALSE,
  interesses_permuta TEXT[],
  visualizacoes INTEGER NOT NULL DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PARTE 5: CONFIGURAÇÃO DAS POLÍTICAS DE STORAGE PARA BUCKETS E OBJETOS

-- Habilite RLS na tabela storage.buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Permita usuários autenticados criarem buckets
CREATE POLICY "Permitir que usuários autenticados criem buckets"
ON storage.buckets
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permita usuários autenticados listar buckets
CREATE POLICY "Permitir que usuários autenticados listem buckets"
ON storage.buckets
FOR SELECT
TO authenticated
USING (true);

-- Permita usuários anônimos listar buckets (para acesso público a imagens)
CREATE POLICY "Permitir que usuários anônimos listem buckets"
ON storage.buckets
FOR SELECT
TO anon
USING (true);

-- Habilite RLS na tabela storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Permita que usuários autenticados insiram objetos no bucket 'imoveis'
CREATE POLICY "Permitir upload de imagens em imoveis"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imoveis');

-- Permita que usuários autenticados visualizem objetos do bucket 'imoveis'
CREATE POLICY "Permitir visualização de imagens em imoveis"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'imoveis');

-- Permita que usuários anônimos visualizem objetos do bucket 'imoveis' (para acesso público)
CREATE POLICY "Permitir visualização pública de imagens em imoveis"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'imoveis');

-- Permita que usuários autenticados atualizem seus próprios objetos no bucket 'imoveis'
CREATE POLICY "Permitir atualização de imagens em imoveis"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'imoveis' AND owner = auth.uid())
WITH CHECK (bucket_id = 'imoveis' AND owner = auth.uid());

-- Permita que usuários autenticados excluam seus próprios objetos no bucket 'imoveis'
CREATE POLICY "Permitir exclusão de imagens em imoveis"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'imoveis' AND owner = auth.uid());

-- PARTE 6: CONFIGURAÇÃO DAS POLÍTICAS PARA A TABELA IMOVEIS

-- Remover políticas existentes para imoveis (caso a tabela exista)
DROP POLICY IF EXISTS "Permitir visualização de todos os imóveis" ON imoveis;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios imóveis" ON imoveis;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios imóveis" ON imoveis;
DROP POLICY IF EXISTS "Usuários podem excluir seus próprios imóveis" ON imoveis;

-- Habilitar RLS na tabela imoveis
ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;

-- Permitir que usuários autenticados possam ver todos os imóveis
CREATE POLICY "Permitir visualização de todos os imóveis"
ON imoveis
FOR SELECT
TO authenticated
USING (true);

-- Permitir que usuários autenticados insiram seus próprios imóveis
CREATE POLICY "Usuários podem criar seus próprios imóveis"
ON imoveis
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Permitir que usuários autenticados atualizem seus próprios imóveis
CREATE POLICY "Usuários podem atualizar seus próprios imóveis"
ON imoveis
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Permitir que usuários autenticados excluam seus próprios imóveis
CREATE POLICY "Usuários podem excluir seus próprios imóveis"
ON imoveis
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- PARTE 7: VERIFICAÇÃO DA CONFIGURAÇÃO

-- Verificar políticas da tabela usuarios
SELECT
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'usuarios';

-- Verificar políticas de storage
SELECT
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage';

-- Verificar estrutura da tabela planos
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'planos'
ORDER BY ordinal_position;

-- Verificar dados dos planos
SELECT id, nome, tipo_usuario, periodo, preco, recursos, limite_imoveis
FROM planos
ORDER BY tipo_usuario, ordem;

-- Verificar se a tabela imoveis existe
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'imoveis';

-- Verificar a estrutura da tabela
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'imoveis'; 