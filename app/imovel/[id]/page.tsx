'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaExchangeAlt, FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';
import { useAuth } from '@/app/contexts/AuthContext';
import DynamicHeader from '@/app/components/DynamicHeader';
import HydrationFix from '@/app/components/HydrationFix';

// Tipo para o imóvel detalhado
type PropertyDetail = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  priceUSD: number;
  type: string;
  beds: number;
  baths: number;
  area: number;
  features: string[];
  images: string[];
  mainImageUrl: string;
  exchangeCountry: string;
  acceptsExchange: boolean;
  isFavorite: boolean;
  owner: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    memberSince: string;
  };
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [message, setMessage] = useState('');

  // Carregar dados do imóvel
  useEffect(() => {
    const fetchPropertyData = () => {
      // Simulação de chamada à API
      setTimeout(() => {
        const mockProperty: PropertyDetail = {
          id: id as string,
          title: 'Apartamento Luxuoso com Vista para o Mar',
          description: 'Este impressionante apartamento oferece uma vista deslumbrante para o mar, localizado em uma área privilegiada da cidade. Conta com acabamentos de alto padrão, amplas janelas que permitem abundância de luz natural, e uma varanda espaçosa perfeita para relaxar e apreciar o pôr do sol. O condomínio oferece piscina, academia, segurança 24 horas e estacionamento privativo.',
          location: 'Balneário Camboriú, SC',
          price: 1250000,
          priceUSD: 250000,
          type: 'Apartamento',
          beds: 3,
          baths: 2,
          area: 120,
          features: ['Vista para o mar', 'Piscina', 'Academia', 'Segurança 24h', 'Estacionamento', 'Varanda gourmet'],
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop'
          ],
          mainImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
          exchangeCountry: 'Estados Unidos',
          acceptsExchange: true,
          isFavorite: false,
          owner: {
            id: '123',
            name: 'Carlos Oliveira',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            rating: 4.8,
            memberSince: '2020'
          }
        };
        
        setProperty(mockProperty);
        setSelectedImage(mockProperty.mainImageUrl);
        setIsFavorite(mockProperty.isFavorite);
        setLoading(false);
      }, 1000);
    };

    fetchPropertyData();
  }, [id]);

  // Carregar imóveis do usuário para permuta
  useEffect(() => {
    if (user && showExchangeModal) {
      // Simulação de chamada à API para buscar imóveis do usuário
      setTimeout(() => {
        const mockUserProperties = [
          { id: 'prop1', title: 'Meu Apartamento em São Paulo', location: 'São Paulo, SP', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop', price: 980000 },
          { id: 'prop2', title: 'Casa na Praia', location: 'Florianópolis, SC', imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop', price: 1150000 },
        ];
        setUserProperties(mockUserProperties);
      }, 500);
    }
  }, [user, showExchangeModal]);

  // Formatar preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Alternar favorito
  const toggleFavorite = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsFavorite(!isFavorite);
    // Aqui seria a chamada à API para salvar o favorito
  };

  // Compartilhar propriedade
  const shareProperty = () => {
    // Implementar funcionalidade de compartilhamento
    alert('Funcionalidade de compartilhamento será implementada em breve!');
  };

  // Enviar proposta de permuta
  const submitExchangeProposal = () => {
    if (!selectedProperty) {
      alert('Por favor, selecione uma propriedade para permuta');
      return;
    }

    // Simulação de envio de proposta
    alert('Proposta enviada com sucesso! O proprietário será notificado.');
    setShowExchangeModal(false);
    setSelectedProperty('');
    setMessage('');
  };

  // Modal de proposta de permuta
  const ExchangeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Propor Permuta</h3>
        
        {userProperties.length === 0 ? (
          <div className="text-center py-4">
            <p className="mb-4">Você não possui imóveis cadastrados para propor permuta.</p>
            <button 
              onClick={() => router.push('/cadastrar-imovel')}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
            >
              Cadastrar Imóvel
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4">Selecione um dos seus imóveis para propor permuta:</p>
            <div className="space-y-4 mb-4">
              {userProperties.map(prop => (
                <div 
                  key={prop.id}
                  onClick={() => setSelectedProperty(prop.id)}
                  className={`border p-3 rounded flex items-center cursor-pointer ${selectedProperty === prop.id ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-200'}`}
                >
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image 
                      src={prop.imageUrl} 
                      alt={prop.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <h4 className="font-medium">{prop.title}</h4>
                    <p className="text-sm text-gray-600">{prop.location}</p>
                    <p className="text-primary font-medium">{formatPrice(prop.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Mensagem (opcional)</label>
              <textarea
                className="w-full border border-gray-300 rounded p-2"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explique por que você está interessado nesta permuta..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowExchangeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={submitExchangeProposal}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
              >
                Enviar Proposta
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <HydrationFix />
        <DynamicHeader />
        <div className="container mx-auto px-4 py-16 flex justify-center mt-14">
          <div className="animate-pulse space-y-8 w-full max-w-4xl">
            <div className="h-80 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <HydrationFix />
        <DynamicHeader />
        <div className="container mx-auto px-4 py-16 text-center mt-14">
          <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
          <p className="mb-6">O imóvel que você está procurando não existe ou foi removido.</p>
          <button 
            onClick={() => router.push('/buscar-imoveis')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
          >
            Voltar para Busca
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <HydrationFix />
      <DynamicHeader />
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Galeria de Imagens */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3 h-[400px] md:h-[500px] relative rounded-lg overflow-hidden">
            <Image 
              src={selectedImage}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:h-[500px] overflow-y-auto">
            {property.images.map((img, index) => (
              <div 
                key={index}
                className={`relative h-32 cursor-pointer rounded-lg overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setSelectedImage(img)}
              >
                <Image 
                  src={img}
                  alt={`Imagem ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Informações do Imóvel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="flex space-x-3">
                <button 
                  onClick={toggleFavorite}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  aria-label="Favoritar"
                >
                  {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                </button>
                <button 
                  onClick={shareProperty}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  aria-label="Compartilhar"
                >
                  <FaShare />
                </button>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <FaMapMarkerAlt className="text-primary mr-2" />
              <span className="text-gray-700">{property.location}</span>
            </div>

            <div className="flex flex-wrap items-center mb-6 gap-4">
              <div className="flex items-center">
                <FaBed className="mr-2 text-gray-600" />
                <span>{property.beds} quartos</span>
              </div>
              <div className="flex items-center">
                <FaBath className="mr-2 text-gray-600" />
                <span>{property.baths} banheiros</span>
              </div>
              <div className="flex items-center">
                <FaRulerCombined className="mr-2 text-gray-600" />
                <span>{property.area} m²</span>
              </div>
              {property.acceptsExchange && (
                <div className="flex items-center">
                  <FaExchangeAlt className="mr-2 text-primary" />
                  <span>Aceita permuta: {property.exchangeCountry}</span>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Preço</h2>
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600">BRL</p>
                  <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600">USD</p>
                  <p className="text-2xl font-bold text-primary">
                    {property.priceUSD.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Sobre este imóvel</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 relative rounded-full overflow-hidden">
                  <Image 
                    src={property.owner.avatar}
                    alt={property.owner.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{property.owner.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-1">★</span>
                    <span>{property.owner.rating}</span>
                    <span className="mx-2">•</span>
                    <span>Membro desde {property.owner.memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => alert('Entrar em contato via WhatsApp')}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition flex justify-center items-center"
                >
                  <span>Contato via WhatsApp</span>
                </button>
                
                {property.acceptsExchange && (
                  <button 
                    onClick={() => user ? setShowExchangeModal(true) : router.push('/login')}
                    className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition flex justify-center items-center"
                  >
                    <FaExchangeAlt className="mr-2" />
                    <span>Propor Permuta</span>
                  </button>
                )}
                
                <button 
                  onClick={() => alert('Agendar visita')}
                  className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  Agendar Visita
                </button>
              </div>
            </div>
          </div>
        </div>

        {showExchangeModal && <ExchangeModal />}
      </div>
    </>
  );
} 