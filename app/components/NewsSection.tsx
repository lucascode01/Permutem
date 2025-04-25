'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CityCardProps = {
  title: string;
  imageSrc: string;
  ctaText: string;
  ctaLink: string;
};

const CityCard = ({ title, imageSrc, ctaText, ctaLink }: CityCardProps) => {
  return (
    <div className="relative h-48 md:h-56 lg:h-64 rounded-lg overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10" />
      <div 
        className="absolute inset-0 z-0 transform group-hover:scale-105 transition-transform duration-300"
      >
        <div 
          className="relative w-full h-full"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
        <h3 className="font-bold text-xl mb-3">{title}</h3>
        <Link 
          href={ctaLink} 
          className="bg-white text-[#0071ce] py-2 px-4 rounded-md font-medium text-sm hover:bg-gray-100 transition-colors"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
};

const NewsSection = () => {
  // Preparando para receber 5 cidades
  const cityItems: CityCardProps[] = [
    {
      title: 'Manhuaçu-MG',
      imageSrc: '/images/cities/manhuacu.png',
      ctaText: 'Mostrar imóveis',
      ctaLink: '#',
    },
    {
      title: 'Muriaé-MG',
      imageSrc: '/images/cities/muriae.png',
      ctaText: 'Mostrar imóveis',
      ctaLink: '#',
    },
    {
      title: 'Ipatinga-MG',
      imageSrc: '/images/cities/ipatinga.png',
      ctaText: 'Mostrar imóveis',
      ctaLink: '#',
    },
    {
      title: 'Manhumirim-MG',
      imageSrc: '/images/cities/manhumirim.png',
      ctaText: 'Mostrar imóveis',
      ctaLink: '#',
    },
    {
      title: 'Caratinga-MG',
      imageSrc: '/images/cities/cidade5.png',
      ctaText: 'Mostrar imóveis',
      ctaLink: '#',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const maxVisibleItems = 3;
  const totalItems = cityItems.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= totalItems ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? totalItems - 1 : prevIndex - 1
    );
  };

  // Calcula os itens visíveis baseados no índice atual
  const getVisibleItems = () => {
    const visibleItems = [];
    for (let i = 0; i < maxVisibleItems; i++) {
      const index = (currentIndex + i) % totalItems;
      visibleItems.push(cityItems[index]);
    }
    return visibleItems;
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container-center">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Novidades Permutem</h2>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getVisibleItems().map((item, index) => (
            <div key={`${currentIndex}-${index}`} className="transition-all duration-500 ease-in-out">
              <CityCard
                title={item.title}
                imageSrc={item.imageSrc}
                ctaText={item.ctaText}
                ctaLink={item.ctaLink}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection; 