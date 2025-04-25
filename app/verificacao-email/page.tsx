'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function VerificacaoEmailPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirecionar se o usuário não estiver logado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleConfirmation = () => {
    router.push('/selecionar-plano');
  };

  // Renderizar um loading state enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      {/* Cabeçalho com seta de voltar e logo */}
      <div className="w-full border-b border-gray-200">
        <div className="container mx-auto max-w-4xl px-4 py-4 flex items-center">
          <Link href="/" className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="flex-1 flex justify-center">
            <Image 
              src="/images/permutem-logo.png" 
              alt="Permuti" 
              width={150} 
              height={40} 
              className="h-8 w-auto"
            />
          </div>
          <div className="w-6"></div> {/* Espaçador para centralizar a logo */}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-4 py-12">
        <div className="w-full bg-white rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Tudo certo!
          </h1>
          <p className="text-gray-700 mb-8">
            Um link para verificação da conta foi enviado para o e-mail {user?.email}. Siga os procedimentos para verificarmos sua conta.
          </p>
          
          <button 
            onClick={handleConfirmation}
            className="w-full bg-[#4CAF50] hover:bg-[#43a047] text-white font-medium py-3 px-6 rounded transition-colors"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
} 