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
    
    // Criar o bucket 'imoveis'
    const { data, error } = await supabaseAdmin.storage.createBucket('imoveis', {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024 // 10MB
    });
    
    if (error) {
      console.error('Erro ao criar bucket:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Bucket criado com sucesso',
      data
    });
    
  } catch (error: any) {
    console.error('Erro ao criar bucket:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
} 