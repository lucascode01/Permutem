// Exportação de tipos para Assinaturas
export type AssinaturaStatus = 'active' | 'canceled' | 'expired' | 'past_due' | 'pending';

// Tipo para provedores de autenticação OAuth
export type Provider = 'google' | 'facebook' | 'apple' | 'github' | 'gitlab' | 'bitbucket' | 'twitter' | 'discord' | 'twitch' | 'microsoft' | 'slack' | 'spotify';

export interface Assinatura {
  id: string;
  user_id: string;
  plano_id: string;
  asaas_id: string;
  asaas_customer_id: string;
  valor: number;
  status: AssinaturaStatus;
  periodo_cobranca: 'mensal' | 'anual';
  proximo_vencimento: string;
  ultimo_pagamento?: string;
  data_inicio: string;
  renovacao_automatica: boolean;
  criado_em: string;
  atualizado_em: string;
}

// Exportação de tipos para Pagamentos
export type PagamentoStatus = 'created' | 'pending' | 'paid' | 'overdue' | 'refunded' | 'canceled';

export interface Pagamento {
  id: string;
  assinatura_id: string;
  user_id: string;
  asaas_id: string;
  valor: number;
  status: PagamentoStatus;
  metodo_pagamento: 'card' | 'pix' | 'boleto' | 'transfer';
  data_pagamento?: string | null;
  data_vencimento: string;
  descricao: string;
  criado_em: string;
  atualizado_em: string;
}

// Exportação de tipos para Planos
export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  valor_mensal: number;
  valor_anual: number;
  max_anuncios: number;
  recursos: string[];
  ativo: boolean;
  ordem: number;
  destaque: boolean;
  tipo_usuario?: 'proprietario' | 'corretor' | 'admin';
  periodo?: 'mensal' | 'anual';
  preco?: number;
  limite_imoveis?: number;
  preco_personalizado?: boolean;
  criado_em: string;
  atualizado_em: string;
}

// Exportação de tipos para Usuários
export interface Usuario {
  id: string;
  email: string;
  primeiro_nome: string;
  ultimo_nome: string;
  tipo_usuario: 'proprietario' | 'corretor' | 'admin';
  telefone?: string;
  cpf_cnpj?: string;
  data_nascimento?: string;
  foto_perfil?: string;
  status?: 'ativo' | 'inativo' | 'pendente' | 'bloqueado';
  data_registro?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
  };
  created_at: string;
  updated_at: string;
}

// Exportação de tipos para Imóveis
export interface Imovel {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string;
  tipo: 'apartamento' | 'casa' | 'terreno' | 'comercial' | 'rural' | 'outro';
  finalidade: 'permuta' | 'venda' | 'ambos';
  preco: number;
  area: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    latitude?: number;
    longitude?: number;
  };
  caracteristicas: string[];
  fotos: string[];
  status: 'ativo' | 'inativo' | 'vendido' | 'permutado';
  destaque: boolean;
  interesses_permuta: string[];
  visualizacoes: number;
  criado_em: string;
  atualizado_em: string;
}

// Exportação de tipos para Propostas
export interface Proposta {
  id: string;
  imovel_origem_id: string;
  imovel_destino_id: string;
  user_origem_id: string;
  user_destino_id: string;
  mensagem: string;
  status: 'pendente' | 'aceita' | 'recusada' | 'cancelada' | 'concluida';
  valor_adicional?: number;
  criado_em: string;
  atualizado_em: string;
}

// Exportação de tipos para Mensagens
export interface Mensagem {
  id: string;
  proposta_id: string;
  user_id: string;
  conteudo: string;
  lida: boolean;
  criado_em: string;
}

// Exportação de tipos para Favoritos
export interface Favorito {
  id: string;
  user_id: string;
  imovel_id: string;
  criado_em: string;
}

// Exportação de tipos para Notificações
export interface Notificacao {
  id: string;
  user_id: string;
  tipo: 'proposta' | 'mensagem' | 'sistema' | 'pagamento';
  titulo: string;
  conteudo: string;
  link?: string;
  lida: boolean;
  criado_em: string;
} 