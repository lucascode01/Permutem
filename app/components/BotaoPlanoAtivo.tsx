'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { checkSubscriptionStatus } from '../lib/checkout';
import { toast } from 'react-hot-toast';

interface BotaoPlanoAtivoProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function BotaoPlanoAtivo({ 
  onClick, 
  children, 
  className = '', 
  disabled = false 
}: BotaoPlanoAtivoProps) {
  const { user, loading } = useAuth();
  const [verificandoPlano, setVerificandoPlano] = useState<boolean>(false);
  const [planoAtivo, setPlanoAtivo] = useState<boolean | null>(null);
  const router = useRouter();

  const handleClick = async () => {
    if (disabled) return;
    
    // Se já verificamos o plano e não está ativo, redirecionar para selecionar plano
    if (planoAtivo === false) {
      toast.error('Você precisa ter um plano ativo para realizar esta ação!');
      router.push('/dashboard/escolher-plano');
      return;
    }
    
    // Se ainda não verificamos o plano ou o usuário não está logado
    if (planoAtivo === null || !user?.id) {
      setVerificandoPlano(true);
      
      try {
        if (!user?.id) {
          toast.error('Você precisa estar logado para realizar esta ação!');
          router.push('/login');
          return;
        }
        
        const status = await checkSubscriptionStatus(user.id);
        setPlanoAtivo(status.active);
        
        if (status.active) {
          // Se o plano estiver ativo, executar a ação
          onClick();
        } else {
          // Se o plano não estiver ativo, mostrar mensagem e redirecionar
          toast.error('Você precisa ter um plano ativo para realizar esta ação!');
          router.push('/dashboard/escolher-plano');
        }
      } catch (error) {
        console.error('Erro ao verificar status do plano:', error);
        toast.error('Erro ao verificar status do plano. Tente novamente.');
      } finally {
        setVerificandoPlano(false);
      }
    } else {
      // Se já verificamos o plano e está ativo, executar a ação
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={verificandoPlano || disabled}
      className={className}
    >
      {verificandoPlano ? (
        <span className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verificando...
        </span>
      ) : (
        children
      )}
    </button>
  );
} 