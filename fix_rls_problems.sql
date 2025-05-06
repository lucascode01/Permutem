-- Primeiro, vamos remover as políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Permitir inserção de perfis durante o registro" ON "usuarios";
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON "usuarios";
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON "usuarios";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "usuarios";
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON "usuarios";
DROP POLICY IF EXISTS "Enable read access for all users" ON "usuarios";
DROP POLICY IF EXISTS "Enable" ON "usuarios";

-- Agora vamos criar uma nova política que permite inserções de qualquer usuário
-- Esta política é mais permissiva, ideal para desenvolvimento
CREATE POLICY "Permitir qualquer inserção - desenvolvimento" ON "usuarios"
FOR INSERT TO public
WITH CHECK (true);

-- Política para leitura de dados
CREATE POLICY "Permitir leitura de dados - desenvolvimento" ON "usuarios"
FOR SELECT TO public
USING (true);

-- Política para atualização de dados
CREATE POLICY "Permitir atualização de dados - desenvolvimento" ON "usuarios"
FOR UPDATE TO public
USING (true);

-- Se mesmo assim não funcionar, você pode temporariamente desativar o RLS
-- DESCOMENTE a linha abaixo se continuar tendo problemas
-- ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY; 