-- PARTE 1: CONFIGURAÇÃO DAS POLÍTICAS DE SEGURANÇA PARA A TABELA USUARIOS

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

-- PARTE 2: CONFIGURAÇÃO DA TABELA DE PLANOS

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

-- PARTE 3: VERIFICAÇÃO DA CONFIGURAÇÃO

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

-- Verificar estrutura da tabela planos
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'planos'
ORDER BY ordinal_position;

-- Verificar dados dos planos
SELECT id, nome, tipo_usuario, periodo, preco, recursos, limite_imoveis
FROM planos
ORDER BY tipo_usuario, ordem; 