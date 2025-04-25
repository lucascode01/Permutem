'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaComments, FaBuilding, FaExchangeAlt, FaCheck, FaTimes, FaClock, FaEye, FaFilter } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

type Proposal = {
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
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // Redirecionar se o usuário não estiver logado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Carregar propostas (mock)
  useEffect(() => {
    // Simulação de dados de propostas
    const mockProposals: Proposal[] = [
      {
        id: '1',
        type: 'received',
        title: 'Proposta de permuta para seu apartamento',
        propertyId: '1',
        propertyTitle: 'Apartamento 2 quartos em Botafogo',
        propertyLocation: 'Botafogo, Rio de Janeiro',
        propertyImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3',
        propertyPrice: 'R$ 450.000',
        offerPropertyId: '5',
        offerPropertyTitle: 'Apartamento na Barra da Tijuca',
        offerPropertyLocation: 'Barra da Tijuca, Rio de Janeiro',
        offerPropertyImageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3',
        offerPropertyPrice: 'R$ 480.000',
        message: 'Olá! Tenho interesse em permutar meu apartamento na Barra pelo seu em Botafogo. Podemos conversar?',
        status: 'pending',
        createdAt: '2023-09-10T14:30:00',
      },
      {
        id: '2',
        type: 'received',
        title: 'Proposta de permuta para sua casa',
        propertyId: '2',
        propertyTitle: 'Casa com jardim na Barra da Tijuca',
        propertyLocation: 'Barra da Tijuca, Rio de Janeiro',
        propertyImageUrl: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3',
        propertyPrice: 'R$ 1.200.000',
        offerPropertyId: '6',
        offerPropertyTitle: 'Casa em Angra dos Reis',
        offerPropertyLocation: 'Angra dos Reis, RJ',
        offerPropertyImageUrl: '/images/cities/muriae.png',
        offerPropertyPrice: 'R$ 950.000 + R$ 250.000',
        message: 'Gostaria de permutar minha casa em Angra + diferença em dinheiro pela sua casa na Barra.',
        status: 'accepted',
        createdAt: '2023-09-05T10:15:00',
        updatedAt: '2023-09-06T16:30:00',
      },
      {
        id: '3',
        type: 'sent',
        title: 'Proposta enviada para cobertura',
        propertyId: '3',
        propertyTitle: 'Cobertura Duplex na Barra da Tijuca',
        propertyLocation: 'Barra da Tijuca, Rio de Janeiro',
        propertyImageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3',
        propertyPrice: 'R$ 1.500.000',
        offerPropertyId: '7',
        offerPropertyTitle: 'Meu apartamento em Copacabana',
        offerPropertyLocation: 'Copacabana, Rio de Janeiro',
        offerPropertyImageUrl: '/images/cities/ipatinga.png',
        offerPropertyPrice: 'R$ 900.000 + R$ 600.000',
        message: 'Tenho interesse em sua cobertura e ofereço meu apartamento + diferença em dinheiro.',
        status: 'rejected',
        createdAt: '2023-09-01T16:45:00',
        updatedAt: '2023-09-03T11:20:00',
      },
      {
        id: '4',
        type: 'sent',
        title: 'Proposta enviada para apartamento',
        propertyId: '4',
        propertyTitle: 'Apartamento no Centro',
        propertyLocation: 'Centro, Rio de Janeiro',
        propertyImageUrl: '/images/cities/manhuacu.png',
        propertyPrice: 'R$ 380.000',
        offerPropertyId: '8',
        offerPropertyTitle: 'Meu apartamento em Botafogo',
        offerPropertyLocation: 'Botafogo, Rio de Janeiro',
        offerPropertyImageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3',
        offerPropertyPrice: 'R$ 420.000',
        message: 'Tenho interesse em trocar meu apartamento pelo seu. Estou disposto a negociar valores.',
        status: 'pending',
        createdAt: '2023-08-25T09:30:00',
      },
    ];

    setProposals(mockProposals);
  }, []);

  const getFilteredProposals = () => {
    let filtered = proposals.filter(proposal => proposal.type === activeTab);
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter);
    }
    
    return filtered;
  };

  const acceptProposal = (id: string) => {
    setProposals(prevProposals => 
      prevProposals.map(proposal => 
        proposal.id === id 
          ? { ...proposal, status: 'accepted', updatedAt: new Date().toISOString() } 
          : proposal
      )
    );
  };

  const rejectProposal = (id: string) => {
    setProposals(prevProposals => 
      prevProposals.map(proposal => 
        proposal.id === id 
          ? { ...proposal, status: 'rejected', updatedAt: new Date().toISOString() } 
          : proposal
      )
    );
  };

  const cancelProposal = (id: string) => {
    setProposals(prevProposals => 
      prevProposals.map(proposal => 
        proposal.id === id 
          ? { ...proposal, status: 'cancelled', updatedAt: new Date().toISOString() } 
          : proposal
      )
    );
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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
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
  );
} 