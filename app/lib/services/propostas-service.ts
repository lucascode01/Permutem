import { supabase } from '@/app/lib/supabase';
import { Proposta, Mensagem } from '@/app/lib/types';

export interface PropostaFormData {
  imovel_origem_id: string;
  imovel_destino_id: string;
  mensagem: string;
  valor_adicional?: number;
}

// Interface estendida para o resultado da consulta com os dados relacionados
export interface PropostaCompleta extends Proposta {
  imovel_origem?: {
    id: string;
    titulo: string;
    fotos: string[];
    endereco?: {
      cidade: string;
    };
    preco: number;
  };
  imovel_destino?: {
    id: string;
    titulo: string;
    fotos: string[];
    endereco?: {
      cidade: string;
    };
    preco: number;
  };
  usuario_origem?: {
    id: string;
    primeiro_nome: string;
    ultimo_nome: string;
    email: string;
    telefone: string;
  };
  usuario_destino?: {
    id: string;
    primeiro_nome: string;
    ultimo_nome: string;
    email: string;
    telefone: string;
  };
  mensagens?: Mensagem[];
}

class PropostasService {
  /**
   * Cria uma nova proposta de permuta
   */
  async criarProposta(userId: string, data: PropostaFormData): Promise<{ data: Proposta | null; error: Error | null }> {
    try {
      // Primeiro, buscar informações do imóvel de destino para obter o user_id do destinatário
      const { data: imovelDestino, error: fetchError } = await supabase
        .from('imoveis')
        .select('user_id')
        .eq('id', data.imovel_destino_id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Criar a proposta
      const { data: proposta, error } = await supabase
        .from('propostas')
        .insert({
          imovel_origem_id: data.imovel_origem_id,
          imovel_destino_id: data.imovel_destino_id,
          user_origem_id: userId,
          user_destino_id: imovelDestino.user_id,
          mensagem: data.mensagem,
          valor_adicional: data.valor_adicional || null,
          status: 'pendente'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Criar notificação para o destinatário
      await this.criarNotificacaoProposta(proposta.id, imovelDestino.user_id);
      
      return { data: proposta, error: null };
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Cria uma notificação para o destinatário da proposta
   */
  private async criarNotificacaoProposta(propostaId: string, destinatarioId: string): Promise<void> {
    try {
      // Buscar detalhes da proposta com informações dos imóveis
      const { data: proposta } = await supabase
        .from('propostas')
        .select(`
          id,
          imoveis!imovel_origem_id (titulo),
          usuarios!user_origem_id (primeiro_nome, ultimo_nome)
        `)
        .eq('id', propostaId)
        .single();
      
      if (!proposta) return;
      
      // Criar notificação
      await supabase
        .from('notificacoes')
        .insert({
          user_id: destinatarioId,
          tipo: 'proposta',
          titulo: 'Nova proposta de permuta recebida',
          conteudo: `${proposta.usuarios.primeiro_nome} ${proposta.usuarios.ultimo_nome} tem interesse em permutar com seu imóvel.`,
          link: `/propostas/${propostaId}`,
          lida: false
        });
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  }

  /**
   * Lista propostas enviadas por um usuário
   */
  async listarPropostasEnviadas(userId: string): Promise<{ data: PropostaCompleta[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          imovel_origem:imoveis!imovel_origem_id (id, titulo, fotos, preco, endereco),
          imovel_destino:imoveis!imovel_destino_id (id, titulo, fotos, preco, endereco),
          usuario_destino:usuarios!user_destino_id (id, primeiro_nome, ultimo_nome, email, telefone)
        `)
        .eq('user_origem_id', userId)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao listar propostas enviadas:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Lista propostas recebidas por um usuário
   */
  async listarPropostasRecebidas(userId: string): Promise<{ data: PropostaCompleta[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          imovel_origem:imoveis!imovel_origem_id (id, titulo, fotos, preco, endereco),
          imovel_destino:imoveis!imovel_destino_id (id, titulo, fotos, preco, endereco),
          usuario_origem:usuarios!user_origem_id (id, primeiro_nome, ultimo_nome, email, telefone)
        `)
        .eq('user_destino_id', userId)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao listar propostas recebidas:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Busca detalhes completos de uma proposta por ID
   */
  async buscarPropostaPorId(propostaId: string): Promise<{ data: PropostaCompleta | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          imovel_origem:imoveis!imovel_origem_id (*),
          imovel_destino:imoveis!imovel_destino_id (*),
          usuario_origem:usuarios!user_origem_id (id, primeiro_nome, ultimo_nome, email, telefone),
          usuario_destino:usuarios!user_destino_id (id, primeiro_nome, ultimo_nome, email, telefone),
          mensagens: mensagens (*)
        `)
        .eq('id', propostaId)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar proposta:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Responde a uma proposta (aceitar ou recusar)
   */
  async responderProposta(propostaId: string, resposta: 'aceita' | 'recusada', mensagem?: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Atualizar status da proposta
      const { error: updateError } = await supabase
        .from('propostas')
        .update({ 
          status: resposta,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', propostaId);
      
      if (updateError) throw updateError;
      
      // Buscar informações da proposta para notificação
      const { data: proposta } = await supabase
        .from('propostas')
        .select(`
          user_origem_id,
          user_destino_id,
          imoveis!imovel_destino_id (titulo),
          usuarios!user_destino_id (primeiro_nome, ultimo_nome)
        `)
        .eq('id', propostaId)
        .single();
      
      if (!proposta) throw new Error('Proposta não encontrada');
      
      // Adicionar mensagem de resposta, se fornecida
      if (mensagem) {
        await this.enviarMensagem(propostaId, proposta.user_destino_id, mensagem);
      }
      
      // Criar notificação para o usuário de origem
      await supabase
        .from('notificacoes')
        .insert({
          user_id: proposta.user_origem_id,
          tipo: 'proposta',
          titulo: `Proposta ${resposta === 'aceita' ? 'aceita' : 'recusada'}`,
          conteudo: `${proposta.usuarios.primeiro_nome} ${resposta === 'aceita' ? 'aceitou' : 'recusou'} sua proposta de permuta para o imóvel "${proposta.imoveis.titulo}".`,
          link: `/propostas/${propostaId}`,
          lida: false
        });
      
      // Se aceita, atualizar status dos imóveis
      if (resposta === 'aceita') {
        await this.atualizarStatusImoveisPermutados(propostaId);
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro ao responder proposta:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Envia uma mensagem em uma proposta
   */
  async enviarMensagem(propostaId: string, userId: string, conteudo: string): Promise<{ data: Mensagem | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('mensagens')
        .insert({
          proposta_id: propostaId,
          user_id: userId,
          conteudo,
          lida: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Atualiza o status dos imóveis para "permutado" quando uma proposta é aceita
   */
  private async atualizarStatusImoveisPermutados(propostaId: string): Promise<void> {
    try {
      // Buscar IDs dos imóveis na proposta
      const { data: proposta } = await supabase
        .from('propostas')
        .select('imovel_origem_id, imovel_destino_id')
        .eq('id', propostaId)
        .single();
      
      if (!proposta) return;
      
      // Atualizar status dos imóveis para "permutado"
      const promises = [
        supabase
          .from('imoveis')
          .update({ status: 'permutado', atualizado_em: new Date().toISOString() })
          .eq('id', proposta.imovel_origem_id),
        supabase
          .from('imoveis')
          .update({ status: 'permutado', atualizado_em: new Date().toISOString() })
          .eq('id', proposta.imovel_destino_id)
      ];
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Erro ao atualizar status dos imóveis:', error);
    }
  }

  /**
   * Cancela uma proposta pendente
   */
  async cancelarProposta(propostaId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Primeiro verificar se a proposta está pendente
      const { data: proposta, error: fetchError } = await supabase
        .from('propostas')
        .select('status, user_origem_id, user_destino_id')
        .eq('id', propostaId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (proposta.status !== 'pendente') {
        throw new Error('Apenas propostas pendentes podem ser canceladas');
      }
      
      // Atualizar status da proposta para cancelada
      const { error } = await supabase
        .from('propostas')
        .update({ 
          status: 'cancelada',
          atualizado_em: new Date().toISOString()
        })
        .eq('id', propostaId);
      
      if (error) throw error;
      
      // Notificar o destinatário sobre o cancelamento
      await supabase
        .from('notificacoes')
        .insert({
          user_id: proposta.user_destino_id,
          tipo: 'proposta',
          titulo: 'Proposta cancelada',
          conteudo: 'Uma proposta de permuta foi cancelada pelo remetente.',
          link: `/propostas/${propostaId}`,
          lida: false
        });
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro ao cancelar proposta:', error);
      return { success: false, error: error as Error };
    }
  }
}

export const propostasService = new PropostasService(); 