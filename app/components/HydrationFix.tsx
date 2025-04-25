'use client';

import { useEffect, useState, createContext, useContext } from 'react';

type HydrationContextType = {
  isClient: boolean;
};

const HydrationContext = createContext<HydrationContextType>({ isClient: false });

export function useIsClient() {
  return useContext(HydrationContext).isClient;
}

export default function HydrationFix({ children }: { children?: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <HydrationContext.Provider value={{ isClient }}>
      {children}
    </HydrationContext.Provider>
  );
}

// Componente para renderizar apenas no cliente
export function ClientOnly({ children, fallback = null }: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode 
}) {
  const isClient = useIsClient();
  
  if (!isClient) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
} 