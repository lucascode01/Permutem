'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirecionar se o usuário não estiver logado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Renderizar um loading state enquanto verifica autenticação
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0071ce] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Bem-vindo ao seu Dashboard, Eduardo
      </h1>

      {/* Cards informativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card de Imóveis */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Seus Imóveis</h2>
          <p className="text-gray-600 mb-4">
            Você ainda não possui imóveis cadastrados.
          </p>
          <Link 
            href="/anuncios/criar" 
            className="text-[#0071ce] hover:underline font-medium inline-block"
          >
            Anuncie seu primeiro imóvel
          </Link>
        </div>

        {/* Card de Propostas */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Propostas Recebidas</h2>
          <p className="text-gray-600">
            Você não tem propostas recebidas.
          </p>
        </div>

        {/* Card de Favoritos */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Imóveis Favoritos</h2>
          <p className="text-gray-600 mb-4">
            Você não tem imóveis favoritos.
          </p>
          <Link 
            href="/buscar-imoveis" 
            className="text-[#0071ce] hover:underline font-medium inline-block"
          >
            Buscar imóveis para permuta
          </Link>
        </div>
      </div>

      {/* Como funciona */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Como funciona o Permuti</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Passo 1 */}
          <div className="text-center p-3">
            <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-[#0071ce] font-semibold text-xl">1</span>
            </div>
            <h3 className="font-medium mb-2">Anuncie seu imóvel</h3>
            <p className="text-sm text-gray-600">
              Cadastre seu imóvel com fotos e detalhes
            </p>
          </div>
          
          {/* Passo 2 */}
          <div className="text-center p-3">
            <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-[#0071ce] font-semibold text-xl">2</span>
            </div>
            <h3 className="font-medium mb-2">Encontre opções</h3>
            <p className="text-sm text-gray-600">
              Busque imóveis compatíveis com seu interesse
            </p>
          </div>
          
          {/* Passo 3 */}
          <div className="text-center p-3">
            <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-[#0071ce] font-semibold text-xl">3</span>
            </div>
            <h3 className="font-medium mb-2">Faça propostas</h3>
            <p className="text-sm text-gray-600">
              Envie propostas de permuta aos proprietários
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 