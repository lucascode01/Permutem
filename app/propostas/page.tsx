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
        
        if (erroRecebidas) {
          console.error('Erro ao carregar propostas recebidas:', erroRecebidas);
          toast.error('Erro ao carregar propostas recebidas');
        }

        // Carregar propostas enviadas
        const { data: propostasEnviadas, error: erroEnviadas } = await propostasService.listarPropostasEnviadas(user.id);
        
        if (erroEnviadas) {
          console.error('Erro ao carregar propostas enviadas:', erroEnviadas);
          toast.error('Erro ao carregar propostas enviadas');
        }

        // Converter para o formato da view
        const propostasRecebidasConvertidas = (propostasRecebidas || []).map(proposta => ({
          id: proposta.id,
          type: 'received' as const,
          title: `Proposta recebida para imóvel`,
          propertyId: proposta.imovel_destino_id,
          propertyTitle: 'Imóvel de interesse',
          propertyLocation: 'Localização do imóvel',
          propertyImageUrl: '/placeholder-property.jpg',
          propertyPrice: formatarPreco(0),
          offerPropertyId: proposta.imovel_origem_id,
          offerPropertyTitle: 'Imóvel oferecido',
          offerPropertyLocation: 'Localização do imóvel oferecido',
          offerPropertyImageUrl: '/placeholder-property.jpg',
          offerPropertyPrice: proposta.valor_adicional ? formatarPreco(proposta.valor_adicional) : undefined,
          message: proposta.mensagem,
          status: converterStatus(proposta.status),
          createdAt: proposta.criado_em,
          updatedAt: proposta.atualizado_em
        }));

        const propostasEnviadasConvertidas = (propostasEnviadas || []).map(proposta => ({
          id: proposta.id,
          type: 'sent' as const,
          title: `Proposta enviada para imóvel`,
          propertyId: proposta.imovel_destino_id,
          propertyTitle: 'Imóvel de interesse',
          propertyLocation: 'Localização do imóvel',
          propertyImageUrl: '/placeholder-property.jpg',
          propertyPrice: formatarPreco(0),
          offerPropertyId: proposta.imovel_origem_id,
          offerPropertyTitle: 'Seu imóvel oferecido',
          offerPropertyLocation: 'Localização do seu imóvel',
          offerPropertyImageUrl: '/placeholder-property.jpg',
          offerPropertyPrice: proposta.valor_adicional ? formatarPreco(proposta.valor_adicional) : undefined,
          message: proposta.mensagem,
          status: converterStatus(proposta.status),
          createdAt: proposta.criado_em,
          updatedAt: proposta.atualizado_em
        }));

        setProposals([...propostasRecebidasConvertidas, ...propostasEnviadasConvertidas]);
        
      } catch (error) {
        console.error('Erro ao carregar propostas:', error);
        toast.error('Erro ao carregar propostas');
      } finally {
        setIsLoadingProposals(false);
      }
    };

    if (user?.id && planoAtivo) {
      loadProposals();
    } else {
      setIsLoadingProposals(false);
    }
  }, [user, planoAtivo]);

  const getFilteredProposals = () => {
    return proposals.filter(proposal => {
      const matchesTab = proposal.type === activeTab;
      const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
      return matchesTab && matchesStatus;
    });
  };

  const acceptProposal = async (id: string) => {
    try {
      toast.success('Proposta aceita com sucesso!');
      
      // Atualizar status localmente
      setProposals(prev => 
        prev.map(proposal => 
          proposal.id === id 
            ? { ...proposal, status: 'accepted' as const }
            : proposal
        )
      );
      
    } catch (error) {
      console.error('Erro ao aceitar proposta:', error);
      toast.error('Erro ao aceitar proposta');
    }
  };

  const rejectProposal = async (id: string) => {
    try {
      toast.success('Proposta rejeitada');
      
      // Atualizar status localmente
      setProposals(prev => 
        prev.map(proposal => 
          proposal.id === id 
            ? { ...proposal, status: 'rejected' as const }
            : proposal
        )
      );
      
    } catch (error) {
      console.error('Erro ao rejeitar proposta:', error);
      toast.error('Erro ao rejeitar proposta');
    }
  };

  const cancelProposal = async (id: string) => {
    try {
      toast.success('Proposta cancelada');
      
      // Atualizar status localmente
      setProposals(prev => 
        prev.map(proposal => 
          proposal.id === id 
            ? { ...proposal, status: 'cancelled' as const }
            : proposal
        )
      );
      
    } catch (error) {
      console.error('Erro ao cancelar proposta:', error);
      toast.error('Erro ao cancelar proposta');
    }
  };

  const converterStatus = (statusBackend: string): ProposalStatus => {
    switch (statusBackend) {
      case 'pendente': return 'pending';
      case 'aceita': return 'accepted';
      case 'rejeitada': return 'rejected';
      case 'cancelada': return 'cancelled';
      default: return 'pending';
    }
  };

  const formatarPreco = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredProposals = getFilteredProposals();

  if (loading || verificandoPlano) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-[#0071ce] hover:text-[#0056b3] mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Voltar ao Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <FaComments className="mr-3 text-[#0071ce]" /> 
        Propostas de Permuta
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
        <div className="bg-white rounded-lg shadow-sm">
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
                Rejeitadas
              </button>
            </div>
          </div>

          {/* Lista de Propostas */}
          <div className="p-6">
            {filteredProposals.length === 0 ? (
              <div className="text-center py-12">
                <FaComments className="text-gray-400 w-16 h-16 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Nenhuma proposta encontrada
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'received' 
                    ? 'Você ainda não recebeu propostas de permuta.'
                    : 'Você ainda não enviou propostas de permuta.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProposals.map((proposal) => (
                  <div key={proposal.id} className="border rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800">{proposal.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {proposal.status === 'pending' ? 'Pendente' :
                         proposal.status === 'accepted' ? 'Aceita' :
                         proposal.status === 'rejected' ? 'Rejeitada' :
                         'Cancelada'}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {/* Imóvel Principal */}
                      <div className="border rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-gray-100 p-3 border-b">
                          <span className="text-sm font-medium">
                            {activeTab === 'received' 
                              ? 'Seu imóvel' 
                              : 'Imóvel de interesse'}
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
        </div>
      )}
    </div>
  );
} 