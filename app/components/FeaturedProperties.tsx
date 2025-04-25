'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

type PropertyProps = {
  id: string;
  title: string;
  location: string;
  price: string;
  priceUSD?: string;
  imageUrl: string;
  exchangeCountry?: string;
  badges?: {
    type: 'for_sale' | 'for_exchange';
    text: string;
  }[];
};

const PropertyCard = ({
  id,
  title,
  location,
  price,
  priceUSD,
  imageUrl,
  exchangeCountry = "Brasil",
  badges = [],
}: PropertyProps) => {
  return (
    <Link href={`/imovel/${id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <button 
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.preventDefault(); // Impedir navegação ao clicar no coração
                // Aqui você pode adicionar lógica de favoritar se necessário
              }}
            >
              <FaHeart className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
          <div 
            className="h-48 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          
          {badges.some(badge => badge.type === 'for_exchange') && (
            <div className="mb-3">
              <p className="text-sm text-[#0071ce] font-medium">
                Estuda permuta por imóvel em{' '}
                <span className="inline-block border border-[#0071ce] px-1 text-[#0071ce] font-semibold">
                  {exchangeCountry}
                </span>
              </p>
            </div>
          )}
          
          <div className="flex flex-col">
            <p className="font-bold text-lg text-primary">{price}</p>
            {priceUSD && <p className="text-gray-500 text-sm">{priceUSD}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
};

const FeaturedProperties = () => {
  const properties: PropertyProps[] = [
    {
      id: '1',
      title: 'Apartamento no Jardins de São Paulo',
      location: '',
      price: 'R$ 2.750.000',
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3',
      exchangeCountry: "SP",
      badges: [
        { type: 'for_exchange', text: 'Permuta por imóvel' }
      ],
    },
    {
      id: '2',
      title: 'Casa no Condomínio Alphaville de Belo Horizonte',
      location: '',
      price: 'R$ 3.200.000',
      imageUrl: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3',
      exchangeCountry: "RJ",
      badges: [
        { type: 'for_exchange', text: 'Permuta por imóvel' }
      ],
    },
    {
      id: '3',
      title: 'Cobertura Duplex na Barra da Tijuca do Rio de Janeiro',
      location: '',
      price: 'R$ 1.201.603',
      imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3',
      exchangeCountry: "SC",
      badges: [
        { type: 'for_exchange', text: 'Permuta por imóvel' }
      ],
    },
    {
      id: '4',
      title: 'Apartamento no Centro de Manhuaçu',
      location: '',
      price: 'R$ 420.000',
      imageUrl: '/images/cities/manhuacu.png',
      exchangeCountry: "MG",
      badges: [
        { type: 'for_exchange', text: 'Permuta por imóvel' }
      ],
    },
    {
      id: '5',
      title: 'Casa no Condomínio Vista Verde de Muriaé',
      location: '',
      price: 'R$ 650.000',
      imageUrl: '/images/cities/muriae.png',
      exchangeCountry: "MG",
      badges: [
        { type: 'for_exchange', text: 'Permuta por imóvel' }
      ],
    },
    {
      id: '6',
      title: 'Cobertura no Brooklin de São Paulo',
      location: '',
      price: 'R$ 780.000',
      imageUrl: '/images/cities/ipatinga.png',
      exchangeCountry: "MG",
      badges: [
        { type: 'for_exchange', text: 'Permuta por imóvel' }
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalItems = properties.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + itemsPerPage) >= totalItems ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalItems - 1 : prevIndex - 1
    );
  };

  // Calcula os itens visíveis baseados no índice atual
  const getVisibleItems = () => {
    const visibleItems = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % totalItems;
      visibleItems.push(properties[index]);
    }
    return visibleItems;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-center">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Imóveis para Permutar em Destaque</h2>
            <p className="text-gray-600">Troque seu imóvel com estilo e descubra grandes oportunidades em todo o Brasil.</p>
          </div>
          <div className="flex">
            <button 
              onClick={prevSlide}
              className="border border-gray-300 rounded-full p-2 mr-2 hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getVisibleItems().map((property) => (
            <div key={`property-${property.id}`}>
              <PropertyCard 
                id={property.id}
                title={property.title} 
                location={property.location}
                price={property.price}
                priceUSD={property.priceUSD}
                imageUrl={property.imageUrl}
                exchangeCountry={property.exchangeCountry}
                badges={property.badges}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties; 