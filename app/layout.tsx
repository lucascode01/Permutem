import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { Toaster } from 'react-hot-toast';
import MainContentWrapper from './components/MainContentWrapper';

// Define fontes de sistema em vez de importar do Google Fonts
const fontClass = 'font-sans'; // Usa a fonte sans-serif do sistema

// A exportação de metadata ainda funciona em client components
export const metadata: Metadata = {
  title: 'Permutem - Plataforma de Permuta de Imóveis',
  description: 'Encontre opções de permuta para seu imóvel de forma rápida e segura',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Fontes serão carregadas via CDN em vez de Next.js Fonts */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" />
        {/* Script que remove atributos problemáticos adicionados por extensões */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const handleAttributeRemoval = () => {
                const body = document.body;
                if (!body) return;
                
                // Remove atributos específicos
                ['bis_register', '__processed_be3f8c50-3ca7-4e01-b56a-ac51cd88d324__', 'cz-shortcut-listen'].forEach(attr => {
                  if (body.hasAttribute(attr)) {
                    body.removeAttribute(attr);
                  }
                });
              };
              
              // Executa imediatamente
              handleAttributeRemoval();
              
              // Executa novamente após DOMContentLoaded
              document.addEventListener('DOMContentLoaded', handleAttributeRemoval);
              
              // Executa periodicamente
              setInterval(handleAttributeRemoval, 500);
            `,
          }}
        />
      </head>
      <body className={fontClass} suppressHydrationWarning>
        <SupabaseProvider>
          <AuthProvider>
            {/* Usa o Wrapper para controlar Navbar/Footer */}
            <MainContentWrapper>
              {children}
            </MainContentWrapper>
            <Toaster position="top-center" />
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
} 