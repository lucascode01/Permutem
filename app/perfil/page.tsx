'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaCamera, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaEdit, FaCheck, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import HydrationFix from '../components/HydrationFix';
import ImageUpload from '../components/ImageUpload';

// Interface expandida para o User do perfil
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'proprietario' | 'corretor' | 'admin';
  subscription?: {
    active: boolean;
    planoId?: string;
    expiracao?: string;
  };
  phone?: string;
  bio?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
}

export default function PerfilPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('geral');
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    address: {
      street: '',
      number: '',
      complement: '',
      city: '',
      state: '',
      country: '',
      zip: '',
    }
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user) {
      // Tratar o usuário como UserProfile para acessar os campos adicionais
      const userProfile = user as unknown as UserProfile;
      
      // Preencher dados do formulário com dados do usuário
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || '',
        address: {
          street: userProfile.address?.street || '',
          number: userProfile.address?.number || '',
          complement: userProfile.address?.complement || '',
          city: userProfile.address?.city || '',
          state: userProfile.address?.state || '',
          country: userProfile.address?.country || '',
          zip: userProfile.address?.zip || '',
        }
      });
      
      // Simulação de imagem de perfil (mock)
      setProfileImageUrl(null); // Inicialmente sem imagem
    }
  }, [user, isLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setFormData({
        ...formData,
        [parentKey]: {
          ...(formData[parentKey as keyof typeof formData] as Record<string, any>),
          [childKey]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de atualização
    setTimeout(() => {
      setSuccessMsg('Perfil atualizado com sucesso!');
      setEditing(false);
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    }, 1000);
  };
  
  const handleImageSelected = (file: File) => {
    setProfileImage(file);
    // Em uma implementação real, aqui você enviaria a imagem para o servidor
    console.log('Imagem selecionada:', file.name);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Minha Conta</h1>
      
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          {/* Foto e nome do usuário */}
          <div className="bg-[#4CAF50] p-8 flex flex-col items-center relative">
            <ImageUpload 
              currentImage={profileImageUrl}
              onImageSelected={handleImageSelected}
            />
          <h2 className="text-xl font-semibold text-white">{user?.firstName} {user?.lastName}</h2>
          <p className="text-white text-opacity-90">{user?.email}</p>
          </div>

          {/* Abas */}
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('geral')}
              className={`py-4 px-6 font-medium text-sm ${activeTab === 'geral' 
                ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
                : 'text-gray-600 hover:text-gray-800'}`}
            >
              Informações Gerais
            </button>
            <button 
              onClick={() => setActiveTab('seguranca')}
              className={`py-4 px-6 font-medium text-sm ${activeTab === 'seguranca' 
                ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
                : 'text-gray-600 hover:text-gray-800'}`}
            >
              Segurança
            </button>
          </div>

          {/* Conteúdo da aba selecionada */}
          <div className="p-6">
            {/* Mensagens de erro/sucesso */}
            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
                {successMsg}
              </div>
            )}
            
            {/* Tab: Informações Gerais */}
            {activeTab === 'geral' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Informações Pessoais</h3>
                  {!editing ? (
                    <button 
                      onClick={() => setEditing(true)}
                      className="flex items-center text-[#4CAF50]"
                    >
                      <FaEdit className="mr-1" />
                      <span>Editar</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => setEditing(false)}
                      className="flex items-center text-gray-500"
                    >
                      <span>Cancelar</span>
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`w-full pl-10 pr-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sobrenome
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className={`w-full px-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`w-full pl-10 pr-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`w-full pl-10 pr-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sobre mim
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!editing}
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-8 mb-4">Endereço</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rua
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className={`w-full px-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número
                        </label>
                        <input
                          type="text"
                          name="address.number"
                          value={formData.address.number}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`w-full px-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Complemento
                        </label>
                        <input
                          type="text"
                          name="address.complement"
                          value={formData.address.complement}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`w-full px-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className={`w-full px-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`w-full px-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CEP
                        </label>
                        <input
                          type="text"
                          name="address.zip"
                          value={formData.address.zip}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className={`w-full px-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        País
                      </label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className={`w-full px-4 py-2 border rounded-md ${editing ? 'bg-white' : 'bg-gray-50'} ${!editing && 'text-gray-500'}`}
                      />
                    </div>
                  </div>
                  
                  {editing && (
                    <div className="mt-6 text-right">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#43a047] transition-colors"
                      >
                        <FaCheck className="mr-2" />
                        Salvar Alterações
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
            
            {/* Tab: Segurança */}
            {activeTab === 'seguranca' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Alterar Senha</h3>
                
                <form className="max-w-md">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#43a047] transition-colors"
                  >
                    Alterar Senha
                  </button>
                </form>
              </div>
            )}
        </div>
    </div>
    </>
  );
} 