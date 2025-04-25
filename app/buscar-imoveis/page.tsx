'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaFilter, FaMapMarkerAlt, FaHeart, FaShareAlt, FaList, FaTh, FaHome, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import DynamicHeader from '../components/DynamicHeader';
import HydrationFix from '../components/HydrationFix';

type Property = {
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
  isFavorite: boolean;
};

export default function BuscarImoveisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    priceMin: '',
    priceMax: '',
    beds: 0,
    baths: 0,
    acceptsExchange: false,
    exchangeCountry: 'all',
  });

  // Carregar imóveis com base na busca (mock)
  useEffect(() => {
    setLoading(true);
    
    // Simulando uma chamada à API
    setTimeout(() => {
      // Mock de dados para imóveis
      const mockProperties: Property[] = [
        {
          id: '1',
          title: 'Apartamento 3 quartos com vista para o mar',
          location: 'Copacabana, Rio de Janeiro',
          price: 'R$ 950.000',
          priceUSD: 'US$ 190,000',
          imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3',
          type: 'apartamento',
          beds: 3,
          baths: 2,
          area: '120m²',
          exchangeCountry: 'Portugal',
          acceptsExchange: true,
          isFavorite: false,
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
          isFavorite: false,
        },
        {
          id: '3',
          title: 'Apartamento mobiliado próximo à praia',
          location: 'Botafogo, Rio de Janeiro',
          price: 'R$ 850.000',
          priceUSD: 'US$ 170,000',
          imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3',
          type: 'apartamento',
          beds: 2,
          baths: 2,
          area: '90m²',
          acceptsExchange: true,
          isFavorite: true,
        },
        {
          id: '4',
          title: 'Terreno em área nobre',
          location: 'Ipanema, Rio de Janeiro',
          price: 'R$ 1.800.000',
          priceUSD: 'US$ 360,000',
          imageUrl: '/images/cities/manhuacu.png',
          type: 'terreno',
          beds: 0,
          baths: 0,
          area: '500m²',
          acceptsExchange: true,
          exchangeCountry: 'Brasil',
          isFavorite: false,
        },
        {
          id: '5',
          title: 'Loja em shopping center',
          location: 'Leblon, Rio de Janeiro',
          price: 'R$ 3.200.000',
          priceUSD: 'US$ 640,000',
          imageUrl: '/images/cities/ipatinga.png',
          type: 'comercial',
          beds: 0,
          baths: 1,
          area: '120m²',
          acceptsExchange: false,
          isFavorite: false,
        },
        {
          id: '6',
          title: 'Apartamento duplex com terraço',
          location: 'Flamengo, Rio de Janeiro',
          price: 'R$ 1.150.000',
          priceUSD: 'US$ 230,000',
          imageUrl: '/images/cities/muriae.png',
          type: 'apartamento',
          beds: 3,
          baths: 2,
          area: '150m²',
          acceptsExchange: true,
          exchangeCountry: 'Portugal',
          isFavorite: false,
        },
      ];

      // Filtra os resultados com base na consulta de busca
      let filteredProperties = mockProperties;
      
      if (query) {
        const searchTerms = query.toLowerCase();
        filteredProperties = mockProperties.filter(property => 
          property.location.toLowerCase().includes(searchTerms) || 
          property.title.toLowerCase().includes(searchTerms)
        );
      }
      
      // Aplicar outros filtros
      if (filters.type !== 'all') {
        filteredProperties = filteredProperties.filter(property => property.type === filters.type);
      }
      
      if (filters.beds > 0) {
        filteredProperties = filteredProperties.filter(property => property.beds >= filters.beds);
      }
      
      if (filters.baths > 0) {
        filteredProperties = filteredProperties.filter(property => property.baths >= filters.baths);
      }
      
      if (filters.acceptsExchange) {
        filteredProperties = filteredProperties.filter(property => property.acceptsExchange);
      }
      
      if (filters.exchangeCountry !== 'all' && filters.exchangeCountry !== '') {
        filteredProperties = filteredProperties.filter(
          property => property.exchangeCountry === filters.exchangeCountry
        );
      }
      
      if (filters.priceMin !== '') {
        const minPrice = parseInt(filters.priceMin.replace(/\D/g, ''));
        filteredProperties = filteredProperties.filter(property => {
          const propertyPrice = parseInt(property.price.replace(/\D/g, ''));
          return propertyPrice >= minPrice;
        });
      }
      
      if (filters.priceMax !== '') {
        const maxPrice = parseInt(filters.priceMax.replace(/\D/g, ''));
        filteredProperties = filteredProperties.filter(property => {
          const propertyPrice = parseInt(property.price.replace(/\D/g, ''));
          return propertyPrice <= maxPrice;
        });
      }

      setProperties(filteredProperties);
      setLoading(false);
    }, 1000);
  }, [query, filters, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/buscar-imoveis?q=${encodeURIComponent(query)}`);
  };

  const toggleFavorite = (id: string) => {
    setProperties(prevProperties => 
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

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HydrationFix />
      <DynamicHeader />

      {/* Cabeçalho */}
      <header className="bg-white text-gray-800 border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 pt-6 pb-4 flex items-center">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors mr-3">
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-medium ml-2">Buscar Imóveis</h1>
          <div className="flex-grow"></div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
          >
            <FaFilter className="mr-2" />
            <span className="text-sm font-medium">Filtrar</span>
          </button>
        </div>

        {/* Barra de busca */}
        <div className="bg-gray-50 py-5 border-t border-gray-200 border-b">
          <div className="container mx-auto max-w-6xl px-4">
            <form onSubmit={handleSearch} className="flex">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-[#4CAF50]" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por cidade, bairro ou região"
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-l-md focus:outline-none border border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-30 shadow-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-3 rounded-r-md transition-colors font-medium shadow-sm"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>

        {/* Filtros adicionais (ocultos por padrão) */}
        {showFilters && (
          <div className="bg-white py-6 border-b border-gray-200 shadow-inner">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Imóvel</label>
                  <select
                    className="w-full p-2 rounded-md bg-white text-gray-800 border border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-30 focus:outline-none"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="all">Todos os tipos</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Preço</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Mínimo"
                      className="w-1/2 p-2 rounded-md bg-white text-gray-800 border border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-30 focus:outline-none"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Máximo"
                      className="w-1/2 p-2 rounded-md bg-white text-gray-800 border border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-30 focus:outline-none"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Quartos</label>
                  <select
                    className="w-full p-2 rounded-md bg-white text-gray-800 border border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-30 focus:outline-none"
                    value={filters.beds}
                    onChange={(e) => handleFilterChange('beds', Number(e.target.value))}
                  >
                    <option value="0">Qualquer</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Banheiros</label>
                  <select
                    className="w-full p-2 rounded-md bg-white text-gray-800 border border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-30 focus:outline-none"
                    value={filters.baths}
                    onChange={(e) => handleFilterChange('baths', Number(e.target.value))}
                  >
                    <option value="0">Qualquer</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Permuta</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="acceptsExchange"
                      checked={filters.acceptsExchange}
                      onChange={(e) => handleFilterChange('acceptsExchange', e.target.checked)}
                      className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                    />
                    <label htmlFor="acceptsExchange" className="text-gray-800">
                      Aceita permuta
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">País para permuta</label>
                  <select
                    className="w-full p-2 rounded-md bg-white text-gray-800 border border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-30 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                    value={filters.exchangeCountry}
                    onChange={(e) => handleFilterChange('exchangeCountry', e.target.value)}
                    disabled={!filters.acceptsExchange}
                  >
                    <option value="all">Qualquer país</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Portugal">Portugal</option>
                    <option value="EUA">EUA</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setFilters({
                    type: 'all',
                    priceMin: '',
                    priceMax: '',
                    beds: 0,
                    baths: 0,
                    acceptsExchange: false,
                    exchangeCountry: 'all',
                  })}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md mr-2 transition-colors"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-[#4CAF50] hover:bg-[#43a047] text-white rounded-md transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-6">
        {/* Resultados da busca */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {loading 
                ? 'Buscando imóveis...' 
                : properties.length === 0 
                  ? 'Nenhum imóvel encontrado' 
                  : `${properties.length} imóveis encontrados`}
            </h2>
            {query && <p className="text-gray-600">Resultados para: {query}</p>}
          </div>
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

        {/* Estado de carregamento */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando resultados...</p>
          </div>
        )}

        {/* Sem resultados */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaHome className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-gray-800 font-medium mb-2">Nenhum imóvel encontrado</h3>
            <p className="text-gray-600 mb-6">Tente modificar seus critérios de busca ou filtros.</p>
          </div>
        )}

        {/* Lista de imóveis */}
        {!loading && properties.length > 0 && (
          viewType === 'grid' ? (
            // Visualização em Grade
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
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
          ) : (
            // Visualização em Lista
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
                  <div className="relative md:w-64 flex-shrink-0">
                    <Link href={`/imovel/${property.id}`}>
                      <div
                        className="h-48 md:h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${property.imageUrl})` }}
                      />
                    </Link>
                    {property.acceptsExchange && (
                      <div className="absolute bottom-0 left-0 bg-[#0071ce] text-white px-3 py-1 text-xs font-semibold">
                        Aceita Permuta
                      </div>
                    )}
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
                    
                    <div className="mb-3">
                      <div className="inline-flex items-center bg-gray-100 px-2 py-1 rounded mr-2">
                        {property.type === 'casa' && <FaHome className="mr-1 text-gray-500" />}
                        {property.type === 'apartamento' && <FaBuilding className="mr-1 text-gray-500" />}
                        <span className="text-sm text-gray-700 capitalize">{property.type}</span>
                      </div>
                      
                      {property.acceptsExchange && property.exchangeCountry && (
                        <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                          Permuta por imóvel em {property.exchangeCountry}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                      <div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          {property.beds > 0 && <span>{property.beds} Quartos</span>}
                          {property.baths > 0 && <span>{property.baths} Banheiros</span>}
                          <span>{property.area}</span>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold text-lg text-primary">{property.price}</p>
                          {property.priceUSD && <p className="text-gray-500 text-sm">{property.priceUSD}</p>}
                        </div>
                      </div>
                      
                      <Link 
                        href={`/imovel/${property.id}`}
                        className="bg-[#4CAF50] hover:bg-[#43a047] text-white text-center px-4 py-2 rounded transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
} 