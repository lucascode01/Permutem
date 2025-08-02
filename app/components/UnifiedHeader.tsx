'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeftIcon,
  UserIcon,
  ChevronDownIcon,
  BellIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { FaSignOutAlt, FaUser, FaListAlt, FaHeart, FaComments } from 'react-icons/fa';
import { IoMdSwap } from 'react-icons/io';

interface UnifiedHeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
  pageTitle?: string;
  transparent?: boolean;
  hideMenu?: boolean;
  variant?: 'default' | 'dashboard' | 'profile' | 'plan';
  hideActions?: boolean;
}

export default function UnifiedHeader({
  showBackButton = false,
  backUrl = '/dashboard',
  pageTitle = '',
  transparent = false,
  hideMenu = false,
  variant = 'default',
  hideActions = false
}: UnifiedHeaderProps) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Determinar o estilo do cabeçalho com base na variante ou no caminho
  const isDashboardPage = variant === 'dashboard' || pathname?.startsWith('/dashboard');
  const isProfilePage = variant === 'profile' || pathname === '/perfil';
  const isPlanPage = variant === 'plan' || pathname?.includes('/plano');
  const isAuthPage = pathname === '/login' || pathname === '/cadastro';
  
  // Definir a cor de fundo baseada na variante
  let headerBgColor = '';
  let textColor = '';
  
  if (isDashboardPage) {
    headerBgColor = 'bg-[#222]';
    textColor = 'text-white';
  } else if (isProfilePage) {
    headerBgColor = 'bg-[#4CAF50]';
    textColor = 'text-white';
  } else if (isPlanPage) {
    headerBgColor = 'bg-[#0071ce]';
    textColor = 'text-white';
  } else if (transparent && !isScrolled) {
    headerBgColor = 'bg-transparent';
    textColor = 'text-white';
  } else {
    headerBgColor = 'bg-white';
    textColor = 'text-gray-800';
    if (!transparent) {
      headerBgColor += ' shadow-md';
    }
  }

  const headerStyle = `${headerBgColor} ${textColor}`;

  // Monitorar o scroll quando o cabeçalho é transparente
  useEffect(() => {
    if (transparent) {
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
    }
  }, [transparent]);

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
  
  // Logo branco ou colorido dependendo do fundo
  const logoFile = isDashboardPage || isProfilePage || isPlanPage || (transparent && !isScrolled)
    ? "/images/permutem-logo-white.png"
    : "/images/permutem-logo.png";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerStyle}`}>
      <div className="container mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Link href={backUrl} className="flex items-center">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
          )}
          
          <Link href="/" className="flex items-center">
            <Image 
              src={logoFile}
              alt="Permutem" 
              width={150} 
              height={40} 
              className="h-8 w-auto object-contain"
            />
          </Link>
          
          {pageTitle && (
            <h1 className="text-lg font-medium ml-4">{pageTitle}</h1>
          )}
          
          {!hideMenu && !isAuthPage && (
            <div className="hidden md:flex items-center space-x-6 ml-6">
              <Link 
                href="/" 
                className={`text-sm font-medium hover:opacity-80 transition-opacity
                  ${pathname === '/' ? 'opacity-100' : 'opacity-90'}`}
              >
                Início
              </Link>
              <Link 
                href="/como-funciona" 
                className={`text-sm font-medium hover:opacity-80 transition-opacity
                  ${pathname === '/como-funciona' ? 'opacity-100' : 'opacity-90'}`}
              >
                Como funciona
              </Link>
              <Link 
                href="/ajuda" 
                className={`text-sm font-medium hover:opacity-80 transition-opacity
                  ${pathname === '/ajuda' ? 'opacity-100' : 'opacity-90'}`}
              >
                Ajuda
              </Link>
            </div>
          )}
        </div>

        {!hideActions && (
          <div className="flex items-center space-x-4">
            {user && !isAuthPage && (
              <Link 
                href="/anuncios/criar" 
                className={`${isScrolled || !transparent || isDashboardPage || isProfilePage || isPlanPage 
                  ? 'bg-[#0071ce] hover:bg-blue-700 text-white' 
                  : 'bg-white text-[#0071ce] hover:bg-gray-100'} 
                  text-sm font-medium py-2 px-4 rounded transition-colors`}
              >
                <span className="hidden md:inline">Anuncie seu imóvel</span>
                <span className="md:hidden">Anunciar</span>
              </Link>
            )}
            
            {user ? (
              <div className="relative">
                <button 
                  className="flex items-center"
                  onClick={toggleMenu}
                  aria-label="Menu do usuário"
                >
                  <div className="h-8 w-8 bg-gray-100 text-blue-800 rounded-full flex items-center justify-center mr-1 font-medium text-md">
                    {user.user_metadata?.primeiro_nome?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm hidden md:inline font-medium mr-1">
                    {user.user_metadata?.primeiro_nome || 'Usuário'}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                
                {/* Menu de usuário suspenso */}
                {menuOpen && (
                  <div className="absolute right-0 top-10 z-[1000] bg-white shadow-lg rounded-lg w-64 py-2 mt-2">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3 font-medium">
                          {user.user_metadata?.primeiro_nome?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.user_metadata?.primeiro_nome || 'Usuário'} {user.user_metadata?.ultimo_nome || ''}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-b pb-2 pt-2">
                      <Link href="/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-100">
                        <HomeIcon className="h-5 w-5 text-gray-600 mr-3" />
                        <span className="text-gray-800">Dashboard</span>
                      </Link>
                      <Link href="/perfil" className="flex items-center px-4 py-2 hover:bg-gray-100">
                        <FaUser className="text-gray-600 mr-3" />
                        <span className="text-gray-800">Minha conta</span>
                      </Link>
                      <Link href="/anuncios" className="flex items-center px-4 py-2 hover:bg-gray-100">
                        <FaListAlt className="text-gray-600 mr-3" />
                        <span className="text-gray-800">Meus Anúncios</span>
                      </Link>
                      <Link href="/dashboard/plano-ativo" className="flex items-center px-4 py-2 hover:bg-gray-100">
                        <StarIcon className="h-5 w-5 text-gray-600 mr-3" />
                        <span className="text-gray-800">Meu Plano</span>
                      </Link>
                      <Link href="/favoritos" className="flex items-center px-4 py-2 hover:bg-gray-100">
                        <FaHeart className="text-gray-600 mr-3" />
                        <span className="text-gray-800">Favoritos</span>
                      </Link>
                      <Link href="/notificacoes" className="flex items-center px-4 py-2 hover:bg-gray-100">
                        <BellIcon className="h-5 w-5 text-gray-600 mr-3" />
                        <span className="text-gray-800">Notificações</span>
                      </Link>
                      <Link href="/propostas" className="flex items-center px-4 py-2 hover:bg-gray-100">
                        <FaComments className="text-gray-600 mr-3" />
                        <span className="text-gray-800">Propostas</span>
                      </Link>
                      <Link href="/sugestoes" className="flex items-center px-4 py-2 hover:bg-gray-100">
                        <IoMdSwap className="text-gray-600 mr-3" />
                        <span className="text-gray-800">Sugestões</span>
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
              !isAuthPage && (
                <>
                  <Link 
                    href="/cadastro" 
                    className={`${isScrolled || !transparent 
                      ? 'bg-[#0071ce] hover:bg-blue-700 text-white' 
                      : 'bg-white text-[#0071ce] hover:bg-gray-100'}
                        py-2 px-4 rounded text-sm font-medium transition-colors`}
                  >
                    <span className="hidden md:inline">Anuncie seu imóvel</span>
                    <span className="md:hidden">Anunciar</span>
                  </Link>
                  <Link 
                    href="/login" 
                    className={`text-sm font-medium hover:opacity-80 transition-opacity
                      ${isScrolled || !transparent ? 'text-gray-800' : 'text-white'}`}
                  >
                    Entrar
                  </Link>
                </>
              )
            )}
          </div>
        )}
      </div>
    </header>
  );
} 