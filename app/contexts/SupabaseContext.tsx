'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from '../lib/supabase';
import type { Types } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { initSupabase } from '../lib/init-supabase';
import { mockDataGenerator } from '../lib/mock-data';

type SupabaseContextType = {
  supabase: SupabaseClient;
  planos: Types.Plano[];
  imoveis: Types.Imovel[];
  imoveisDestaque: Types.Imovel[];
  propostas: Types.Proposta[];
  usuarios: Types.Usuario[];
  isLoading: boolean;
  recarregarUsuarios: () => Promise<void>;
  recarregarImoveis: () => Promise<void>;
  recarregarPropostas: () => Promise<void>;
  recarregarPlanos: () => Promise<void>;
  recarregarImoveisDestaque: () => Promise<void>;
  alterarDestaqueImovel: (id: string, destaque: boolean) => Promise<boolean>;
  alterarStatusImovel: (id: string, status: 'ativo' | 'inativo' | 'vendido' | 'permutado') => Promise<boolean>;
  alterarStatusUsuario: (id: string, status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado') => Promise<boolean>;
  alterarStatusProposta: (id: string, status: 'pendente' | 'aceita' | 'recusada' | 'cancelada') => Promise<boolean>;
  fetchImoveisUsuario: (userId: string) => Promise<Types.Imovel[]>;
  fetchPropostasRecebidas: (userId: string) => Promise<Types.Proposta[]>;
  fetchPropostasEnviadas: (userId: string) => Promise<Types.Proposta[]>;
  fetchFavoritos: (userId: string) => Promise<Types.Favorito[]>;
  fetchHistoricoPagamentos: (userId: string) => Promise<Types.Pagamento[]>;
  fetchUsuario: (userId: string) => Promise<Types.Usuario | null>;
  fetchAssinaturaUsuario: (userId: string) => Promise<Types.Assinatura | null>;
  cadastrarNovoImovel: (imovel: Omit<Types.Imovel, 'id'>) => Promise<Types.Imovel | undefined>;
  enviarProposta: (proposta: Omit<Types.Proposta, 'id' | 'data_criacao' | 'data_atualizacao'>) => Promise<Types.Proposta | undefined>;
  fetchImoveis: (filters?: any) => Promise<Types.Imovel[]>;
  fetchMeusImoveis: (filters?: any) => Promise<{
    imoveis: Types.Imovel[],
    estatisticas: any,
    pagination: any
  }>;
  fetchImovelPorId: (id: string) => Promise<{imovel: Types.Imovel, ehProprietario: boolean} | null>;
  criarImovel: (dadosImovel: Partial<Types.Imovel>) => Promise<{
    success: boolean,
    imovel?: Types.Imovel,
    message?: string,
    error?: string,
    limiteAtingido?: boolean,
    maximoPermitido?: number
  }>;
  atualizarImovel: (id: string, dadosImovel: Partial<Types.Imovel>) => Promise<{
    success: boolean,
    imovel?: Types.Imovel,
    message?: string,
    error?: string
  }>;
  excluirImovel: (id: string) => Promise<{
    success: boolean,
    message?: string,
    error?: string
  }>;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [supabase] = useState<SupabaseClient>(() => createClient(supabaseUrl, supabaseAnonKey));
  const [planos, setPlanos] = useState<Types.Plano[]>([]);
  const [imoveis, setImoveis] = useState<Types.Imovel[]>([]);
  const [imoveisDestaque, setImoveisDestaque] = useState<Types.Imovel[]>([]);
  const [propostas, setPropostas] = useState<Types.Proposta[]>([]);
  const [usuarios, setUsuarios] = useState<Types.Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(true);

  // Simulação de planos
  const mockPlanos: Types.Plano[] = [
    {
      id: 'basic',
      nome: 'Plano Proprietário',
      descricao: 'Ideal para proprietários de imóveis',
      valor_mensal: 40.00,
      valor_anual: 400.00,
      max_anuncios: 5,
      recursos: ['Até 5 imóveis cadastrados', 'Visualização de propostas', 'Suporte por email', 'Destaque nos resultados de busca'],
      ativo: true,
      ordem: 1,
      destaque: true,
      tipo_usuario: 'proprietario',
      periodo: 'mensal',
      preco: 40.00,
      limite_imoveis: 5,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    },
    {
      id: 'chave',
      nome: 'Plano Chave',
      descricao: 'Para corretores e imobiliárias de pequeno porte',
      valor_mensal: 180.00,
      valor_anual: 1800.00,
      max_anuncios: 30,
      recursos: [
        'Até 30 imóveis cadastrados',
        'Visualização de propostas',
        'Destaque na busca',
        'Suporte prioritário',
        'Dashboard de estatísticas'
      ],
      ativo: true,
      ordem: 2,
      destaque: false,
      tipo_usuario: 'corretor',
      periodo: 'mensal',
      preco: 180.00,
      limite_imoveis: 30,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    },
    {
      id: 'porta-aberta',
      nome: 'Plano Porta Aberta',
      descricao: 'Para imobiliárias de médio porte',
      valor_mensal: 290.00,
      valor_anual: 2900.00,
      max_anuncios: 70,
      recursos: [
        'Até 70 imóveis cadastrados',
        'Visualização de propostas',
        'Destaque na busca',
        'Análise de mercado',
        'Suporte prioritário',
        'Dashboard de estatísticas'
      ],
      ativo: true,
      ordem: 3,
      destaque: true,
      tipo_usuario: 'corretor',
      periodo: 'mensal',
      preco: 290.00,
      limite_imoveis: 70,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    },
    {
      id: 'troca-premium',
      nome: 'Plano Troca Premium',
      descricao: 'Para imobiliárias que desejam mais visibilidade',
      valor_mensal: 390.00,
      valor_anual: 3900.00,
      max_anuncios: 100,
      recursos: [
        'Até 100 imóveis cadastrados',
        'Visualização de propostas',
        'Destaque na busca',
        'Análise de mercado',
        'Suporte 24/7',
        'Dashboard completo de estatísticas',
        'Certificação de anúncios',
        'Relatórios mensais de performance'
      ],
      ativo: true,
      ordem: 4,
      destaque: false,
      tipo_usuario: 'corretor',
      periodo: 'mensal',
      preco: 390.00,
      limite_imoveis: 100,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    },
    {
      id: 'torre-alta',
      nome: 'Plano Torre Alta',
      descricao: 'Para grandes imobiliárias e redes',
      valor_mensal: 0,
      valor_anual: 0,
      max_anuncios: 999999,
      recursos: [
        'Acima de 100 imóveis cadastrados',
        'Visualização de propostas',
        'Posição privilegiada nos resultados',
        'Análise de mercado completa',
        'Suporte dedicado 24/7',
        'API para integração com sistemas',
        'Dashboard executivo de estatísticas',
        'Certificação premium de anúncios',
        'Relatórios personalizados'
      ],
      ativo: true,
      ordem: 5,
      destaque: false,
      tipo_usuario: 'corretor',
      periodo: 'mensal',
      preco: 0,
      preco_personalizado: true,
      limite_imoveis: 999999,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    }
  ];

  // Carregar dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        await fetchPlanos();
        await fetchImoveis();
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Função para buscar planos
  const fetchPlanos = async (): Promise<Types.Plano[]> => {
    try {
      // Aqui faria a consulta ao Supabase
      // const { data, error } = await supabase.from('planos').select('*').order('ordem');
      
      // Usar mock para desenvolvimento
      const mockData = mockPlanos;
      setPlanos(mockData);
      return mockData;
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      return [];
    }
  };

  // Função para buscar imóveis com filtros
  const fetchImoveis = async (filters?: any): Promise<Types.Imovel[]> => {
    try {
      // Construir URL com filtros
      const urlParams = new URLSearchParams();
      
      if (filters?.tipo) urlParams.append('tipo', filters.tipo);
      if (filters?.status) urlParams.append('status', filters.status);
      if (filters?.page) urlParams.append('page', filters.page.toString());
      if (filters?.limit) urlParams.append('limit', filters.limit.toString());
      if (filters?.somenteUsuario) urlParams.append('somente_usuario', 'true');
      
      // Fazer requisição à API
      const response = await fetch(`/api/imoveis?${urlParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar imóveis');
      }
      
      return data.imoveis;
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      return [];
    }
  };

  // Função para buscar meus imóveis
  const fetchMeusImoveis = async (filters?: any): Promise<{
    imoveis: Types.Imovel[],
    estatisticas: any,
    pagination: any
  }> => {
    try {
      // Construir URL com filtros
      const urlParams = new URLSearchParams();
      
      if (filters?.tipo) urlParams.append('tipo', filters.tipo);
      if (filters?.status) urlParams.append('status', filters.status);
      if (filters?.page) urlParams.append('page', filters.page.toString());
      if (filters?.limit) urlParams.append('limit', filters.limit.toString());
      
      // Fazer requisição à API
      const response = await fetch(`/api/imoveis/meus-imoveis?${urlParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar meus imóveis');
      }
      
      return {
        imoveis: data.imoveis || [],
        estatisticas: data.estatisticas || {},
        pagination: data.pagination || {}
      };
    } catch (error) {
      console.error('Erro ao buscar meus imóveis:', error);
      return {
        imoveis: [],
        estatisticas: {},
        pagination: {}
      };
    }
  };

  // Função para buscar imóvel por ID
  const fetchImovelPorId = async (id: string): Promise<{imovel: Types.Imovel, ehProprietario: boolean} | null> => {
    try {
      // Fazer requisição à API
      const response = await fetch(`/api/imoveis/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar imóvel');
      }
      
      return {
        imovel: data.imovel,
        ehProprietario: data.ehProprietario
      };
    } catch (error) {
      console.error(`Erro ao buscar imóvel ${id}:`, error);
      return null;
    }
  };

  // Função para criar um novo imóvel
  const criarImovel = async (dadosImovel: Partial<Types.Imovel>): Promise<{
    success: boolean,
    imovel?: Types.Imovel,
    message?: string,
    error?: string,
    limiteAtingido?: boolean,
    maximoPermitido?: number
  }> => {
    try {
      // Fazer requisição à API
      const response = await fetch('/api/imoveis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosImovel)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Erro ao criar imóvel',
          limiteAtingido: data.limiteAtingido,
          maximoPermitido: data.maximoPermitido
        };
      }
      
      return {
        success: true,
        imovel: data.imovel,
        message: data.message || 'Imóvel criado com sucesso'
      };
    } catch (error: any) {
      console.error('Erro ao criar imóvel:', error);
      return {
        success: false,
        error: error.message || 'Erro ao criar imóvel'
      };
    }
  };

  // Função para atualizar um imóvel
  const atualizarImovel = async (id: string, dadosImovel: Partial<Types.Imovel>): Promise<{
    success: boolean,
    imovel?: Types.Imovel,
    message?: string,
    error?: string
  }> => {
    try {
      // Fazer requisição à API
      const response = await fetch(`/api/imoveis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosImovel)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Erro ao atualizar imóvel'
        };
      }
      
      return {
        success: true,
        imovel: data.imovel,
        message: data.message || 'Imóvel atualizado com sucesso'
      };
    } catch (error: any) {
      console.error(`Erro ao atualizar imóvel ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Erro ao atualizar imóvel'
      };
    }
  };

  // Função para excluir um imóvel (na verdade, inativa)
  const excluirImovel = async (id: string): Promise<{
    success: boolean,
    message?: string,
    error?: string
  }> => {
    try {
      // Fazer requisição à API
      const response = await fetch(`/api/imoveis/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Erro ao excluir imóvel'
        };
      }
      
      return {
        success: true,
        message: data.message || 'Imóvel excluído com sucesso'
      };
    } catch (error: any) {
      console.error(`Erro ao excluir imóvel ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Erro ao excluir imóvel'
      };
    }
  };

  // Função para buscar imóveis de um usuário específico
  const fetchImoveisUsuario = async (userId: string): Promise<Types.Imovel[]> => {
    try {
      // No Supabase seria:
      // const { data, error } = await supabase.from('imoveis').select('*').eq('user_id', userId);
      
      // Mock para desenvolvimento
      const userImoveis = imoveis.filter(imovel => imovel.user_id === userId);
      return userImoveis;
    } catch (error) {
      console.error(`Erro ao buscar imóveis do usuário ${userId}:`, error);
      return [];
    }
  };

  // Função para buscar propostas recebidas por um usuário
  const fetchPropostasRecebidas = async (userId: string): Promise<Types.Proposta[]> => {
    try {
      // No Supabase seria:
      // const { data, error } = await supabase.from('propostas').select('*').eq('user_destino_id', userId);
      
      // Mock para desenvolvimento
      const mockPropostas: Types.Proposta[] = [];
      for (let i = 1; i <= 5; i++) {
        mockPropostas.push({
          id: `proposta_recebida_${i}`,
          imovel_origem_id: `imovel_${i + 10}`,
          imovel_destino_id: `imovel_${i}`,
          user_origem_id: `user_${i + 5}`,
          user_destino_id: userId,
          mensagem: `Proposta de permuta ${i}. Tenho interesse no seu imóvel.`,
          status: i % 3 === 0 ? 'aceita' : i % 2 === 0 ? 'pendente' : 'recusada',
          valor_adicional: i * 10000,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString()
        });
      }
      return mockPropostas;
    } catch (error) {
      console.error(`Erro ao buscar propostas recebidas pelo usuário ${userId}:`, error);
      return [];
    }
  };

  // Função para buscar propostas enviadas por um usuário
  const fetchPropostasEnviadas = async (userId: string): Promise<Types.Proposta[]> => {
    try {
      // No Supabase seria:
      // const { data, error } = await supabase.from('propostas').select('*').eq('user_origem_id', userId);
      
      // Mock para desenvolvimento
      const mockPropostas: Types.Proposta[] = [];
      for (let i = 1; i <= 3; i++) {
        mockPropostas.push({
          id: `proposta_enviada_${i}`,
          imovel_origem_id: `imovel_${i}`,
          imovel_destino_id: `imovel_${i + 5}`,
          user_origem_id: userId,
          user_destino_id: `user_${i + 2}`,
          mensagem: `Proposta enviada ${i}. Tenho interesse no seu imóvel.`,
          status: i % 2 === 0 ? 'pendente' : 'recusada',
          valor_adicional: i * 5000,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString()
        });
      }
      return mockPropostas;
    } catch (error) {
      console.error(`Erro ao buscar propostas enviadas pelo usuário ${userId}:`, error);
      return [];
    }
  };

  // Função para buscar favoritos de um usuário
  const fetchFavoritos = async (userId: string): Promise<Types.Favorito[]> => {
    try {
      // No Supabase seria:
      // const { data, error } = await supabase.from('favoritos').select('*').eq('user_id', userId);
      
      // Mock para desenvolvimento
      const mockFavoritos: Types.Favorito[] = [];
      for (let i = 1; i <= 4; i++) {
        mockFavoritos.push({
          id: `favorito_${i}`,
          user_id: userId,
          imovel_id: `imovel_${i * 2}`,
          criado_em: new Date().toISOString()
        });
      }
      return mockFavoritos;
    } catch (error) {
      console.error(`Erro ao buscar favoritos do usuário ${userId}:`, error);
      return [];
    }
  };

  // Função para buscar histórico de pagamentos de um usuário
  const fetchHistoricoPagamentos = async (userId: string): Promise<Types.Pagamento[]> => {
    try {
      // No Supabase seria:
      // const { data, error } = await supabase.from('pagamentos').select('*').eq('user_id', userId);
      
      // Mock para desenvolvimento
      const mockPagamentos: Types.Pagamento[] = [];
      const dataPagamento = new Date();
      
      for (let i = 1; i <= 6; i++) {
        // Criar data de pagamento (mês anterior)
        const pagamentoDate = new Date(dataPagamento);
        pagamentoDate.setMonth(pagamentoDate.getMonth() - i);
        
        // Criar data de vencimento (3 dias antes do pagamento)
        const vencimentoDate = new Date(pagamentoDate);
        vencimentoDate.setDate(vencimentoDate.getDate() - 3);
        
        mockPagamentos.push({
          id: `pagamento_${i}`,
          assinatura_id: 'assinatura_1',
          user_id: userId,
          asaas_id: `asaas_payment_${i}`,
          valor: 49.90,
          status: 'paid',
          metodo_pagamento: i % 2 === 0 ? 'card' : 'pix',
          data_pagamento: pagamentoDate.toISOString(),
          data_vencimento: vencimentoDate.toISOString(),
          descricao: `Assinatura Plano Premium - Mês ${i}`,
          criado_em: vencimentoDate.toISOString(),
          atualizado_em: pagamentoDate.toISOString()
        });
      }
      
      return mockPagamentos;
    } catch (error) {
      console.error(`Erro ao buscar histórico de pagamentos do usuário ${userId}:`, error);
      return [];
    }
  };

  // Função para buscar dados de um usuário
  const fetchUsuario = async (userId: string): Promise<Types.Usuario | null> => {
    try {
      // No Supabase seria:
      // const { data, error } = await supabase.from('usuarios').select('*').eq('id', userId).single();
      
      // Mock para desenvolvimento
      const mockUsuario: Types.Usuario = {
        id: userId,
        email: `usuario${userId}@exemplo.com`,
        primeiro_nome: 'João',
        ultimo_nome: 'Silva',
        tipo_usuario: 'proprietario',
        telefone: '(11) 99999-9999',
        cpf_cnpj: '123.456.789-00',
        data_nascimento: '1990-01-01',
        foto_perfil: '/images/avatar.jpg',
        endereco: {
          cep: '12345-678',
          logradouro: 'Rua Exemplo',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          uf: 'SP'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockUsuario;
    } catch (error) {
      console.error(`Erro ao buscar dados do usuário ${userId}:`, error);
      return null;
    }
  };

  // Função para buscar assinatura de um usuário
  const fetchAssinaturaUsuario = async (userId: string): Promise<Types.Assinatura | null> => {
    try {
      // No Supabase seria:
      // const { data, error } = await supabase.from('assinaturas').select('*').eq('user_id', userId).order('data_inicio', { ascending: false }).limit(1).single();
      
      // Mock para desenvolvimento
      const dataInicio = new Date();
      dataInicio.setMonth(dataInicio.getMonth() - 2); // Assinatura iniciada há 2 meses
      
      const dataProximoVencimento = new Date();
      dataProximoVencimento.setDate(dataProximoVencimento.getDate() + 15); // Próximo vencimento em 15 dias
      
      const mockAssinatura: Types.Assinatura = {
        id: 'assinatura_1',
        user_id: userId,
        plano_id: 'premium',
        asaas_id: 'asaas_subscription_1',
        asaas_customer_id: 'asaas_customer_1',
        valor: 49.90,
        status: 'active',
        periodo_cobranca: 'mensal',
        proximo_vencimento: dataProximoVencimento.toISOString(),
        ultimo_pagamento: new Date().toISOString(),
        data_inicio: dataInicio.toISOString(),
        renovacao_automatica: true,
        criado_em: dataInicio.toISOString(),
        atualizado_em: new Date().toISOString()
      };
      
      return mockAssinatura;
    } catch (error) {
      console.error(`Erro ao buscar assinatura do usuário ${userId}:`, error);
      return null;
    }
  };

  // Função para recarregar usuários
  const recarregarUsuarios = async () => {
    try {
      setIsLoading(true);
      
      // Mock para desenvolvimento
      const mockUsuarios: Types.Usuario[] = [];
      for (let i = 1; i <= 20; i++) {
        mockUsuarios.push({
          id: `user_${i}`,
          email: `usuario${i}@exemplo.com`,
          primeiro_nome: `Nome${i}`,
          ultimo_nome: `Sobrenome${i}`,
          tipo_usuario: i % 3 === 0 ? 'corretor' : 'proprietario',
          telefone: `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          data_nascimento: new Date(1980 + i, i % 12, i % 28 + 1).toISOString(),
          status: i % 5 === 0 ? 'pendente' : 'ativo',
          data_registro: new Date(2023, i % 12, i % 28 + 1).toISOString(),
          created_at: new Date(2023, i % 12, i % 28 + 1).toISOString(),
          updated_at: new Date(2023, i % 12, i % 28 + 1).toISOString()
        });
      }
      
      setUsuarios(mockUsuarios);
    } catch (error) {
      console.error('Erro ao recarregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para recarregar imóveis
  const recarregarImoveis = async () => {
    if (isUsingMockData) return;
    
    try {
      const { data: imoveisData, error } = await supabase
        .from('imoveis')
        .select('*')
        .order('data_cadastro', { ascending: false });

      if (error) throw error;
      setImoveis(imoveisData || []);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
      // Fallback para dados simulados
      if (!isUsingMockData) {
        setIsUsingMockData(true);
        const mockData = mockDataGenerator();
        setImoveis(mockData.imoveis);
      }
    }
  };

  // Função para recarregar imóveis em destaque
  const recarregarImoveisDestaque = async () => {
    if (isUsingMockData) return;
    
    try {
      const { data: imoveisData, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('destaque', true)
        .eq('status', 'aprovado')
        .order('data_cadastro', { ascending: false });

      if (error) throw error;
      setImoveisDestaque(imoveisData || []);
    } catch (error) {
      console.error('Erro ao carregar imóveis em destaque:', error);
      // Fallback para dados simulados
      if (!isUsingMockData) {
        setIsUsingMockData(true);
        const mockData = mockDataGenerator();
        setImoveisDestaque(mockData.imoveisDestaque);
      }
    }
  };

  // Função para recarregar propostas
  const recarregarPropostas = async () => {
    if (isUsingMockData) return;
    
    try {
      const { data: propostasData, error } = await supabase
        .from('propostas')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      setPropostas(propostasData || []);
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
      // Fallback para dados simulados
      if (!isUsingMockData) {
        setIsUsingMockData(true);
        const mockData = mockDataGenerator();
        setPropostas(mockData.propostas);
      }
    }
  };

  // Função para recarregar planos
  const recarregarPlanos = async () => {
    if (isUsingMockData) return;
    
    try {
      const { data: planosData, error } = await supabase
        .from('planos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      setPlanos(planosData || []);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      // Fallback para dados simulados
      if (!isUsingMockData) {
        setIsUsingMockData(true);
        const mockData = mockDataGenerator();
        setPlanos(mockData.planos);
      }
    }
  };

  // Função para alterar o destaque de um imóvel
  const alterarDestaqueImovel = async (id: string, destaque: boolean) => {
    if (isUsingMockData) {
      // Atualizar localmente os dados mockados
      setImoveis(imoveis.map(imovel => 
        imovel.id === id ? { ...imovel, destaque } : imovel
      ));
      
      // Atualizar também a lista de destaques se necessário
      if (destaque) {
        const imovelParaDestaque = imoveis.find(i => i.id === id);
        if (imovelParaDestaque && !imoveisDestaque.some(i => i.id === id)) {
          setImoveisDestaque([...imoveisDestaque, imovelParaDestaque]);
        }
      } else {
        setImoveisDestaque(imoveisDestaque.filter(i => i.id !== id));
      }
      
      toast.success(`Imóvel ${destaque ? 'adicionado aos destaques' : 'removido dos destaques'}`);
      return true;
    }
    
    // Código original para quando houver conexão com Supabase
    try {
      const { error } = await supabase
        .from('imoveis')
        .update({ destaque })
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar o estado local após sucesso na API
      setImoveis(imoveis.map(imovel => 
        imovel.id === id ? { ...imovel, destaque } : imovel
      ));
      
      // Atualizar também a lista de destaques
      await recarregarImoveisDestaque();
      
      toast.success(`Imóvel ${destaque ? 'adicionado aos destaques' : 'removido dos destaques'}`);
      return true;
    } catch (error) {
      console.error('Erro ao alterar destaque do imóvel:', error);
      toast.error('Não foi possível alterar o destaque do imóvel');
      return false;
    }
  };

  // Função para alterar o status de um imóvel
  const alterarStatusImovel = async (id: string, status: 'ativo' | 'inativo' | 'vendido' | 'permutado') => {
    try {
      console.log(`Alterando status do imóvel ${id} para ${status}`);
      
      // Atualizar o estado com o novo status
      setImoveis(prevImoveis => 
        prevImoveis.map(imovel => 
          imovel.id === id 
            ? { ...imovel, status, atualizado_em: new Date().toISOString() }
            : imovel
        )
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao alterar status do imóvel:', error);
      return false;
    }
  };
  
  // Função para alterar o status de um usuário
  const alterarStatusUsuario = async (id: string, status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado') => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar a lista de usuários localmente
      setImoveis(prevImoveis => 
        prevImoveis.map(imovel => 
          imovel.id === id ? { ...imovel, status } : imovel
        )
      );
      
      const statusMessages = {
        ativo: 'Usuário ativado com sucesso',
        inativo: 'Usuário inativado',
        pendente: 'Usuário marcado como pendente',
        bloqueado: 'Usuário bloqueado'
      };
      
      toast.success(statusMessages[status]);
      return true;
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      toast.error('Não foi possível alterar o status do usuário');
      return false;
    }
  };
  
  // Função para alterar o status de uma proposta
  const alterarStatusProposta = async (id: string, status: 'pendente' | 'aceita' | 'recusada' | 'cancelada') => {
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('propostas')
        .update({ 
          status,
          data_atualizacao: now
        })
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar a lista de propostas localmente
      setPropostas(prevPropostas => 
        prevPropostas.map(proposta => 
          proposta.id === id ? { ...proposta, status, data_atualizacao: now } : proposta
        )
      );
      
      const statusMessages = {
        pendente: 'Proposta marcada como pendente',
        aceita: 'Proposta aceita com sucesso',
        recusada: 'Proposta recusada',
        cancelada: 'Proposta cancelada'
      };
      
      toast.success(statusMessages[status]);
      return true;
    } catch (error) {
      console.error('Erro ao alterar status da proposta:', error);
      toast.error('Não foi possível alterar o status da proposta');
      return false;
    }
  };
  
  // Cadastrar novo imóvel
  const cadastrarNovoImovel = async (imovel: Omit<Types.Imovel, 'id'>): Promise<Types.Imovel | undefined> => {
    try {
      console.log('Cadastrando novo imóvel:', imovel);
      
      // No modo de desenvolvimento, criar um mock
      const mockId = `imovel_${Date.now()}`;
      
      // Garantir que o status é compatível com o tipo Imovel
      const status: 'ativo' | 'inativo' | 'vendido' | 'permutado' = 'ativo';
      
      const novoImovel: Types.Imovel = {
        ...imovel,
        id: mockId,
        status,
        visualizacoes: 0,
        destaque: false,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      };
      
      // Atualizar o estado com o novo imóvel
      setImoveis(prevImoveis => [...prevImoveis, novoImovel]);
      
      return novoImovel;
    } catch (error) {
      console.error('Erro ao cadastrar imóvel:', error);
      return undefined;
    }
  };
  
  // Enviar proposta
  const enviarProposta = async (proposta: Omit<Types.Proposta, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<Types.Proposta | undefined> => {
    try {
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
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Atualiza o estado local
        setPropostas(prev => [data[0], ...prev]);
        toast.success('Proposta enviada com sucesso!');
        return data[0];
      }
      
      return undefined;
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      toast.error('Não foi possível enviar a proposta');
      return undefined;
    }
  };

  return (
    <SupabaseContext.Provider value={{
      supabase,
      planos,
      imoveis,
      imoveisDestaque,
      propostas,
      usuarios,
      isLoading,
      recarregarUsuarios,
      recarregarImoveis,
      recarregarPropostas,
      recarregarPlanos,
      recarregarImoveisDestaque,
      alterarDestaqueImovel,
      alterarStatusImovel,
      alterarStatusUsuario,
      alterarStatusProposta,
      fetchImoveisUsuario,
      fetchPropostasRecebidas,
      fetchPropostasEnviadas,
      fetchFavoritos,
      fetchHistoricoPagamentos,
      fetchUsuario,
      fetchAssinaturaUsuario,
      cadastrarNovoImovel,
      enviarProposta,
      fetchImoveis,
      fetchMeusImoveis,
      fetchImovelPorId,
      criarImovel,
      atualizarImovel,
      excluirImovel
    }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase deve ser usado dentro de um SupabaseProvider');
  }
  return context;
}; 