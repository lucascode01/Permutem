'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaBuilding } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import PageHeader from './PageHeader';
import HydrationFix from './HydrationFix';
import { useAuth as useAuthContext } from '@/app/contexts/AuthContext';

const RegistrationForm = () => {
  const router = useRouter();
  const auth = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    primeiro_nome: '',
    ultimo_nome: '',
    email: '',
    telefone: '',
    tipo_usuario: 'proprietario' as 'proprietario' | 'corretor' | 'admin',
    password: '',
    confirmPassword: '',
    aceite_termos: false,
    aceite_privacidade: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.primeiro_nome.trim()) {
      newErrors.primeiro_nome = 'Nome é obrigatório';
    }

    if (!formData.ultimo_nome.trim()) {
      newErrors.ultimo_nome = 'Sobrenome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!formData.aceite_termos) {
      newErrors.aceite_termos = 'Você deve aceitar os termos de uso';
    }

    if (!formData.aceite_privacidade) {
      newErrors.aceite_privacidade = 'Você deve aceitar a política de privacidade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await auth.signUp(formData.email, formData.password, {
        primeiro_nome: formData.primeiro_nome,
        ultimo_nome: formData.ultimo_nome,
        telefone: formData.telefone,
        tipo_usuario: formData.tipo_usuario,
      });

      if (error) {
        throw error;
      }

      toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
      router.push('/verificacao-email');
    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      toast.error(err.message || 'Erro ao criar conta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                Crie sua conta
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome e Sobrenome */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="primeiro_nome" className="block text-gray-700 text-sm font-medium mb-1">
                      Nome
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        id="primeiro_nome"
                        value={formData.primeiro_nome}
                        onChange={(e) => handleInputChange('primeiro_nome', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] disabled:opacity-50 ${
                          errors.primeiro_nome ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Seu nome"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.primeiro_nome && (
                      <p className="text-red-500 text-xs mt-1">{errors.primeiro_nome}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="ultimo_nome" className="block text-gray-700 text-sm font-medium mb-1">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      id="ultimo_nome"
                      value={formData.ultimo_nome}
                      onChange={(e) => handleInputChange('ultimo_nome', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] disabled:opacity-50 ${
                        errors.ultimo_nome ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Seu sobrenome"
                      required
                      disabled={isSubmitting}
                    />
                    {errors.ultimo_nome && (
                      <p className="text-red-500 text-xs mt-1">{errors.ultimo_nome}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] disabled:opacity-50 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="seu@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label htmlFor="telefone" className="block text-gray-700 text-sm font-medium mb-1">
                    Telefone
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="tel"
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] disabled:opacity-50 ${
                        errors.telefone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(11) 99999-9999"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.telefone && (
                    <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>
                  )}
                </div>

                {/* Tipo de Usuário */}
                <div>
                  <label htmlFor="tipo_usuario" className="block text-gray-700 text-sm font-medium mb-1">
                    Tipo de Usuário
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      id="tipo_usuario"
                      value={formData.tipo_usuario}
                      onChange={(e) => handleInputChange('tipo_usuario', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      <option value="proprietario">Proprietário</option>
                      <option value="corretor">Corretor</option>
                    </select>
                  </div>
                </div>

                {/* Senha */}
                <div>
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] pr-12 disabled:opacity-50 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Mínimo 6 caracteres"
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
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-1">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] pr-12 disabled:opacity-50 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirme sua senha"
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Termos e Condições */}
                <div className="space-y-3">
                  <div className="flex items-start">
                    <input
                      id="aceite_termos"
                      type="checkbox"
                      checked={formData.aceite_termos}
                      onChange={(e) => handleInputChange('aceite_termos', e.target.checked)}
                      className="h-4 w-4 text-[#0071ce] focus:ring-[#0071ce] border-gray-300 rounded mt-1 disabled:opacity-50"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="aceite_termos" className="ml-2 block text-sm text-gray-700">
                      Li e aceito os{' '}
                      <Link href="/termos" className="text-[#0071ce] hover:underline">
                        Termos de Uso
                      </Link>
                    </label>
                  </div>
                  {errors.aceite_termos && (
                    <p className="text-red-500 text-xs">{errors.aceite_termos}</p>
                  )}

                  <div className="flex items-start">
                    <input
                      id="aceite_privacidade"
                      type="checkbox"
                      checked={formData.aceite_privacidade}
                      onChange={(e) => handleInputChange('aceite_privacidade', e.target.checked)}
                      className="h-4 w-4 text-[#0071ce] focus:ring-[#0071ce] border-gray-300 rounded mt-1 disabled:opacity-50"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="aceite_privacidade" className="ml-2 block text-sm text-gray-700">
                      Li e aceito a{' '}
                      <Link href="/privacidade" className="text-[#0071ce] hover:underline">
                        Política de Privacidade
                      </Link>
                    </label>
                  </div>
                  {errors.aceite_privacidade && (
                    <p className="text-red-500 text-xs">{errors.aceite_privacidade}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0071ce] hover:bg-[#005fad] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Criando conta..." : "Criar conta"}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Já possui conta?{' '}
                    <Link href="/login" className="font-medium text-[#0071ce] hover:text-[#005fad]">
                      Faça login aqui
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default RegistrationForm; 