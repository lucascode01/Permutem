'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  BuildingOffice2Icon, 
  DocumentTextIcon, 
  UserIcon, 
  HeartIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  
  // Menu principal com as mesmas opções que aparecem no dropdown do perfil
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Meus Imóveis', href: '/anuncios', icon: BuildingOffice2Icon },
    { name: 'Minhas Propostas', href: '/propostas', icon: DocumentTextIcon },
    { name: 'Imóveis Favoritos', href: '/favoritos', icon: HeartIcon },
    { name: 'Notificações', href: '/notificacoes', icon: BellIcon },
    { name: 'Sugestões', href: '/sugestoes', icon: ChatBubbleLeftRightIcon },
    { name: 'Minha Conta', href: '/perfil', icon: UserIcon },
    { name: 'Meu Plano', href: '/dashboard/plano-ativo', icon: StarIcon },
  ];

  // Determinar o nome do plano com base no ID
  const getPlanName = (planoId: string | undefined) => {
    if (!planoId) return 'Nenhum';
    
    if (planoId.includes('basic')) return 'Básico';
    if (planoId.includes('premium')) return 'Premium';
    if (planoId.includes('professional') || planoId.includes('profissional')) return 'Profissional';
    
    return planoId; // Retorna o ID original se não reconhecer o padrão
  };

  const planName = getPlanName(undefined);

  return (
    <div className="h-full w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-center">
        <Link href="/">
          <Image 
            src="/images/permutem-logo.png" 
            alt="Permutem" 
            width={120} 
            height={30} 
            className="h-8 w-auto"
          />
        </Link>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center font-medium text-lg">
            {user?.user_metadata?.primeiro_nome?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-medium text-gray-800">{user?.user_metadata?.primeiro_nome || 'Usuário'} {user?.user_metadata?.ultimo_nome || ''}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-2">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-white bg-[#0071ce]'
                        : 'text-gray-700 hover:text-[#0071ce] hover:bg-blue-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center px-4 py-2 text-sm font-medium text-[#0071ce] bg-blue-50 rounded-lg mb-4">
          <span className="mr-2 text-lg">⭐</span>
          <div>
            <p>Status: Inativo</p>
            <p className="text-xs text-gray-600">Plano: {planName}</p>
          </div>
        </div>

        <button
                          onClick={signOut}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
          Sair
        </button>
      </div>
    </div>
  );
} 