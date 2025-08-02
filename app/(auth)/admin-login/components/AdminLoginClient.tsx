'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaUserShield, FaLock, FaChevronLeft } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';

// Versão sem conteúdo inicialmente, apenas adiciona após cliente montar
const AdminLoginClient = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-gray-200 h-12 w-40 mx-auto mb-6 rounded-md animate-pulse"></div>
          <div className="bg-gray-200 h-64 w-80 mx-auto rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  return <AdminLoginForm />;
};

// Componente efetivo do formulário
const AdminLoginForm = () => {
  // Estado para o formulário (não inicializado com valores - importante!)
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { signIn, user } = useAuth();

  // Verificar se já está logado
  useEffect(() => {
    if (user && user.user_metadata?.tipo_usuario === 'admin') {
      router.push('/admin');
    }
  }, [user, router]);

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Obtém os valores do formulário diretamente do evento
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const rememberMe = formData.get('rememberMe') === 'on';
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError('E-mail ou senha incorretos. Por favor, tente novamente.');
        return;
      }
      
      if (data?.user) {
        router.push('/admin');
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

  return (
    <div className="min-h-screen relative bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-6 left-6">
        <Link href="/">
          <span className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
            <FaChevronLeft className="mr-1 h-3 w-3" /> Voltar para o site
          </span>
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/images/permutem-logo.png"
            alt="Permutem Logo"
            width={150}
            height={60}
            priority
          />
        </div>
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mt-4 mb-4">
          Acesso Administrativo
        </h2>
        <div className="bg-blue-600 py-4 px-6 shadow rounded-t-md">
          <div className="flex justify-center items-center">
            <FaUserShield className="text-white h-8 w-8 mr-2" />
            <h2 className="text-white text-xl font-semibold">Área Restrita</h2>
          </div>
        </div>
        <div className="bg-white py-8 px-4 shadow sm:rounded-b-md sm:px-10">
          <div className="flex items-center justify-center p-4 mb-6 bg-blue-50 text-blue-700 rounded-md">
            <FaLock className="mr-2" />
            <p className="text-sm">Área restrita apenas para administradores</p>
          </div>
            
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
            
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-600 mb-1">E-mail</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                defaultValue="admin@permutem.com.br"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite seu e-mail" 
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-600 mb-1">Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password"
                  defaultValue="admin123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Digite sua senha" 
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
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="rememberMe" 
                name="rememberMe"
                defaultChecked={true}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-gray-600">
                Lembrar-me
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Entrando...' : 'Entrar como Administrador'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginClient; 