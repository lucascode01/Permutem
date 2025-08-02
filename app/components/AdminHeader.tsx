'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { FaSignOutAlt, FaHome, FaUserCog, FaRegBell, FaSearch } from 'react-icons/fa';

const AdminHeader = () => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  // Fechar menu ao mudar de página
  useEffect(() => {
    setMenuOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (menuOpen) setMenuOpen(false);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    signOut();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pesquisando:", searchQuery);
    // Implementar lógica de pesquisa aqui
  };

  if (!user || user.user_metadata?.tipo_usuario !== 'admin') {
    return null;
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md">
      <div className="flex justify-between items-center h-20 px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/admin/dashboard" className="flex items-center">
            <Image 
              src="/images/permutem-logo.png" 
              alt="Permutem" 
              width={140} 
              height={45} 
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Barra de pesquisa */}
        <div className="hidden md:block flex-grow max-w-xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-gray-500 hover:text-blue-600"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Ações do usuário */}
        <div className="flex items-center space-x-5">
          {/* Botão Home */}
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            <FaHome className="text-xl" />
          </Link>

          {/* Notificações */}
          <div className="relative">
            <button 
              className="text-gray-600 hover:text-blue-600 relative"
              onClick={toggleNotifications}
            >
              <FaRegBell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">Novo imóvel pendente aprovação</p>
                    <p className="text-xs text-gray-500 mt-1">Há 10 minutos atrás</p>
                  </div>
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">Novo usuário cadastrado</p>
                    <p className="text-xs text-gray-500 mt-1">Há 1 hora atrás</p>
                  </div>
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">Novo pagamento recebido</p>
                    <p className="text-xs text-gray-500 mt-1">Há 3 horas atrás</p>
                  </div>
                </div>
                <div className="p-2 text-center border-t border-gray-200">
                  <Link href="/admin/notificacoes" className="text-xs text-blue-600 font-medium hover:underline">
                    Ver todas as notificações
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Perfil de usuário */}
          <div className="relative">
            <button 
              className="flex items-center"
              onClick={toggleMenu}
            >
              <div className="h-9 w-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <FaUserCog />
              </div>
              <span className="ml-2 font-medium text-sm text-gray-700 hidden md:block">
                {user.user_metadata?.primeiro_nome || 'Admin'}
              </span>
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-medium text-gray-800">{user.user_metadata?.primeiro_nome || 'Admin'} {user.user_metadata?.ultimo_nome || ''}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link href="/admin/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Perfil de administrador
                  </Link>
                  <Link href="/admin/configuracoes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Configurações
                  </Link>
                </div>
                <div className="py-1 border-t border-gray-200">
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <FaSignOutAlt className="mr-2" />
                      <span>Sair</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 