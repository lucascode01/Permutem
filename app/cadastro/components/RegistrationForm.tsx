'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { useAuth } from '@/app/contexts/AuthContext';

export default function RegistrationForm() {
  const router = useRouter();
  const { signUp, signInWithProvider, loading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('proprietario');
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });

  // Detectar se é um dispositivo Apple
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsAppleDevice(/iphone|ipad|ipod|macintosh/.test(userAgent));
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  
  const handleUserTypeChange = (type: string) => setUserType(type);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpa o erro específico do campo quando o usuário começa a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'A confirmação de senha é obrigatória';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setErrors(prev => ({ ...prev, general: '' }));
    
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        {
          primeiro_nome: formData.firstName,
          ultimo_nome: formData.lastName,
          tipo_usuario: userType as 'proprietario' | 'corretor' | 'admin',
        }
      );
      
      if (error) {
        if (error.message.includes('already registered')) {
          setErrors(prev => ({ ...prev, email: 'Este e-mail já está cadastrado' }));
        } else {
          setErrors(prev => ({ ...prev, general: error.message }));
        }
        return;
      }
      
      toast.success('Cadastro realizado com sucesso! Você já pode acessar o sistema.');
      router.push('/selecionar-plano');
    } catch (err) {
      console.error('Erro no cadastro:', err);
      setErrors(prev => ({
        ...prev, 
        general: 'Ocorreu um erro durante o cadastro. Por favor, tente novamente.'
      }));
    }
  };

  const handleSocialRegister = async (provider: 'google' | 'facebook' | 'apple') => {
    setErrors(prev => ({ ...prev, general: '' }));
    try {
      await signInWithProvider(provider);
      // O redirecionamento será feito automaticamente pelo Supabase
    } catch (err) {
      console.error(`Erro no cadastro com ${provider}:`, err);
      setErrors(prev => ({
        ...prev,
        general: `Ocorreu um erro durante o cadastro com ${provider}. Por favor, tente novamente.`
      }));
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6">Cadastre-se</h2>
      
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex justify-between mb-4">
          <button
            type="button"
            onClick={() => handleUserTypeChange('proprietario')}
            className={`flex-1 py-2 px-4 rounded-l-lg ${
              userType === 'proprietario'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Proprietário
          </button>
          <button
            type="button"
            onClick={() => handleUserTypeChange('corretor')}
            className={`flex-1 py-2 px-4 rounded-r-lg ${
              userType === 'corretor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Corretor
          </button>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <button
          onClick={() => handleSocialRegister('google')}
          className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          <FaGoogle className="h-5 w-5 mr-3 text-[#4285F4]" />
          <span>Cadastre-se com Google</span>
        </button>
        
        <button
          onClick={() => handleSocialRegister('facebook')}
          className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          <FaFacebookF className="h-5 w-5 mr-3 text-[#3b5998]" />
          <span>Cadastre-se com Facebook</span>
        </button>
        
        {isAppleDevice && (
          <button
            onClick={() => handleSocialRegister('apple')}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            <FaApple className="h-5 w-5 mr-3" />
            <span>Cadastre-se com Apple</span>
          </button>
        )}
      </div>
      
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500">ou</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Seu nome"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Sobrenome
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Seu sobrenome"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="seu.email@exemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md pr-10 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Crie uma senha"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirme a Senha
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md pr-10 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirme sua senha"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Cadastrar'}
        </button>
      </form>
      
      <p className="text-center text-sm text-gray-600 mt-6">
        Já tem uma conta?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Entre aqui
        </a>
      </p>
    </div>
  );
} 