'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import PageHeader from '@/app/components/PageHeader';
import HydrationFix from '@/app/components/HydrationFix';

export default function VerificacaoEmail() {
  return (
    <>
      <HydrationFix />
      <PageHeader />
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center pt-28 pb-12">
        <div className="w-full max-w-md px-4 py-8 sm:px-0">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-8 sm:px-10 text-center">
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
                <div className="bg-green-100 p-4 rounded-full">
                  <FaEnvelope className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Verifique seu email
              </h2>
              
              <p className="text-gray-600 mb-6">
                Enviamos um link de confirmação para o seu email. 
                Clique no link para ativar sua conta.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <FaCheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Próximos passos:</p>
                    <ul className="space-y-1 text-left">
                      <li>• Verifique sua caixa de entrada</li>
                      <li>• Clique no link de confirmação</li>
                      <li>• Faça login na sua conta</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="w-full bg-[#0071ce] hover:bg-[#005fad] text-white font-medium py-3 px-4 rounded-lg transition-colors inline-block"
                >
                  Ir para o Login
                </Link>
                
                <Link
                  href="/"
                  className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Link>
              </div>
              
              <div className="mt-6 text-xs text-gray-500">
                <p>Não recebeu o email? Verifique sua pasta de spam ou</p>
                <Link href="/recuperar-senha" className="text-[#0071ce] hover:underline">
                  solicite um novo link
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 