import { supabase } from '@/app/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface FileUploadResult {
  path: string;
  url: string;
}

class UploadService {
  /**
   * Faz upload de uma imagem para o bucket 'imoveis' no Supabase Storage
   */
  async uploadImagem(file: File, userId: string): Promise<{ data: FileUploadResult | null; error: Error | null }> {
    try {
      // Gerar um nome de arquivo único usando timestamp e UUID
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${uuidv4()}.${fileExt}`;
      const filePath = `imoveis/${fileName}`;
      
      // Upload do arquivo
      const { error } = await supabase.storage
        .from('imoveis')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Obter URL pública
      const { data } = await supabase.storage
        .from('imoveis')
        .getPublicUrl(filePath);
      
      if (!data || !data.publicUrl) {
        throw new Error('Erro ao obter URL da imagem');
      }
      
      return {
        data: {
          path: filePath,
          url: data.publicUrl
        },
        error: null
      };
    } catch (error) {
      console.error('Erro ao fazer upload de imagem:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Faz upload de múltiplas imagens
   */
  async uploadMultiplasImagens(files: File[], userId: string): Promise<{ data: FileUploadResult[]; error: Error | null }> {
    try {
      const uploads = [];
      const errors = [];
      
      for (const file of files) {
        const { data, error } = await this.uploadImagem(file, userId);
        
        if (error) {
          errors.push(error);
          continue;
        }
        
        if (data) {
          uploads.push(data);
        }
      }
      
      if (errors.length > 0 && uploads.length === 0) {
        throw new Error('Erro ao fazer upload de todas as imagens');
      }
      
      return {
        data: uploads,
        error: errors.length > 0 ? new Error(`${errors.length} imagens falharam ao fazer upload`) : null
      };
    } catch (error) {
      console.error('Erro ao fazer upload múltiplo:', error);
      return { data: [], error: error as Error };
    }
  }

  /**
   * Remove uma imagem do Storage
   */
  async removerImagem(filePath: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase.storage
        .from('imoveis')
        .remove([filePath]);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Extrai o caminho do arquivo a partir da URL pública
   */
  extrairCaminhoArquivo(url: string): string | null {
    try {
      // A URL pública terá o formato: https://xxxxx.supabase.co/storage/v1/object/public/imoveis/caminho/do/arquivo.jpg
      const match = url.match(/\/public\/imoveis\/(.+)$/);
      
      if (match && match[1]) {
        return `imoveis/${match[1]}`;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao extrair caminho do arquivo:', error);
      return null;
    }
  }
}

export const uploadService = new UploadService(); 