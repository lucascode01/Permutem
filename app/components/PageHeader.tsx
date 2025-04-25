'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaUser, FaListAlt, FaHeart, FaBell, FaComments, FaSignOutAlt } from 'react-icons/fa';
import { IoMdSwap } from 'react-icons/io';
import { useAuth } from '../contexts/AuthContext';

const PageHeader = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Fechar menu ao mudar de página
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto max-w-6xl px-4 flex justify-between items-center h-20">
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/permutem-logo.png" 
            alt="Permutem" 
            width={150} 
            height={40} 
            className="h-10 w-auto"
          />
        </Link>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-800 text-sm font-medium hover:text-primary">
              Início
            </Link>
            <Link href="/como-funciona" className="text-gray-800 text-sm font-medium hover:text-primary">
              Como funciona
            </Link>
            <Link href="/ajuda" className="text-gray-800 text-sm font-medium hover:text-primary">
              Ajuda
            </Link>
          </nav>
          
          {user ? (
            <div className="relative">
              <button 
                className="flex items-center"
                onClick={toggleMenu}
              >
                <div className="h-9 w-9 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                  <FaUser className="text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {user.firstName}
                </span>
              </button>
              
              {/* Menu de usuário suspenso */}
              {menuOpen && (
                <div className="absolute right-0 top-10 z-[1000] bg-white shadow-lg rounded-lg w-64 py-2 mt-2">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <FaUser className="text-gray-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-b pb-2 pt-2">
                    <Link href="/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-100">
                      <FaUser className="text-gray-600 mr-3" />
                      <span className="text-gray-800">Painel</span>
                    </Link>
                    <Link href="/perfil" className="flex items-center px-4 py-2 hover:bg-gray-100">
                      <FaUser className="text-gray-600 mr-3" />
                      <span className="text-gray-800">Minha conta</span>
                    </Link>
                    <Link href="/anuncios" className="flex items-center px-4 py-2 hover:bg-gray-100">
                      <FaListAlt className="text-gray-600 mr-3" />
                      <span className="text-gray-800">Meus Anúncios</span>
                    </Link>
                    <Link href="/favoritos" className="flex items-center px-4 py-2 hover:bg-gray-100">
                      <FaHeart className="text-gray-600 mr-3" />
                      <span className="text-gray-800">Imóveis Favoritos</span>
                    </Link>
                    <Link href="/notificacoes" className="flex items-center px-4 py-2 hover:bg-gray-100">
                      <FaBell className="text-gray-600 mr-3" />
                      <span className="text-gray-800">Notificações</span>
                    </Link>
                    <Link href="/propostas" className="flex items-center px-4 py-2 hover:bg-gray-100">
                      <FaComments className="text-gray-600 mr-3" />
                      <span className="text-gray-800">Minhas Propostas</span>
                    </Link>
                    <Link href="/sugestoes" className="flex items-center px-4 py-2 hover:bg-gray-100">
                      <IoMdSwap className="text-gray-600 mr-3" />
                      <span className="text-gray-800">Sugestões de imóveis</span>
                    </Link>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <FaSignOutAlt className="mr-3" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/cadastro" className="bg-[#0071ce] hover:bg-opacity-90 text-white py-2 px-4 rounded text-sm font-medium">
                <span className="hidden md:inline">Anuncie seu imóvel</span>
                <span className="md:hidden">Anunciar</span>
              </Link>
              <Link href="/login" className="text-gray-800 text-sm font-medium hover:text-primary">
                Entrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader; 