'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';
import { FaUser, FaSignOutAlt, FaCog, FaBell, FaHeart, FaHome, FaPlus } from 'react-icons/fa';

export default function AuthNavbar() {
  const { user, userProfile, signOutWithConfirm, isAdmin, isCorretor } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await signOutWithConfirm();
    setShowUserMenu(false);
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/dashboard" className="flex items-center">
              <Image 
                src="/images/permutem-logo.png" 
                alt="Permutem" 
                width={120} 
                height={32} 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Navegação Central */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/dashboard" 
              className="flex items-center text-gray-700 hover:text-[#0071ce] transition-colors"
            >
              <FaHome className="mr-2" />
              Dashboard
            </Link>
            
            <Link 
              href="/anuncios" 
              className="flex items-center text-gray-700 hover:text-[#0071ce] transition-colors"
            >
              <FaPlus className="mr-2" />
              Meus Anúncios
            </Link>
            
            <Link 
              href="/favoritos" 
              className="flex items-center text-gray-700 hover:text-[#0071ce] transition-colors"
            >
              <FaHeart className="mr-2" />
              Favoritos
            </Link>
            
            <Link 
              href="/mensagens" 
              className="flex items-center text-gray-700 hover:text-[#0071ce] transition-colors"
            >
              <FaBell className="mr-2" />
              Mensagens
            </Link>

            {/* Menu Admin */}
            {isAdmin() && (
              <Link 
                href="/admin" 
                className="flex items-center text-red-600 hover:text-red-700 transition-colors"
              >
                <FaCog className="mr-2" />
                Admin
              </Link>
            )}
          </div>

          {/* Menu do Usuário */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-gray-700 hover:text-[#0071ce] transition-colors"
            >
              <div className="relative">
                <img
                  src={userProfile?.foto_perfil || '/images/default-avatar.png'}
                  alt="Foto do perfil"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
                {isAdmin() && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {userProfile?.primeiro_nome || 'Usuário'}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {userProfile?.primeiro_nome} {userProfile?.ultimo_nome}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userProfile?.tipo_usuario}
                  </p>
                </div>
                
                <Link
                  href="/perfil"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FaUser className="mr-2" />
                  Meu Perfil
                </Link>
                
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FaHome className="mr-2" />
                  Dashboard
                </Link>
                
                <Link
                  href="/anuncios"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FaPlus className="mr-2" />
                  Meus Anúncios
                </Link>
                
                <Link
                  href="/favoritos"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FaHeart className="mr-2" />
                  Favoritos
                </Link>
                
                <Link
                  href="/mensagens"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FaBell className="mr-2" />
                  Mensagens
                </Link>

                {isAdmin() && (
                  <Link
                    href="/admin"
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaCog className="mr-2" />
                    Painel Admin
                  </Link>
                )}
                
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para fechar o menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
} 