import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
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
          
          <Link href="/cadastro" className="bg-[#0071ce] hover:bg-opacity-90 text-white py-2 px-4 rounded text-sm font-medium">
            <span className="hidden md:inline">Anuncie seu imóvel</span>
            <span className="md:hidden">Anunciar</span>
          </Link>
          <Link href="/login" className="text-gray-800 text-sm font-medium hover:text-primary">
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 