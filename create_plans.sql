-- Verificar se a tabela planos existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'planos'
);

-- Criar tabela planos se não existir (baseado no schema do supabase.ts)
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

-- Limpar planos existentes (opcional, remova esta linha se quiser manter os existentes)
-- TRUNCATE TABLE planos;

-- Inserir planos para proprietários
INSERT INTO planos (id, nome, descricao, valor_mensal, valor_anual, max_anuncios, recursos, ativo, ordem, destaque, tipo_usuario)
VALUES
  ('basic-prop', 'Básico', 'Plano básico para proprietários de imóveis', 29.90, 299.00, 1,
   ARRAY['1 imóvel', 'Visibilidade básica', 'Suporte por email'],
   TRUE, 1, FALSE, ARRAY['proprietario']),
   
  ('standard-prop', 'Standard', 'Plano padrão para proprietários de imóveis', 49.90, 499.00, 3,
   ARRAY['3 imóveis', 'Destaque na busca', 'Suporte prioritário', 'Estatísticas de visualização'],
   TRUE, 2, TRUE, ARRAY['proprietario']),
   
  ('premium-prop', 'Premium', 'Plano premium para proprietários de imóveis', 79.90, 799.00, 10,
   ARRAY['10 imóveis', 'Destaque máximo', 'Suporte VIP', 'Estatísticas avançadas', 'Propostas ilimitadas'],
   TRUE, 3, FALSE, ARRAY['proprietario']);

-- Inserir planos para corretores
INSERT INTO planos (id, nome, descricao, valor_mensal, valor_anual, max_anuncios, recursos, ativo, ordem, destaque, tipo_usuario)
VALUES
  ('basic-corretor', 'Corretor Iniciante', 'Plano para corretores iniciantes', 59.90, 599.00, 5,
   ARRAY['5 imóveis', 'Painel de clientes', 'Suporte por email'],
   TRUE, 1, FALSE, ARRAY['corretor']),
   
  ('standard-corretor', 'Corretor Profissional', 'Plano ideal para corretores', 99.90, 999.00, 15,
   ARRAY['15 imóveis', 'Destaque na busca', 'Painel de clientes avançado', 'Suporte prioritário'],
   TRUE, 2, TRUE, ARRAY['corretor']),
   
  ('premium-corretor', 'Corretor Elite', 'Plano premium para corretores', 149.90, 1499.00, 30,
   ARRAY['30 imóveis', 'Destaque máximo', 'CRM completo', 'Suporte VIP', 'Estatísticas avançadas', 'Exportação de dados'],
   TRUE, 3, FALSE, ARRAY['corretor']);

-- Plano para administradores (opcional)
INSERT INTO planos (id, nome, descricao, valor_mensal, valor_anual, max_anuncios, recursos, ativo, ordem, destaque, tipo_usuario)
VALUES
  ('admin', 'Administrador', 'Plano para administradores do sistema', 0.00, 0.00, 999999,
   ARRAY['Acesso completo', 'Recursos administrativos', 'Controle total do sistema'],
   TRUE, 1, FALSE, ARRAY['admin'])
ON CONFLICT (id) DO NOTHING; 