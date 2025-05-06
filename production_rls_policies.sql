-- Remover políticas de desenvolvimento existentes
DROP POLICY IF EXISTS "Permitir qualquer inserção - desenvolvimento" ON "usuarios";
DROP POLICY IF EXISTS "Permitir leitura de dados - desenvolvimento" ON "usuarios";
DROP POLICY IF EXISTS "Permitir atualização de dados - desenvolvimento" ON "usuarios";

-- Garantir que RLS está habilitado
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para INSERÇÃO durante registro
-- Importante: Permite que usuários anônimos e autenticados criem registros
CREATE POLICY "Permitir inserção durante registro" ON "usuarios"
FOR INSERT TO public
WITH CHECK (true);

-- Política para SELEÇÃO (leitura)
-- Usuários só podem ver seus próprios dados
CREATE POLICY "Usuários veem apenas seus próprios dados" ON "usuarios"
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Política para UPDATE (atualização)
-- Usuários só podem atualizar seus próprios dados
CREATE POLICY "Usuários atualizam apenas seus próprios dados" ON "usuarios"
FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- Política para REMOÇÃO (delete)
-- Usuários só podem remover seus próprios dados
CREATE POLICY "Usuários removem apenas seus próprios dados" ON "usuarios"
FOR DELETE TO authenticated
USING (auth.uid() = id);

-- OPCIONAL: Política para administradores
-- Administradores podem ver todos os dados de usuários
-- CREATE POLICY "Administradores veem todos os dados" ON "usuarios"
-- FOR SELECT TO authenticated
-- USING (auth.jwt()->>'role' = 'admin'); 