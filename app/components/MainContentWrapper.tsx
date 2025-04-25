'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainContentWrapper({ 
  children 
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  // Verifica se a rota atual é EXATAMENTE /admin-login
  const isAdminLoginRoute = pathname === '/admin-login';

  return (
    <div suppressHydrationWarning>
      {/* Renderiza Navbar apenas se NÃO for a rota /admin-login */}
      {!isAdminLoginRoute && <Navbar />}
      
      <main suppressHydrationWarning>
        {children}
      </main>
      
      {/* Renderiza Footer apenas se NÃO for a rota /admin-login */}
      {!isAdminLoginRoute && <Footer />}
    </div>
  );
} 