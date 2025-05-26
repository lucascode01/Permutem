'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { checkSubscriptionStatus } from '../lib/checkout';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

interface RequirePlanoAtivoProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RequirePlanoAtivo({ children, fallback }: RequirePlanoAtivoProps) {
  const { user, loading } = useAuth();
  const [verificandoPlano, setVerificandoPlano] = useState<boolean>(true);
  const [planoAtivo, setPlanoAtivo] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const verificarPlano = async () => {
      if (!user?.id) {
        setVerificandoPlano(false);
        return;
      }

      try {
        console.log('Verificando status do plano do usuário');
        const status = await checkSubscriptionStatus(user.id);
        setPlanoAtivo(status.active);
        console.log('Status do plano:', status.active ? 'Ativo' : 'Inativo');
      } catch (error) {
        console.error('Erro ao verificar status do plano:', error);
        setPlanoAtivo(false);
      } finally {
        setVerificandoPlano(false);
      }
    };

    if (user?.id) {
      verificarPlano();
    } else {
      setVerificandoPlano(false);
    }
  }, [user]);

  // Se estiver carregando, mostrar um estado de carregamento
  if (loading || verificandoPlano) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#4CAF50]"></div>
        <span className="ml-2 text-sm text-gray-600">Verificando plano...</span>
      </div>
    );
  }

  // Se não estiver logado, não mostrar nada (deve ser redirecionado pelo AuthContext)
  if (!user) {
    return null;
  }
  
  // Se o plano estiver inativo e um fallback for fornecido, mostrar o fallback
  if (!planoAtivo && fallback) {
    return <>{fallback}</>;
  }

  // Se o plano estiver inativo e nenhum fallback for fornecido, mostrar mensagem padrão
  if (!planoAtivo) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 text-center">
        <FaExclamationTriangle className="text-yellow-500 mx-auto mb-3" size={24} />
        <h3 className="text-gray-800 font-medium mb-2">Plano Inativo</h3>
        <p className="text-gray-600 mb-4">
          Para executar esta ação, você precisa ter um plano ativo.
        </p>
        <Link 
          href="/dashboard/escolher-plano" 
          className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-4 py-2 rounded-md text-sm"
        >
          Ver planos disponíveis
        </Link>
      </div>
    );
  }

  // Se o plano estiver ativo, renderizar os children
  return <>{children}</>;
} 