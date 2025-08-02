'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import AuthNavbar from './AuthNavbar';
import Footer from './Footer';
import { useAuth } from '@/app/hooks/useAuth';

export default function MainContentWrapper({ 
  children 
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Verifica se a rota atual é EXATAMENTE /admin-login
  const isAdminLoginRoute = pathname === '/admin-login';

  // Rotas que não devem mostrar navbar/footer
  const publicRoutes = ['/login', '/cadastro', '/recuperar-senha', '/verificacao-email'];
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <div suppressHydrationWarning>
      {/* Renderiza AuthNavbar se usuário está logado, Navbar se não está logado */}
      {!isAdminLoginRoute && !isPublicRoute && (
        user ? <AuthNavbar /> : <Navbar />
      )}
      
      <main suppressHydrationWarning>
        {children}
      </main>
      
      {/* Renderiza Footer apenas se NÃO for a rota /admin-login */}
      {!isAdminLoginRoute && <Footer />}
    </div>
  );
} 