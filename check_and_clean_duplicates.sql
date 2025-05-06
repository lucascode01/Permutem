-- Verificar usuários existentes com o email que está causando o erro
SELECT * FROM usuarios 
WHERE email = 'gouveiarx@gmail.com';

-- Se encontrar registros, você pode deletá-los com este comando:
-- DELETE FROM usuarios WHERE email = 'gouveiarx@gmail.com';

-- Ou, se preferir manter os dados mas modificar o email para poder criar um novo:
-- UPDATE usuarios SET email = 'gouveiarx_old@gmail.com' WHERE email = 'gouveiarx@gmail.com';

-- IMPORTANTE: Execute primeiro a consulta SELECT para verificar o que será alterado
-- antes de executar os comandos DELETE ou UPDATE! 