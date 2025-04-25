'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaExchangeAlt, FaMapMarkerAlt, FaHome, FaHeart, FaShareAlt, FaTh, FaList } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

type SuggestedProperty = {
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
  compatibilityScore: number;
  isFavorite: boolean;
  reasonsForMatch: string[];
};

export default function SugestoesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [suggestedProperties, setSuggestedProperties] = useState<SuggestedProperty[]>([]);
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [selectedUserProperty, setSelectedUserProperty] = useState<string | null>(null);

  // Redirecionar se o usuário não estiver logado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Carregar imóveis do usuário (mock)
  useEffect(() => {
    const mockUserProperties = [
      {
        id: '1',
        title: 'Meu Apartamento em Botafogo',
        location: 'Botafogo, Rio de Janeiro',
        price: 'R$ 450.000',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3',
      },
      {
        id: '2',
        title: 'Minha Casa na Barra da Tijuca',
        location: 'Barra da Tijuca, Rio de Janeiro',
        price: 'R$ 1.200.000',
        imageUrl: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3',
      }
    ];

    setUserProperties(mockUserProperties);
    if (mockUserProperties.length > 0) {
      setSelectedUserProperty(mockUserProperties[0].id);
    }
  }, []);

  // Carregar sugestões de imóveis (mock)
  useEffect(() => {
    if (!selectedUserProperty) return;

    // Simulação de dados de sugestões
    const mockSuggestions: SuggestedProperty[] = [
      {
        id: '101',
        title: 'Apartamento 3 quartos com vista para o mar',
        location: 'Copacabana, Rio de Janeiro',
        price: 'R$ 950.000',
        priceUSD: 'US$ 190,000',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3',
        type: 'apartamento',
        beds: 3,
        baths: 2,
        area: '120m²',
        compatibilityScore: 95,
        isFavorite: false,
        reasonsForMatch: ['Localização compatível', 'Valor próximo ao do seu imóvel', 'Proprietário interessado em Botafogo'],
      },
      {
        id: '102',
        title: 'Cobertura Duplex em Ipanema',
        location: 'Ipanema, Rio de Janeiro',
        price: 'R$ 1.500.000',
        priceUSD: 'US$ 300,000',
        imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3',
        type: 'apartamento',
        beds: 4,
        baths: 3,
        area: '200m²',
        compatibilityScore: 82,
        isFavorite: true,
        reasonsForMatch: ['Proprietário aceita diferença em dinheiro', 'Busca imóveis em Botafogo'],
      },
      {
        id: '103',
        title: 'Apartamento com vista para o Pão de Açúcar',
        location: 'Urca, Rio de Janeiro',
        price: 'R$ 780.000',
        priceUSD: 'US$ 156,000',
        imageUrl: '/images/cities/ipatinga.png',
        type: 'apartamento',
        beds: 2,
        baths: 2,
        area: '85m²',
        compatibilityScore: 78,
        isFavorite: false,
        reasonsForMatch: ['Localização próxima à sua', 'Valor dentro da sua faixa de preço'],
      },
      {
        id: '104',
        title: 'Casa em condomínio fechado',
        location: 'Recreio dos Bandeirantes, Rio de Janeiro',
        price: 'R$ 850.000',
        priceUSD: 'US$ 170,000',
        imageUrl: '/images/cities/manhuacu.png',
        type: 'casa',
        beds: 3,
        baths: 2,
        area: '150m²',
        compatibilityScore: 72,
        isFavorite: false,
        reasonsForMatch: ['Proprietário interessado na sua região', 'Aceita permuta por apartamento em Botafogo'],
      },
    ];

    setSuggestedProperties(mockSuggestions);
  }, [selectedUserProperty]);

  const toggleFavorite = (id: string) => {
    setSuggestedProperties(prevProperties => 
      prevProperties.map(property => 
        property.id === id 
          ? { ...property, isFavorite: !property.isFavorite } 
          : property
      )
    );
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white text-gray-800 border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 pt-6 pb-4 flex items-center">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors mr-3">
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-medium ml-2">Sugestões de Imóveis para Permuta</h1>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-6 mt-4 mb-8">
        {userProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaHome className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-gray-800 font-medium mb-2">Você ainda não possui imóveis cadastrados</h3>
            <p className="text-gray-600 mb-6">Para receber sugestões de permuta, você precisa anunciar pelo menos um imóvel.</p>
            <Link href="/anuncios/criar" className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-2 rounded-md text-sm">
              Anunciar um imóvel
            </Link>
          </div>
        ) : (
          <>
            {/* Seletor de imóvel */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h2 className="text-gray-800 font-medium mb-4">Selecione seu imóvel para ver sugestões de permuta</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProperties.map(property => (
                  <div 
                    key={property.id}
                    onClick={() => setSelectedUserProperty(property.id)}
                    className={`border rounded-lg overflow-hidden cursor-pointer ${
                      selectedUserProperty === property.id 
                        ? 'border-[#4CAF50] ring-2 ring-[#4CAF50] ring-opacity-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex p-3">
                      <div 
                        className="h-16 w-16 bg-cover bg-center rounded"
                        style={{ backgroundImage: `url(${property.imageUrl})` }}
                      ></div>
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium text-sm">{property.title}</h4>
                        <p className="text-xs text-gray-600">{property.location}</p>
                        <p className="text-sm font-medium mt-1">{property.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visualização e filtros */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Sugestões compatíveis ({suggestedProperties.length})
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewType('grid')}
                  className={`p-2 rounded ${viewType === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
                  title="Visualização em grade"
                >
                  <FaTh className="text-gray-700" />
                </button>
                <button 
                  onClick={() => setViewType('list')}
                  className={`p-2 rounded ${viewType === 'list' ? 'bg-gray-200' : 'bg-white'}`}
                  title="Visualização em lista"
                >
                  <FaList className="text-gray-700" />
                </button>
              </div>
            </div>

            {/* Lista de sugestões */}
            {suggestedProperties.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaExchangeAlt className="text-gray-400 w-6 h-6" />
                </div>
                <h3 className="text-gray-800 font-medium mb-2">Sem sugestões no momento</h3>
                <p className="text-gray-600 mb-6">Ainda não encontramos imóveis compatíveis para permuta com o seu.</p>
              </div>
            ) : (
              viewType === 'grid' ? (
                // Visualização em Grade
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suggestedProperties.map((property) => (
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
                            onClick={() => toggleFavorite(property.id)}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          >
                            <FaHeart className={property.isFavorite ? "text-red-500" : "text-gray-400"} />
                          </button>
                        </div>
                        <div className="absolute top-3 left-3 bg-[#0071ce] text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {property.compatibilityScore}% compatível
                        </div>
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
                            <div className="flex items-center">
                              <span className="font-semibold mr-1">{property.beds}</span> Quartos
                            </div>
                            <div className="flex items-center">
                              <span className="font-semibold mr-1">{property.baths}</span> Banheiros
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {property.area}
                          </div>
                        </div>
                        
                        <div className="flex flex-col mb-3">
                          <p className="font-bold text-lg text-primary">{property.price}</p>
                          {property.priceUSD && <p className="text-gray-500 text-sm">{property.priceUSD}</p>}
                        </div>
                        
                        <Link 
                          href={`/propostas/criar?propertyId=${property.id}&myPropertyId=${selectedUserProperty}`}
                          className="block w-full bg-[#4CAF50] hover:bg-[#43a047] text-white text-center py-2 rounded transition-colors mt-2"
                        >
                          Propor Permuta
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Visualização em Lista
                <div className="space-y-4">
                  {suggestedProperties.map((property) => (
                    <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
                      <div className="relative md:w-64 flex-shrink-0">
                        <Link href={`/imovel/${property.id}`}>
                          <div
                            className="h-48 md:h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${property.imageUrl})` }}
                          />
                        </Link>
                        <div className="absolute top-3 left-3 bg-[#0071ce] text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {property.compatibilityScore}% compatível
                        </div>
                      </div>
                      
                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start">
                          <Link href={`/imovel/${property.id}`}>
                            <h3 className="font-semibold text-lg mb-2 hover:text-[#4CAF50] transition-colors">{property.title}</h3>
                          </Link>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => shareProperty(property.id, property.title)}
                              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                            >
                              <FaShareAlt />
                            </button>
                            <button 
                              onClick={() => toggleFavorite(property.id)}
                              className="p-2 rounded-full hover:bg-gray-100"
                            >
                              <FaHeart className={property.isFavorite ? "text-red-500" : "text-gray-400"} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-3">
                          <FaMapMarkerAlt className="mr-1 text-gray-400" />
                          <p className="text-sm">{property.location}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {property.reasonsForMatch.map((reason, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                              {reason}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-end mt-2">
                          <div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span>{property.beds} Quartos</span>
                              <span>{property.baths} Banheiros</span>
                              <span>{property.area}</span>
                            </div>
                            <div className="flex flex-col">
                              <p className="font-bold text-lg text-primary">{property.price}</p>
                              {property.priceUSD && <p className="text-gray-500 text-sm">{property.priceUSD}</p>}
                            </div>
                          </div>
                          
                          <Link 
                            href={`/propostas/criar?propertyId=${property.id}&myPropertyId=${selectedUserProperty}`}
                            className="bg-[#4CAF50] hover:bg-[#43a047] text-white text-center px-4 py-2 rounded transition-colors"
                          >
                            Propor Permuta
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
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