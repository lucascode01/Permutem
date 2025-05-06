-- Primeira parte: Configurar políticas de segurança para a tabela usuarios

-- Remover TODAS as políticas existentes para evitar conflitos
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

-- Segunda parte: Configurar a tabela de planos

-- Verificar se a tabela planos existe, se não, criar
CREATE TABLE IF NOT EXISTS planos (
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
  tipo_usuario TEXT[] NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar campos que o código espera
ALTER TABLE planos 
ADD COLUMN IF NOT EXISTS periodo TEXT DEFAULT 'mensal',
ADD COLUMN IF NOT EXISTS preco NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS limite_imoveis INTEGER,
ADD COLUMN IF NOT EXISTS preco_personalizado BOOLEAN DEFAULT FALSE;

-- Inserir planos para proprietários (se ainda não existem)
INSERT INTO planos (id, nome, descricao, valor_mensal, valor_anual, max_anuncios, recursos, ativo, ordem, destaque, tipo_usuario, periodo, preco, limite_imoveis)
VALUES
  ('basic-prop', 'Básico', 'Plano básico para proprietários de imóveis', 29.90, 299.00, 1,
   ARRAY['1 imóvel', 'Visibilidade básica', 'Suporte por email'],
   TRUE, 1, FALSE, ARRAY['proprietario'], 'mensal', 29.90, 1),
   
  ('standard-prop', 'Standard', 'Plano padrão para proprietários de imóveis', 49.90, 499.00, 3,
   ARRAY['3 imóveis', 'Destaque na busca', 'Suporte prioritário', 'Estatísticas de visualização'],
   TRUE, 2, TRUE, ARRAY['proprietario'], 'mensal', 49.90, 3),
   
  ('premium-prop', 'Premium', 'Plano premium para proprietários de imóveis', 79.90, 799.00, 10,
   ARRAY['10 imóveis', 'Destaque máximo', 'Suporte VIP', 'Estatísticas avançadas', 'Propostas ilimitadas'],
   TRUE, 3, FALSE, ARRAY['proprietario'], 'mensal', 79.90, 10)
ON CONFLICT (id) DO NOTHING;

-- Inserir planos para corretores (se ainda não existem)
INSERT INTO planos (id, nome, descricao, valor_mensal, valor_anual, max_anuncios, recursos, ativo, ordem, destaque, tipo_usuario, periodo, preco, limite_imoveis)
VALUES
  ('basic-corretor', 'Corretor Iniciante', 'Plano para corretores iniciantes', 59.90, 599.00, 5,
   ARRAY['5 imóveis', 'Painel de clientes', 'Suporte por email'],
   TRUE, 1, FALSE, ARRAY['corretor'], 'mensal', 59.90, 5),
   
  ('standard-corretor', 'Corretor Profissional', 'Plano ideal para corretores', 99.90, 999.00, 15,
   ARRAY['15 imóveis', 'Destaque na busca', 'Painel de clientes avançado', 'Suporte prioritário'],
   TRUE, 2, TRUE, ARRAY['corretor'], 'mensal', 99.90, 15),
   
  ('premium-corretor', 'Corretor Elite', 'Plano premium para corretores', 149.90, 1499.00, 30,
   ARRAY['30 imóveis', 'Destaque máximo', 'CRM completo', 'Suporte VIP', 'Estatísticas avançadas', 'Exportação de dados'],
   TRUE, 3, FALSE, ARRAY['corretor'], 'mensal', 149.90, 30)
ON CONFLICT (id) DO NOTHING;

-- Inserir plano para administradores (se ainda não existe)
INSERT INTO planos (id, nome, descricao, valor_mensal, valor_anual, max_anuncios, recursos, ativo, ordem, destaque, tipo_usuario, periodo, preco, limite_imoveis)
VALUES
  ('admin', 'Administrador', 'Plano para administradores do sistema', 0.00, 0.00, 999999,
   ARRAY['Acesso completo', 'Recursos administrativos', 'Controle total do sistema'],
   TRUE, 1, FALSE, ARRAY['admin'], 'mensal', 0.00, 999999)
ON CONFLICT (id) DO NOTHING;

-- Atualizar quaisquer campos que possam estar faltando
UPDATE planos 
SET preco = valor_mensal,
    limite_imoveis = max_anuncios
WHERE preco IS NULL OR limite_imoveis IS NULL; 