import { supabase } from '@/app/lib/supabase';
import { Favorito, Imovel } from '@/app/lib/types';

class FavoritosService {
  /**
   * Adiciona um imóvel aos favoritos
   */
  async adicionarFavorito(userId: string, imovelId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Verificar se já existe
      const { data: existente } = await supabase
        .from('favoritos')
        .select('id')
        .eq('user_id', userId)
        .eq('imovel_id', imovelId)
        .single();
      
      // Se já existir, retorna sucesso
      if (existente) {
        return { success: true, error: null };
      }
      
      // Adicionar aos favoritos
      const { error } = await supabase
        .from('favoritos')
        .insert({
          user_id: userId,
          imovel_id: imovelId
        });
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Remove um imóvel dos favoritos
   */
  async removerFavorito(userId: string, imovelId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', userId)
        .eq('imovel_id', imovelId);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Lista os imóveis favoritos de um usuário
   */
  async listarFavoritos(userId: string): Promise<{ data: Imovel[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select(`
          imoveis:imovel_id (*)
        `)
        .eq('user_id', userId)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      
      // Transformar o resultado para extrair os imóveis
      const imoveis = data?.map(item => item.imoveis) || [];
      
      return { data: imoveis, error: null };
    } catch (error) {
      console.error('Erro ao listar favoritos:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Verifica se um imóvel está favoritado por um usuário
   */
  async verificarFavorito(userId: string, imovelId: string): Promise<{ favoritado: boolean; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select('id')
        .eq('user_id', userId)
        .eq('imovel_id', imovelId);
      
      if (error) throw error;
      
      return { favoritado: data && data.length > 0, error: null };
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      return { favoritado: false, error: error as Error };
    }
  }
}

export const favoritosService = new FavoritosService(); 