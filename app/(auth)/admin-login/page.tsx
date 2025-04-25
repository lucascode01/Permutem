'use client';

import { useEffect, useState } from 'react';
import AdminLoginClient from './components/AdminLoginClient';

export default function AdminLoginPage() {
  const [showClient, setShowClient] = useState(false);
  
  // Efeito para garantir que a renderização aconteça apenas no cliente
  useEffect(() => {
    setShowClient(true);
  }, []);
  
  if (!showClient) {
    return null;
            }
            
  return <AdminLoginClient />;
} 