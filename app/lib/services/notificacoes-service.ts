import { supabase } from '@/app/lib/supabase';
import { Notificacao } from '@/app/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Verificar se estamos em ambiente browser
const isBrowser = typeof window !== 'undefined';

class NotificacoesService {
  /**
   * Lista as notificações de um usuário
   */
  async listarNotificacoes(userId: string): Promise<{ data: Notificacao[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('user_id', userId)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      
      // Criar notificações de fallback (mock) para desenvolvimento
      // Verificar se está no browser antes de acessar localStorage
      if (isBrowser) {
        try {
          const dataMock: Notificacao[] = this.gerarNotificacoesMock(userId);
          return { data: dataMock, error: null };
        } catch (storageError) {
          console.error('Erro ao gerar notificações mockadas:', storageError);
        }
      }
      
      // Se não está no browser ou falhou, criar notificações em memória
      const agora = new Date();
      const notificacoesEmergencia: Notificacao[] = [
        {
          id: "mock-1",
          user_id: userId,
          tipo: 'sistema',
          titulo: 'Bem-vindo ao Permutem',
          conteudo: 'Obrigado por se cadastrar em nossa plataforma!',
          link: '/dashboard',
          lida: false,
          criado_em: new Date(agora.getTime() - 30 * 60000).toISOString()
        }
      ];
      return { data: notificacoesEmergencia, error: null };
    }
  }

  /**
   * Gera notificações mockadas para desenvolvimento
   */
  private gerarNotificacoesMock(userId: string): Notificacao[] {
    // Verificar se já temos notificações mockadas no localStorage
    try {
      if (!isBrowser) {
        throw new Error('Não estamos em ambiente browser');
      }
      
      const savedNotificacoes = localStorage.getItem(`mock_notificacoes_${userId}`);
      if (savedNotificacoes) {
        try {
          return JSON.parse(savedNotificacoes);
        } catch (error) {
          console.error('Erro ao parsear notificações mockadas:', error);
        }
      }
      
      // Se não temos, criar novas notificações mockadas
      const agora = new Date();
      const notificacoes: Notificacao[] = [
        {
          id: uuidv4(),
          user_id: userId,
          tipo: 'sistema',
          titulo: 'Bem-vindo ao Permutem',
          conteudo: 'Obrigado por se cadastrar em nossa plataforma! Comece cadastrando seu primeiro imóvel.',
          link: '/anuncios/novo',
          lida: false,
          criado_em: new Date(agora.getTime() - 30 * 60000).toISOString()
        },
        {
          id: uuidv4(),
          user_id: userId,
          tipo: 'proposta',
          titulo: 'Nova proposta de permuta',
          conteudo: 'Você recebeu uma nova proposta para seu imóvel "Apartamento 3 quartos em Copacabana"',
          link: '/propostas',
          lida: false,
          criado_em: new Date(agora.getTime() - 2 * 3600000).toISOString()
        },
        {
          id: uuidv4(),
          user_id: userId,
          tipo: 'mensagem',
          titulo: 'Nova mensagem recebida',
          conteudo: 'João Silva enviou uma mensagem sobre seu imóvel',
          link: '/mensagens',
          lida: true,
          criado_em: new Date(agora.getTime() - 1 * 86400000).toISOString()
        },
        {
          id: uuidv4(),
          user_id: userId,
          tipo: 'sistema',
          titulo: 'Seu anúncio está em alta!',
          conteudo: 'Seu imóvel "Casa 4 quartos no Jardim Botânico" recebeu 12 visualizações nas últimas 24 horas.',
          link: '/anuncios',
          lida: true,
          criado_em: new Date(agora.getTime() - 2 * 86400000).toISOString()
        },
        {
          id: uuidv4(),
          user_id: userId,
          tipo: 'pagamento',
          titulo: 'Assinatura renovada',
          conteudo: 'Sua assinatura do plano Premium foi renovada com sucesso.',
          link: '/perfil',
          lida: true,
          criado_em: new Date(agora.getTime() - 15 * 86400000).toISOString()
        }
      ];
      
      // Salvar no localStorage para manter consistência entre reloads
      try {
        localStorage.setItem(`mock_notificacoes_${userId}`, JSON.stringify(notificacoes));
      } catch (error) {
        console.error('Erro ao salvar notificações no localStorage:', error);
      }
      
      return notificacoes;
    } catch (error) {
      console.error('Erro no gerarNotificacoesMock:', error);
      throw error;
    }
  }

  /**
   * Busca uma notificação por ID
   */
  async buscarNotificacaoPorId(notificacaoId: string): Promise<{ data: Notificacao | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('id', notificacaoId)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar notificação:', error);
      
      // Tentar encontrar na versão mockada
      const mockNotificacoes = this.buscarTodasNotificacoesMock();
      const notificacao = mockNotificacoes.find(n => n.id === notificacaoId);
      
      return { data: notificacao || null, error: notificacao ? null : error as Error };
    }
  }

  /**
   * Busca todas as notificações mockadas de todos os usuários
   */
  private buscarTodasNotificacoesMock(): Notificacao[] {
    const todasNotificacoes: Notificacao[] = [];
    
    // Verificar se está no browser antes de usar localStorage
    if (!isBrowser) {
      return todasNotificacoes;
    }
    
    // Iterar sobre todas as chaves no localStorage que começam com mock_notificacoes_
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mock_notificacoes_')) {
        try {
          const notificacoes = JSON.parse(localStorage.getItem(key) || '[]');
          todasNotificacoes.push(...notificacoes);
        } catch (error) {
          console.error(`Erro ao parsear ${key}:`, error);
        }
      }
    }
    
    return todasNotificacoes;
  }

  /**
   * Cria uma nova notificação
   */
  async criarNotificacao(notificacao: Omit<Notificacao, 'id' | 'criado_em'>): Promise<{ data: Notificacao | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .insert(notificacao)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      
      // Criar uma nova notificação mock
      const novaNotificacao: Notificacao = {
        id: uuidv4(),
        user_id: notificacao.user_id,
        tipo: notificacao.tipo,
        titulo: notificacao.titulo,
        conteudo: notificacao.conteudo,
        link: notificacao.link,
        lida: notificacao.lida,
        criado_em: new Date().toISOString()
      };
      
      // Adicionar à lista no localStorage
      const savedNotificacoes = localStorage.getItem(`mock_notificacoes_${notificacao.user_id}`);
      let notificacoes: Notificacao[] = [];
      
      if (savedNotificacoes) {
        try {
          notificacoes = JSON.parse(savedNotificacoes);
        } catch (error) {
          console.error('Erro ao parsear notificações mockadas:', error);
        }
      }
      
      notificacoes.unshift(novaNotificacao);
      localStorage.setItem(`mock_notificacoes_${notificacao.user_id}`, JSON.stringify(notificacoes));
      
      return { data: novaNotificacao, error: null };
    }
  }

  /**
   * Marca uma notificação como lida
   */
  async marcarComoLida(notificacaoId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Tentar atualizar no banco de dados real
      try {
        const { error } = await supabase
          .from('notificacoes')
          .update({ lida: true })
          .eq('id', notificacaoId);
        
        if (error) throw error;
        
        return { success: true, error: null };
      } catch (dbError) {
        console.error('Erro ao marcar notificação como lida no banco:', dbError);
        
        // Fallback para localStorage em desenvolvimento
        try {
          // Obter o ID do usuário da notificação para o mockId
          const notificacaoIdParts = notificacaoId.split('_');
          const userId = notificacaoIdParts.length > 1 ? notificacaoIdParts[1] : 'user';
          
          const savedNotificacoes = localStorage.getItem(`mock_notificacoes_${userId}`);
          if (savedNotificacoes) {
            const notificacoes = JSON.parse(savedNotificacoes);
            const updated = notificacoes.map((n: Notificacao) => 
              n.id === notificacaoId ? { ...n, lida: true } : n
            );
            
            localStorage.setItem(`mock_notificacoes_${userId}`, JSON.stringify(updated));
          }
          
          return { success: true, error: null };
        } catch (storageError) {
          console.error('Erro ao atualizar notificação no localStorage:', storageError);
          // Falha silenciosa em desenvolvimento, retornando sucesso mesmo assim
          return { success: true, error: null };
        }
      }
    } catch (error) {
      console.error('Erro inesperado ao marcar notificação como lida:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Remove uma notificação
   */
  async removerNotificacao(notificacaoId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Tentar excluir no banco de dados real
      try {
        const { error } = await supabase
          .from('notificacoes')
          .delete()
          .eq('id', notificacaoId);
        
        if (error) throw error;
        
        return { success: true, error: null };
      } catch (dbError) {
        console.error('Erro ao remover notificação do banco:', dbError);
        
        // Fallback para localStorage em desenvolvimento
        try {
          // Obter o ID do usuário da notificação para o mockId
          const notificacaoIdParts = notificacaoId.split('_');
          const userId = notificacaoIdParts.length > 1 ? notificacaoIdParts[1] : 'user';
          
          const savedNotificacoes = localStorage.getItem(`mock_notificacoes_${userId}`);
          if (savedNotificacoes) {
            const notificacoes = JSON.parse(savedNotificacoes);
            const updated = notificacoes.filter((n: Notificacao) => n.id !== notificacaoId);
            
            localStorage.setItem(`mock_notificacoes_${userId}`, JSON.stringify(updated));
          }
          
          return { success: true, error: null };
        } catch (storageError) {
          console.error('Erro ao remover notificação do localStorage:', storageError);
          // Falha silenciosa em desenvolvimento, retornando sucesso mesmo assim
          return { success: true, error: null };
        }
      }
    } catch (error) {
      console.error('Erro inesperado ao remover notificação:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Marca todas as notificações de um usuário como lidas
   */
  async marcarTodasComoLidas(userId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Tentar atualizar no banco de dados real
      try {
        const { error } = await supabase
          .from('notificacoes')
          .update({ lida: true })
          .eq('user_id', userId)
          .eq('lida', false);
        
        if (error) throw error;
        
        return { success: true, error: null };
      } catch (dbError) {
        console.error('Erro ao marcar todas notificações como lidas no banco:', dbError);
        
        // Fallback para localStorage em desenvolvimento
        try {
          const savedNotificacoes = localStorage.getItem(`mock_notificacoes_${userId}`);
          if (savedNotificacoes) {
            const notificacoes = JSON.parse(savedNotificacoes);
            const updated = notificacoes.map((n: Notificacao) => ({ ...n, lida: true }));
            
            localStorage.setItem(`mock_notificacoes_${userId}`, JSON.stringify(updated));
          }
          
          return { success: true, error: null };
        } catch (storageError) {
          console.error('Erro ao atualizar notificações no localStorage:', storageError);
          // Falha silenciosa em desenvolvimento, retornando sucesso mesmo assim
          return { success: true, error: null };
        }
      }
    } catch (error) {
      console.error('Erro inesperado ao marcar todas notificações como lidas:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Exclui uma notificação
   */
  async excluirNotificacao(notificacaoId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .delete()
        .eq('id', notificacaoId);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
      
      // Excluir da versão mockada
      const mockNotificacoes = this.buscarTodasNotificacoesMock();
      const notificacao = mockNotificacoes.find(n => n.id === notificacaoId);
      
      if (notificacao) {
        const key = `mock_notificacoes_${notificacao.user_id}`;
        const savedNotificacoes = localStorage.getItem(key);
        
        if (savedNotificacoes) {
          try {
            const notificacoes = JSON.parse(savedNotificacoes);
            const notificacoesFiltradas = notificacoes.filter((n: Notificacao) => n.id !== notificacaoId);
            
            localStorage.setItem(key, JSON.stringify(notificacoesFiltradas));
            return { success: true, error: null };
          } catch (error) {
            console.error(`Erro ao atualizar ${key}:`, error);
          }
        }
      }
      
      return { success: false, error: error as Error };
    }
  }

  /**
   * Conta notificações não lidas
   */
  async contarNaoLidas(userId: string): Promise<{ count: number; error: Error | null }> {
    try {
      const { count, error } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('lida', false);
      
      if (error) throw error;
      
      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      
      // Contar na versão mockada
      const key = `mock_notificacoes_${userId}`;
      const savedNotificacoes = localStorage.getItem(key);
      
      if (savedNotificacoes) {
        try {
          const notificacoes = JSON.parse(savedNotificacoes);
          const count = notificacoes.filter((n: Notificacao) => !n.lida).length;
          
          return { count, error: null };
        } catch (error) {
          console.error(`Erro ao contar não lidas em ${key}:`, error);
        }
      }
      
      return { count: 0, error: error as Error };
    }
  }

  /**
   * Cria uma notificação para favoritos
   */
  async notificarFavorito(userId: string, imovelId: string, imovelTitulo: string): Promise<void> {
    try {
      await this.criarNotificacao({
        user_id: userId,
        tipo: 'sistema',
        titulo: 'Novo favorito',
        conteudo: `Seu imóvel "${imovelTitulo}" foi adicionado aos favoritos.`,
        link: `/anuncios/detalhes/${imovelId}`,
        lida: false
      });
    } catch (error) {
      console.error('Erro ao notificar favorito:', error);
    }
  }

  /**
   * Cria uma notificação para visualizações
   */
  async notificarVisualizacoes(userId: string, imovelId: string, imovelTitulo: string, quantidade: number): Promise<void> {
    try {
      await this.criarNotificacao({
        user_id: userId,
        tipo: 'sistema',
        titulo: 'Seu anúncio está em alta!',
        conteudo: `Seu imóvel "${imovelTitulo}" recebeu ${quantidade} visualizações nas últimas 24 horas.`,
        link: `/anuncios/detalhes/${imovelId}`,
        lida: false
      });
    } catch (error) {
      console.error('Erro ao notificar visualizações:', error);
    }
  }

  /**
   * Cria uma notificação para aprovação de imóvel pelo admin
   */
  async notificarAprovacaoImovel(userId: string, imovelId: string, imovelTitulo: string): Promise<void> {
    try {
      await this.criarNotificacao({
        user_id: userId,
        tipo: 'sistema',
        titulo: 'Imóvel aprovado',
        conteudo: `Seu imóvel "${imovelTitulo}" foi aprovado pelo administrador e já está disponível para visualização.`,
        link: `/anuncios/detalhes/${imovelId}`,
        lida: false
      });
    } catch (error) {
      console.error('Erro ao notificar aprovação de imóvel:', error);
    }
  }

  /**
   * Cria uma notificação para rejeição de imóvel pelo admin
   */
  async notificarRejeicaoImovel(userId: string, imovelId: string, imovelTitulo: string, motivo: string): Promise<void> {
    try {
      await this.criarNotificacao({
        user_id: userId,
        tipo: 'sistema',
        titulo: 'Imóvel rejeitado',
        conteudo: `Seu imóvel "${imovelTitulo}" não foi aprovado pelo administrador. Motivo: ${motivo}`,
        link: `/anuncios/detalhes/${imovelId}`,
        lida: false
      });
    } catch (error) {
      console.error('Erro ao notificar rejeição de imóvel:', error);
    }
  }

  /**
   * Cria uma notificação para sugestão de permuta
   */
  async notificarSugestaoPermuta(userId: string, qtdSugestoes: number): Promise<void> {
    try {
      await this.criarNotificacao({
        user_id: userId,
        tipo: 'sistema',
        titulo: 'Novas sugestões de permuta',
        conteudo: `Encontramos ${qtdSugestoes} novos imóveis que combinam com suas preferências de permuta.`,
        link: '/sugestoes',
        lida: false
      });
    } catch (error) {
      console.error('Erro ao notificar sugestão de permuta:', error);
    }
  }
}

export const notificacoesService = new NotificacoesService(); 