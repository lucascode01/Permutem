-- Script para configurar o banco de dados do Permutem
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Habilitar extensão uuid-ossp para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  primeiro_nome TEXT NOT NULL,
  ultimo_nome TEXT NOT NULL,
  tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('proprietario', 'corretor', 'admin')),
  telefone TEXT,
  cpf_cnpj TEXT,
  data_nascimento DATE,
  foto_perfil TEXT,
  endereco JSONB,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de planos
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
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela de assinaturas
CREATE TABLE IF NOT EXISTS assinaturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES usuarios(id),
  plano_id TEXT NOT NULL REFERENCES planos(id),
  asaas_id TEXT NOT NULL,
  asaas_customer_id TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'past_due', 'pending')),
  periodo_cobranca TEXT NOT NULL CHECK (periodo_cobranca IN ('mensal', 'anual')),
  proximo_vencimento TIMESTAMP WITH TIME ZONE NOT NULL,
  ultimo_pagamento TIMESTAMP WITH TIME ZONE,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  renovacao_automatica BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, asaas_id)
);

-- 5. Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assinatura_id UUID NOT NULL REFERENCES assinaturas(id),
  user_id UUID NOT NULL REFERENCES usuarios(id),
  asaas_id TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('created', 'pending', 'paid', 'overdue', 'refunded', 'canceled')),
  metodo_pagamento TEXT NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  data_vencimento TIMESTAMP WITH TIME ZONE NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (asaas_id)
);

-- 6. Criar tabela de imóveis
CREATE TABLE IF NOT EXISTS imoveis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES usuarios(id),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('apartamento', 'casa', 'terreno', 'comercial', 'rural', 'outro')),
  finalidade TEXT NOT NULL CHECK (finalidade IN ('permuta', 'venda', 'ambos')),
  preco NUMERIC(15,2) NOT NULL,
  area NUMERIC(10,2) NOT NULL,
  quartos INTEGER,
  banheiros INTEGER,
  vagas INTEGER,
  endereco JSONB NOT NULL,
  caracteristicas TEXT[],
  fotos TEXT[],
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'vendido', 'permutado')),
  destaque BOOLEAN NOT NULL DEFAULT FALSE,
  interesses_permuta TEXT[],
  visualizacoes INTEGER NOT NULL DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Criar tabela de propostas
CREATE TABLE IF NOT EXISTS propostas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  imovel_origem_id UUID NOT NULL REFERENCES imoveis(id),
  imovel_destino_id UUID NOT NULL REFERENCES imoveis(id),
  user_origem_id UUID NOT NULL REFERENCES usuarios(id),
  user_destino_id UUID NOT NULL REFERENCES usuarios(id),
  mensagem TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceita', 'recusada', 'cancelada', 'concluida')),
  valor_adicional NUMERIC(15,2),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Criar tabela de mensagens
CREATE TABLE IF NOT EXISTS mensagens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposta_id UUID NOT NULL REFERENCES propostas(id),
  user_id UUID NOT NULL REFERENCES usuarios(id),
  conteudo TEXT NOT NULL,
  lida BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Criar tabela de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES usuarios(id),
  imovel_id UUID NOT NULL REFERENCES imoveis(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, imovel_id)
);

-- 10. Criar tabela de notificações
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES usuarios(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('proposta', 'mensagem', 'sistema', 'pagamento')),
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  link TEXT,
  lida BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Criar índices para otimização
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_imoveis_user_id ON imoveis(user_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_status ON imoveis(status);
CREATE INDEX IF NOT EXISTS idx_imoveis_tipo ON imoveis(tipo);
CREATE INDEX IF NOT EXISTS idx_propostas_user_origem ON propostas(user_origem_id);
CREATE INDEX IF NOT EXISTS idx_propostas_user_destino ON propostas(user_destino_id);
CREATE INDEX IF NOT EXISTS idx_propostas_status ON propostas(status);
CREATE INDEX IF NOT EXISTS idx_assinaturas_user_id ON assinaturas(user_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas(status);
CREATE INDEX IF NOT EXISTS idx_notificacoes_user_id ON notificacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(user_id, lida) WHERE lida = FALSE;

-- 12. Habilitar Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE propostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- 13. Criar políticas RLS para usuários
CREATE POLICY "Usuários podem ver seu próprio perfil" 
  ON usuarios FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem editar seu próprio perfil" 
  ON usuarios FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admin pode ver todos usuários" 
  ON usuarios FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() AND tipo_usuario = 'admin'
    )
  );

-- 14. Criar políticas RLS para planos
CREATE POLICY "Todos podem ver planos" 
  ON planos FOR SELECT 
  USING (true);

CREATE POLICY "Apenas admin pode editar planos" 
  ON planos FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() AND tipo_usuario = 'admin'
    )
  );

-- 15. Criar políticas RLS para imóveis
CREATE POLICY "Todos podem ver imóveis ativos" 
  ON imoveis FOR SELECT 
  USING (status = 'ativo');

CREATE POLICY "Usuários podem ver seus próprios imóveis" 
  ON imoveis FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Admin pode ver todos imóveis" 
  ON imoveis FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() AND tipo_usuario = 'admin'
    )
  );

CREATE POLICY "Usuários podem inserir imóveis" 
  ON imoveis FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários podem editar seus próprios imóveis" 
  ON imoveis FOR UPDATE 
  USING (user_id = auth.uid());

-- 16. Criar políticas RLS para propostas
CREATE POLICY "Usuários podem ver suas próprias propostas" 
  ON propostas FOR SELECT 
  USING (
    user_origem_id = auth.uid() OR 
    user_destino_id = auth.uid()
  );

CREATE POLICY "Usuários podem inserir propostas" 
  ON propostas FOR INSERT 
  WITH CHECK (user_origem_id = auth.uid());

CREATE POLICY "Usuários podem atualizar suas próprias propostas" 
  ON propostas FOR UPDATE 
  USING (
    (user_origem_id = auth.uid() AND status = 'pendente') OR
    (user_destino_id = auth.uid() AND status = 'pendente')
  );

-- 17. Criar políticas RLS para assinaturas
CREATE POLICY "Usuários podem ver suas próprias assinaturas" 
  ON assinaturas FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Admin pode ver todas assinaturas" 
  ON assinaturas FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() AND tipo_usuario = 'admin'
    )
  );

-- 18. Criar políticas RLS para favoritos
CREATE POLICY "Usuários podem ver seus próprios favoritos" 
  ON favoritos FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem inserir favoritos" 
  ON favoritos FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem deletar seus próprios favoritos" 
  ON favoritos FOR DELETE 
  USING (user_id = auth.uid());

-- 19. Criar políticas RLS para notificações
CREATE POLICY "Usuários podem ver suas próprias notificações" 
  ON notificacoes FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar suas próprias notificações" 
  ON notificacoes FOR UPDATE 
  USING (user_id = auth.uid());

-- 20. Inserir planos padrão
INSERT INTO planos (id, nome, descricao, valor_mensal, valor_anual, max_anuncios, recursos, ativo, ordem, destaque) VALUES
('basic', 'Básico', 'Ideal para proprietários que querem iniciar com permutas', 29.90, 299.00, 3, ARRAY['Até 3 imóveis ativos', 'Sugestões básicas de permuta', 'Visualização de contatos'], true, 1, false),
('premium', 'Premium', 'Para proprietários que desejam mais opções de permuta', 49.90, 499.00, 10, ARRAY['Até 10 imóveis ativos', 'Sugestões avançadas de permuta', 'Destaque nos resultados de busca', 'Estatísticas detalhadas'], true, 2, true),
('professional', 'Profissional', 'Para corretores e imobiliárias', 79.90, 799.00, 30, ARRAY['Até 30 imóveis ativos', 'Sugestões premium de permuta', 'Destaque máximo nos resultados', 'Estatísticas avançadas', 'Suporte prioritário'], true, 3, false)
ON CONFLICT (id) DO NOTHING;

-- 21. Configurar Storage para imagens
-- Nota: As políticas de storage devem ser configuradas separadamente no Supabase Dashboard

-- 22. Criar função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 23. Criar triggers para atualizar timestamps
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_imoveis_updated_at BEFORE UPDATE ON imoveis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_propostas_updated_at BEFORE UPDATE ON propostas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assinaturas_updated_at BEFORE UPDATE ON assinaturas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON pagamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planos_updated_at BEFORE UPDATE ON planos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 24. Criar função para verificar plano ativo
CREATE OR REPLACE FUNCTION check_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM assinaturas 
    WHERE user_id = user_uuid 
    AND status = 'active' 
    AND proximo_vencimento > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 25. Criar função para contar imóveis do usuário
CREATE OR REPLACE FUNCTION count_user_properties(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM imoveis 
    WHERE user_id = user_uuid 
    AND status = 'ativo'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mensagem de conclusão
SELECT 'Banco de dados configurado com sucesso!' as status; 