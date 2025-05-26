'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaComments, FaBuilding, FaExchangeAlt, FaCheck, FaTimes, FaClock, FaEye, FaFilter, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { propostasService } from '../lib/services/propostas-service';
import { Proposta } from '../lib/types';
import { toast } from 'react-hot-toast';
import { checkSubscriptionStatus } from '../lib/checkout';
import RequirePlanoAtivo from '../components/RequirePlanoAtivo';

type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

type ProposalViewModel = {
  id: string;
  type: 'sent' | 'received';
  title: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImageUrl: string;
  propertyPrice: string;
  offerPropertyId?: string;
  offerPropertyTitle?: string;
  offerPropertyLocation?: string;
  offerPropertyImageUrl?: string;
  offerPropertyPrice?: string;
  message?: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt?: string;
};

export default function PropostasPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');
  const [proposals, setProposals] = useState<ProposalViewModel[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(true);
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

  // Carregar propostas reais
  useEffect(() => {
    const loadProposals = async () => {
      if (!user?.id) {
        setIsLoadingProposals(false);
        return;
      }
      
      if (!planoAtivo) {
        console.log('Usuário sem plano ativo, não carregando propostas');
        setIsLoadingProposals(false);
        return;
      }
      
      setIsLoadingProposals(true);
      
      try {
        // Carregar propostas recebidas
        const { data: propostasRecebidas, error: erroRecebidas } = await propostasService.listarPropostasRecebidas(user.id);
        
        // Carregar propostas enviadas
        const { data: propostasEnviadas, error: erroEnviadas } = await propostasService.listarPropostasEnviadas(user.id);
        
        if (erroRecebidas || erroEnviadas) {
          throw new Error('Erro ao carregar propostas');
        }
        
        // Transformar dados para o formato da view
        const viewModels: ProposalViewModel[] = [];
        
        // Processar propostas recebidas
        if (propostasRecebidas && propostasRecebidas.length > 0) {
          propostasRecebidas.forEach(proposta => {
            viewModels.push({
              id: proposta.id,
              type: 'received',
              title: `Proposta de permuta para ${proposta.imovel_destino?.titulo || 'seu imóvel'}`,
              propertyId: proposta.imovel_destino_id,
              propertyTitle: proposta.imovel_destino?.titulo || 'Seu imóvel',
              propertyLocation: proposta.imovel_destino?.endereco?.cidade || '-',
              propertyImageUrl: proposta.imovel_destino?.fotos?.[0] || '/placeholder-image.jpg',
              propertyPrice: formatarPreco(proposta.imovel_destino?.preco || 0),
              offerPropertyId: proposta.imovel_origem_id,
              offerPropertyTitle: proposta.imovel_origem?.titulo || 'Imóvel oferecido',
              offerPropertyLocation: proposta.imovel_origem?.endereco?.cidade || '-',
              offerPropertyImageUrl: proposta.imovel_origem?.fotos?.[0] || '/placeholder-image.jpg',
              offerPropertyPrice: formatarPreco(proposta.imovel_origem?.preco || 0),
              message: proposta.mensagem,
              status: converterStatus(proposta.status),
              createdAt: proposta.criado_em,
              updatedAt: proposta.atualizado_em
            });
          });
        }
        
        // Processar propostas enviadas
        if (propostasEnviadas && propostasEnviadas.length > 0) {
          propostasEnviadas.forEach(proposta => {
            viewModels.push({
              id: proposta.id,
              type: 'sent',
              title: `Proposta enviada para ${proposta.imovel_destino?.titulo || 'imóvel'}`,
              propertyId: proposta.imovel_destino_id,
              propertyTitle: proposta.imovel_destino?.titulo || 'Imóvel alvo',
              propertyLocation: proposta.imovel_destino?.endereco?.cidade || '-',
              propertyImageUrl: proposta.imovel_destino?.fotos?.[0] || '/placeholder-image.jpg',
              propertyPrice: formatarPreco(proposta.imovel_destino?.preco || 0),
              offerPropertyId: proposta.imovel_origem_id,
              offerPropertyTitle: proposta.imovel_origem?.titulo || 'Seu imóvel',
              offerPropertyLocation: proposta.imovel_origem?.endereco?.cidade || '-',
              offerPropertyImageUrl: proposta.imovel_origem?.fotos?.[0] || '/placeholder-image.jpg',
              offerPropertyPrice: formatarPreco(proposta.imovel_origem?.preco || 0),
              message: proposta.mensagem,
              status: converterStatus(proposta.status),
              createdAt: proposta.criado_em,
              updatedAt: proposta.atualizado_em
            });
          });
        }
        
        setProposals(viewModels);
      } catch (error) {
        console.error('Erro ao carregar propostas:', error);
        toast.error('Não foi possível carregar as propostas.');
        setProposals([]);
      } finally {
        setIsLoadingProposals(false);
      }
    };
    
    if (user?.id && planoAtivo && !verificandoPlano) {
      loadProposals();
    } else if (!verificandoPlano) {
      setIsLoadingProposals(false);
    }
  }, [user, planoAtivo, verificandoPlano]);

  const getFilteredProposals = () => {
    let filtered = proposals.filter(proposal => proposal.type === activeTab);
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter);
    }
    
    return filtered;
  };

  const acceptProposal = async (id: string) => {
    try {
      setIsLoadingProposals(true);
      const { success, error } = await propostasService.responderProposta(id, 'aceita');
      
      if (error) throw error;
      
      if (success) {
        toast.success('Proposta aceita com sucesso!');
        
        // Atualizar o status na lista local
        setProposals(prevProposals => 
          prevProposals.map(proposal => 
            proposal.id === id 
              ? { ...proposal, status: 'accepted', updatedAt: new Date().toISOString() } 
              : proposal
          )
        );
      }
    } catch (error) {
      console.error('Erro ao aceitar proposta:', error);
      toast.error('Não foi possível aceitar a proposta. Tente novamente.');
      
      // Fallback para atualização local em caso de erro
      setProposals(prevProposals => 
        prevProposals.map(proposal => 
          proposal.id === id 
            ? { ...proposal, status: 'accepted', updatedAt: new Date().toISOString() } 
            : proposal
        )
      );
    } finally {
      setIsLoadingProposals(false);
    }
  };

  const rejectProposal = async (id: string) => {
    try {
      setIsLoadingProposals(true);
      const { success, error } = await propostasService.responderProposta(id, 'recusada');
      
      if (error) throw error;
      
      if (success) {
        toast.success('Proposta recusada com sucesso!');
        
        // Atualizar o status na lista local
        setProposals(prevProposals => 
          prevProposals.map(proposal => 
            proposal.id === id 
              ? { ...proposal, status: 'rejected', updatedAt: new Date().toISOString() } 
              : proposal
          )
        );
      }
    } catch (error) {
      console.error('Erro ao recusar proposta:', error);
      toast.error('Não foi possível recusar a proposta. Tente novamente.');
      
      // Fallback para atualização local em caso de erro
      setProposals(prevProposals => 
        prevProposals.map(proposal => 
          proposal.id === id 
            ? { ...proposal, status: 'rejected', updatedAt: new Date().toISOString() } 
            : proposal
        )
      );
    } finally {
      setIsLoadingProposals(false);
    }
  };

  const cancelProposal = async (id: string) => {
    try {
      setIsLoadingProposals(true);
      const { success, error } = await propostasService.cancelarProposta(id);
      
      if (error) throw error;
      
      if (success) {
        toast.success('Proposta cancelada com sucesso!');
        
        // Atualizar o status na lista local
        setProposals(prevProposals => 
          prevProposals.map(proposal => 
            proposal.id === id 
              ? { ...proposal, status: 'cancelled', updatedAt: new Date().toISOString() } 
              : proposal
          )
        );
      }
    } catch (error) {
      console.error('Erro ao cancelar proposta:', error);
      toast.error('Não foi possível cancelar a proposta. Tente novamente.');
      
      // Fallback para atualização local em caso de erro
      setProposals(prevProposals => 
        prevProposals.map(proposal => 
          proposal.id === id 
            ? { ...proposal, status: 'cancelled', updatedAt: new Date().toISOString() } 
            : proposal
        )
      );
    } finally {
      setIsLoadingProposals(false);
    }
  };

  // Função auxiliar para converter status do backend para o status da view
  const converterStatus = (statusBackend: string): ProposalStatus => {
    switch (statusBackend) {
      case 'pendente': return 'pending';
      case 'aceita': return 'accepted';
      case 'recusada': return 'rejected';
      case 'cancelada': return 'cancelled';
      default: return 'pending';
    }
  };
  
  // Formatação de preço
  const formatarPreco = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Renderizar um loading state enquanto verifica autenticação
  if (loading || verificandoPlano) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  const filteredProposals = getFilteredProposals();

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <FaComments className="mr-3 text-[#0071ce]" /> Propostas de Permuta
      </h1>

      {!planoAtivo ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FaExclamationTriangle className="text-yellow-500 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Plano Inativo</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Você não possui um plano ativo. Para acessar as propostas de permuta, é necessário assinar um plano.
          </p>
          <Link 
            href="/dashboard/escolher-plano" 
            className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-2 rounded-md text-sm"
          >
            Ver planos disponíveis
          </Link>
        </div>
      ) : isLoadingProposals ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs e filtros */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button 
                  onClick={() => setActiveTab('received')}
                  className={`py-4 px-6 font-medium text-sm ${activeTab === 'received' 
                  ? 'text-[#0071ce] border-b-2 border-[#0071ce]' 
                    : 'text-gray-600 hover:text-gray-800'}`}
                >
                Propostas Recebidas
                </button>
                <button 
                  onClick={() => setActiveTab('sent')}
                  className={`py-4 px-6 font-medium text-sm ${activeTab === 'sent' 
                  ? 'text-[#0071ce] border-b-2 border-[#0071ce]' 
                    : 'text-gray-600 hover:text-gray-800'}`}
                >
                Propostas Enviadas
                </button>
            </div>

            {/* Filtros */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center mb-2">
                <FaFilter className="text-[#0071ce] mr-2" />
                <h3 className="text-sm font-medium text-gray-700">Filtrar por status</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'all'
                      ? 'bg-[#0071ce] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'pending'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                }`}
              >
                Pendentes
              </button>
              <button
                onClick={() => setStatusFilter('accepted')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'accepted'
                    ? 'bg-[#4CAF50] text-white'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                Aceitas
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'rejected'
                      ? 'bg-red-500 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                Recusadas
              </button>
              {activeTab === 'sent' && (
                <button
                  onClick={() => setStatusFilter('cancelled')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === 'cancelled'
                        ? 'bg-gray-500 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Canceladas
                </button>
              )}
              </div>
            </div>
            </div>

            {/* Lista de propostas */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                  {activeTab === 'received' ? (
                    <>
                      <FaComments className="text-[#0071ce] mr-2 text-sm" /> Propostas Recebidas
                    </>
                  ) : (
                    <>
                      <FaComments className="text-[#0071ce] mr-2 text-sm" /> Propostas Enviadas
                    </>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({statusFilter === 'pending' ? 'Pendentes' : 
                        statusFilter === 'accepted' ? 'Aceitas' : 
                        statusFilter === 'rejected' ? 'Recusadas' : 'Canceladas'})
                    </span>
                  )}
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredProposals.length} {filteredProposals.length === 1 ? 'proposta encontrada' : 'propostas encontradas'}
                </span>
              </div>

              {filteredProposals.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaComments className="text-gray-400 w-8 h-8" />
                  </div>
                  <h3 className="text-gray-800 font-medium mb-2">Nenhuma proposta encontrada</h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === 'received' 
                      ? 'Você ainda não recebeu propostas de permuta com este status.' 
                      : 'Você ainda não enviou propostas de permuta com este status.'}
                  </p>
                  {activeTab === 'sent' && (
                    <Link href="/buscar-imoveis" className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-2 rounded-md text-sm">
                      Buscar imóveis para propor permuta
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredProposals.map((proposal) => (
                    <div 
                      key={proposal.id} 
                      className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-lg text-gray-900">{proposal.title}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          proposal.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : proposal.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : proposal.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                          {proposal.status === 'pending' 
                            ? 'Pendente' 
                            : proposal.status === 'accepted'
                              ? 'Aceita'
                              : proposal.status === 'rejected'
                                ? 'Recusada'
                                : 'Cancelada'
                          }
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        {/* Imóvel Objeto da Proposta */}
                        <div className="border rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-gray-100 p-3 border-b">
                            <span className="text-sm font-medium">
                              {activeTab === 'received' 
                                ? 'Seu imóvel' 
                                : 'Imóvel que você quer permutar'}
                            </span>
                          </div>
                          <div className="p-3">
                            <div className="flex">
                              <div 
                                className="h-20 w-20 bg-cover bg-center rounded"
                                style={{ backgroundImage: `url(${proposal.propertyImageUrl})` }}
                              ></div>
                              <div className="ml-3 flex-1">
                                <h4 className="font-medium">{proposal.propertyTitle}</h4>
                                <p className="text-sm text-gray-600">{proposal.propertyLocation}</p>
                                <p className="text-sm font-medium mt-1">{proposal.propertyPrice}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Imóvel Oferecido */}
                        <div className="border rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-gray-100 p-3 border-b">
                            <span className="text-sm font-medium">
                              {activeTab === 'received' 
                                ? 'Imóvel oferecido' 
                                : 'Seu imóvel oferecido'}
                            </span>
                          </div>
                          <div className="p-3">
                            <div className="flex">
                              <div 
                                className="h-20 w-20 bg-cover bg-center rounded"
                                style={{ backgroundImage: `url(${proposal.offerPropertyImageUrl})` }}
                              ></div>
                              <div className="ml-3 flex-1">
                                <h4 className="font-medium">{proposal.offerPropertyTitle}</h4>
                                <p className="text-sm text-gray-600">{proposal.offerPropertyLocation}</p>
                                <p className="text-sm font-medium mt-1">{proposal.offerPropertyPrice}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {proposal.message && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <p className="text-gray-700">{proposal.message}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaClock className="mr-1" />
                          <span>Criada em: {formatDate(proposal.createdAt)}</span>
                          {proposal.updatedAt && (
                            <span className="ml-4">
                              Atualizada em: {formatDate(proposal.updatedAt)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {proposal.type === 'received' && proposal.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => rejectProposal(proposal.id)}
                                className="border border-red-300 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-50 flex items-center"
                              >
                                <FaTimes className="mr-1" /> Recusar
                              </button>
                              <button 
                                onClick={() => acceptProposal(proposal.id)}
                                className="bg-[#4CAF50] text-white px-3 py-1 rounded-md text-sm hover:bg-[#43a047] flex items-center"
                              >
                                <FaCheck className="mr-1" /> Aceitar
                              </button>
                            </>
                          )}

                          {proposal.type === 'sent' && proposal.status === 'pending' && (
                            <button 
                              onClick={() => cancelProposal(proposal.id)}
                              className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-50"
                            >
                              Cancelar proposta
                            </button>
                          )}

                          <Link 
                            href={`/propostas/${proposal.id}`}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200 flex items-center"
                          >
                            <FaEye className="mr-1" /> Ver detalhes
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </>
    </>
  );
} 