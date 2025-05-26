'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { supabase } from '@/app/lib/supabase';
import PageHeader from '@/app/components/PageHeader';
import HydrationFix from '@/app/components/HydrationFix';

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está acessando a página com um token válido
    const checkAccessToken = async () => {
      // O código é colocado automaticamente na URL ao clicar no link de recuperação
      // Não precisamos extrair tokens manualmente
      // O Supabase SDK verifica automaticamente pela presença do código na URL
      
      // Verificamos apenas se o usuário já está autenticado
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        setError('Não foi possível validar sua sessão. Por favor, solicite um novo link de recuperação.');
      }
    };
    
    checkAccessToken();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      toast.success('Senha alterada com sucesso!');
      
      // Redirecionar para login após alguns segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Erro ao redefinir senha:', err);
      setError(err.message || 'Não foi possível redefinir sua senha. Por favor, tente novamente.');
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
              
              <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
                {success ? 'Senha Redefinida!' : 'Redefinir Senha'}
              </h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {success ? (
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-6">
                    <p className="font-medium">Senha alterada com sucesso!</p>
                    <p className="text-sm mt-1">Você será redirecionado para a página de login em instantes...</p>
                  </div>
                  
                  <Link 
                    href="/login" 
                    className="inline-block bg-[#0071ce] hover:bg-[#005fad] text-white font-medium py-2 px-4 rounded transition-colors"
                  >
                    Ir para Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] pr-12"
                        placeholder="Digite sua nova senha"
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-1">
                      Confirme a Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] pr-12"
                        placeholder="Confirme sua nova senha"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[#0071ce] hover:bg-[#005fad] text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    disabled={submitting}
                  >
                    {submitting ? 'Alterando...' : 'Redefinir Senha'}
                  </button>
                </form>
              )}
              
              {!success && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link 
                    href="/login" 
                    className="flex items-center justify-center text-sm text-[#0071ce] hover:text-[#005fad]"
                  >
                    <FaArrowLeft className="mr-2" />
                    Voltar para login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 