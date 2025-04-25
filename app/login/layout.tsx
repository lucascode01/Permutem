'use client';

import React from 'react';
import UnifiedHeader from '../components/UnifiedHeader';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UnifiedHeader transparent={false} />
      <main className="flex-1 pt-14">
        {children}
      </main>
    </div>
  );
} 