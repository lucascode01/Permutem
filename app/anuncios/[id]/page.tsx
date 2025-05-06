'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function AnuncioRedirecionarPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  
  useEffect(() => {
    // Redirecionar para a rota correta após 2 segundos
    const timeout = setTimeout(() => {
      router.replace(`/anuncios/detalhes/${id}`);
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [id, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white flex-col">
      <div className="text-center mb-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
        <p className="text-gray-600 mb-6">Redirecionando para a nova página de detalhes...</p>
        <Link 
          href="/anuncios" 
          className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-4 py-2 rounded-md inline-flex items-center text-sm"
        >
          <FaArrowLeft className="mr-2" />
          Voltar para a lista de anúncios
        </Link>
      </div>
      <div className="text-center text-gray-500 text-sm">
        <p>Se você não for redirecionado automaticamente,</p>
        <Link 
          href={`/anuncios/detalhes/${id}`}
          className="text-blue-500 hover:underline"
        >
          clique aqui para acessar a página de detalhes
        </Link>
      </div>
    </div>
  );
} 