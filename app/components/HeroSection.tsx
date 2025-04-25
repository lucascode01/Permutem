'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

// Usando imagens locais com nomes simplificados
const sliderImages = [
  "/images/carousel1.png",
  "/images/carousel2.png",
  "/images/carousel3.png",
  "/images/carousel4.png",
  "/images/carousel5.png",
  "/images/carousel6.jpg"
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Pré-carregamento das imagens
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = sliderImages.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      Promise.all(imagePromises)
        .then(() => setImagesLoaded(true))
        .catch(error => console.error("Erro ao carregar imagens:", error));
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imagesLoaded]);

  return (
    <section className="relative h-[60vh] md:h-[700px] bg-[#003366]">
      {sliderImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black opacity-50" />
        </div>
      ))}
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-3xl leading-tight text-white">
          Não vende? Permutem.
        </h1>
        <p className="text-xl mb-10 max-w-2xl text-white">
          A alternativa inteligente para quem quer trocar imóveis.
        </p>
        
        <div className="w-full max-w-2xl">
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Busque por Cidade ou Estado..." 
                  className="w-full p-3 bg-white border border-gray-200 rounded text-gray-700 text-sm focus:outline-none focus:border-[#0071ce]"
                />
              </div>
              
              <button className="bg-[#0071ce] hover:bg-opacity-90 text-white p-3 rounded font-medium flex items-center justify-center text-sm ml-2">
                <FaSearch className="mr-2" />
                <span>Buscar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 