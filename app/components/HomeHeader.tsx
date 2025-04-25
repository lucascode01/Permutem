import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HomeHeader = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto max-w-6xl px-4 flex justify-between items-center h-20">
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/permutem-logo-white.png" 
            alt="Permutem" 
            width={200} 
            height={53} 
            className="h-14 w-auto"
          />
        </Link>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white text-sm font-medium hover:text-gray-200">
              Início
            </Link>
            <Link href="/como-funciona" className="text-white text-sm font-medium hover:text-gray-200">
              Como funciona
            </Link>
            <Link href="/ajuda" className="text-white text-sm font-medium hover:text-gray-200">
              Ajuda
            </Link>
          </nav>
          
          <Link href="/cadastro" className="bg-[#0071ce] hover:bg-opacity-90 text-white py-2 px-4 rounded text-sm font-medium">
            <span className="hidden md:inline">Anuncie seu imóvel</span>
            <span className="md:hidden">Anunciar</span>
          </Link>
          <Link href="/login" className="text-white text-sm font-medium hover:text-gray-200">
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader; 