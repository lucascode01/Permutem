'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import PageHeader from '../../components/PageHeader';
import HydrationFix from '../../components/HydrationFix';

export default function RedefinirSenhaPage() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  // Verificar a validade do token quando a página carregar
  useEffect(() => {
    const verifyToken = async () => {
      setIsVerifyingToken(true);
      try {
        // Simulação de verificação de token
        // Em um ambiente real, isso chamaria sua API real
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Para testar o fluxo de erro, você pode descomentar esta linha:
        // throw new Error('Token inválido');
        
        // Simulando token válido
        setIsValidToken(true);
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        setIsValidToken(false);
        setError('O link de redefinição de senha é inválido ou expirou. Por favor, solicite um novo link.');
      } finally {
        setIsVerifyingToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = () => {
    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar senha
    if (!validatePassword()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulação de API para redefinir a senha
      // Em um ambiente real, isso chamaria sua API real com o token e a nova senha
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular sucesso
      setSuccess(true);
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setError('Não foi possível redefinir sua senha. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar tela de carregamento enquanto verifica o token
  if (isVerifyingToken) {
    return (
      <>
        <HydrationFix />
        <PageHeader />
        <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
          <div className="w-full max-w-md px-4 py-8 sm:px-0">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-8 text-center">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-700">Verificando seu link de redefinição de senha...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Renderizar mensagem de erro se o token for inválido
  if (!isValidToken) {
    return (
      <>
        <HydrationFix />
        <PageHeader />
        <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
          <div className="w-full max-w-md px-4 py-8 sm:px-0">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-8">
              <div className="text-center text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4 text-center">Link Inválido</h1>
              <p className="text-gray-600 mb-6 text-center">
                {error}
              </p>
              <div className="text-center">
                <Link href="/recuperar-senha" className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block">
                  Solicitar Novo Link
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Renderizar tela de sucesso
  if (success) {
    return (
      <>
        <HydrationFix />
        <PageHeader />
        <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
          <div className="w-full max-w-md px-4 py-8 sm:px-0">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-8">
              <div className="text-center text-green-500 mb-4">
                <FaCheckCircle className="h-16 w-16 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold mb-4 text-center">Senha Redefinida!</h1>
              <p className="text-gray-600 mb-6 text-center">
                Sua senha foi atualizada com sucesso. Agora você pode fazer login com sua nova senha.
              </p>
              <div className="text-center">
                <Link href="/login" className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block">
                  Ir para Login
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Renderizar formulário de redefinição de senha
  return (
    <>
      <HydrationFix />
      <PageHeader />
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
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
              
              <h1 className="text-2xl font-bold mb-3 text-center text-gray-800">Redefinir Senha</h1>
              <p className="text-gray-600 mb-8 text-center text-sm">
                Defina sua nova senha para acessar sua conta
              </p>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Nova Senha</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                      placeholder="Digite sua nova senha" 
                      required
                      minLength={8}
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
                  <p className="text-xs text-gray-500 mt-1">
                    A senha deve ter pelo menos 8 caracteres
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">Confirmar Senha</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      id="confirmPassword" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                      placeholder="Confirme sua nova senha" 
                      required
                    />
                    <button 
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 shadow-sm"
                >
                  {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
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