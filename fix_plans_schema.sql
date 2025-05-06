-- Verificar como está a tabela planos atual
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'planos';

-- Ajustar a estrutura da tabela para corresponder ao que o código espera
BEGIN;

-- Backup da tabela original (opcional)
-- CREATE TABLE planos_backup AS SELECT * FROM planos;

-- Adicionar campos que o código espera
ALTER TABLE planos 
ADD COLUMN IF NOT EXISTS periodo TEXT NOT NULL DEFAULT 'mensal',
ADD COLUMN IF NOT EXISTS preco NUMERIC(10,2);

-- Atualizar o campo preco com base no valor_mensal para planos mensais
UPDATE planos SET preco = valor_mensal WHERE periodo = 'mensal';

-- Criar versões anuais dos planos
INSERT INTO planos (
  id, nome, descricao, valor_mensal, valor_anual, max_anuncios, 
  recursos, ativo, ordem, destaque, tipo_usuario, periodo, preco
)
SELECT 
  id || '-anual' as id,
  nome,
  descricao || ' (Anual)',
  valor_mensal,
  valor_anual,
  max_anuncios,
  recursos,
  ativo,
  ordem,
  destaque,
  tipo_usuario,
  'anual' as periodo,
  valor_anual / 12 as preco
FROM planos
WHERE id NOT LIKE '%-anual'
ON CONFLICT (id) DO NOTHING;

-- Adicionar novos campos que possam ser necessários
ALTER TABLE planos
ADD COLUMN IF NOT EXISTS limite_imoveis INTEGER,
ADD COLUMN IF NOT EXISTS preco_personalizado BOOLEAN DEFAULT FALSE;

-- Atualizar limite_imoveis com base no max_anuncios
UPDATE planos SET limite_imoveis = max_anuncios WHERE limite_imoveis IS NULL;

COMMIT; 