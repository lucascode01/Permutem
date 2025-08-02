import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from '@/app/lib/supabase';

export async function GET(request: NextRequest) {
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

    // Buscar assinatura ativa do usuário
    const { data: assinatura, error: assinaturaError } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .single();

    if (assinaturaError && assinaturaError.code !== 'PGRST116') {
      console.error('Erro ao buscar assinatura:', assinaturaError);
      return NextResponse.json(
        { error: 'Erro ao verificar assinatura' },
        { status: 500 }
      );
    }

    // Se não há assinatura ativa
    if (!assinatura) {
      return NextResponse.json({
        status: 'inactive',
        message: 'Nenhuma assinatura ativa encontrada'
      });
    }

    // Verificar se a assinatura não está vencida
    const hoje = new Date();
    const proximoVencimento = new Date(assinatura.proximo_vencimento);
    
    if (proximoVencimento < hoje) {
      // Atualizar status da assinatura para vencida
      await supabase
        .from('assinaturas')
        .update({ status: 'expired' })
        .eq('id', assinatura.id);

      return NextResponse.json({
        status: 'expired',
        message: 'Assinatura vencida'
      });
    }

    return NextResponse.json({
      status: 'active',
      assinatura: {
        id: assinatura.id,
        plano_id: assinatura.plano_id,
        valor: assinatura.valor,
        periodo_cobranca: assinatura.periodo_cobranca,
        proximo_vencimento: assinatura.proximo_vencimento,
        renovacao_automatica: assinatura.renovacao_automatica
      }
    });

  } catch (error: any) {
    console.error('Erro ao verificar status da assinatura:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 