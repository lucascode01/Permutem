'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaPlus, FaEllipsisV, FaBell, FaHome, FaBuilding, FaDollarSign, FaMapMarkerAlt, FaEye, FaEdit, FaTrashAlt, FaPowerOff, FaStar, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AnunciosPage() {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('ativos');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const menuRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [anuncios, setAnuncios] = useState<any[]>([]);
  const [isLoadingAnuncios, setIsLoadingAnuncios] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fechar menu quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeMenu !== null && !menuRefs.current[activeMenu]?.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);
  
  // Buscar anúncios do usuário atual
  useEffect(() => {
    if (!isLoadingAuth && user) {
      fetchUserAnuncios();
    } else if (!isLoadingAuth && !user) {
      // Redirecionar para login se não estiver autenticado
      router.push('/login');
    }
  }, [user, isLoadingAuth, router]);
  
  // Função para buscar anúncios do usuário atual
  const fetchUserAnuncios = async () => {
    setIsLoadingAnuncios(true);
    setError(null);
    
    try {
      // Simulação de busca de dados (em produção, seria uma chamada real à API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      /**
       * INTEGRAÇÃO COM SUPABASE - PRODUÇÃO
       * 
       * Em um ambiente de produção, esta função faria uma chamada ao Supabase para buscar
       * os anúncios do usuário atual, usando uma estrutura como:
       * 
       * const { data, error } = await supabase
       *   .from('imoveis')
       *   .select('*, propostas(*)')
       *   .eq('user_id', user.id)
       *   .order('criado_em', { ascending: false });
       * 
       * Se error, trataria o erro. Caso contrário, setAnuncios(data);
       * 
       * A tabela de imóveis no Supabase armazena todos os anúncios de todos os usuários,
       * com permissões RLS (Row Level Security) configuradas para:
       * - Permitir que usuários vejam apenas seus próprios anúncios na área "Meus Anúncios"
       * - Permitir que todos os usuários vejam anúncios com status "ativo" na busca pública
       * - Permitir que apenas administradores vejam todos os anúncios no painel administrativo
       * 
       * PROPOSTAS E MATCH:
       * 
       * Quando um usuário se interessa por um anúncio e deseja fazer uma permuta:
       * 1. Ele cria uma proposta via API:
       *    await supabase.from('propostas').insert({
       *      imovel_origem_id: seuImovelId,
       *      imovel_destino_id: imovelDesejadoId,
       *      user_origem_id: user.id,
       *      user_destino_id: donoDointensaoOculta.id,
       *      mensagem: "Tenho interesse em seu imóvel...",
       *      status: "pendente"
       *    });
       * 
       * 2. O proprietário do anúncio recebe uma notificação e pode:
       *    - Aceitar a proposta
       *    - Recusar a proposta
       *    - Fazer uma contraproposta
       * 
       * 3. Quando uma proposta é aceita por ambas as partes, o status muda para "concluida"
       *    e os imóveis são marcados como "permutado" para indicar um match bem-sucedido.
       * 
       * 4. Os usuários podem trocar mensagens através da tabela "mensagens" relacionada à proposta.
       */
      
      // Em uma implementação real, buscaria do usuário específico:
      // const response = await fetch(`/api/anuncios/user/${user.id}`);
      
      // Por enquanto, vamos limpar os dados mockados para mostrar estado vazio 
      // até que o usuário comece a criar seus próprios anúncios
      const mockAnuncios: any[] = []; // Array vazio para simular que não há anúncios ainda
      
      // Verificar no localStorage se existe algum anúncio cadastrado pelo usuário
      const savedAnuncios = localStorage.getItem('userAnuncios');
      if (savedAnuncios) {
        try {
          const parsedAnuncios = JSON.parse(savedAnuncios);
          // Adicionar os anúncios salvos ao array mockAnuncios
          setAnuncios(parsedAnuncios);
        } catch (err) {
          console.error('Erro ao parsear anúncios do localStorage:', err);
          setAnuncios(mockAnuncios);
        }
      } else {
        setAnuncios(mockAnuncios);
      }
    } catch (err) {
      console.error('Erro ao buscar anúncios:', err);
      setError('Não foi possível carregar seus anúncios. Tente novamente mais tarde.');
      toast.error('Erro ao carregar anúncios');
    } finally {
      setIsLoadingAnuncios(false);
    }
  };

  const anunciosFiltrados = anuncios.filter(anuncio => {
    if (activeTab === 'ativos') return anuncio.status === 'ativo';
    if (activeTab === 'inativos') return anuncio.status === 'inativo';
    return true; // tab "todos"
  });

  const handleMenuToggle = (index: number) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const handleDeleteAnuncio = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.')) {
      try {
        // Implementação real usaria uma API para excluir o anúncio
        // Simulação de exclusão
        const updatedAnuncios = anuncios.filter(anuncio => anuncio.id !== id);
        setAnuncios(updatedAnuncios);
        
        // Atualizar no localStorage
        localStorage.setItem('userAnuncios', JSON.stringify(updatedAnuncios));
        
        toast.success('Anúncio excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir anúncio:', error);
        toast.error('Erro ao excluir anúncio. Tente novamente.');
      }
    }
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
      const action = newStatus === 'ativo' ? 'ativado' : 'desativado';
      
      // Implementação real usaria uma API para alterar o status
      // Simulação de alteração de status
      const updatedAnuncios = anuncios.map(anuncio => 
        anuncio.id === id ? { ...anuncio, status: newStatus } : anuncio
      );
      
      setAnuncios(updatedAnuncios);
      
      // Atualizar no localStorage
      localStorage.setItem('userAnuncios', JSON.stringify(updatedAnuncios));
      
      toast.success(`Anúncio ${action} com sucesso`);
    } catch (error) {
      console.error('Erro ao alterar status do anúncio:', error);
      toast.error('Erro ao alterar status do anúncio. Tente novamente.');
    }
  };

  const handlePromoteAnuncio = (id: number) => {
    // Redirecionaria para a página de planos de destaque
    toast.success('Redirecionando para página de destaque...');
    // router.push(`/anuncios/destacar/${id}`);
  };

  // Função para formatar preço com pontuação e vírgulas
  const formatarPreco = (preco: string | number) => {
    // Se for string, remover prefixo R$ e converter para número
    let valor: number;
    
    if (typeof preco === 'string') {
      // Remover R$, pontos e substituir vírgula por ponto para converter para número
      const precoLimpo = preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
      valor = parseFloat(precoLimpo) || 0;
    } else {
      valor = preco || 0;
    }
    
    // Formatar com sistema brasileiro (ponto para milhar, vírgula para decimal)
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  // Renderizar loading state
  if (isLoadingAuth || isLoadingAnuncios) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus anúncios...</p>
        </div>
      </div>
    );
  }

  // Renderizar erro
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white text-gray-800 border-b border-gray-100">
          <div className="container mx-auto max-w-6xl px-4 pt-6 pb-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors mr-3">
                <FaArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-base font-medium ml-2">Meus Anúncios</h1>
            </div>
            <Link 
              href="/anuncios/criar" 
              className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-4 py-2 rounded-md flex items-center text-sm"
            >
              <FaPlus className="mr-2" />
              Novo anúncio
            </Link>
          </div>
        </header>
        
        <div className="flex-1 container mx-auto max-w-6xl px-4 py-12">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
            <h3 className="text-red-700 font-medium mb-2">Erro ao carregar anúncios</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchUserAnuncios}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white text-gray-800 border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors mr-3">
              <FaArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-base font-medium ml-2">Meus Anúncios</h1>
          </div>
          <Link 
            href="/anuncios/criar" 
            className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-4 py-2 rounded-md flex items-center text-sm"
          >
            <FaPlus className="mr-2" />
            Novo anúncio
          </Link>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-6">
        {/* Cabeçalho informativo */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <h2 className="text-blue-800 font-medium mb-1">Dicas para aumentar suas chances de sucesso</h2>
          <p className="text-blue-700 text-sm">
            Mantenha seus anúncios ativos e atualizados. Imóveis com boa descrição e fotos de qualidade recebem até 3x mais visualizações.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('todos')}
            className={`pb-2 px-4 font-medium text-sm ${activeTab === 'todos' 
              ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Todos ({anuncios.length})
          </button>
          <button 
            onClick={() => setActiveTab('ativos')}
            className={`pb-2 px-4 font-medium text-sm ${activeTab === 'ativos' 
              ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Ativos ({anuncios.filter(a => a.status === 'ativo').length})
          </button>
          <button 
            onClick={() => setActiveTab('inativos')}
            className={`pb-2 px-4 font-medium text-sm ${activeTab === 'inativos' 
              ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Inativos ({anuncios.filter(a => a.status === 'inativo').length})
          </button>
        </div>

        {/* Lista de anúncios */}
        {anunciosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaHome className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-gray-800 font-medium mb-2">Nenhum anúncio encontrado</h3>
            <p className="text-gray-600 mb-6">Você não possui anúncios {activeTab === 'ativos' ? 'ativos' : activeTab === 'inativos' ? 'inativos' : ''} no momento.</p>
            <Link 
              href="/anuncios/criar" 
              className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-2 rounded-md inline-flex items-center text-sm"
            >
              <FaPlus className="mr-2" />
              Criar anúncio
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {anunciosFiltrados.map((anuncio, index) => (
              <div key={anuncio.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex flex-col md:flex-row">
                {/* Miniatura da imagem */}
                <div className="w-full md:w-56 h-48 md:h-32 bg-gray-200 rounded-md overflow-hidden relative mb-4 md:mb-0 md:mr-4 flex-shrink-0">
                  {anuncio.imagem ? (
                    <Image 
                      src={anuncio.imagem}
                      alt={anuncio.titulo}
                      fill
                      style={{objectFit: 'cover'}}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaHome className="text-gray-400 w-12 h-12" />
                    </div>
                  )}
                  {anuncio.destaque && (
                    <div className="absolute top-2 left-2 bg-[#FFD700] text-[#222] text-xs font-bold px-2 py-1 rounded-sm">
                      DESTAQUE
                    </div>
                  )}
                  {anuncio.status === 'inativo' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium px-3 py-1 rounded-md bg-black bg-opacity-70">INATIVO</span>
                    </div>
                  )}
                </div>
                
                {/* Informações do anúncio */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">{anuncio.titulo}</h3>
                      <div className="flex items-center mt-1 text-gray-500 text-sm">
                        {anuncio.tipo === 'Apartamento' || anuncio.tipo === 'apartamento' ? (
                          <FaBuilding className="mr-1" />
                        ) : anuncio.tipo === 'Casa' || anuncio.tipo === 'casa' ? (
                          <FaHome className="mr-1" />
                        ) : (
                          <FaBuilding className="mr-1" />
                        )}
                        <span>{anuncio.tipo.charAt(0).toUpperCase() + anuncio.tipo.slice(1)}</span>
                        <span className="mx-2">•</span>
                        <span>Atualizado em {anuncio.dataAtualizacao || new Date().toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="relative" ref={(el) => { menuRefs.current[index] = el; }}>
                      <button 
                        onClick={() => handleMenuToggle(index)}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        <FaEllipsisV />
                      </button>
                      
                      {/* Menu de opções */}
                      {activeMenu === index && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <Link 
                              href={`/anuncios/detalhes/${anuncio.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaEye className="mr-3 text-gray-500" />
                              Ver detalhes
                            </Link>
                            <Link 
                              href={`/anuncios/editar/${anuncio.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaEdit className="mr-3 text-gray-500" />
                              Editar anúncio
                            </Link>
                            <button 
                              onClick={() => handleToggleStatus(anuncio.id, anuncio.status)}
                              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaPowerOff className="mr-3 text-gray-500" />
                              {anuncio.status === 'ativo' ? 'Desativar anúncio' : 'Ativar anúncio'}
                            </button>
                            {!anuncio.destaque && anuncio.status === 'ativo' && (
                              <button 
                                onClick={() => handlePromoteAnuncio(anuncio.id)}
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <FaStar className="mr-3 text-yellow-500" />
                                Destacar anúncio
                              </button>
                            )}
                            <Link 
                              href={`/estatisticas/anuncio/${anuncio.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaChartLine className="mr-3 text-gray-500" />
                              Ver estatísticas
                            </Link>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                              onClick={() => handleDeleteAnuncio(anuncio.id)}
                              className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <FaTrashAlt className="mr-3" />
                              Excluir anúncio
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap">
                    <div className="mr-6 mb-2 flex items-center text-gray-700">
                      <span className="font-medium">
                        {formatarPreco(anuncio.preco)}
                      </span>
                    </div>
                    <div className="mb-2 flex items-center text-gray-700">
                      <FaMapMarkerAlt className="mr-1 text-gray-500" />
                      <span className="text-sm">{anuncio.endereco}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex items-center mr-4">
                        <FaEye className="mr-1" /> 
                        {anuncio.visualizacoes || 0} visualizações
                      </span>
                      <span className="flex items-center">
                        <FaBell className="mr-1" /> 
                        {anuncio.propostas || 0} {anuncio.propostas === 1 ? 'proposta' : 'propostas'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      {anuncio.status === 'inativo' ? (
                        <button 
                          onClick={() => handleToggleStatus(anuncio.id, anuncio.status)}
                          className="text-[#4CAF50] border border-[#4CAF50] px-3 py-1 rounded-md text-sm hover:bg-[#4CAF50] hover:text-white"
                        >
                          Ativar
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleToggleStatus(anuncio.id, anuncio.status)}
                          className="text-gray-700 border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-100"
                        >
                          Desativar
                        </button>
                      )}
                      <Link 
                        href={`/anuncios/editar/${anuncio.id}`}
                        className="border border-blue-500 text-blue-500 px-3 py-1 rounded-md text-sm hover:bg-blue-50"
                      >
                        Editar
                      </Link>
                      <Link 
                        href={`/anuncios/detalhes/${anuncio.id}`}
                        className="bg-[#4CAF50] text-white px-3 py-1 rounded-md text-sm hover:bg-[#43a047]"
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 