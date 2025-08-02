'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaListAlt, FaHeart, FaBell, FaComments, FaSignOutAlt } from 'react-icons/fa';
import { IoMdSwap } from 'react-icons/io';

const DynamicHeader = () => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Verificar se estamos em uma página pública (home, como-funciona, ajuda)
  const isPublicPage = ['/', '/como-funciona', '/ajuda'].includes(pathname);

  // Verificar se estamos na página de detalhe do imóvel
  const isPropertyDetailPage = pathname.startsWith('/imovel/');

  // Monitorar o scroll da página para mudar o estilo do cabeçalho
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fechar menu ao mudar de página
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    signOut();
  };

  // Cabeçalho para usuário não autenticado ou páginas públicas
  if (!user || isPublicPage) {
    // Defina headerClass com base na página e no estado de rolagem
    let headerClass = '';
    if (isPropertyDetailPage) {
      // Na página de detalhe do imóvel, sempre use fundo branco
      headerClass = 'bg-white shadow-md';
    } else {
      // Em outras páginas públicas, mantenha o comportamento original
      headerClass = isScrolled ? 'bg-white shadow-md' : 'bg-transparent';
    }

    return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
        <div className="container mx-auto max-w-6xl px-4 flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Image 
              src={isScrolled || isPropertyDetailPage ? "/images/permutem-logo.png" : "/images/permutem-logo-white.png"} 
              alt="Permutem" 
              width={150} 
              height={40} 
              className="h-10 w-auto"
            />
          </Link>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className={`text-sm font-medium ${isScrolled || isPropertyDetailPage ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'}`}>
                Início
              </Link>
              <Link href="/como-funciona" className={`text-sm font-medium ${isScrolled || isPropertyDetailPage ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'}`}>
                Como funciona
              </Link>
              <Link href="/ajuda" className={`text-sm font-medium ${isScrolled || isPropertyDetailPage ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'}`}>
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
                  <span className={`text-sm font-medium ${isScrolled || isPropertyDetailPage ? 'text-gray-800' : 'text-white'}`}>
                    {user.user_metadata?.primeiro_nome || 'Usuário'}
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
                          <p className="font-medium text-gray-800">{user.user_metadata?.primeiro_nome || 'Usuário'} {user.user_metadata?.ultimo_nome || ''}</p>
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
                <Link href="/login" className={`text-sm font-medium ${isScrolled || isPropertyDetailPage ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'}`}>
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Cabeçalho para usuário autenticado em páginas internas
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#222] text-white">
      <div className="container mx-auto max-w-6xl px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-5">
          <Link href="/dashboard" className="flex items-center">
            <Image 
              src="/images/permutem-logo-white.png" 
              alt="Permutem" 
              width={150} 
              height={40} 
              className="h-8 w-auto"
            />
          </Link>
          <Link href="/como-funciona" className="text-sm font-medium">
            Como funciona
          </Link>
          <Link href="/ajuda" className="text-sm font-medium">
            Ajuda
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/anuncios/criar" className="bg-[#4CAF50] hover:bg-[#43a047] text-white text-sm font-medium py-2 px-4 rounded transition-colors">
            <span className="hidden md:inline">Anuncie seu imóvel</span>
            <span className="md:hidden">Anunciar</span>
          </Link>
          <div className="relative">
            <button 
              className="flex items-center text-sm font-medium"
              onClick={toggleMenu}
            >
              <div className="h-9 w-9 bg-gray-300 rounded-full flex items-center justify-center mr-1">
                <FaUser className="text-gray-700" />
              </div>
              <span className="hidden md:inline">{user.firstName}</span>
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
        </div>
      </div>
    </header>
  );
};

export default DynamicHeader; 