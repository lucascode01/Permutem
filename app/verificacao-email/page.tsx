'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import HydrationFix from '../components/HydrationFix';

export default function VerificacaoEmailPage() {
  return (
    <>
      <HydrationFix />
      <PageHeader />
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center pt-28 pb-12">
        <div className="w-full max-w-md px-4 py-8 sm:px-0">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-8 sm:px-10">
              <div className="flex justify-center mb-8">
                <Image 
                  src="/images/permutem-logo.png" 
                  alt="Permutem" 
                  width={120} 
                  height={32} 
                  className="h-8 w-auto"
                />
              </div>
              
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                Verifique seu email
              </h2>
              
              <p className="text-center text-gray-600 mb-6">
                Enviamos um link de confirmação para o seu email. Por favor, verifique sua caixa de entrada e spam para concluir o cadastro.
              </p>
              
              <p className="text-center text-gray-600 mb-8">
                Após confirmar seu email, você poderá escolher um plano e começar a usar a plataforma.
              </p>
              
              <div className="flex flex-col space-y-3">
                <Link href="/login" className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-700 transition-colors">
                  Ir para o login
                </Link>
                
                <Link href="/" className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Voltar para a página inicial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 