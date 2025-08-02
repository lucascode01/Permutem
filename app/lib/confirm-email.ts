import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './supabase';

/**
 * Função utilitária para confirmar manualmente um email durante o desenvolvimento
 * ATENÇÃO: Use apenas em ambiente de desenvolvimento!
 */
export async function confirmEmail(email: string): Promise<{ success: boolean; message: string }> {
  if (process.env.NODE_ENV !== 'development') {
    return {
      success: false,
      message: 'Esta função só pode ser usada em ambiente de desenvolvimento.'
    };
  }
  
  try {
    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Verificar se o usuário existe
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id, email')
      .eq('email', email)
      .single();
    
    if (userError || !userData) {
      return {
        success: false,
        message: 'Usuário não encontrado com este email.'
      };
    }
    
    // Obter usuário auth
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError || !authData || !authData.users || authData.users.length === 0) {
      return {
        success: false,
        message: 'Usuário não encontrado na autenticação.'
      };
    }
    
    // Confirmar email
    const userId = authData.users[0].id;
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    );
    
    if (updateError) {
      return {
        success: false,
        message: `Erro ao confirmar email: ${updateError.message}`
      };
    }
    
    return {
      success: true,
      message: `Email ${email} confirmado com sucesso!`
    };
  } catch (error) {
    console.error('Erro ao confirmar email:', error);
    return {
      success: false,
      message: `Erro inesperado: ${error instanceof Error ? error.message : String(error)}`
    };
  }
} 