'use client';

import InternalLayout from '../components/layouts/InternalLayout';

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InternalLayout>
      {children}
    </InternalLayout>
  );
} 