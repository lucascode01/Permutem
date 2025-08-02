'use client';

import React from 'react';
import AuthGuard from '@/app/components/AuthGuard';
import { useAuth } from '@/app/hooks/useAuth';
import { FaHome, FaPlus, FaHeart, FaBell, FaUser, FaCog } from 'react-icons/fa';

export default function DashboardPage() {
  const { userProfile, isAdmin, isCorretor, isProprietario } = useAuth();

  const dashboardItems = [
    {
      title: 'Meus Anúncios',
      description: 'Gerencie seus imóveis anunciados',
      icon: FaPlus,
      href: '/anuncios',
      color: 'bg-blue-500',
    },
    {
      title: 'Favoritos',
      description: 'Imóveis que você salvou',
      icon: FaHeart,
      href: '/favoritos',
      color: 'bg-red-500',
    },
    {
      title: 'Mensagens',
      description: 'Conversas e propostas',
      icon: FaBell,
      href: '/mensagens',
      color: 'bg-green-500',
    },
    {
      title: 'Meu Perfil',
      description: 'Edite suas informações',
      icon: FaUser,
      href: '/perfil',
      color: 'bg-purple-500',
    },
  ];

  // Adicionar itens específicos para admin
  if (isAdmin()) {
    dashboardItems.push({
      title: 'Painel Admin',
      description: 'Gerenciar sistema',
      icon: FaCog,
      href: '/admin',
      color: 'bg-red-600',
    });
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bem-vindo, {userProfile?.primeiro_nome}!
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie seus imóveis e encontre as melhores oportunidades de permuta.
            </p>
          </div>

          {/* Status do Usuário */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Status da Conta
                </h2>
                <p className="text-sm text-gray-600 capitalize">
                  {userProfile?.tipo_usuario} • Conta ativa
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
          </div>

          {/* Cards de Ação */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${item.color} text-white`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Estatísticas Rápidas */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaPlus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Anúncios Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaHeart className="w-5 h-5 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Favoritos</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaBell className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mensagens</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaUser className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Visualizações</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h2>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#0071ce] text-white px-6 py-2 rounded-lg hover:bg-[#005fad] transition-colors">
                Anunciar Imóvel
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Buscar Imóveis
              </button>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Ver Propostas
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
} 