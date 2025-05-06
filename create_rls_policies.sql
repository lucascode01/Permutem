-- Habilita Row Level Security para a tabela usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de perfis durante o registro
CREATE POLICY "Permitir inserção de perfis durante o registro" ON "usuarios"
FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para permitir a leitura dos próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados" ON "usuarios"
FOR SELECT USING (auth.uid() = id);

-- Política para permitir atualização dos próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados" ON "usuarios"
FOR UPDATE USING (auth.uid() = id);

-- Opcional: política para administradores (se necessário)
-- CREATE POLICY "Administradores podem fazer tudo" ON "usuarios"
-- USING (auth.jwt() ? auth.jwt()->>'role' = 'admin' : false); 