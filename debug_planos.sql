-- Verificar todos os planos na tabela
SELECT id, nome, tipo_usuario, periodo, preco, ativo FROM planos;

-- Verificar os planos para proprietários
SELECT id, nome, tipo_usuario, periodo, preco FROM planos 
WHERE tipo_usuario = 'proprietario' AND periodo = 'mensal';

-- Verificar os planos para corretores
SELECT id, nome, tipo_usuario, periodo, preco FROM planos 
WHERE tipo_usuario = 'corretor' AND periodo = 'mensal';

-- Verificar se há outros valores de tipo_usuario ou periodo que possam estar causando problemas
SELECT DISTINCT tipo_usuario, periodo FROM planos; 