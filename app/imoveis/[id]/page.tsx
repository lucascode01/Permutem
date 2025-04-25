'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaExchangeAlt, FaDollarSign, FaHeart, FaShare, FaBed, FaBath, FaRuler, FaCar, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

import { useAuth } from '@/app/contexts/AuthContext';

// Mock de dados detalhados para um imóvel
const mockProperty = {
  id: '1',
  title: 'Casa de Luxo com Vista para o Mar',
  location: 'Balneário Camboriú, SC',
  price: 'R$ 2.500.000',
  priceUSD: 'USD 500,000',
  exchangeCountry: 'Portugal',
  exchangeValue: 'Até EUR 450.000',
  description: 'Magnífica casa de luxo com vista panorâmica para o mar. Localizada em um condomínio exclusivo, esta propriedade oferece o máximo em conforto e sofisticação. Com acabamentos de alto padrão, piscina privativa e áreas de lazer completas.',
  features: [
    { icon: 'bed', label: 'Quartos', value: '4' },
    { icon: 'bath', label: 'Banheiros', value: '3' },
    { icon: 'ruler', label: 'Área', value: '320m²' },
    { icon: 'car', label: 'Vagas', value: '3' }
  ],
  amenities: [
    'Piscina', 'Área gourmet', 'Jardim', 'Academia', 'Segurança 24h', 
    'Vista para o mar', 'Ar condicionado', 'Aquecimento solar'
  ],
  images: [
    '/img/property1.jpg',
    '/img/property2.jpg',
    '/img/property3.jpg',
    '/img/property4.jpg',
    '/img/property5.jpg',
  ],
  owner: {
    id: '101',
    name: 'Carlos Silva',
    phone: '+55 47 99999-8888',
    email: 'carlos@exemplo.com',
    profilePic: '/img/profile.jpg',
    responseRate: '95%',
    responseTime: 'Em média 2 horas'
  },
  createdAt: '2023-10-15',
  views: 1245
};

// Componente para exibir as imagens do imóvel em um carrossel
const PropertyGallery = ({ images }: { images: string[] }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div className="relative w-full mb-8">
      <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
        {/* Placeholder para imagens em desenvolvimento */}
        <div 
          className="w-full h-full bg-gray-300 flex items-center justify-center"
          style={{backgroundImage: `url('https://source.unsplash.com/random/1200x800/?luxury,house,${currentImage}')`, backgroundSize: 'cover'}}
        >
          <span className="text-sm text-white bg-black/50 px-2 py-1 rounded">Imagem ilustrativa</span>
        </div>
        
        {/* Botões de navegação */}
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
          onClick={prevImage}
        >
          &lt;
        </button>
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
          onClick={nextImage}
        >
          &gt;
        </button>
      </div>
      
      {/* Miniaturas */}
      <div className="flex mt-4 space-x-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, index) => (
          <div 
            key={index}
            className={`w-24 h-16 shrink-0 cursor-pointer ${index === currentImage ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => selectImage(index)}
          >
            <div 
              className="w-full h-full bg-gray-300"
              style={{backgroundImage: `url('https://source.unsplash.com/random/300x200/?luxury,house,${index}')`, backgroundSize: 'cover'}}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de formulário de contato
const ContactForm = ({ owner }: { owner: any }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulação de envio
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setMessage('');
      
      // Reset do estado após 3 segundos
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Enviar mensagem ao proprietário</h3>
      
      {sent ? (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-3">
          Mensagem enviada com sucesso! O proprietário entrará em contato em breve.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Olá, tenho interesse neste imóvel e gostaria de mais informações..."
            required
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {sending ? 'Enviando...' : 'Enviar mensagem'}
          </button>
        </form>
      )}
      
      <div className="mt-4 flex flex-col space-y-2">
        <a href={`tel:${owner.phone}`} className="flex items-center text-blue-600 hover:underline">
          <FaPhone className="mr-2" /> {owner.phone}
        </a>
        <a href={`mailto:${owner.email}`} className="flex items-center text-blue-600 hover:underline">
          <FaEnvelope className="mr-2" /> {owner.email}
        </a>
        <a href={`https://wa.me/${owner.phone.replace(/\D/g, '')}`} className="flex items-center text-green-600 hover:underline">
          <FaWhatsapp className="mr-2" /> Contato via WhatsApp
        </a>
      </div>
    </div>
  );
};

// Componente para exibir uma propriedade para proposta de permuta
const ExchangeProperty = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <FaExchangeAlt className="mr-2 text-blue-600" /> 
        Proposta de Permuta
      </h3>
      
      <p className="mb-4">
        O proprietário aceita permutas em imóveis localizados em:
        <span className="block mt-1 font-medium">Portugal - Até EUR 450.000</span>
      </p>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Tem um imóvel para propor na permuta?</p>
        <Link href="/propostas/nova" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
          Fazer proposta de permuta
        </Link>
      </div>
    </div>
  );
};

// Componente principal da página de detalhes do imóvel
export default function PropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    // Simulação de carregamento de dados
    setTimeout(() => {
      setProperty(mockProperty);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleFavorite = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/imoveis/' + params.id);
      return;
    }
    
    setFavorited(!favorited);
    // Aqui entraria a lógica para salvar nos favoritos
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Confira este imóvel: ${property?.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-[500px] bg-gray-300 rounded-lg mb-8"></div>
          <div className="h-10 bg-gray-300 rounded mb-4 w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded mb-8 w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-40 bg-gray-300 rounded mb-8"></div>
              <div className="h-60 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-80 bg-gray-300 rounded mb-4"></div>
              <div className="h-40 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Imóvel não encontrado</h2>
        <p className="mb-8">O imóvel que você está procurando não existe ou foi removido.</p>
        <Link href="/busca" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Voltar para busca de imóveis
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm">
        <Link href="/" className="text-gray-600 hover:text-blue-600">Início</Link>
        <span className="mx-2">/</span>
        <Link href="/busca" className="text-gray-600 hover:text-blue-600">Busca</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{property.title}</span>
      </div>
      
      {/* Galeria de imagens */}
      <PropertyGallery images={property.images} />
      
      {/* Cabeçalho com informações principais */}
      <div className="flex justify-between items-start mb-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <p className="flex items-center text-gray-600 mb-2">
            <FaMapMarkerAlt className="mr-1" /> {property.location}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-bold text-2xl">{property.price}</p>
            <p className="text-gray-600">({property.priceUSD})</p>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={handleFavorite}
            className={`flex items-center space-x-1 px-4 py-2 rounded-full border ${
              favorited 
                ? 'bg-red-100 text-red-600 border-red-200' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <FaHeart className={favorited ? 'text-red-600' : ''} />
            <span>{favorited ? 'Favoritado' : 'Favoritar'}</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center space-x-1 px-4 py-2 rounded-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
          >
            <FaShare />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna principal (2/3) */}
        <div className="md:col-span-2">
          {/* Características do imóvel */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Características</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.features.map((feature: any, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  {feature.icon === 'bed' && <FaBed className="text-2xl text-blue-600 mb-2" />}
                  {feature.icon === 'bath' && <FaBath className="text-2xl text-blue-600 mb-2" />}
                  {feature.icon === 'ruler' && <FaRuler className="text-2xl text-blue-600 mb-2" />}
                  {feature.icon === 'car' && <FaCar className="text-2xl text-blue-600 mb-2" />}
                  <span className="text-sm text-gray-600">{feature.label}</span>
                  <span className="font-medium">{feature.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Descrição do imóvel */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Descrição</h2>
            <p className="text-gray-700 whitespace-pre-line mb-6">
              {property.description}
            </p>
            
            <h3 className="font-semibold mb-2">Comodidades</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {property.amenities.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mapa de localização (placeholder) */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Localização</h2>
            <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Mapa da localização seria exibido aqui</span>
            </div>
          </div>
        </div>
        
        {/* Coluna lateral (1/3) */}
        <div>
          {/* Informações do proprietário */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex-shrink-0">
                {/* Placeholder para foto de perfil */}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{property.owner.name}</h3>
                <p className="text-sm text-gray-600">Proprietário</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FaCalendarAlt className="mr-1" /> 
                  <span>No Permutem desde {new Date(property.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm mb-4">
              <div>
                <p className="text-gray-600">Taxa de resposta</p>
                <p className="font-medium">{property.owner.responseRate}</p>
              </div>
              <div>
                <p className="text-gray-600">Tempo de resposta</p>
                <p className="font-medium">{property.owner.responseTime}</p>
              </div>
            </div>
          </div>
          
          {/* Formulário de contato */}
          <ContactForm owner={property.owner} />
          
          {/* Componente de permuta */}
          <ExchangeProperty />
          
          {/* Estatísticas */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">Informações</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Código</span>
              <span className="font-medium">#{property.id}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Publicado em</span>
              <span className="font-medium">{new Date(property.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Visualizações</span>
              <span className="font-medium">{property.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 