import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('photo') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhuma foto foi enviada' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Apenas arquivos de imagem são permitidos' },
        { status: 400 }
      );
    }

    // Validar tamanho do arquivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'A imagem deve ter no máximo 5MB' },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop();
    const fileName = `${session.user.id}-${Date.now()}.${fileExtension}`;
    const filePath = `profile-photos/${fileName}`;

    // Fazer upload para o Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Erro ao fazer upload da foto:', uploadError);
      return NextResponse.json(
        { error: 'Erro ao fazer upload da foto' },
        { status: 500 }
      );
    }

    // Gerar URL pública da imagem
    const { data: urlData } = supabase.storage
      .from('user-photos')
      .getPublicUrl(filePath);

    // Atualizar perfil do usuário com a nova foto
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({
        foto_perfil: urlData.publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (updateError) {
      console.error('Erro ao atualizar foto no perfil:', updateError);
      return NextResponse.json(
        { error: 'Erro ao atualizar foto no perfil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      photoUrl: urlData.publicUrl,
      message: 'Foto atualizada com sucesso'
    });

  } catch (error: any) {
    console.error('Erro inesperado ao fazer upload da foto:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 