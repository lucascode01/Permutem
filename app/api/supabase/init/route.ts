import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createTableScripts } from '../../../lib/supabase';

// Esta API é usada apenas para inicializar o banco de dados com as tabelas necessárias

// Inicialização do cliente Supabase com chave de serviço para acesso total
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  // Verificar autenticação (em produção, use uma chave secreta)
  const authHeader = req.headers.get('authorization');
  const expectedSecret = process.env.SUPABASE_INIT_SECRET || 'permutem-init-secret'; // Alterar em produção
  
  if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  
  try {
    // Criar cliente Supabase com chave de serviço para acesso administrativo
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Ativar extensão uuid-ossp para gerar UUIDs
    await supabase.rpc('extensions', { extensions: ['uuid-ossp'] });
    
    // Ordenar as tabelas para garantir que as dependências sejam criadas primeiro
    const tableOrder = [
      'usuarios',
      'planos',
      'assinaturas',
      'pagamentos',
      'imoveis',
      'propostas',
      'mensagens',
      'favoritos',
      'notificacoes'
    ];
    
    // Resultados da criação das tabelas
    const results = [];
    
    // Criar as tabelas na ordem correta
    for (const tableName of tableOrder) {
      const script = createTableScripts[tableName as keyof typeof createTableScripts];
      if (!script) {
        results.push({ table: tableName, status: 'error', message: 'Script não encontrado' });
        continue;
      }
      
      try {
        // Executar o script SQL para criar a tabela
        const { error } = await supabase.rpc('exec_sql', { sql: script });
        if (error) throw error;
        
        results.push({ table: tableName, status: 'success' });
      } catch (error: any) {
        results.push({ 
          table: tableName, 
          status: 'error', 
          message: error.message || 'Erro desconhecido' 
        });
      }
    }
    
    // Criar dados iniciais
    await createInitialData(supabase);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Banco de dados inicializado com sucesso',
      results
    });
    
  } catch (error: any) {
    console.error('Erro ao inicializar o banco de dados:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro ao inicializar o banco de dados' 
    }, { status: 500 });
  }
}

// Função para criar dados iniciais para demonstração
async function createInitialData(supabase: any) {
  // Inserir planos
  const planos = [
    {
      id: 'basic',
      nome: 'Básico',
      descricao: 'Ideal para proprietários que querem iniciar com permutas',
      valor_mensal: 29.90,
      valor_anual: 299.00,
      max_anuncios: 3,
      recursos: ['Até 3 imóveis ativos', 'Sugestões básicas de permuta', 'Visualização de contatos'],
      ativo: true,
      ordem: 1,
      destaque: false
    },
    {
      id: 'premium',
      nome: 'Premium',
      descricao: 'Para proprietários que desejam mais opções de permuta',
      valor_mensal: 49.90,
      valor_anual: 499.00,
      max_anuncios: 10,
      recursos: ['Até 10 imóveis ativos', 'Sugestões avançadas de permuta', 'Destaque nos resultados de busca', 'Estatísticas detalhadas'],
      ativo: true,
      ordem: 2,
      destaque: true
    },
    {
      id: 'professional',
      nome: 'Profissional',
      descricao: 'Para corretores e imobiliárias',
      valor_mensal: 79.90,
      valor_anual: 799.00,
      max_anuncios: 30,
      recursos: ['Até 30 imóveis ativos', 'Sugestões premium de permuta', 'Destaque máximo nos resultados', 'Estatísticas avançadas', 'Suporte prioritário'],
      ativo: true,
      ordem: 3,
      destaque: false
    }
  ];
  
  // Inserir planos
  await supabase.from('planos').upsert(planos);
  
  // Inserir usuário administrador
  const adminUser = {
    email: 'admin@permutem.com.br',
    primeiro_nome: 'Admin',
    ultimo_nome: 'Sistema',
    tipo_usuario: 'admin',
    // Aqui você deve inserir hash da senha em produção (em vez de senha em texto puro)
  };
  
  await supabase.from('usuarios').upsert(adminUser, { onConflict: 'email' });
} 