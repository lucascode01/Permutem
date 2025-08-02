'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const { user, isLoading } = useAuth();
  const [statusUpdated, setStatusUpdated] = useState(false);
  
  // Obter o ID da sessão da URL (simulado)
  const sessionId = searchParams.get('session_id');
  
  // Atualizar a assinatura do usuário 
  useEffect(() => {
    if (isLoading || statusUpdated || !user || !sessionId) return;
    
    const updateStatus = async () => {
      try {
        setStatusUpdated(true); // Marcar como atualizado para prevenir múltiplas chamadas
        toast.success('Sua assinatura foi ativada com sucesso!', {
          id: 'subscription-activated', // ID único para evitar duplicações
          duration: 5000, // Duração mais longa para garantir que só aparece uma vez
        });
      } catch (error) {
        console.error('Erro ao atualizar status da assinatura:', error);
        toast.error('Erro ao ativar assinatura', {
          id: 'subscription-error',
        });
      }
    };
    
    updateStatus();
  }, [sessionId, user, isLoading, statusUpdated]);

  // Configurar o temporizador para redirecionamento em um useEffect separado
  useEffect(() => {
    if (isLoading || !user || !sessionId) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [sessionId, router, user, isLoading]);
  
  // Mostrar tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0071ce] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Se não estiver logado, redirecionar para login
  if (!user) {
    router.push('/login');
    return null;
  }
  
  // Se não houver ID de sessão, mostrar mensagem de erro
  if (!sessionId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="flex justify-center items-center text-red-500 text-5xl mb-4">
            <FaCheckCircle className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Erro no processamento</h1>
          <p className="text-gray-600 mb-6">
            Não foi possível confirmar seu pagamento. Por favor, tente novamente.
          </p>
          <Link
            href="/selecionar-plano"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Voltar para seleção de planos
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="flex justify-center items-center text-green-500 text-5xl mb-4">
          <FaCheckCircle className="mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Pagamento confirmado!</h1>
        
        <p className="text-gray-600 mb-6">
          Obrigado pela sua inscrição. Seu plano está ativo e você já pode começar a anunciar seus imóveis na plataforma Permutem.
        </p>
        
        <div className="mb-6">
          <Image 
            src="/images/permutem-logo.png" 
            alt="Permutem" 
            width={150} 
            height={40} 
            className="mx-auto"
          />
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Você será redirecionado para o dashboard em {countdown} segundos...
        </p>
        
        <Link
          href="/dashboard"
          className="inline-block bg-[#0071ce] hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  );
} 