'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EscolherPlanoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para a página de seleção de planos
    router.push('/selecionar-plano');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para seleção de planos...</p>
      </div>
    </div>
  );
} 