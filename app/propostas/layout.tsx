'use client';

import InternalLayout from '../components/layouts/InternalLayout';

export default function PropostasLayout({
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