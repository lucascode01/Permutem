'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Usuario, Imovel, Proposta, Plano } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { initSupabase } from '../lib/init-supabase';
import { mockDataGenerator } from '../lib/mock-data';

type SupabaseContextType = {
  usuarios: Usuario[];
  imoveis: Imovel[];
  imoveisDestaque: Imovel[];
  propostas: Proposta[];
  planos: Plano[];
  isLoading: boolean;
  recarregarUsuarios: () => Promise<void>;
  recarregarImoveis: () => Promise<void>;
  recarregarPropostas: () => Promise<void>;
  recarregarPlanos: () => Promise<void>;
  recarregarImoveisDestaque: () => Promise<void>;
  alterarDestaqueImovel: (id: string, destaque: boolean) => Promise<boolean>;
  alterarStatusImovel: (id: string, status: 'aprovado' | 'pendente' | 'reprovado' | 'pausado') => Promise<boolean>;
  alterarStatusUsuario: (id: string, status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado') => Promise<boolean>;
  alterarStatusProposta: (id: string, status: 'pendente' | 'aceita' | 'recusada' | 'cancelada') => Promise<boolean>;
  getImoveisByUsuario: (usuarioId: string) => Promise<Imovel[]>;
  getPropostasUsuario: (usuarioId: string, tipo: 'enviadas' | 'recebidas' | 'todas') => Promise<Proposta[]>;
  cadastrarNovoImovel: (imovel: Omit<Imovel, 'id'>) => Promise<Imovel | undefined>;
  enviarProposta: (proposta: Omit<Proposta, 'id' | 'data_criacao' | 'data_atualizacao'>) => Promise<Proposta | undefined>;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [imoveisDestaque, setImoveisDestaque] = useState<Imovel[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(true);

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      try {
        // Forçar uso de dados simulados para desenvolvimento
        // Comentado temporariamente enquanto o backend não estiver pronto
        /*
        try {
          await initSupabase();
          setIsUsingMockData(false);
        } catch (error) {
          console.warn("Não foi possível inicializar o Supabase, usando dados simulados.", error);
          setIsUsingMockData(true);
        }
        
        // Se não estiver usando mock data, tenta carregar dados reais
        if (!isUsingMockData) {
          await Promise.all([
            recarregarUsuarios(),
            recarregarImoveis(),
            recarregarPropostas(),
            recarregarPlanos(),
            recarregarImoveisDestaque()
          ]);
        } else {
          // Carregar dados simulados
          const mockData = mockDataGenerator();
          setUsuarios(mockData.usuarios);
          setImoveis(mockData.imoveis);
          setImoveisDestaque(mockData.imoveisDestaque);
          setPropostas(mockData.propostas);
          setPlanos(mockData.planos);
        }
        */
        
        // Por enquanto, sempre usamos dados mockados
        const mockData = mockDataGenerator();
        setUsuarios(mockData.usuarios);
        setImoveis(mockData.imoveis);
        setImoveisDestaque(mockData.imoveisDestaque);
        setPropostas(mockData.propostas);
        setPlanos(mockData.planos);
        
        // Exibir notificação
        toast.success('Usando dados de demonstração', {
          duration: 3000,
          position: 'top-center'
        });
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        
        // Fallback para dados mockados
        setIsUsingMockData(true);
        const mockData = mockDataGenerator();
        setUsuarios(mockData.usuarios);
        setImoveis(mockData.imoveis);
        setImoveisDestaque(mockData.imoveisDestaque);
        setPropostas(mockData.propostas);
        setPlanos(mockData.planos);
        
        toast.error('Erro ao carregar dados. Usando dados de demonstração.');
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
    
    // Configurar listeners apenas se não estiver usando dados mock
    // Comentado para evitar erros com o backend indisponível
    /*
    if (!isUsingMockData) {
      // Configurar listeners de tempo real para atualizações
      const usuariosSubscription = supabase
        .channel('usuarios-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'usuarios' 
        }, () => {
          recarregarUsuarios();
        })
        .subscribe();
        
      const imoveisSubscription = supabase
        .channel('imoveis-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'imoveis' 
        }, () => {
          recarregarImoveis();
          recarregarImoveisDestaque();
        })
        .subscribe();
        
      const propostasSubscription = supabase
        .channel('propostas-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'propostas' 
        }, () => {
          recarregarPropostas();
        })
        .subscribe();
        
      // Limpar listeners ao desmontar
      return () => {
        usuariosSubscription.unsubscribe();
        imoveisSubscription.unsubscribe();
        propostasSubscription.unsubscribe();
      };
    }
    */
  }, [isUsingMockData]);

  // Função para recarregar usuários
  const recarregarUsuarios = async () => {
    if (isUsingMockData) return;
    
    try {
      const { data: usuariosData, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('data_registro', { ascending: false });

      if (error) throw error;
      setUsuarios(usuariosData || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      // Fallback para dados simulados se ainda não estiver usando
      if (!isUsingMockData) {
        setIsUsingMockData(true);
        const mockData = mockDataGenerator();
        setUsuarios(mockData.usuarios);
      }
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
  const alterarStatusImovel = async (id: string, status: 'aprovado' | 'pendente' | 'reprovado' | 'pausado') => {
    try {
      const { error } = await supabase
        .from('imoveis')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar a lista de imóveis localmente também
      setImoveis(prevImoveis => 
        prevImoveis.map(imovel => 
          imovel.id === id ? { ...imovel, status } : imovel
        )
      );
      
      // Se o status for alterado para algo que não seja 'aprovado',
      // remova da lista de destaques se estiver lá
      if (status !== 'aprovado') {
        setImoveisDestaque(prevDestaques => 
          prevDestaques.filter(imovel => imovel.id !== id)
        );
      }
      
      const statusMessages = {
        aprovado: 'Imóvel aprovado com sucesso',
        pendente: 'Imóvel colocado em análise',
        reprovado: 'Imóvel reprovado',
        pausado: 'Imóvel pausado'
      };
      
      toast.success(statusMessages[status]);
      return true;
    } catch (error) {
      console.error('Erro ao alterar status do imóvel:', error);
      toast.error('Não foi possível alterar o status do imóvel');
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
      setUsuarios(prevUsuarios => 
        prevUsuarios.map(usuario => 
          usuario.id === id ? { ...usuario, status } : usuario
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
  
  // Obter imóveis de um usuário específico
  const getImoveisByUsuario = async (usuarioId: string): Promise<Imovel[]> => {
    try {
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('data_cadastro', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar imóveis do usuário ${usuarioId}:`, error);
      toast.error('Erro ao carregar seus imóveis');
      return [];
    }
  };
  
  // Obter propostas de um usuário (enviadas e/ou recebidas)
  const getPropostasUsuario = async (usuarioId: string, tipo: 'enviadas' | 'recebidas' | 'todas'): Promise<Proposta[]> => {
    try {
      let query = supabase.from('propostas').select('*');
      
      if (tipo === 'enviadas') {
        query = query.eq('usuario_origem_id', usuarioId);
      } else if (tipo === 'recebidas') {
        query = query.eq('usuario_destino_id', usuarioId);
      } else {
        query = query.or(`usuario_origem_id.eq.${usuarioId},usuario_destino_id.eq.${usuarioId}`);
      }
      
      const { data, error } = await query.order('data_criacao', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar propostas do usuário ${usuarioId}:`, error);
      toast.error('Erro ao carregar suas propostas');
      return [];
    }
  };
  
  // Cadastrar novo imóvel
  const cadastrarNovoImovel = async (imovel: Omit<Imovel, 'id'>): Promise<Imovel | undefined> => {
    try {
      const { data, error } = await supabase
        .from('imoveis')
        .insert([imovel])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Atualiza o estado local
        setImoveis(prev => [data[0], ...prev]);
        toast.success('Imóvel cadastrado com sucesso!');
        return data[0];
      }
      
      return undefined;
    } catch (error) {
      console.error('Erro ao cadastrar imóvel:', error);
      toast.error('Não foi possível cadastrar o imóvel');
      return undefined;
    }
  };
  
  // Enviar proposta
  const enviarProposta = async (proposta: Omit<Proposta, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<Proposta | undefined> => {
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
      usuarios,
      imoveis,
      imoveisDestaque,
      propostas,
      planos,
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
      getImoveisByUsuario,
      getPropostasUsuario,
      cadastrarNovoImovel,
      enviarProposta
    }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}; 