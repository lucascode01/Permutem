'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirecionar para o dashboard administrativo
    router.push('/admin/dashboard');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
    </div>
  );
} 