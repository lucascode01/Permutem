'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaListAlt, FaHeart, FaBell, FaComments, FaSignOutAlt } from 'react-icons/fa';
import { IoMdSwap } from 'react-icons/io';
import { notificacoesService } from '../lib/services/notificacoes-service';

export const Navbar = () => {
  const { user, userProfile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const pathname = usePathname();

  // Verificar se estamos em uma página pública (home, como-funciona, ajuda)
  const isPublicPage = ['/', '/como-funciona', '/ajuda'].includes(pathname || '');

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
  
  // Buscar notificações não lidas
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (user?.id) {
        try {
          const { count, error } = await notificacoesService.contarNaoLidas(user.id);
          if (!error) {
            setUnreadNotifications(count);
          }
        } catch (error) {
          console.error('Erro ao buscar notificações:', error);
        }
      }
    };

    fetchUnreadNotifications();

    // Configurar polling para atualizar a cada 60 segundos
    const interval = setInterval(fetchUnreadNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    signOut();
  };

  // Cabeçalho para usuário não autenticado ou páginas públicas
  if (!user || isPublicPage) {
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto max-w-6xl px-4 flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Image 
              src={isScrolled ? "/images/permutem-logo.png" : "/images/permutem-logo-white.png"} 
              alt="Permutem" 
              width={185} 
              height={50} 
              className="w-auto h-12" 
              priority
            />
          </Link>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className={`text-sm font-medium ${isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'}`}>
                Início
              </Link>
              <Link href="/como-funciona" className={`text-sm font-medium ${isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'}`}>
                Como funciona
              </Link>
              <Link href="/ajuda" className={`text-sm font-medium ${isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'}`}>
                Ajuda
              </Link>
            </nav>
            
            {!user ? (
              <div className="flex items-center space-x-4">
                <Link href="/cadastro" className="bg-[#0071ce] hover:bg-opacity-90 text-white py-2 px-4 rounded text-sm font-medium">
                  <span className="hidden md:inline">Anuncie seu imóvel</span>
                  <span className="md:hidden">Anunciar</span>
                </Link>
                <Link href="/login" className={`text-sm font-medium ${isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'}`}>
                  Entrar
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button 
                  className="flex items-center"
                  onClick={toggleMenu}
                >
                  <div className="h-9 w-9 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    <FaUser className="text-gray-700" />
                  </div>
                  <span className={`text-sm font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                    {userProfile?.primeiro_nome}
                  </span>
                </button>
                
                {menuOpen && (
                  <div className="absolute right-0 top-10 z-[1000] bg-white shadow-lg rounded-lg w-64 py-2 mt-2">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <FaUser className="text-gray-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{userProfile?.primeiro_nome} {userProfile?.ultimo_nome}</p>
                          <p className="text-sm text-gray-500">{userProfile?.email}</p>
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
                        <div className="relative">
                          <FaBell className="text-gray-600 mr-3" />
                          {unreadNotifications > 0 && (
                            <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                              {unreadNotifications > 9 ? '9+' : unreadNotifications}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-800">Notificações</span>
                        {unreadNotifications > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                            {unreadNotifications}
                          </span>
                        )}
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
            )}
          </div>
        </div>
      </header>
    );
  }

  // Cabeçalho para usuário autenticado em páginas internas
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto max-w-6xl px-4 flex justify-between items-center h-[68px]">
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/permutem-logo.png" 
            alt="Permutem" 
            width={185} 
            height={50} 
            className="w-auto h-12"
            priority
          />
        </Link>
        
        <div className="flex items-center">
          <div className="relative">
            <button 
              className="flex items-center"
              onClick={toggleMenu}
            >
              <div className="h-9 w-9 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                <FaUser className="text-gray-700" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                {userProfile?.primeiro_nome}
              </span>
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 top-10 z-[1000] bg-white shadow-lg rounded-lg w-64 py-2 mt-2">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{userProfile?.primeiro_nome} {userProfile?.ultimo_nome}</p>
                      <p className="text-sm text-gray-500">{userProfile?.email}</p>
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
                    <div className="relative">
                      <FaBell className="text-gray-600 mr-3" />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadNotifications > 9 ? '9+' : unreadNotifications}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-800">Notificações</span>
                    {unreadNotifications > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {unreadNotifications}
                      </span>
                    )}
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

// Adicionar export default do componente para compatibilidade
export default Navbar; 