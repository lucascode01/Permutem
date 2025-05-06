-- Verificar a tabela exatamente como seria retornada pela consulta do SupabaseContext
-- Assumindo que o SupabaseContext busca todos os planos ativos

-- 1. Verificar todos os planos ativos
SELECT id, nome, descricao, preco, recursos, periodo, tipo_usuario
FROM planos
WHERE ativo = TRUE
ORDER BY tipo_usuario, ordem;

-- 2. Verificar se há problemas com o campo periodo
SELECT id, nome, periodo, tipo_usuario
FROM planos
WHERE periodo IS NULL OR periodo = '';

-- 3. Verificar a estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'planos'
ORDER BY ordinal_position; 