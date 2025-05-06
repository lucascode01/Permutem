'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import HydrationFix from '../components/HydrationFix';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  
  const router = useRouter();
  const { login, loginWithSocial } = useAuth();

  // Detectar se é um dispositivo Apple
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsAppleDevice(/iphone|ipad|ipod|macintosh/.test(userAgent));
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password, formData.rememberMe);
      
      if (success) {
        router.push('/dashboard');
      } else {
        setError('E-mail ou senha incorretos. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Ocorreu um erro durante o login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setError('');
    try {
      const success = await loginWithSocial(provider);
      if (success) {
        router.push('/dashboard');
      } else {
        setError(`Não foi possível entrar com ${provider}. Por favor, tente novamente.`);
      }
    } catch (error) {
      console.error(`Erro no login com ${provider}:`, error);
      setError(`Ocorreu um erro durante o login com ${provider}. Por favor, tente novamente.`);
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
                <Link href="/" className="flex items-center text-primary hover:text-primary-dark transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="text-sm font-medium">Voltar</span>
                </Link>
                
                <Image 
                  src="/images/permutem-logo.png" 
                  alt="Permutem" 
                  width={120} 
                  height={32} 
                  className="h-8 w-auto"
                />
              </div>
              
              <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">Acesso à Plataforma</h1>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">E-mail</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Digite seu e-mail" 
                    required
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Senha</label>
                    <Link href="/recuperar-senha" className="text-primary text-sm font-medium hover:text-primary-dark transition-colors">Esqueceu a senha?</Link>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                      placeholder="Digite sua senha" 
                      required
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="rememberMe" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-gray-600 text-sm">
                    Lembrar-me
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 shadow-sm"
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
                
                <div className="relative flex items-center mt-4">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">ou entre com</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="flex items-center justify-center bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaGoogle className="text-red-500 mr-2" />
                    <span className="text-sm">Google</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('facebook')}
                    className="flex items-center justify-center bg-blue-600 rounded-lg py-2 px-4 text-white hover:bg-blue-700 transition-colors"
                  >
                    <FaFacebookF className="mr-2" />
                    <span className="text-sm">Facebook</span>
                  </button>
                </div>
                
                {isAppleDevice && (
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('apple')}
                    className="w-full flex items-center justify-center bg-black rounded-lg py-2 px-4 text-white hover:bg-gray-900 transition-colors mt-2"
                  >
                    <FaApple className="mr-2" />
                    <span className="text-sm">Entrar com Apple</span>
                  </button>
                )}
                
                <div className="text-center text-gray-600 pt-4">
                  <span className="text-sm">Não tem uma conta?</span>{" "}
                  <Link href="/cadastro" className="text-primary font-medium hover:text-primary-dark transition-colors text-sm">
                    Cadastre-se
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