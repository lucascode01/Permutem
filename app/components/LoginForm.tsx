'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaApple, FaGoogle, FaFacebook, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import PageHeader from './PageHeader';
import HydrationFix from './HydrationFix';
import { useAuth } from '@/app/hooks/useAuth';
import { useAuth as useAuthContext } from '@/app/contexts/AuthContext';

const LoginForm = () => {
  const router = useRouter();
  const { signInWithProvider, loading } = useAuth();
  const auth = useAuthContext();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleBackToOptions = () => {
    setShowLoginForm(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Tentando fazer login com:', email);
      
      // Usar o método do AuthContext diretamente
      const { error } = await auth.signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      toast.error(err.message || 'Ocorreu um erro. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      await signInWithProvider(provider);
      // Redirecionamento ocorrerá automaticamente pelo Supabase
    } catch (err: any) {
      console.error(`Erro ao fazer login com ${provider}:`, err);
      toast.error(`Não foi possível fazer login com ${provider}`);
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
                Acesse ou crie sua conta
              </h2>

              {!showLoginForm ? (
                <>
                  <div className="space-y-3">
                    {/* Temporariamente desabilitado até configurar no Supabase
                    <button 
                      onClick={() => handleSocialLogin('apple')}
                      className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || isSubmitting}
                    >
                      <FaApple className="h-5 w-5 mr-3" />
                      <span>Entrar com Apple</span>
                    </button>

                    <button 
                      onClick={() => handleSocialLogin('google')}
                      className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || isSubmitting}
                    >
                      <FaGoogle className="h-5 w-5 mr-3 text-[#4285F4]" />
                      <span>Entrar com Google</span>
                    </button>

                    <button 
                      onClick={() => handleSocialLogin('facebook')}
                      className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || isSubmitting}
                    >
                      <FaFacebook className="h-5 w-5 mr-3 text-[#3b5998]" />
                      <span>Entrar com Facebook</span>
                    </button>
                    */}

                    <button 
                      onClick={handleEmailLoginClick}
                      className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || isSubmitting}
                    >
                      <FaEnvelope className="h-5 w-5 mr-3" />
                      <span>Entrar com email</span>
                    </button>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Não possui conta?{' '}
                      <Link href="/cadastro" className="font-medium text-[#0071ce] hover:text-[#005fad]">
                        Cadastre-se aqui
                      </Link>
                    </p>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] disabled:opacity-50"
                      placeholder="Digite seu e-mail"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] pr-12 disabled:opacity-50"
                        placeholder="Digite sua senha"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-[#0071ce] focus:ring-[#0071ce] border-gray-300 rounded disabled:opacity-50"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Lembrar
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link href="/recuperar-senha" className="font-medium text-[#0071ce] hover:text-[#005fad]">
                        Esqueceu a senha?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0071ce] hover:bg-[#005fad] text-white font-medium py-3 px-4 rounded-lg transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || isSubmitting}
                  >
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Não possui conta?{' '}
                      <Link href="/cadastro" className="font-medium text-[#0071ce] hover:text-[#005fad]">
                        Cadastre-se aqui
                      </Link>
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center mt-4">
                    <button
                      type="button"
                      onClick={handleBackToOptions}
                      className="text-sm text-gray-500 hover:text-[#0071ce] disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      Voltar para opções de login
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-xs text-gray-500 text-center">
                Ao logar, você afirma que leu e concorda com os nossos{' '}
                <Link href="/termos-de-uso" className="text-[#0071ce] hover:underline">
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link href="/politica-de-privacidade" className="text-[#0071ce] hover:underline">
                  Política de Privacidade
                </Link>{' '}
                do Permutem.
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginForm; 