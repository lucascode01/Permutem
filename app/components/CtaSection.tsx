import React from 'react';
import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="relative py-16 bg-secondary text-white overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="container-center relative z-10">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Publique seu imóvel e comece a receber e enviar ofertas imediatamente.
          </h2>
          <Link href="/cadastro" className="btn bg-white text-[#0071ce] font-semibold hover:bg-gray-100 inline-block">
            Publique já
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection; 