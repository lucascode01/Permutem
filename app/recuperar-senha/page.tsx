'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PageHeader from '../components/PageHeader';
import HydrationFix from '../components/HydrationFix';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    
    try {
      // Simulação da API de envio do e-mail de recuperação
      // Em um ambiente real, isso chamaria sua API real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular sucesso
      setSuccessMessage(`Um link para redefinir sua senha foi enviado para ${email}. Por favor, verifique sua caixa de entrada e siga as instruções.`);
      setEmail('');
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      setError('Não foi possível processar sua solicitação. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HydrationFix />
      <PageHeader />
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="w-full max-w-md px-4 py-8 sm:px-0">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-8 sm:px-10">
              <div className="flex justify-between items-center mb-8">
                <Link href="/login" className="flex items-center text-primary hover:text-primary-dark transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="text-sm font-medium">Voltar para o login</span>
                </Link>
                
                <Image 
                  src="/images/permutem-logo.png" 
                  alt="Permutem" 
                  width={120} 
                  height={32} 
                  className="h-8 w-auto"
                />
              </div>
              
              <h1 className="text-2xl font-bold mb-3 text-center text-gray-800">Recuperar Senha</h1>
              <p className="text-gray-600 mb-8 text-center text-sm">
                Informe seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
              </p>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6 text-sm">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">E-mail cadastrado</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Digite seu e-mail" 
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 shadow-sm"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>
                
                <div className="text-center text-gray-600 pt-2">
                  <span className="text-sm">Lembrou sua senha?</span>{" "}
                  <Link href="/login" className="text-primary font-medium hover:text-primary-dark transition-colors text-sm">
                    Voltar para o login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 