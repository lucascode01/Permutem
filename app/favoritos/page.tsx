'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaHeart, FaMapMarkerAlt, FaHome, FaBuilding, FaShareAlt, FaFilter } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

type FavoriteProperty = {
  id: string;
  title: string;
  location: string;
  price: string;
  priceUSD?: string;
  imageUrl: string;
  type: 'casa' | 'apartamento' | 'terreno' | 'comercial';
  beds: number;
  baths: number;
  area: string;
  exchangeCountry?: string;
  acceptsExchange: boolean;
};

export default function FavoritosPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteProperties, setFavoriteProperties] = useState<FavoriteProperty[]>([]);

  // Redirecionar se o usuário não estiver logado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Carregar imóveis favoritos (mock)
  useEffect(() => {
    // Simulação de dados de imóveis favoritos
    const mockFavorites: FavoriteProperty[] = [
      {
        id: '1',
        title: 'Apartamento 3 quartos com vista para o mar',
        location: 'Copacabana, Rio de Janeiro',
        price: 'R$ 1.200.000',
        priceUSD: 'US$ 240,000',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3',
        type: 'apartamento',
        beds: 3,
        baths: 2,
        area: '120m²',
        exchangeCountry: 'Portugal',
        acceptsExchange: true,
      },
      {
        id: '2',
        title: 'Casa em condomínio com piscina',
        location: 'Barra da Tijuca, Rio de Janeiro',
        price: 'R$ 2.500.000',
        priceUSD: 'US$ 500,000',
        imageUrl: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3',
        type: 'casa',
        beds: 4,
        baths: 3,
        area: '250m²',
        exchangeCountry: 'EUA',
        acceptsExchange: true,
      },
      {
        id: '3',
        title: 'Apartamento mobiliado próximo à praia',
        location: 'Balneário Camboriú, SC',
        price: 'R$ 950.000',
        priceUSD: 'US$ 190,000',
        imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3',
        type: 'apartamento',
        beds: 2,
        baths: 2,
        area: '90m²',
        acceptsExchange: false,
      },
      {
        id: '4',
        title: 'Terreno em área nobre',
        location: 'Jurerê Internacional, Florianópolis',
        price: 'R$ 1.800.000',
        priceUSD: 'US$ 360,000',
        imageUrl: '/images/cities/manhuacu.png',
        type: 'terreno',
        beds: 0,
        baths: 0,
        area: '500m²',
        acceptsExchange: true,
        exchangeCountry: 'Brasil',
      },
    ];

    setFavoriteProperties(mockFavorites);
  }, []);

  const getFilteredProperties = () => {
    if (activeFilter === 'todos') {
      return favoriteProperties;
    }
    if (activeFilter === 'permuta') {
      return favoriteProperties.filter(prop => prop.acceptsExchange);
    }
    return favoriteProperties.filter(prop => prop.type === activeFilter);
  };

  const removeFromFavorites = (id: string) => {
    setFavoriteProperties(favoriteProperties.filter(prop => prop.id !== id));
  };

  const shareProperty = (id: string, title: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Permutem - ' + title,
        text: 'Confira este imóvel no Permutem!',
        url: `https://permutem.com.br/imovel/${id}`,
      })
        .then(() => console.log('Compartilhado com sucesso'))
        .catch((error) => console.log('Erro ao compartilhar', error));
    } else {
      alert('Compartilhamento não suportado neste navegador.');
    }
  };

  // Renderizar um loading state enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const filteredProperties = getFilteredProperties();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white text-gray-800 border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors mr-3">
              <FaArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-base font-medium ml-2">Imóveis Favoritos</h1>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
          >
            <FaFilter className="mr-2" />
            <span className="text-sm font-medium">Filtrar</span>
          </button>
        </div>

        {/* Filtros adicionais (ocultos por padrão) */}
        {showFilters && (
          <div className="bg-gray-50 py-4 border-t border-gray-200">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveFilter('todos')}
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    activeFilter === 'todos'
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveFilter('apartamento')}
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    activeFilter === 'apartamento'
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Apartamentos
                </button>
                <button
                  onClick={() => setActiveFilter('casa')}
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    activeFilter === 'casa'
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Casas
                </button>
                <button
                  onClick={() => setActiveFilter('terreno')}
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    activeFilter === 'terreno'
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Terrenos
                </button>
                <button
                  onClick={() => setActiveFilter('permuta')}
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    activeFilter === 'permuta'
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Aceita Permuta
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-6 mt-4 mb-8">
        {/* Lista de imóveis favoritos */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaHeart className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-gray-800 font-medium mb-2">Nenhum imóvel favorito</h3>
            <p className="text-gray-600 mb-6">Você ainda não adicionou imóveis aos favoritos.</p>
            <Link href="/buscar-imoveis" className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-2 rounded-md text-sm">
              Buscar imóveis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <Link href={`/imovel/${property.id}`}>
                    <div
                      className="h-48 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${property.imageUrl})` }}
                    />
                  </Link>
                  <div className="absolute top-3 right-3 z-10 flex space-x-2">
                    <button 
                      onClick={() => shareProperty(property.id, property.title)}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <FaShareAlt className="text-gray-500" />
                    </button>
                    <button 
                      onClick={() => removeFromFavorites(property.id)}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <FaHeart className="text-red-500" />
                    </button>
                  </div>
                  {property.acceptsExchange && (
                    <div className="absolute bottom-0 left-0 bg-[#0071ce] text-white px-3 py-1 text-xs font-semibold">
                      Aceita Permuta
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <Link href={`/imovel/${property.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-[#4CAF50] transition-colors">{property.title}</h3>
                  </Link>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <FaMapMarkerAlt className="mr-1 text-gray-400" />
                    <p className="text-sm">{property.location}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex space-x-3 text-sm text-gray-600">
                      {property.beds > 0 && (
                        <div className="flex items-center">
                          <span className="font-semibold mr-1">{property.beds}</span> Quartos
                        </div>
                      )}
                      {property.baths > 0 && (
                        <div className="flex items-center">
                          <span className="font-semibold mr-1">{property.baths}</span> Banheiros
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {property.area}
                    </div>
                  </div>
                  
                  {property.acceptsExchange && property.exchangeCountry && (
                    <div className="mb-3">
                      <p className="text-sm text-[#0071ce] font-medium">
                        Permuta por imóvel em{' '}
                        <span className="inline-block border border-[#0071ce] px-1 text-[#0071ce] font-semibold">
                          {property.exchangeCountry}
                        </span>
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <p className="font-bold text-lg text-primary">{property.price}</p>
                    {property.priceUSD && <p className="text-gray-500 text-sm">{property.priceUSD}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Espaçamento no rodapé */}
      <div className="py-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center text-gray-500 text-sm">
            Permutem © {new Date().getFullYear()} - Todos os direitos reservados
          </div>
        </div>
      </div>
    </div>
  );
} 