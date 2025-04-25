import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://lvmiyeudjowgtglwmodz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bWl5ZXVkam93Z3RnbHdtb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDA4NTMsImV4cCI6MjA1ODc3Njg1M30.N0gPGMGXOi2SqGX6pWGWBex1sf_S4YzK2FpE2v2Mkq0';

// Criar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas principais do banco de dados
export type Usuario = {
  id: string;
  email: string;
  nome: string;
  sobrenome: string;
  tipo: 'proprietario' | 'corretor' | 'admin';
  telefone?: string;
  data_registro: string;
  ultimo_login: string;
  status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado';
  verificado: boolean;
  plano_id?: string;
};

export type Imovel = {
  id: string;
  usuario_id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  localizacao: string;
  cidade: string;
  estado: string;
  pais: string;
  preco: number;
  preco_usd?: number;
  area: number;
  quartos: number;
  banheiros: number;
  aceita_permuta: boolean;
  status: 'aprovado' | 'pendente' | 'reprovado' | 'pausado';
  data_cadastro: string;
  destaque: boolean;
  imagens: string[];
};

export type Proposta = {
  id: string;
  usuario_origem_id: string;
  usuario_destino_id: string;
  imovel_origem_id: string;
  imovel_destino_id: string;
  mensagem: string;
  status: 'pendente' | 'aceita' | 'recusada' | 'cancelada';
  data_criacao: string;
  data_atualizacao: string;
};

export type Plano = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  periodo: 'mensal';
  recursos: string[];
  ativo: boolean;
  destaque: boolean;
  ordem: number;
  tipo_usuario?: 'proprietario' | 'corretor' | 'admin';
  limite_imoveis?: number;
  preco_personalizado?: boolean;
};

export type Assinatura = {
  id: string;
  usuario_id: string;
  plano_id: string;
  data_inicio: string;
  data_fim: string;
  status: 'ativa' | 'pendente' | 'cancelada' | 'expirada';
  renovacao_automatica: boolean;
  valor_pago: number;
  ultimo_pagamento: string;
};

// Funções para tabela de usuários

// Obter todos os usuários
export async function getUsuarios() {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .order('data_registro', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
  
  return data || [];
}

// Obter usuário por ID
export async function getUsuarioById(id: string) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Erro ao buscar usuário com ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

// Atualizar status do usuário
export async function updateUsuarioStatus(id: string, status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado') {
  const { error } = await supabase
    .from('usuarios')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error(`Erro ao atualizar status do usuário ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Funções para tabela de imóveis

// Obter todos os imóveis
export async function getImoveis() {
  const { data, error } = await supabase
    .from('imoveis')
    .select('*')
    .order('data_cadastro', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar imóveis:', error);
    throw error;
  }
  
  return data || [];
}

// Obter imóveis de um usuário específico
export async function getImoveisByUsuario(usuarioId: string) {
  const { data, error } = await supabase
    .from('imoveis')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('data_cadastro', { ascending: false });
  
  if (error) {
    console.error(`Erro ao buscar imóveis do usuário ${usuarioId}:`, error);
    throw error;
  }
  
  return data || [];
}

// Obter um imóvel específico por ID
export async function getImovelById(id: string) {
  const { data, error } = await supabase
    .from('imoveis')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Erro ao buscar imóvel com ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

// Atualizar o status de um imóvel
export async function alterarStatusImovel(id: string, status: 'aprovado' | 'pendente' | 'reprovado' | 'pausado') {
  const { error } = await supabase
    .from('imoveis')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error(`Erro ao alterar status do imóvel ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Alternar o destaque de um imóvel
export async function toggleDestaqueImovel(id: string, destaque: boolean) {
  const { error } = await supabase
    .from('imoveis')
    .update({ destaque })
    .eq('id', id);
  
  if (error) {
    console.error(`Erro ao alterar destaque do imóvel ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Criar um novo imóvel
export async function criarImovel(imovel: Omit<Imovel, 'id'>) {
  const { data, error } = await supabase
    .from('imoveis')
    .insert([imovel])
    .select();
  
  if (error) {
    console.error('Erro ao criar imóvel:', error);
    throw error;
  }
  
  return data?.[0];
}

// Atualizar um imóvel existente
export async function atualizarImovel(id: string, imovel: Partial<Imovel>) {
  const { error } = await supabase
    .from('imoveis')
    .update(imovel)
    .eq('id', id);
  
  if (error) {
    console.error(`Erro ao atualizar imóvel ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Funções para tabela de propostas

// Obter todas as propostas
export async function getPropostas() {
  const { data, error } = await supabase
    .from('propostas')
    .select('*')
    .order('data_criacao', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar propostas:', error);
    throw error;
  }
  
  return data || [];
}

// Obter propostas enviadas por um usuário
export async function getPropostasEnviadas(usuarioId: string) {
  const { data, error } = await supabase
    .from('propostas')
    .select('*')
    .eq('usuario_origem_id', usuarioId)
    .order('data_criacao', { ascending: false });
  
  if (error) {
    console.error(`Erro ao buscar propostas enviadas pelo usuário ${usuarioId}:`, error);
    throw error;
  }
  
  return data || [];
}

// Obter propostas recebidas por um usuário
export async function getPropostasRecebidas(usuarioId: string) {
  const { data, error } = await supabase
    .from('propostas')
    .select('*')
    .eq('usuario_destino_id', usuarioId)
    .order('data_criacao', { ascending: false });
  
  if (error) {
    console.error(`Erro ao buscar propostas recebidas pelo usuário ${usuarioId}:`, error);
    throw error;
  }
  
  return data || [];
}

// Atualizar status de uma proposta
export async function atualizarStatusProposta(id: string, status: 'pendente' | 'aceita' | 'recusada' | 'cancelada') {
  const { error } = await supabase
    .from('propostas')
    .update({ 
      status, 
      data_atualizacao: new Date().toISOString() 
    })
    .eq('id', id);
  
  if (error) {
    console.error(`Erro ao atualizar status da proposta ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Criar uma nova proposta
export async function criarProposta(proposta: Omit<Proposta, 'id' | 'data_criacao' | 'data_atualizacao'>) {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('propostas')
    .insert([{
      ...proposta,
      data_criacao: now,
      data_atualizacao: now,
      status: 'pendente'
    }])
    .select();
  
  if (error) {
    console.error('Erro ao criar proposta:', error);
    throw error;
  }
  
  return data?.[0];
}

// Funções para tabela de planos

// Obter todos os planos
export async function getPlanos() {
  const { data, error } = await supabase
    .from('planos')
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true });
  
  if (error) {
    console.error('Erro ao buscar planos:', error);
    throw error;
  }
  
  return data || [];
}

// Funções para tabela de assinaturas

// Obter assinatura de um usuário
export async function getAssinaturaUsuario(usuarioId: string) {
  const { data, error } = await supabase
    .from('assinaturas')
    .select('*, planos(*)')
    .eq('usuario_id', usuarioId)
    .eq('status', 'ativa')
    .order('data_inicio', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') { // Ignora erro quando não encontra resultados
    console.error(`Erro ao buscar assinatura do usuário ${usuarioId}:`, error);
    throw error;
  }
  
  return data;
}

// Obter imóveis em destaque para a home
export async function getImoveisDestaque(limite: number = 6) {
  const { data, error } = await supabase
    .from('imoveis')
    .select('*')
    .eq('destaque', true)
    .eq('status', 'aprovado')
    .order('data_cadastro', { ascending: false })
    .limit(limite);
  
  if (error) {
    console.error('Erro ao buscar imóveis em destaque:', error);
    throw error;
  }
  
  return data || [];
} 