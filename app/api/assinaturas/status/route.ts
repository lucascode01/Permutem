import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 });
    }

    // Criar cliente Supabase diretamente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Buscar informações da assinatura no Supabase
    const { data: assinatura, error } = await supabase
      .from('assinaturas')
      .select('*, planos(*)')
      .eq('usuario_id', userId)
      .eq('status', 'ACTIVE')
      .order('criado_em', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Erro ao buscar assinatura:', error);
      return NextResponse.json({ error: 'Erro ao buscar assinatura' }, { status: 500 });
    }

    // Se não encontrou assinatura ativa
    if (!assinatura) {
      return NextResponse.json({
        active: false
      });
    }

    // Verificar se a assinatura expirou (para pagamentos únicos)
    const agora = new Date();
    const expiracao = assinatura.expiracao ? new Date(assinatura.expiracao) : null;
    
    if (expiracao && agora > expiracao) {
      return NextResponse.json({
        active: false,
        planoId: assinatura.plano_id,
        expiracao: assinatura.expiracao
      });
    }

    // Retornar dados da assinatura
    return NextResponse.json({
      active: true,
      planoId: assinatura.plano_id,
      expiracao: assinatura.expiracao,
      asaasId: assinatura.asaas_id
    });
  } catch (error) {
    console.error('Erro ao verificar status da assinatura:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
} 