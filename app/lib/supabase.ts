import { createClient } from '@supabase/supabase-js';
// Importar tipos do arquivo types.ts
import type * as Types from './types';

// Configuração para desenvolvimento
const devConfig = {
  supabaseUrl: 'https://lvmiyeudjowgtglwmodz.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bWl5ZXVkam93Z3RnbHdtb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDA4NTMsImV4cCI6MjA1ODc3Njg1M30.N0gPGMGXOi2SqGX6pWGWBex1sf_S4YzK2FpE2v2Mkq0'
};

// URL e chave do Supabase
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || devConfig.supabaseUrl;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || devConfig.supabaseKey;

// Tipos para tipar melhor o retorno do Supabase
export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          email: string;
          primeiro_nome: string;
          ultimo_nome: string;
          tipo_usuario: string;
          criado_em: string;
        };
        Insert: {
  id: string;
  email: string;
          primeiro_nome: string;
          ultimo_nome: string;
          tipo_usuario?: string;
        };
      };
      assinaturas: {
        Row: {
  id: string;
  usuario_id: string;
          plano_id: string;
          status: string;
          asaas_id: string;
          criado_em: string;
          expiracao: string | null;
        };
      };
      planos: {
        Row: {
  id: string;
  nome: string;
          valor: number;
          intervalo: string;
  ativo: boolean;
        };
      };
    };
  };
};

// Função para criar um cliente Supabase no lado do cliente
export const createSupabaseClient = () => {
  // Usar as variáveis globais que já têm fallback para desenvolvimento
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Função para criar um cliente Supabase com chave de serviço (para operações administrativas)
export const createSupabaseAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
};

// Criar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Adicionar verificação para ambiente de desenvolvimento
if (process.env.NODE_ENV === 'development' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn('Atenção: Usando configurações de desenvolvimento para o Supabase. Para produção, defina as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

// Reexportar tipos
export type { Types };

// Definição da estrutura de tabelas do Supabase
export const supabaseTables = {
  assinaturas: 'assinaturas',
  pagamentos: 'pagamentos',
  planos: 'planos',
  usuarios: 'usuarios',
  imoveis: 'imoveis',
  propostas: 'propostas',
  mensagens: 'mensagens',
  favoritos: 'favoritos',
  notificacoes: 'notificacoes'
};

// SQL para criar política RLS que permite criar buckets (deve ser executado no SQL Editor do Supabase)
export const rls_policy_bucket_creation = `
-- Habilite RLS na tabela storage.buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Permita usuários autenticados criarem buckets (isso deve ser executado no SQL Editor do Supabase)
CREATE POLICY "Permitir que usuários autenticados criem buckets"
ON storage.buckets
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permita usuários autenticados para listar buckets
CREATE POLICY "Permitir que usuários autenticados listem buckets"
ON storage.buckets
FOR SELECT
TO authenticated
USING (true);

-- Habilite RLS na tabela storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Permita que usuários autenticados insiram objetos no bucket 'imoveis'
CREATE POLICY "Permitir upload de imagens em imoveis"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imoveis');

-- Permita que usuários autenticados visualizem objetos do bucket 'imoveis'
CREATE POLICY "Permitir visualização de imagens em imoveis"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'imoveis');

-- Permita que usuários autenticados atualizem seus próprios objetos no bucket 'imoveis'
CREATE POLICY "Permitir atualização de imagens em imoveis"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'imoveis' AND owner = auth.uid())
WITH CHECK (bucket_id = 'imoveis' AND owner = auth.uid());

-- Permita que usuários autenticados excluam seus próprios objetos no bucket 'imoveis'
CREATE POLICY "Permitir exclusão de imagens em imoveis"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'imoveis' AND owner = auth.uid());
`;

// Definição de scripts SQL para criação das tabelas
export const createTableScripts = {
  usuarios: `
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
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  planos: `
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
  `,
  assinaturas: `
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
  `,
  pagamentos: `
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
  `,
  imoveis: `
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
  `,
  propostas: `
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
  `,
  mensagens: `
    CREATE TABLE IF NOT EXISTS mensagens (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      proposta_id UUID NOT NULL REFERENCES propostas(id),
      user_id UUID NOT NULL REFERENCES usuarios(id),
      conteudo TEXT NOT NULL,
      lida BOOLEAN NOT NULL DEFAULT FALSE,
      criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  favoritos: `
    CREATE TABLE IF NOT EXISTS favoritos (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES usuarios(id),
      imovel_id UUID NOT NULL REFERENCES imoveis(id),
      criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE (user_id, imovel_id)
    );
  `,
  notificacoes: `
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
  `
};

/**
 * Verificar se o bucket existe e criar se necessário
 * @param bucket Nome do bucket no Storage
 * @returns true se o bucket existe ou foi criado com sucesso
 */
export const ensureBucketExists = async (
  bucketName: string = 'imoveis'
): Promise<boolean> => {
  try {
    // Criar cliente com chave de serviço se disponível para evitar erros de RLS
    const storageClient = process.env.SUPABASE_SERVICE_ROLE_KEY 
      ? createSupabaseAdminClient().storage
      : supabase.storage;

    // Verificar se o bucket já existe
    const { data: buckets, error } = await storageClient.listBuckets();
    
    if (error) {
      console.error('Erro ao listar buckets:', error);
      return false;
    }
    
    // Verificar se o bucket já existe
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`Bucket ${bucketName} já existe.`);
      return true;
    }
    
    // Criar o bucket se não existir
    console.log(`Bucket ${bucketName} não existe. Criando...`);
    const { error: createError } = await storageClient.createBucket(bucketName, {
      public: true // Tornar os arquivos públicos por padrão
    });
    
    if (createError) {
      console.error(`Erro ao criar bucket ${bucketName}:`, createError);
      
      // Se o erro é de permissão (RLS), informe ao usuário para configurar as políticas RLS
      if (createError.message.includes('row-level security') || createError.message.includes('permission denied')) {
        console.error(`
          Erro de permissão RLS! Você precisa executar as seguintes consultas SQL no seu Supabase:
          
          ${rls_policy_bucket_creation}
          
          Ou use o cliente Admin com a chave de serviço configurando SUPABASE_SERVICE_ROLE_KEY
        `);
      }
      
      return false;
    }
    
    console.log(`Bucket ${bucketName} criado com sucesso.`);
    return true;
  } catch (error) {
    console.error('Erro ao verificar/criar bucket:', error);
    return false;
  }
};

/**
 * Upload de uma imagem para o Supabase Storage
 * @param file Arquivo a ser enviado
 * @param bucket Nome do bucket no Storage
 * @param path Caminho dentro do bucket (geralmente userID ou prefixo de contexto)
 * @returns Objeto com URL pública da imagem ou erro
 */
export const uploadImage = async (
  file: File,
  bucket: string = 'imoveis', 
  path: string = ''
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    // Verificar e criar o bucket se necessário
    const bucketReady = await ensureBucketExists(bucket);
    
    if (!bucketReady) {
      console.warn('Bucket não disponível, usando armazenamento local temporário');
      // Alternativa: criar uma URL local para o arquivo (não persistente)
      const objectUrl = URL.createObjectURL(file);
      
      // Criamos um objeto para persistir no localStorage como fallback
      const localImageData = {
        name: file.name,
        size: file.size,
        type: file.type,
        objectUrl,
        createdAt: new Date().toISOString()
      };
      
      // Salvar informações do arquivo no localStorage para referência
      try {
        const savedImages = localStorage.getItem('localImageCache') || '[]';
        const imageCache = JSON.parse(savedImages);
        imageCache.push(localImageData);
        localStorage.setItem('localImageCache', JSON.stringify(imageCache));
      } catch (e) {
        console.error('Erro ao salvar cache de imagem local:', e);
      }
      
      return { url: objectUrl, error: null };
    }
    
    // Gerar um nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${path ? path + '/' : ''}${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Enviar o arquivo para o Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Obter a URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    
    // Fallback para armazenamento local temporário em caso de erro
    try {
      console.warn('Usando fallback para armazenamento local temporário');
      const objectUrl = URL.createObjectURL(file);
      return { url: objectUrl, error: null };
    } catch (fallbackError) {
      console.error('Erro também no fallback:', fallbackError);
      return { url: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao fazer upload') };
    }
  }
};

/**
 * Upload de múltiplas imagens para o Supabase Storage
 * @param files Array de arquivos a serem enviados
 * @param bucket Nome do bucket no Storage
 * @param path Caminho dentro do bucket
 * @returns Array com URLs públicas das imagens
 */
export const uploadMultipleImages = async (
  files: File[],
  bucket: string = 'imoveis',
  path: string = ''
): Promise<{ urls: string[]; errors: Error[] }> => {
  const results = await Promise.all(
    files.map(file => uploadImage(file, bucket, path))
  );
  
  const urls = results
    .filter(result => result.url !== null)
    .map(result => result.url as string);
    
  const errors = results
    .filter(result => result.error !== null)
    .map(result => result.error as Error);
  
  return { urls, errors };
}; 