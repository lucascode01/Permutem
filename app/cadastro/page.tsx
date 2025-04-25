'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaIdCard } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import HydrationFix from '../components/HydrationFix';
import { useAuth } from '../contexts/AuthContext';

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('proprietario');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { register } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUserTypeChange = (type: string) => {
    setUserType(type);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpa o erro específico do campo quando o usuário começa a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      general: ''
    };
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'O primeiro nome é obrigatório';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'O sobrenome é obrigatório';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'O e-mail é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor, insira um e-mail válido';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'A senha é obrigatória';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setErrors(prev => ({ ...prev, general: '' }));
    setIsLoading(true);
    
    try {
      const success = await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        userType
      );
      
      if (success) {
        router.push('/selecionar-plano');
      } else {
        setErrors(prev => ({
          ...prev, 
          general: 'Não foi possível completar o cadastro. Por favor, tente novamente.'
        }));
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErrors(prev => ({
        ...prev, 
        general: 'Ocorreu um erro durante o cadastro. Por favor, tente novamente.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HydrationFix />
      <PageHeader />
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center pt-28 pb-12">
        <div className="w-full max-w-2xl px-4 py-8 sm:px-0">
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
              
              <h1 className="text-2xl font-bold mb-3 text-center text-gray-800">Crie sua conta</h1>
              <p className="text-gray-600 mb-8 text-center text-sm">
                Preencha os campos abaixo para começar a usar a plataforma
              </p>
              
              {errors.general && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
                  {errors.general}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-2">Nome</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        id="firstName" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                        placeholder="Seu nome" 
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-2">Sobrenome</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        id="lastName" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                        placeholder="Seu sobrenome" 
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">E-mail</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                      placeholder="seu-email@exemplo.com" 
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                      placeholder="Crie uma senha segura" 
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
                  {errors.password ? (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">A senha deve ter pelo menos 8 caracteres</p>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-gray-700 text-sm font-medium mb-3">Sou um:</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`flex items-center border ${userType === 'proprietario' ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-300'} rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-primary`}
                      onClick={() => handleUserTypeChange('proprietario')}
                    >
                      <input 
                        type="radio" 
                        id="proprietario" 
                        name="userType" 
                        checked={userType === 'proprietario'}
                        onChange={() => handleUserTypeChange('proprietario')}
                        className="mr-2 h-4 w-4 text-primary"
                      />
                      <label htmlFor="proprietario" className="text-gray-700 cursor-pointer text-sm">Proprietário</label>
                    </div>
                    <div 
                      className={`flex items-center border ${userType === 'corretor' ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-300'} rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-primary`}
                      onClick={() => handleUserTypeChange('corretor')}
                    >
                      <input 
                        type="radio" 
                        id="corretor" 
                        name="userType" 
                        checked={userType === 'corretor'}
                        onChange={() => handleUserTypeChange('corretor')}
                        className="mr-2 h-4 w-4 text-primary"
                      />
                      <label htmlFor="corretor" className="text-gray-700 cursor-pointer text-sm">Corretor</label>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                  Ao clicar em "Criar conta", você concorda com nossos <Link href="/termos" className="text-primary hover:underline font-medium">Termos de Uso</Link> e <Link href="/privacidade" className="text-primary hover:underline font-medium">Política de Privacidade</Link>.
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 transform hover:-translate-y-1 hover:shadow-md duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Criando sua conta...
                    </span>
                  ) : (
                    'Criar conta'
                  )}
                </button>
                
                <div className="text-center text-gray-600 pt-2">
                  <span className="text-sm">Já possui uma conta?</span>{" "}
                  <Link href="/login" className="text-primary font-medium hover:text-primary-dark transition-colors text-sm hover:underline">
                    Fazer login
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