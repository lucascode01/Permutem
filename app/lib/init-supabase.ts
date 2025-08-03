import { supabase } from './supabase';

// Função para verificar se uma tabela existe
async function tableExists(tableName: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_name', tableName);
  
  if (error) {
    console.error(`Erro ao verificar se tabela ${tableName} existe:`, error);
    return false;
  }
  
  return (data && data.length > 0);
}

// Criar tabela de usuários
async function createUsuariosTable() {
  const exists = await tableExists('usuarios');
  if (!exists) {
    const { error } = await supabase.rpc('create_usuarios_table', {
      sql: `
      CREATE TABLE IF NOT EXISTS public.usuarios (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        nome TEXT NOT NULL,
        sobrenome TEXT NOT NULL,
        tipo TEXT NOT NULL CHECK (tipo IN ('proprietario', 'corretor', 'admin')),
        telefone TEXT,
        data_registro TIMESTAMP WITH TIME ZONE DEFAULT now(),
        ultimo_login TIMESTAMP WITH TIME ZONE DEFAULT now(),
        status TEXT NOT NULL CHECK (status IN ('ativo', 'inativo', 'pendente', 'bloqueado')),
        verificado BOOLEAN DEFAULT false,
        plano_id UUID REFERENCES public.planos(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      -- Políticas de segurança RLS
      ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
      
      -- Criar políticas para usuários
      CREATE POLICY "Usuários podem ver seu próprio perfil" 
        ON public.usuarios 
        FOR SELECT 
        USING (auth.uid() = id);
        
      CREATE POLICY "Admin pode ver todos usuários" 
        ON public.usuarios 
        FOR SELECT 
        USING (
          EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND tipo = 'admin'
          )
        );
        
      CREATE POLICY "Usuários podem editar seu próprio perfil" 
        ON public.usuarios 
        FOR UPDATE 
        USING (auth.uid() = id);
      `
    });
    
    if (error) {
      console.error('Erro ao criar tabela de usuários:', error);
    } else {
      console.log('Tabela de usuários criada com sucesso');
    }
  }
}

// Criar tabela de planos
async function createPlanosTable() {
  const exists = await tableExists('planos');
  if (!exists) {
    // Primeiro criar função para executar SQL personalizado
    await supabase.rpc('create_planos_table', {
      sql: `
      CREATE TABLE IF NOT EXISTS public.planos (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nome TEXT NOT NULL,
        descricao TEXT NOT NULL,
        preco DECIMAL(10, 2) NOT NULL,
        periodo TEXT NOT NULL CHECK (periodo = 'mensal'),
        recursos TEXT[] NOT NULL,
        ativo BOOLEAN DEFAULT true,
        destaque BOOLEAN DEFAULT false,
        ordem INTEGER NOT NULL,
        tipo_usuario TEXT CHECK (tipo_usuario IN ('proprietario', 'corretor', 'admin')),
        limite_imoveis INTEGER,
        preco_personalizado BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      -- Políticas de segurança RLS
      ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;
      
      -- Criar políticas para planos
      CREATE POLICY "Todos podem ver planos" 
        ON public.planos 
        FOR SELECT 
        USING (true);
        
      CREATE POLICY "Apenas admin pode editar planos" 
        ON public.planos 
        FOR ALL 
        USING (
          EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND tipo = 'admin'
          )
        );
      `
    });
    
    console.log('Tabela de planos criada com sucesso');
    
    // Inserir planos padrão
    const { error: insertError } = await supabase
      .from('planos')
      .insert([
        {
          nome: 'Básico',
          descricao: 'Ideal para pequenos proprietários',
          preco: 29.90,
          periodo: 'mensal',
          recursos: [
            'Até 3 imóveis cadastrados',
            'Visualização de propostas',
            'Suporte por email'
          ],
          ativo: true,
          destaque: false,
          ordem: 1
        },
        {
          nome: 'Intermediário',
          descricao: 'Perfeito para quem deseja mais opções',
          preco: 59.90,
          periodo: 'mensal',
          recursos: [
            'Até 10 imóveis cadastrados',
            'Visualização de propostas',
            'Destaque na busca',
            'Suporte prioritário'
          ],
          ativo: true,
          destaque: true,
          ordem: 2
        },
        {
          nome: 'Premium',
          descricao: 'Para profissionais e corretores',
          preco: 99.90,
          periodo: 'mensal',
          recursos: [
            'Imóveis ilimitados',
            'Visualização de propostas',
            'Destaque na busca',
            'Análise de mercado',
            'Suporte 24/7',
            'Certificação de anúncios'
          ],
          ativo: true,
          destaque: false,
          ordem: 3
        }
      ]);
      
    if (insertError) {
      console.error('Erro ao inserir planos padrão:', insertError);
    } else {
      console.log('Planos padrão inseridos com sucesso');
    }
  }
}

// Criar tabela de imóveis
async function createImoveisTable() {
  const exists = await tableExists('imoveis');
  if (!exists) {
    const { error } = await supabase.rpc('create_imoveis_table', {
      sql: `
      CREATE TABLE IF NOT EXISTS public.imoveis (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        usuario_id UUID NOT NULL REFERENCES public.usuarios(id),
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        tipo TEXT NOT NULL,
        finalidade TEXT NOT NULL,
        preco DECIMAL(15, 2) NOT NULL,
        area DECIMAL(10, 2) NOT NULL,
        quartos INTEGER,
        banheiros INTEGER,
        vagas INTEGER,
        endereco JSONB NOT NULL,
        caracteristicas TEXT[],
        fotos TEXT[],
        status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'vendido', 'permutado')),
        destaque BOOLEAN DEFAULT false,
        interesses_permuta TEXT[],
        visualizacoes INTEGER NOT NULL DEFAULT 0,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
        atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      -- Políticas de segurança RLS
      ALTER TABLE public.imoveis ENABLE ROW LEVEL SECURITY;
      
      -- Criar políticas para imóveis
      CREATE POLICY "Todos podem ver imóveis aprovados" 
        ON public.imoveis 
        FOR SELECT 
        USING (status = 'aprovado');
        
      CREATE POLICY "Usuários podem ver seus próprios imóveis" 
        ON public.imoveis 
        FOR SELECT 
        USING (usuario_id = auth.uid());
        
      CREATE POLICY "Admin pode ver todos imóveis" 
        ON public.imoveis 
        FOR SELECT 
        USING (
          EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND tipo = 'admin'
          )
        );
        
      CREATE POLICY "Usuários podem editar seus próprios imóveis" 
        ON public.imoveis 
        FOR UPDATE 
        USING (usuario_id = auth.uid());
        
      CREATE POLICY "Usuários podem inserir imóveis" 
        ON public.imoveis 
        FOR INSERT 
        WITH CHECK (auth.uid() IS NOT NULL);
      `
    });
    
    if (error) {
      console.error('Erro ao criar tabela de imóveis:', error);
    } else {
      console.log('Tabela de imóveis criada com sucesso');
    }
  }
}

// Criar tabela de propostas
async function createPropostasTable() {
  const exists = await tableExists('propostas');
  if (!exists) {
    const { error } = await supabase.rpc('create_propostas_table', {
      sql: `
      CREATE TABLE IF NOT EXISTS public.propostas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        usuario_origem_id UUID NOT NULL REFERENCES public.usuarios(id),
        usuario_destino_id UUID NOT NULL REFERENCES public.usuarios(id),
        imovel_origem_id UUID NOT NULL REFERENCES public.imoveis(id),
        imovel_destino_id UUID NOT NULL REFERENCES public.imoveis(id),
        mensagem TEXT,
        status TEXT NOT NULL CHECK (status IN ('pendente', 'aceita', 'recusada', 'cancelada')),
        data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
        data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      -- Políticas de segurança RLS
      ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;
      
      -- Criar políticas para propostas
      CREATE POLICY "Usuários podem ver suas próprias propostas" 
        ON public.propostas 
        FOR SELECT 
        USING (
          usuario_origem_id = auth.uid() OR 
          usuario_destino_id = auth.uid()
        );
        
      CREATE POLICY "Usuários podem inserir propostas" 
        ON public.propostas 
        FOR INSERT 
        WITH CHECK (usuario_origem_id = auth.uid());
        
      CREATE POLICY "Usuários podem atualizar suas próprias propostas" 
        ON public.propostas 
        FOR UPDATE 
        USING (
          (usuario_origem_id = auth.uid() AND status = 'pendente') OR
          (usuario_destino_id = auth.uid() AND status = 'pendente')
        );
      `
    });
    
    if (error) {
      console.error('Erro ao criar tabela de propostas:', error);
    } else {
      console.log('Tabela de propostas criada com sucesso');
    }
  }
}

// Criar tabela de assinaturas
async function createAssinaturasTable() {
  const exists = await tableExists('assinaturas');
  if (!exists) {
    const { error } = await supabase.rpc('create_assinaturas_table', {
      sql: `
      CREATE TABLE IF NOT EXISTS public.assinaturas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        usuario_id UUID NOT NULL REFERENCES public.usuarios(id),
        plano_id UUID NOT NULL REFERENCES public.planos(id),
        data_inicio TIMESTAMP WITH TIME ZONE DEFAULT now(),
        data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('ativa', 'pendente', 'cancelada', 'expirada')),
        renovacao_automatica BOOLEAN DEFAULT true,
        valor_pago DECIMAL(10, 2) NOT NULL,
        ultimo_pagamento TIMESTAMP WITH TIME ZONE DEFAULT now(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      -- Políticas de segurança RLS
      ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
      
      -- Criar políticas para assinaturas
      CREATE POLICY "Usuários podem ver suas próprias assinaturas" 
        ON public.assinaturas 
        FOR SELECT 
        USING (usuario_id = auth.uid());
        
      CREATE POLICY "Admin pode ver todas assinaturas" 
        ON public.assinaturas 
        FOR SELECT 
        USING (
          EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND tipo = 'admin'
          )
        );
      `
    });
    
    if (error) {
      console.error('Erro ao criar tabela de assinaturas:', error);
    } else {
      console.log('Tabela de assinaturas criada com sucesso');
    }
  }
}

// Inicializar todas as tabelas
export async function initSupabase() {
  console.log('Inicializando tabelas do Supabase...');
  
  try {
    // Verificar se as tabelas existem e criar as funções necesárias
    await createStoredProcedures();
    
    // Criar tabelas na ordem correta por causa das referências
    await createPlanosTable();
    await createUsuariosTable();
    await createImoveisTable();
    await createPropostasTable();
    await createAssinaturasTable();
    
    console.log('Inicialização do Supabase concluída com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar tabelas do Supabase:', error);
    return false;
  }
}

// Função para criar os procedimentos armazenados necessários no Supabase
async function createStoredProcedures() {
  // Criar função para executar SQL personalizado
  const { error } = await supabase.rpc('create_stored_procedures', {
    sql: `
    -- Função para criar tabela de planos
    CREATE OR REPLACE FUNCTION create_planos_table(sql TEXT)
    RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;

    -- Função para criar tabela de usuários
    CREATE OR REPLACE FUNCTION create_usuarios_table(sql TEXT)
    RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;

    -- Função para criar tabela de imóveis
    CREATE OR REPLACE FUNCTION create_imoveis_table(sql TEXT)
    RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;

    -- Função para criar tabela de propostas
    CREATE OR REPLACE FUNCTION create_propostas_table(sql TEXT)
    RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;

    -- Função para criar tabela de assinaturas
    CREATE OR REPLACE FUNCTION create_assinaturas_table(sql TEXT)
    RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
    `
  });

  if (error) {
    console.error('Erro ao criar procedimentos armazenados:', error);
    return false;
  }
  
  return true;
} 