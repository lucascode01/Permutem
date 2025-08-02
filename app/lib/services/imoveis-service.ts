import { supabase } from '@/app/lib/supabase';
import { Imovel } from '@/app/lib/types';

export interface ImovelFormData {
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
  interesses_permuta: string[];
}

class ImoveisService {
  /**
   * Cadastra um novo imóvel
   */
  async cadastrarImovel(userId: string, data: ImovelFormData): Promise<{ data: Imovel | null; error: Error | null }> {
    try {
      const { data: imovel, error } = await supabase
        .from('imoveis')
        .insert({
          user_id: userId,
          titulo: data.titulo,
          descricao: data.descricao,
          tipo: data.tipo,
          finalidade: data.finalidade,
          preco: data.preco,
          area: data.area,
          quartos: data.quartos || null,
          banheiros: data.banheiros || null,
          vagas: data.vagas || null,
          endereco: data.endereco,
          caracteristicas: data.caracteristicas || [],
          fotos: data.fotos || [],
          interesses_permuta: data.interesses_permuta || [],
          status: 'ativo',
          destaque: false,
          visualizacoes: 0
        })
        .select()
        .single();

      if (error) throw error;
      
      return { data: imovel, error: null };
    } catch (error) {
      console.error('Erro ao cadastrar imóvel:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Lista todos os imóveis ativos
   */
  async listarImoveis(page = 1, limit = 10, filters = {}): Promise<{ data: Imovel[] | null; count: number | null; error: Error | null }> {
    try {
      // Calcular o offset baseado na página
      const offset = (page - 1) * limit;
      
      // Iniciar a consulta com os filtros básicos
      let query = supabase
        .from('imoveis')
        .select('*', { count: 'exact' })
        .eq('status', 'ativo')
        .order('criado_em', { ascending: false });
      
      // Aplicar filtros adicionais
      query = this.applyFilters(query, filters);
      
      // Adicionar paginação
      query = query.range(offset, offset + limit - 1);
      
      // Executar a consulta
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return { data, count, error: null };
    } catch (error) {
      console.error('Erro ao listar imóveis:', error);
      return { data: null, count: null, error: error as Error };
    }
  }

  /**
   * Aplica os filtros na consulta
   */
  private applyFilters(query: any, filters: Record<string, any>) {
    // Filtrar por tipo de imóvel
    if (filters.tipo && filters.tipo !== 'todos') {
      query = query.eq('tipo', filters.tipo);
    }
    
    // Filtrar por finalidade
    if (filters.finalidade && filters.finalidade !== 'todos') {
      query = query.eq('finalidade', filters.finalidade);
    }
    
    // Filtrar por faixa de preço
    if (filters.precoMin) {
      query = query.gte('preco', filters.precoMin);
    }
    
    if (filters.precoMax) {
      query = query.lte('preco', filters.precoMax);
    }
    
    // Filtrar por localização
    if (filters.cidade) {
      query = query.contains('endereco', { cidade: filters.cidade });
    }
    
    if (filters.uf) {
      query = query.contains('endereco', { uf: filters.uf });
    }
    
    // Filtrar por quantidade de quartos
    if (filters.quartos) {
      query = query.gte('quartos', filters.quartos);
    }
    
    return query;
  }

  /**
   * Busca um imóvel pelo ID
   */
  async buscarImovelPorId(id: string): Promise<{ data: Imovel | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('imoveis')
        .select('*, usuarios(primeiro_nome, ultimo_nome, telefone, email)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Incrementar visualizações
      await this.incrementarVisualizacoes(id);
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar imóvel:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Incrementa o contador de visualizações
   */
  private async incrementarVisualizacoes(id: string): Promise<void> {
    try {
      // Incrementar visualizações
      await supabase.rpc('increment_visualizacoes', { imovel_id: id });
      
      // Verificar se o imóvel atingiu um marco de visualizações para notificar
      const { data: imovel } = await supabase
        .from('imoveis')
        .select('visualizacoes, user_id, titulo')
        .eq('id', id)
        .single();
      
      if (imovel) {
        // Notificar a cada 10, 50, 100, 500, 1000 visualizações...
        const marcos = [10, 50, 100, 500, 1000, 5000, 10000];
        if (marcos.includes(imovel.visualizacoes)) {
          // Registrar notificação para o proprietário
          await supabase
            .from('notificacoes')
            .insert({
              user_id: imovel.user_id,
              tipo: 'sistema',
              titulo: 'Seu anúncio está em alta!',
              conteudo: `Seu imóvel "${imovel.titulo}" atingiu ${imovel.visualizacoes} visualizações! Continue divulgando para ter mais oportunidades de negócio.`,
              link: `/anuncios/detalhes/${id}`,
              lida: false,
              criado_em: new Date().toISOString()
            });
        }
      }
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error);
    }
  }

  /**
   * Lista imóveis de um usuário específico
   */
  async listarImoveisDoUsuario(userId: string): Promise<{ data: Imovel[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('user_id', userId)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao listar imóveis do usuário:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Atualiza um imóvel existente
   */
  async atualizarImovel(id: string, data: Partial<ImovelFormData>): Promise<{ data: Imovel | null; error: Error | null }> {
    try {
      const { data: imovel, error } = await supabase
        .from('imoveis')
        .update({
          titulo: data.titulo,
          descricao: data.descricao,
          tipo: data.tipo,
          finalidade: data.finalidade,
          preco: data.preco,
          area: data.area,
          quartos: data.quartos,
          banheiros: data.banheiros,
          vagas: data.vagas,
          endereco: data.endereco,
          caracteristicas: data.caracteristicas,
          fotos: data.fotos,
          interesses_permuta: data.interesses_permuta,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: imovel, error: null };
    } catch (error) {
      console.error('Erro ao atualizar imóvel:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Altera o status de um imóvel
   */
  async alterarStatusImovel(id: string, status: 'ativo' | 'inativo' | 'vendido' | 'permutado'): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('imoveis')
        .update({ status, atualizado_em: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro ao alterar status do imóvel:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Exclui um imóvel
   */
  async excluirImovel(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('imoveis')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro ao excluir imóvel:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Adiciona uma imagem ao array de fotos do imóvel
   */
  async adicionarFoto(id: string, fotoUrl: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Primeiro, buscar o imóvel para obter o array atual de fotos
      const { data: imovel, error: fetchError } = await supabase
        .from('imoveis')
        .select('fotos')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Adicionar a nova foto ao array
      const fotosAtualizadas = [...(imovel.fotos || []), fotoUrl];
      
      // Atualizar o imóvel com o novo array de fotos
      const { error: updateError } = await supabase
        .from('imoveis')
        .update({ 
          fotos: fotosAtualizadas,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Remove uma imagem do array de fotos do imóvel
   */
  async removerFoto(id: string, fotoUrl: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Primeiro, buscar o imóvel para obter o array atual de fotos
      const { data: imovel, error: fetchError } = await supabase
        .from('imoveis')
        .select('fotos')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Remover a foto do array
      const fotosAtualizadas = (imovel.fotos || []).filter((foto: string) => foto !== fotoUrl);
      
      // Atualizar o imóvel com o novo array de fotos
      const { error: updateError } = await supabase
        .from('imoveis')
        .update({ 
          fotos: fotosAtualizadas,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Busca imóveis para sugestão de permuta com base em interesses
   */
  async buscarSugestoesPermuta(imovelId: string): Promise<{ data: Imovel[] | null; error: Error | null }> {
    try {
      // Primeiro, buscar o imóvel de origem para obter seus dados
      const { data: imovelOrigem, error: fetchError } = await supabase
        .from('imoveis')
        .select('*')
        .eq('id', imovelId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Buscar imóveis compatíveis com os interesses de permuta
      let query = supabase
        .from('imoveis')
        .select('*')
        .eq('status', 'ativo')
        .neq('user_id', imovelOrigem.user_id) // Não incluir imóveis do mesmo usuário
        .order('criado_em', { ascending: false });
      
      // Filtrar por tipo se especificado nos interesses
      if (imovelOrigem.interesses_permuta && imovelOrigem.interesses_permuta.length > 0) {
        query = query.in('tipo', imovelOrigem.interesses_permuta);
      }
      
      const { data, error } = await query.limit(10);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar sugestões de permuta:', error);
      return { data: null, error: error as Error };
    }
  }
}

export const imoveisService = new ImoveisService(); 