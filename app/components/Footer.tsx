import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-16 pb-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-lg mb-4">Sobre o Permutem</h3>
            <p className="text-gray-600 mb-4">
              O Permutem é uma plataforma online de classificados dedicada à permuta de imóveis. Aqui você pode anunciar seu imóvel e encontrar trocas compatíveis em qualquer região do Brasil.
            </p>
            <Link href="/como-funciona" className="text-primary hover:text-secondary font-medium">
              Somos um portal de troca ou permuta de imóveis.
            </Link>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Suporte</h3>
            <p className="text-gray-600 mb-4">
              Precisa de ajuda com informações ou tem alguma dúvida sobre o Permutem? Acesse nossa Central de Ajuda.
            </p>
            <Link href="/ajuda" className="text-primary hover:text-secondary font-medium">
              Central de Ajuda
            </Link>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Receba nossa Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Fique por dentro das novidades do mercado imobiliário!
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
              <input 
                type="email" 
                placeholder="Digite seu e-mail" 
                className="w-full sm:flex-1 border border-gray-300 rounded-md sm:rounded-r-none sm:rounded-l-md px-4 py-3 focus:outline-none focus:border-primary"
              />
              <button className="w-full sm:w-auto bg-primary hover:bg-secondary text-white px-6 py-3 rounded-md sm:rounded-l-none sm:rounded-r-md font-medium transition-colors">
                INSCREVER-SE
              </button>
            </div>
          </div>
        </div>
        
        <hr className="border-gray-200 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 Permutem. Todos os direitos reservados.</p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/termos" className="hover:text-primary">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-primary">Política de Privacidade</Link>
            <Link href="/cookies" className="hover:text-primary">Política de Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 