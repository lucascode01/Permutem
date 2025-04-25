// Este arquivo serve como fallback para garantir que a raiz funcione
// mesmo se houver problemas com o App Router

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomeRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redireciona para a página inicial do App Router
    router.replace('/');
  }, [router]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      Redirecionando para a página inicial...
    </div>
  );
} 