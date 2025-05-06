'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaBed, 
  FaBath, 
  FaCar, 
  FaRuler, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaExchangeAlt,
  FaEye,
  FaBell,
  FaShare,
  FaTimesCircle,
  FaCheckCircle,
  FaEdit,
  FaArrowUp,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaTimes
} from 'react-icons/fa';
import { BiMessageDetail } from 'react-icons/bi';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Componente para exibir características do imóvel
const CaracteristicaItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number | null }) => {
  if (!value || value === '0') return null;
  
  return (
    <div className="flex items-center my-2">
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
        <Icon className="text-[#4CAF50] text-sm" />
      </div>
      <div className="flex-1">
        <span className="text-sm text-gray-600">{label}</span>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
};

export default function DetalhesAnuncioPage() {
  const router = useRouter();
  const params = useParams();
  const anuncioId = params?.id as string;
  
  const { user, isLoading } = useAuth();
  const [anuncio, setAnuncio] = useState<any>(null);
  const [isLoadingAnuncio, setIsLoadingAnuncio] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [showPropostaModal, setShowPropostaModal] = useState(false);
  const [permutaSelecionada, setPermutaSelecionada] = useState<string | null>(null);
  const [meusImoveis, setMeusImoveis] = useState<any[]>([]);
  
  // Array de imagens simuladas (em produção, viria do backend)
  const [images, setImages] = useState<string[]>([]);
  
  // Função para verificar posição do scroll e mostrar/esconder botão de voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Função para scrollar de volta ao topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Verificar se o anúncio está nos favoritos ao carregar a página
  useEffect(() => {
    const favoritosStorage = localStorage.getItem('userFavoritos');
    if (favoritosStorage) {
      try {
        const favoritos = JSON.parse(favoritosStorage);
        setFavoritos(favoritos);
      } catch (err) {
        console.error('Erro ao parsear favoritos do localStorage:', err);
      }
    }
  }, []);
  
  // Função para adicionar ou remover dos favoritos
  const toggleFavorito = () => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar favoritos');
      router.push('/login');
      return;
    }
    
    const novosFavoritos = [...favoritos];
    const index = novosFavoritos.indexOf(anuncioId);
    
    if (index > -1) {
      // Remover dos favoritos
      novosFavoritos.splice(index, 1);
      toast.success('Imóvel removido dos favoritos!');
    } else {
      // Adicionar aos favoritos
      novosFavoritos.push(anuncioId);
      toast.success('Imóvel salvo nos favoritos!');
    }
    
    setFavoritos(novosFavoritos);
    localStorage.setItem('userFavoritos', JSON.stringify(novosFavoritos));
  };
  
  // Verificar se o anúncio está nos favoritos
  const isFavorito = () => {
    return favoritos.includes(anuncioId);
  };
  
  // Carregar meus imóveis disponíveis para permuta
  useEffect(() => {
    if (user) {
      const savedAnuncios = localStorage.getItem('userAnuncios');
      if (savedAnuncios) {
        try {
          const anuncios = JSON.parse(savedAnuncios);
          // Filtrar apenas os imóveis do usuário logado
          const meusAnuncios = anuncios.filter((item: any) => item.userId === user.id);
          // Não exibir o imóvel atual na lista de permutas
          const imoveisParaPermuta = meusAnuncios.filter((item: any) => item.id !== anuncioId);
          setMeusImoveis(imoveisParaPermuta);
        } catch (err) {
          console.error('Erro ao parsear anúncios do localStorage:', err);
        }
      }
    }
  }, [user, anuncioId]);
  
  // Função para lidar com o envio da proposta de permuta
  const enviarProposta = () => {
    if (!user || !permutaSelecionada) {
      toast.error('Selecione um imóvel para permuta');
      return;
    }
    
    // Obter propostas existentes
    let propostas = [];
    const propostasStorage = localStorage.getItem('userPropostas');
    
    if (propostasStorage) {
      try {
        propostas = JSON.parse(propostasStorage);
      } catch (err) {
        console.error('Erro ao parsear propostas do localStorage:', err);
      }
    }
    
    // Encontrar o imóvel selecionado para permuta
    const imovelPermuta = meusImoveis.find(item => item.id === permutaSelecionada);
    
    if (!imovelPermuta) {
      toast.error('Imóvel para permuta não encontrado');
      return;
    }
    
    // Adicionar nova proposta
    const novaProposta = {
      id: Date.now().toString(),
      anuncioId: anuncioId,
      anuncioTitulo: anuncio.titulo,
      anuncioPreco: anuncio.preco,
      anuncioImagem: anuncio.imagem,
      userId: user.id,
      proprietarioId: anuncio.userId,
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'pendente',
      imovelPermutaId: imovelPermuta.id,
      imovelPermutaTitulo: imovelPermuta.titulo,
      imovelPermutaPreco: imovelPermuta.preco,
      imovelPermutaImagem: imovelPermuta.imagem,
      mensagem: `Proposta de permuta do imóvel "${imovelPermuta.titulo}" pelo imóvel "${anuncio.titulo}"`
    };
    
    propostas.push(novaProposta);
    
    // Salvar propostas atualizadas
    localStorage.setItem('userPropostas', JSON.stringify(propostas));
    
    // Atualizar contador de propostas do anúncio
    const savedAnuncios = localStorage.getItem('userAnuncios');
    if (savedAnuncios) {
      try {
        const anuncios = JSON.parse(savedAnuncios);
        const anuncioIndex = anuncios.findIndex((item: any) => 
          item.id && item.id.toString() === anuncioId.toString()
        );
        
        if (anuncioIndex > -1) {
          anuncios[anuncioIndex].propostas = (anuncios[anuncioIndex].propostas || 0) + 1;
          localStorage.setItem('userAnuncios', JSON.stringify(anuncios));
        }
      } catch (err) {
        console.error('Erro ao atualizar contador de propostas:', err);
      }
    }
    
    toast.success('Proposta enviada com sucesso!');
    setShowPropostaModal(false);
  };
  
  // Função para editar anúncio
  const handleEditar = () => {
    router.push(`/anuncios/editar/${anuncioId}`);
  };

  // Função para desativar anúncio
  const handleDesativar = () => {
    if (confirm('Tem certeza que deseja desativar este anúncio?')) {
      // Aqui você implementaria a lógica para desativar o anúncio
      toast.success('Anúncio desativado com sucesso!');
      router.push('/anuncios');
    }
  };

  // Configurar imagens do carrossel quando o anúncio for carregado
  useEffect(() => {
    if (anuncio) {
      console.log('Anúncio carregado para imagens:', anuncio);
      
      // Verificar se o anúncio já possui um array de imagens válidas
      if (anuncio.imagens && Array.isArray(anuncio.imagens) && anuncio.imagens.length > 0) {
        // Filtrar URLs inválidas (como blob:)
        const imagensValidas = anuncio.imagens.filter((url: any) => 
          url && typeof url === 'string' && !url.startsWith('blob:')
        );
        
        if (imagensValidas.length > 0) {
          console.log('Usando array de imagens do anúncio (após filtro):', imagensValidas);
          setImages(imagensValidas);
          // Também guardar no localStorage para persistência
          localStorage.setItem(`anuncio_imagens_${anuncioId}`, JSON.stringify(imagensValidas));
          return;
        }
      }
      
      // Verificar se há imagens salvas no localStorage para este anúncio
      const savedImagens = localStorage.getItem(`anuncio_imagens_${anuncioId}`);
      if (savedImagens) {
        try {
          const imagens = JSON.parse(savedImagens);
          // Filtrar URLs inválidas
          const imagensValidas = Array.isArray(imagens) 
            ? imagens.filter((url: any) => url && typeof url === 'string' && !url.startsWith('blob:'))
            : [];
            
          if (imagensValidas.length > 0) {
            console.log('Usando imagens do localStorage (após filtro):', imagensValidas);
            setImages(imagensValidas);
            return;
          }
        } catch (err) {
          console.error('Erro ao parsear imagens do localStorage:', err);
        }
      }
      
      // Verificar se há pelo menos uma imagem válida no anúncio
      if (anuncio.imagem && typeof anuncio.imagem === 'string' && !anuncio.imagem.startsWith('blob:')) {
        console.log('Usando imagem única do anúncio:', anuncio.imagem);
        const imageArray = [anuncio.imagem];
        setImages(imageArray);
        // Salvar a imagem no localStorage para persistência
        localStorage.setItem(`anuncio_imagens_${anuncioId}`, JSON.stringify(imageArray));
        return;
      }
      
      // Se chegou aqui, não encontrou imagens válidas, usar placeholders
      console.log('Usando placeholders porque não encontrou imagens válidas');
      const placeholders = ['/placeholder-image.jpg'];
      setImages(placeholders);
    }
  }, [anuncio, anuncioId]);
  
  // Função para abrir o carrossel na imagem clicada
  const openCarousel = (index: number) => {
    setCurrentImageIndex(index);
    setShowCarousel(true);
    // Impedir rolagem do body quando o carrossel está aberto
    document.body.style.overflow = 'hidden';
  };
  
  // Função para fechar o carrossel
  const closeCarousel = () => {
    setShowCarousel(false);
    // Restaurar rolagem do body quando o carrossel é fechado
    document.body.style.overflow = 'auto';
  };
  
  // Função para navegar entre imagens no carrossel
  const navigateCarousel = (direction: 'prev' | 'next') => {
    if (!anuncio?.imagens?.length) return;
    
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? anuncio.imagens.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === anuncio.imagens.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  // Função para formatar preço com pontuação e vírgulas
  const formatarPreco = (preco: string | number) => {
    // Se for string, remover prefixo R$ e converter para número
    let valor = typeof preco === 'string' 
      ? parseFloat(preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) 
      : preco;
    
    // Formatar com sistema brasileiro (ponto para milhar, vírgula para decimal)
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };
  
  // Função para mostrar interesse
  const handleMostrarInteresse = () => {
    if (!user) {
      toast.error('Você precisa estar logado para enviar uma proposta');
      router.push('/login');
      return;
    }
    
    setShowPropostaModal(true);
  };
  
  // Buscar dados do anúncio
  useEffect(() => {
    if (anuncioId) {
      setIsLoadingAnuncio(true);
      
      // Buscar o anúncio do localStorage
      const savedAnuncios = localStorage.getItem('userAnuncios');
      if (savedAnuncios) {
        try {
          const anuncios = JSON.parse(savedAnuncios);
          // Garantir que a comparação funcione com números e strings
          const foundAnuncio = anuncios.find((item: any) => {
            if (!item.id) return false;
            
            // Converter ambos para string para comparação segura
            return item.id.toString() === anuncioId.toString();
          });
          
          if (foundAnuncio) {
            console.log('Anúncio encontrado:', foundAnuncio);
            setAnuncio(foundAnuncio);
            
            // Verificar se o usuário logado é o dono do anúncio
            if (user && foundAnuncio.userId === user.id) {
              setIsOwner(true);
            }
            
            // Definir a primeira imagem como selecionada
            if (foundAnuncio.imagem) {
              setSelectedImage(foundAnuncio.imagem);
            }
            
            // Incrementar visualizações
            if (!isOwner) {
              const anuncioIndex = anuncios.findIndex((item: any) => 
                item.id && item.id.toString() === anuncioId.toString()
              );
              
              if (anuncioIndex > -1) {
                anuncios[anuncioIndex].visualizacoes = (anuncios[anuncioIndex].visualizacoes || 0) + 1;
                localStorage.setItem('userAnuncios', JSON.stringify(anuncios));
              }
            }
            
            setIsLoadingAnuncio(false);
            return;
          } else {
            console.log('Anúncio não encontrado. ID procurado:', anuncioId);
            console.log('Anúncios disponíveis:', anuncios);
          }
        } catch (err) {
          console.error('Erro ao parsear anúncios do localStorage:', err);
        }
      }
      
      // Se não encontrou no localStorage, usar dados simulados
      setTimeout(() => {
        // Dados simulados
        const dadosAnuncio = {
          id: anuncioId,
          titulo: 'Casa em Bairro em Orlando, Florida, EUA',
          descricao: 'Excelente imóvel com ótima localização, próximo ao metrô e comércio local. Imóvel reformado, com piso em porcelanato, armários planejados na cozinha e quartos. Condomínio com portaria 24h, área de lazer completa com piscina, academia e salão de festas.',
          tipo: 'casa',
          preco: 'R$ 2.750.000',
          area: '243',
          quartos: '4',
          banheiros: '5',
          vagas: '2',
          endereco: 'Reedy Creek Blvd, Orlando, Florida - EUA',
          cidade: 'Orlando',
          estado: 'Florida',
          cep: '34747',
          aceitaPermuta: true,
          localPermuta: 'Qualquer imóvel em Brasil',
          imagem: '/placeholder-image.jpg',
          dataPublicacao: '15/04/2023',
          dataAtualizacao: '28/04/2023',
          visualizacoes: 45,
          propostas: 2,
          userId: 'usuario-simulado',
          telefone: '(21) 99999-9999',
          email: 'contato@exemplo.com'
        };
        
        setAnuncio(dadosAnuncio);
        setSelectedImage(dadosAnuncio.imagem);
        setIsLoadingAnuncio(false);
      }, 1000);
    }
  }, [anuncioId, user, isOwner]);

  // Renderizar um loading state enquanto carrega os dados
  if (isLoadingAnuncio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não encontrou o anúncio
  if (!anuncio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Anúncio não encontrado</h2>
          <p className="text-gray-600 mb-6">O anúncio que você está procurando não existe ou foi removido.</p>
          <Link 
            href="/anuncios" 
            className="inline-block bg-[#4CAF50] hover:bg-[#43a047] text-white font-medium py-2 px-6 rounded-md"
          >
            Voltar para anúncios
          </Link>
        </div>
      </div>
    );
  }

  // Verifique se temos múltiplas imagens ou apenas a imagem principal
  const imagens = images && images.length > 0 ? images : [];

  // Se não houver array de imagens, mas houver uma imagem principal válida, usá-la
  if (imagens.length === 0 && anuncio.imagem && typeof anuncio.imagem === 'string' && !anuncio.imagem.startsWith('blob:')) {
    imagens.push(anuncio.imagem);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-12">
      {/* Cabeçalho fixo */}
      <header className="bg-white text-gray-800 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/anuncios" className="text-gray-500 hover:text-gray-700 transition-colors mr-3">
              <FaArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-base font-medium ml-2">Detalhes do Imóvel</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-800 border border-gray-300 px-3 py-1 rounded-md text-sm"
            >
              Voltar ao Painel
            </Link>
            {isOwner && (
              <Link 
                href={`/anuncios/editar/${anuncioId}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Editar
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 mt-2">
        <div className="mb-6">
          <Link href="/dashboard" className="text-[#4CAF50] hover:text-[#43a047] flex items-center">
            <FaArrowLeft className="mr-2" /> Voltar para o Painel
          </Link>
        </div>

        {/* Galeria de Imagens - NOVO LAYOUT */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Imagem principal à esquerda */}
            <div className="md:col-span-3 relative rounded-xl overflow-hidden h-[300px] md:h-[450px]">
              <Image
                src={currentImageIndex >= 0 && currentImageIndex < imagens.length 
                  ? imagens[currentImageIndex] 
                  : anuncio.imagem || '/placeholder-imovel.jpg'}
                alt={anuncio.titulo || 'Imagem do imóvel'}
                fill
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-cover transition-all duration-300"
                quality={85}
                priority
              />
              
              {/* Controles do carrossel */}
              {imagens.length > 1 && (
                <>
                  <button 
                    onClick={() => navigateCarousel('prev')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                    aria-label="Imagem anterior"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => navigateCarousel('next')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                    aria-label="Próxima imagem"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Botão para abrir galeria fullscreen */}
              <button 
                onClick={() => openCarousel(currentImageIndex)}
                className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                aria-label="Ver todas as fotos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </button>
            </div>
            
            {/* Grid de miniaturas à direita */}
            <div className="md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-2 h-min">
              {imagens.length > 0 ? (
                imagens.slice(0, 4).map((src: string, index: number) => (
                  <div 
                    key={index} 
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-24 md:h-[105px] w-full cursor-pointer rounded-md overflow-hidden transition-all ${
                      index === currentImageIndex ? 'ring-2 ring-[#4CAF50]' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="h-24 md:h-[105px] bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Sem imagens</span>
                </div>
              )}
              
              {/* Botão "Ver mais fotos" se houver mais de 4 imagens */}
              {imagens.length > 4 && (
                <div 
                  onClick={() => openCarousel(4)}
                  className="relative h-24 md:h-[105px] w-full cursor-pointer rounded-md overflow-hidden bg-black bg-opacity-60 flex items-center justify-center text-white"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={imagens[4]}
                      alt="Mais fotos"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover opacity-50"
                    />
                  </div>
                  <div className="z-10 text-center">
                    <span className="font-medium">+{imagens.length - 4}</span>
                    <p className="text-xs">Ver todas</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carrossel em tela cheia */}
        {showCarousel && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <button 
              onClick={closeCarousel}
              className="absolute top-4 right-4 text-white p-2 hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Fechar galeria"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative w-full max-w-4xl h-[80vh]">
              <Image
                src={imagens[currentImageIndex] || '/placeholder-imovel.jpg'}
                alt={`Foto ${currentImageIndex + 1} de ${imagens.length}`}
                fill
                sizes="100vw"
                className="object-contain"
                quality={90}
              />
              
              <button 
                onClick={() => navigateCarousel('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                aria-label="Imagem anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={() => navigateCarousel('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                aria-label="Próxima imagem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                {currentImageIndex + 1} de {imagens.length}
              </div>
            </div>
          </div>
        )}

        {/* Título do anúncio e preço */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{anuncio.titulo}</h1>
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2" />
              <span>{anuncio.endereco}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-[#4CAF50] text-3xl font-bold">{formatarPreco(anuncio.preco)}</div>
          </div>
        </div>

        {/* Conteúdo em duas colunas */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Coluna da esquerda - Informações principais */}
          <div className="flex-1">
            {/* Características principais */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Características</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <CaracteristicaItem 
                  icon={FaRuler} 
                  label="Área" 
                  value={anuncio.area ? `${anuncio.area} m²` : null} 
                />
                <CaracteristicaItem 
                  icon={FaBed} 
                  label="Dormitórios" 
                  value={anuncio.quartos} 
                />
                <CaracteristicaItem 
                  icon={FaBath} 
                  label="Banheiros" 
                  value={anuncio.banheiros} 
                />
                <CaracteristicaItem 
                  icon={FaCar} 
                  label="Vagas de Garagem" 
                  value={anuncio.vagas} 
                />
              </div>
              
              {anuncio.aceitaPermuta && (
                <div className="mt-6 p-3 bg-gray-50 rounded-md flex items-center">
                  <FaExchangeAlt className="text-[#4CAF50] mr-3" />
                  <div>
                    <p className="font-medium">Aceita permuta</p>
                    {anuncio.localPermuta && (
                      <p className="text-sm text-gray-600">{anuncio.localPermuta}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Localização */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Localização do Imóvel</h2>
              <div className="flex items-start mb-4">
                <FaMapMarkerAlt className="text-[#4CAF50] mt-1 mr-3" />
                <div>
                  <p className="text-gray-700">{anuncio.endereco}</p>
                  {anuncio.cep && <p className="text-sm text-gray-500">CEP: {anuncio.cep}</p>}
                </div>
              </div>
            </div>
            
            {/* Descrição */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Descrição</h2>
              <p className="text-gray-700 whitespace-pre-line">{anuncio.descricao}</p>
            </div>
            
            {/* Imóveis similares */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Imóveis similares</h2>
              <p className="text-gray-600 text-sm">Confira outros imóveis que podem te interessar</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="h-40 bg-gray-100 relative">
                      <Image 
                        src="/placeholder-image.jpg" 
                        alt="Imóvel similar" 
                        fill
                        style={{objectFit: 'cover'}}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">Imóvel similar {index}</h3>
                      <p className="text-xs text-gray-500">Cidade, Estado</p>
                      <p className="text-[#4CAF50] font-medium mt-1">R$ 450.000</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Coluna da direita - Ações e informações de contato */}
          <div className="lg:w-80">
            {/* Card de ações */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 lg:sticky" style={{ top: "100px" }}>
              <div className="space-y-4">
                <button
                  onClick={handleMostrarInteresse}
                  className="w-full bg-[#4CAF50] hover:bg-[#43a047] text-white font-medium py-3 px-4 rounded-md"
                >
                  Faça uma proposta
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copiado para a área de transferência!');
                  }}
                  className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-gray-50 flex items-center justify-center"
                >
                  <FaShare className="mr-2" />
                  Compartilhar
                </button>
                
                <button
                  onClick={toggleFavorito}
                  className={`w-full border ${isFavorito() ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-300 text-gray-700'} font-medium py-3 px-4 rounded-md hover:bg-gray-50 flex items-center justify-center`}
                >
                  <FaHeart className={`mr-2 ${isFavorito() ? 'text-red-500' : ''}`} />
                  {isFavorito() ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>Visualizações</span>
                  <span>{anuncio.visualizacoes || 0}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>Propostas recebidas</span>
                  <span>{anuncio.propostas || 0}</span>
                </div>
                <div className="text-sm text-gray-500 mt-4">
                  <p>
                    Anúncio publicado em {anuncio.dataPublicacao}
                  </p>
                  {anuncio.dataAtualizacao && anuncio.dataAtualizacao !== anuncio.dataPublicacao && (
                    <p>
                      Atualizado em {anuncio.dataAtualizacao}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Botão flutuante para voltar ao topo */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-[#4CAF50] hover:bg-[#43a047] text-white p-3 rounded-full shadow-lg z-20"
          aria-label="Voltar ao topo"
        >
          <FaArrowUp />
        </button>
      )}
      
      {/* Modal para proposta de permuta */}
      {showPropostaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Proposta de Permuta</h3>
              <button 
                onClick={() => setShowPropostaModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700">Você está interessado em propor uma permuta para:</p>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-bold">{anuncio.titulo}</h4>
                <p className="text-gray-600 text-sm">{anuncio.endereco}</p>
                <p className="text-[#4CAF50] font-bold mt-1">{formatarPreco(anuncio.preco)}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Selecione um de seus imóveis para permutar:
              </label>
              
              {meusImoveis.length === 0 ? (
                <div className="text-center py-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-600 mb-3">Você não possui outros imóveis cadastrados para propor permuta.</p>
                  <Link 
                    href="/anuncios/criar"
                    className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-4 py-2 rounded-md text-sm inline-block"
                  >
                    Cadastrar Imóvel
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {meusImoveis.map((imovel) => (
                    <div 
                      key={imovel.id}
                      onClick={() => setPermutaSelecionada(imovel.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        permutaSelecionada === imovel.id 
                          ? 'border-[#4CAF50] bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
                          {imovel.imagem && (
                            <Image 
                              src={imovel.imagem} 
                              alt={imovel.titulo}
                              fill
                              style={{objectFit: 'cover'}}
                            />
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium">{imovel.titulo}</h4>
                          <p className="text-sm text-gray-600 truncate">{imovel.endereco}</p>
                          <p className="text-[#4CAF50] font-medium">{formatarPreco(imovel.preco)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPropostaModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={enviarProposta}
                disabled={!permutaSelecionada || meusImoveis.length === 0}
                className={`px-4 py-2 rounded-md text-white ${
                  !permutaSelecionada || meusImoveis.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#4CAF50] hover:bg-[#43a047]'
                }`}
              >
                Enviar Proposta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 