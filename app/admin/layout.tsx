'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from '../components/AdminHeader';
import HydrationFix from '../components/HydrationFix';
import Link from 'next/link';
import { FaUsers, FaBuilding, FaChartBar, FaCog, FaComments, FaExchangeAlt, FaMoneyBillWave, FaTachometerAlt } from 'react-icons/fa';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!isLoading && (!user || user?.user_metadata?.tipo_usuario !== 'admin')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

      if (!user || user.user_metadata?.tipo_usuario !== 'admin') {
    return null; // Não renderizar nada enquanto o redirecionamento acontece
  }

  return (
    <>
      <HydrationFix />
      <AdminHeader />
      
      <div id="admin-layout" className="flex min-h-screen bg-gray-50">
        {/* Barra lateral */}
        <aside className="w-64 pt-5 px-4 pb-6 bg-white shadow-sm border-r border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <FaTachometerAlt className="mr-2 text-blue-600" />
            <span>Administração</span>
          </h2>
          
          <nav>
            <ul className="space-y-1">
              <li>
                <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <FaChartBar className="mr-3 text-gray-500" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/usuarios" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <FaUsers className="mr-3 text-gray-500" />
                  <span>Usuários</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/imoveis" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <FaBuilding className="mr-3 text-gray-500" />
                  <span>Imóveis</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/propostas" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <FaExchangeAlt className="mr-3 text-gray-500" />
                  <span>Propostas</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/mensagens" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <FaComments className="mr-3 text-gray-500" />
                  <span>Mensagens</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/financeiro" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <FaMoneyBillWave className="mr-3 text-gray-500" />
                  <span>Financeiro</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/configuracoes" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <FaCog className="mr-3 text-gray-500" />
                  <span>Configurações</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Conteúdo principal */}
        <main className="flex-1 px-8 py-8">
          {children}
        </main>
      </div>
    </>
  );
} 