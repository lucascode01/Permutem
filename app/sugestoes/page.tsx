'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaExchangeAlt, FaMapMarkerAlt, FaHome, FaHeart, FaShareAlt, FaTh, FaList, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { imoveisService } from '../lib/services/imoveis-service';
import { favoritosService } from '../lib/services/favoritos-service';
import { Imovel } from '../lib/types';
import { toast } from 'react-hot-toast';
import { checkSubscriptionStatus } from '../lib/checkout';
import BotaoPlanoAtivo from '../components/BotaoPlanoAtivo';

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
  const { user, loading } = useAuth();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [suggestedProperties, setSuggestedProperties] = useState<SuggestedProperty[]>([]);
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [selectedUserProperty, setSelectedUserProperty] = useState<string | null>(null);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [planoAtivo, setPlanoAtivo] = useState<boolean>(false);
  const [verificandoPlano, setVerificandoPlano] = useState<boolean>(true);

  // Redirecionar se o usuário não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Verificar se o usuário tem um plano ativo
  useEffect(() => {
    const verificarPlano = async () => {
      if (!user?.id) {
        setVerificandoPlano(false);
        return;
      }

      try {
        console.log('Verificando status do plano do usuário');
        const status = await checkSubscriptionStatus(user.id);
        setPlanoAtivo(status.active);
        console.log('Status do plano:', status.active ? 'Ativo' : 'Inativo');
      } catch (error) {
        console.error('Erro ao verificar status do plano:', error);
        setPlanoAtivo(false);
      } finally {
        setVerificandoPlano(false);
      }
    };

    if (user?.id) {
      verificarPlano();
    } else {
      setVerificandoPlano(false);
    }
  }, [user]);

  // Carregar imóveis do usuário
  useEffect(() => {
    const loadUserProperties = async () => {
      if (!user?.id) {
        console.log('Usuário não logado, não carregando imóveis');
        setIsLoadingProperties(false);
        return;
      }
      
      if (!planoAtivo) {
        console.log('Usuário sem plano ativo, não carregando imóveis');
        setIsLoadingProperties(false);
        return;
      }
      
      console.log('Carregando imóveis do usuário:', user.id);
      
      try {
        const { data, error } = await imoveisService.listarImoveisDoUsuario(user.id);
        
        if (error) {
          console.error('Erro ao carregar imóveis do usuário:', error);
          throw error;
        }
        
        console.log('Imóveis do usuário carregados:', data?.length || 0, 'imóveis encontrados');
        
        if (data && data.length > 0) {
          // Mapear os dados para o formato esperado
          const userProps = data.map((imovel: any) => ({
            id: imovel.id,
            title: imovel.titulo,
            location: `${imovel.endereco?.bairro || ''}, ${imovel.endereco?.cidade || ''}`,
            price: formatarPreco(imovel.preco),
            imageUrl: imovel.fotos && imovel.fotos.length > 0 
              ? imovel.fotos[0] 
              : '/placeholder-image.jpg'
          }));
          
          setUserProperties(userProps);
          
          if (userProps.length > 0) {
            console.log('Selecionando primeiro imóvel para sugestões:', userProps[0].id);
            setSelectedUserProperty(userProps[0].id);
          }
        } else {
          // Sem imóveis, mostrar lista vazia
          console.log('Usuário não possui imóveis cadastrados');
          setUserProperties([]);
        }
      } catch (error) {
        console.error('Erro ao carregar imóveis do usuário:', error);
        toast.error('Não foi possível carregar seus imóveis.');
        setUserProperties([]);
      } finally {
        console.log('Finalizando carregamento de imóveis do usuário');
        setIsLoadingProperties(false);
      }
    };
    
    if (user?.id && planoAtivo && !verificandoPlano) {
      console.log('Iniciando carregamento de imóveis do usuário');
      loadUserProperties();
    } else if (!verificandoPlano) {
      console.log('Sem usuário logado/sem plano ativo, definindo loading como false');
      setIsLoadingProperties(false);
    }
  }, [user, planoAtivo, verificandoPlano]);

  // Carregar sugestões de imóveis quando o usuário selecionar um imóvel
  useEffect(() => {
    const loadSuggestions = async () => {
      if (!selectedUserProperty) {
        console.log('Nenhum imóvel selecionado, não carregando sugestões');
        setIsLoadingProperties(false);
        return;
      }
      
      if (!user?.id) {
        console.log('Usuário não logado, não carregando sugestões');
        setIsLoadingProperties(false);
        return;
      }
      
      console.log('Carregando sugestões para o imóvel:', selectedUserProperty);
      setIsLoadingProperties(true);
      
      try {
        // Buscar sugestões da API
        const { data, error } = await imoveisService.buscarSugestoesPermuta(selectedUserProperty);
        
        if (error) {
          console.error('Erro ao buscar sugestões:', error);
          throw error;
        }
        
        console.log('Sugestões carregadas:', data?.length || 0, 'sugestões encontradas');
        
        if (data && data.length > 0) {
          // Carregar favoritos do usuário (se houver)
          let favoritos: string[] = [];
          try {
            const { data: favData } = await favoritosService.listarFavoritos(user.id);
            favoritos = favData?.map((fav: any) => fav.id) || [];
            console.log('Favoritos carregados:', favoritos.length);
          } catch (favError) {
            console.error('Erro ao carregar favoritos:', favError);
          }
          
          // Transformar dados da API para o formato da view
          const suggestions: SuggestedProperty[] = data.map(imovel => {
            // Calcular pontuação de compatibilidade (simulação)
            const compatibilityScore = Math.floor(Math.random() * 30) + 70; // Entre 70 e 99
            
            // Gerar razões para a compatibilidade (simulação)
            const reasons = [];
            if (compatibilityScore > 90) reasons.push('Localização compatível');
            if (compatibilityScore > 80) reasons.push('Valor próximo ao do seu imóvel');
            if (compatibilityScore > 75) reasons.push('Proprietário interessado em sua região');
            
            return {
              id: imovel.id,
              title: imovel.titulo,
              location: `${imovel.endereco?.bairro || ''}, ${imovel.endereco?.cidade || ''}`,
              price: formatarPreco(imovel.preco),
              priceUSD: formatarPrecoUSD(imovel.preco),
              imageUrl: imovel.fotos && imovel.fotos.length > 0 
                ? imovel.fotos[0] 
                : '/placeholder-image.jpg',
              type: imovel.tipo as any,
              beds: imovel.quartos || 0,
              baths: imovel.banheiros || 0,
              area: `${imovel.area}m²`,
              compatibilityScore,
              isFavorite: favoritos.includes(imovel.id),
              reasonsForMatch: reasons
            };
          });
          
          setSuggestedProperties(suggestions);
        } else {
          // Sem sugestões, mostrar lista vazia
          console.log('Nenhuma sugestão encontrada para o imóvel');
          setSuggestedProperties([]);
        }
      } catch (error) {
        console.error('Erro ao carregar sugestões:', error);
        toast.error('Não foi possível carregar as sugestões.');
        setSuggestedProperties([]);
      } finally {
        console.log('Finalizando carregamento de sugestões');
        setIsLoadingProperties(false);
      }
    };
    
    if (selectedUserProperty) {
      console.log('Iniciando carregamento de sugestões');
      loadSuggestions();
    } else {
      console.log('Nenhum imóvel selecionado, definindo loading como false');
      setIsLoadingProperties(false);
    }
  }, [selectedUserProperty, user]);

  // Formatar preço em reais
  const formatarPreco = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  // Formatar preço em dólares
  const formatarPrecoUSD = (valorBRL: number): string => {
    // Taxa de câmbio fixa para exemplo (na prática usaria uma API)
    const cambio = 5;
    const valorUSD = valorBRL / cambio;
    
    return valorUSD.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const toggleFavorite = async (id: string) => {
    if (!user?.id) {
      toast.error('Você precisa estar logado para salvar favoritos');
      return;
    }
    
    // Verificar se já é favorito
    const isFavorito = suggestedProperties.find(p => p.id === id)?.isFavorite;
    
    try {
      if (isFavorito) {
        // Remover dos favoritos
        const { success, error } = await favoritosService.removerFavorito(user.id, id);
        if (error) throw error;
        
        if (success) {
          toast.success('Imóvel removido dos favoritos!');
        }
      } else {
        // Adicionar aos favoritos
        const { success, error } = await favoritosService.adicionarFavorito(user.id, id);
        if (error) throw error;
        
        if (success) {
          toast.success('Imóvel salvo nos favoritos!');
        }
      }
      
      // Atualizar estado local
      setSuggestedProperties(prevProperties => 
        prevProperties.map(property => 
          property.id === id 
            ? { ...property, isFavorite: !property.isFavorite } 
            : property
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      
      // Mesmo com erro, atualizar o estado local para melhor UX
    setSuggestedProperties(prevProperties => 
      prevProperties.map(property => 
        property.id === id 
          ? { ...property, isFavorite: !property.isFavorite } 
          : property
      )
    );
    }
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
  if (loading || verificandoPlano) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
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
        {!planoAtivo ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <FaExclamationTriangle className="mx-auto text-yellow-500 w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Plano Inativo</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Você não possui um plano ativo. Para acessar as sugestões de imóveis para permuta, é necessário assinar um plano.
            </p>
            <Link 
              href="/dashboard/escolher-plano" 
              className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-2 rounded-md text-sm"
            >
              Ver planos disponíveis
            </Link>
          </div>
        ) : isLoadingProperties ? (
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          </div>
        ) : userProperties.length === 0 ? (
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
                        
                        <BotaoPlanoAtivo 
                          onClick={() => router.push(`/propostas/criar?propertyId=${property.id}&myPropertyId=${selectedUserProperty}`)}
                          className="bg-[#4CAF50] hover:bg-[#43a047] text-white text-center px-4 py-2 rounded transition-colors"
                        >
                          Propor Permuta
                        </BotaoPlanoAtivo>
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
                          
                          <BotaoPlanoAtivo 
                            onClick={() => router.push(`/propostas/criar?propertyId=${property.id}&myPropertyId=${selectedUserProperty}`)}
                            className="bg-[#4CAF50] hover:bg-[#43a047] text-white text-center px-4 py-2 rounded transition-colors"
                          >
                            Propor Permuta
                          </BotaoPlanoAtivo>
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