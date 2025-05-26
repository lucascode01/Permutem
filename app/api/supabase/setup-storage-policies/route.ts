import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseUrl } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Acesso não autorizado' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Para admin: verificar se o token é válido
    if (token !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Acesso não autorizado' },
        { status: 401 }
      );
    }
    
    // Use a service role key para criar o bucket
    const supabaseAdmin = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
    
    // Executar SQL para configurar as políticas
    const sql = `
      -- Habilite RLS na tabela storage.buckets se ainda não estiver habilitado
      -- (Isso pode falhar se você não tiver permissões adequadas)
      DO $$
      BEGIN
        BEGIN
          ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
        EXCEPTION WHEN others THEN
          NULL;
        END;
      END $$;

      -- Crie o bucket 'imoveis' se não existir
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'imoveis') THEN
          INSERT INTO storage.buckets (id, name) VALUES ('imoveis', 'imoveis');
        END IF;
      END $$;

      -- Remova políticas existentes para evitar duplicações
      DROP POLICY IF EXISTS "Permitir visualização de imagens em imoveis" ON storage.objects;
      DROP POLICY IF EXISTS "Permitir upload de imagens em imoveis" ON storage.objects;
      DROP POLICY IF EXISTS "Permitir atualização de imagens em imoveis" ON storage.objects;
      DROP POLICY IF EXISTS "Permitir exclusão de imagens em imoveis" ON storage.objects;

      -- Permita que todos visualizem objetos do bucket 'imoveis'
      CREATE POLICY "Permitir visualização de imagens em imoveis"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'imoveis');

      -- Permita que usuários autenticados insiram objetos no bucket 'imoveis'
      CREATE POLICY "Permitir upload de imagens em imoveis"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'imoveis');

      -- Permita que usuários autenticados atualizem seus próprios objetos
      CREATE POLICY "Permitir atualização de imagens em imoveis"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'imoveis' AND owner = auth.uid())
      WITH CHECK (bucket_id = 'imoveis' AND owner = auth.uid());

      -- Permita que usuários autenticados excluam seus próprios objetos
      CREATE POLICY "Permitir exclusão de imagens em imoveis"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'imoveis' AND owner = auth.uid());
    `;
    
    const { error } = await supabaseAdmin.rpc('pgis_exec', { query: sql });
    
    if (error) {
      console.error('Erro ao configurar políticas:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Políticas configuradas com sucesso'
    });
    
  } catch (error: any) {
    console.error('Erro ao configurar políticas:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
} 