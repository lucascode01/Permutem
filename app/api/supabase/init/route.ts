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
    
    // Resultados da criação das tabelas
    const results = [];
    
    // Criar as tabelas na ordem correta
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
    
    for (const tableName of tableOrder) {
      const script = createTableScripts[tableName as keyof typeof createTableScripts];
      if (!script) {
        results.push({ table: tableName, status: 'error', message: 'Script não encontrado' });
        continue;
      }
      
      try {
        // Executar o script SQL diretamente usando a chave de serviço
        const { error } = await supabase.rpc('exec_sql_direct', { sql: script });
        if (error) {
          // Se a função não existe, tentar executar diretamente
          console.log(`Tentando criar tabela ${tableName} diretamente...`);
          
          // Para tabelas simples, vamos criar uma por uma
          if (tableName === 'usuarios') {
            const { error: createError } = await supabase
              .from('usuarios')
              .select('id')
              .limit(1);
            
            if (createError && createError.message.includes('relation "usuarios" does not exist')) {
              // A tabela não existe, vamos criar usando SQL direto
              console.log('Criando tabela usuarios...');
              // Como não podemos executar SQL direto via RPC, vamos usar uma abordagem diferente
              results.push({ table: tableName, status: 'pending', message: 'Tabela precisa ser criada manualmente no Supabase Dashboard' });
            } else {
              results.push({ table: tableName, status: 'success', message: 'Tabela já existe' });
            }
          } else {
            results.push({ table: tableName, status: 'pending', message: 'Tabela precisa ser criada manualmente no Supabase Dashboard' });
          }
        } else {
          results.push({ table: tableName, status: 'success' });
        }
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
      message: 'Verificação do banco de dados concluída',
      results,
      note: 'Algumas tabelas podem precisar ser criadas manualmente no Supabase Dashboard'
    });
    
  } catch (error: any) {
    console.error('Erro ao verificar o banco de dados:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro ao verificar o banco de dados' 
    }, { status: 500 });
  }
}

// Função para criar dados iniciais para demonstração
async function createInitialData(supabase: any) {
  try {
    // Verificar se já existem planos
    const { data: existingPlanos } = await supabase
      .from('planos')
      .select('id')
      .limit(1);
    
    if (!existingPlanos || existingPlanos.length === 0) {
      console.log('Inserindo planos padrão...');
      
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
      const { error: planosError } = await supabase.from('planos').insert(planos);
      if (planosError) {
        console.error('Erro ao inserir planos:', planosError);
      } else {
        console.log('Planos inseridos com sucesso');
      }
    } else {
      console.log('Planos já existem, pulando inserção...');
    }
    
  } catch (error) {
    console.error('Erro ao criar dados iniciais:', error);
  }
} 