'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/contexts/AuthContext';
import PageHeader from '@/app/components/PageHeader';
import HydrationFix from '@/app/components/HydrationFix';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, informe seu email');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error(error.message || 'Erro ao enviar email de recuperação');
        console.error('Erro ao recuperar senha:', error);
        return;
      }
      
      setEmailEnviado(true);
      toast.success('Email de recuperação enviado com sucesso!');
    } catch (err) {
      console.error('Erro ao processar recuperação de senha:', err);
      toast.error('Ocorreu um erro ao processar sua solicitação');
    } finally {
      setSubmitting(false);
    }
  };

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
              
              {!emailEnviado ? (
                <>
                  <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
                    Recuperar Senha
                  </h2>
                  
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    Digite seu email abaixo e enviaremos um link para redefinir sua senha.
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                        E-mail
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FaEnvelope className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce]"
                          placeholder="Digite seu e-mail"
                          required
                          disabled={submitting}
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-[#0071ce] hover:bg-[#005fad] text-white font-medium py-3 px-4 rounded-lg transition-colors"
                      disabled={submitting}
                    >
                      {submitting ? 'Enviando...' : 'Enviar link de recuperação'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-6">
                    <p className="font-medium">Email enviado com sucesso!</p>
                    <p className="text-sm mt-1">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    Não recebeu o email? Verifique sua pasta de spam ou tente novamente em alguns minutos.
                  </p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link 
                  href="/login" 
                  className="flex items-center justify-center text-sm text-[#0071ce] hover:text-[#005fad]"
                >
                  <FaArrowLeft className="mr-2" />
                  Voltar para login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 