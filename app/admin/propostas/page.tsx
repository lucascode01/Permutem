'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaExchangeAlt, FaEye, FaCheckCircle, FaTimesCircle, FaBan } from 'react-icons/fa';
import Image from 'next/image';

type Proposta = {
  id: string;
  tipo: 'enviada' | 'recebida';
  imovelOfertado: {
    id: string;
    titulo: string;
    localizacao: string;
    preco: number;
    proprietario: {
      id: string;
      nome: string;
      email: string;
    };
    imagemUrl: string;
  };
  imovelSolicitado: {
    id: string;
    titulo: string;
    localizacao: string;
    preco: number;
    proprietario: {
      id: string;
      nome: string;
      email: string;
    };
    imagemUrl: string;
  };
  mensagem: string;
  status: 'pendente' | 'aceita' | 'recusada' | 'cancelada';
  dataCriacao: string;
  dataAtualizacao: string;
};

export default function PropostasAdminPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [propostaSelecionada, setPropostaSelecionada] = useState<Proposta | null>(null);
  const [showDetalhes, setShowDetalhes] = useState<boolean>(false);

  // Carregar dados das propostas
  useEffect(() => {
    const carregarPropostas = () => {
      // Simulação de chamada à API
      setTimeout(() => {
        const mockPropostas: Proposta[] = [
          {
            id: '1',
            tipo: 'enviada',
            imovelOfertado: {
              id: '101',
              titulo: 'Apartamento em Balneário Camboriú',
              localizacao: 'Balneário Camboriú, SC',
              preco: 1250000,
              proprietario: {
                id: 'user101',
                nome: 'João Silva',
                email: 'joao.silva@exemplo.com'
              },
              imagemUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop'
            },
            imovelSolicitado: {
              id: '201',
              titulo: 'Casa em Condomínio em Florianópolis',
              localizacao: 'Florianópolis, SC',
              preco: 1450000,
              proprietario: {
                id: 'user201',
                nome: 'Ana Souza',
                email: 'ana.souza@exemplo.com'
              },
              imagemUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop'
            },
            mensagem: 'Tenho interesse em realizar a permuta dos imóveis. Podemos conversar sobre os detalhes?',
            status: 'pendente',
            dataCriacao: '2023-09-15T14:30:00',
            dataAtualizacao: '2023-09-15T14:30:00'
          },
          {
            id: '2',
            tipo: 'recebida',
            imovelOfertado: {
              id: '301',
              titulo: 'Loft no Centro',
              localizacao: 'Rio de Janeiro, RJ',
              preco: 620000,
              proprietario: {
                id: 'user301',
                nome: 'Carlos Oliveira',
                email: 'carlos.oliveira@exemplo.com'
              },
              imagemUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop'
            },
            imovelSolicitado: {
              id: '102',
              titulo: 'Cobertura em Copacabana',
              localizacao: 'Rio de Janeiro, RJ',
              preco: 950000,
              proprietario: {
                id: 'user102',
                nome: 'Maria Santos',
                email: 'maria.santos@exemplo.com'
              },
              imagemUrl: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&auto=format&fit=crop'
            },
            mensagem: 'Olá, gostaria de propor uma permuta pelo seu imóvel em Copacabana. Podemos negociar valores.',
            status: 'aceita',
            dataCriacao: '2023-09-10T10:15:00',
            dataAtualizacao: '2023-09-12T16:45:00'
          },
          {
            id: '3',
            tipo: 'enviada',
            imovelOfertado: {
              id: '103',
              titulo: 'Terreno em Condomínio',
              localizacao: 'Curitiba, PR',
              preco: 550000,
              proprietario: {
                id: 'user103',
                nome: 'Roberto Alves',
                email: 'roberto.alves@exemplo.com'
              },
              imagemUrl: 'https://images.unsplash.com/photo-1500021804447-2ca2eaaaabeb?w=800&auto=format&fit=crop'
            },
            imovelSolicitado: {
              id: '302',
              titulo: 'Sobrado em Condomínio Fechado',
              localizacao: 'Curitiba, PR',
              preco: 780000,
              proprietario: {
                id: 'user302',
                nome: 'Luciana Costa',
                email: 'luciana.costa@exemplo.com'
              },
              imagemUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop'
            },
            mensagem: 'Interesse em permuta com complemento em dinheiro. O terreno fica em uma área valorizada.',
            status: 'recusada',
            dataCriacao: '2023-08-28T09:20:00',
            dataAtualizacao: '2023-08-30T14:10:00'
          },
          {
            id: '4',
            tipo: 'recebida',
            imovelOfertado: {
              id: '303',
              titulo: 'Apartamento na Zona Sul',
              localizacao: 'São Paulo, SP',
              preco: 890000,
              proprietario: {
                id: 'user303',
                nome: 'Felipe Mendes',
                email: 'felipe.mendes@exemplo.com'
              },
              imagemUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'
            },
            imovelSolicitado: {
              id: '104',
              titulo: 'Casa em Condomínio',
              localizacao: 'Campinas, SP',
              preco: 1050000,
              proprietario: {
                id: 'user104',
                nome: 'Juliana Santos',
                email: 'juliana.santos@exemplo.com'
              },
              imagemUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop'
            },
            mensagem: 'Gostaria de permutar meu apartamento com a sua casa. Posso complementar com valor em dinheiro.',
            status: 'pendente',
            dataCriacao: '2023-09-05T16:30:00',
            dataAtualizacao: '2023-09-05T16:30:00'
          },
          {
            id: '5',
            tipo: 'enviada',
            imovelOfertado: {
              id: '105',
              titulo: 'Cobertura Duplex',
              localizacao: 'Belo Horizonte, MG',
              preco: 1180000,
              proprietario: {
                id: 'user105',
                nome: 'Pedro Souza',
                email: 'pedro.souza@exemplo.com'
              },
              imagemUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop'
            },
            imovelSolicitado: {
              id: '304',
              titulo: 'Fazenda Produtiva',
              localizacao: 'Sete Lagoas, MG',
              preco: 2500000,
              proprietario: {
                id: 'user304',
                nome: 'Antonio Ferreira',
                email: 'antonio.ferreira@exemplo.com'
              },
              imagemUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop'
            },
            mensagem: 'Proposta de permuta com complementação em dinheiro. Tenho interesse na sua propriedade rural.',
            status: 'cancelada',
            dataCriacao: '2023-08-15T11:45:00',
            dataAtualizacao: '2023-08-18T09:30:00'
          }
        ];

        setPropostas(mockPropostas);
        setLoading(false);
      }, 1000);
    };

    carregarPropostas();
  }, []);

  // Formatar preço
  const formatarPreco = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Filtrar propostas
  const propostasFiltradas = propostas.filter(proposta => {
    // Filtrar por status
    if (filtroStatus !== 'todos' && proposta.status !== filtroStatus) {
      return false;
    }

    // Filtrar por busca
    if (busca) {
      const termoBuscaLower = busca.toLowerCase();
      return (
        proposta.imovelOfertado.titulo.toLowerCase().includes(termoBuscaLower) ||
        proposta.imovelSolicitado.titulo.toLowerCase().includes(termoBuscaLower) ||
        proposta.imovelOfertado.proprietario.nome.toLowerCase().includes(termoBuscaLower) ||
        proposta.imovelSolicitado.proprietario.nome.toLowerCase().includes(termoBuscaLower) ||
        proposta.imovelOfertado.localizacao.toLowerCase().includes(termoBuscaLower) ||
        proposta.imovelSolicitado.localizacao.toLowerCase().includes(termoBuscaLower)
      );
    }

    return true;
  });

  // Alterar status da proposta
  const alterarStatusProposta = (id: string, novoStatus: 'pendente' | 'aceita' | 'recusada' | 'cancelada') => {
    setPropostas(
      propostas.map(proposta =>
        proposta.id === id ? { ...proposta, status: novoStatus, dataAtualizacao: new Date().toISOString() } : proposta
      )
    );
    
    if (propostaSelecionada?.id === id) {
      setPropostaSelecionada({
        ...propostaSelecionada,
        status: novoStatus,
        dataAtualizacao: new Date().toISOString()
      });
    }
  };

  // Modal de detalhes da proposta
  const ModalDetalhesProposta = () => {
    if (!propostaSelecionada) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold">Detalhes da Proposta</h3>
            <button
              onClick={() => setShowDetalhes(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  propostaSelecionada.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                  propostaSelecionada.status === 'aceita' ? 'bg-green-100 text-green-800' :
                  propostaSelecionada.status === 'recusada' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {propostaSelecionada.status.charAt(0).toUpperCase() + propostaSelecionada.status.slice(1)}
                </span>
                <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {propostaSelecionada.tipo === 'enviada' ? 'Enviada' : 'Recebida'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <p>Criada em: {formatarData(propostaSelecionada.dataCriacao)}</p>
                <p>Atualizada em: {formatarData(propostaSelecionada.dataAtualizacao)}</p>
              </div>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-semibold mb-2">Mensagem:</h4>
              <p className="text-gray-700">{propostaSelecionada.mensagem}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 font-medium">Imóvel Ofertado</div>
              <div className="p-4">
                <div className="relative h-48 mb-3 rounded-lg overflow-hidden">
                  <Image 
                    src={propostaSelecionada.imovelOfertado.imagemUrl} 
                    alt={propostaSelecionada.imovelOfertado.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-bold mb-1">{propostaSelecionada.imovelOfertado.titulo}</h4>
                <p className="text-gray-600 text-sm mb-2">{propostaSelecionada.imovelOfertado.localizacao}</p>
                <p className="text-primary font-bold mb-3">{formatarPreco(propostaSelecionada.imovelOfertado.preco)}</p>
                <div className="border-t pt-3">
                  <h5 className="text-sm font-medium text-gray-500 mb-1">Proprietário</h5>
                  <p className="font-medium">{propostaSelecionada.imovelOfertado.proprietario.nome}</p>
                  <p className="text-sm text-gray-600">{propostaSelecionada.imovelOfertado.proprietario.email}</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 font-medium">Imóvel Solicitado</div>
              <div className="p-4">
                <div className="relative h-48 mb-3 rounded-lg overflow-hidden">
                  <Image 
                    src={propostaSelecionada.imovelSolicitado.imagemUrl} 
                    alt={propostaSelecionada.imovelSolicitado.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-bold mb-1">{propostaSelecionada.imovelSolicitado.titulo}</h4>
                <p className="text-gray-600 text-sm mb-2">{propostaSelecionada.imovelSolicitado.localizacao}</p>
                <p className="text-primary font-bold mb-3">{formatarPreco(propostaSelecionada.imovelSolicitado.preco)}</p>
                <div className="border-t pt-3">
                  <h5 className="text-sm font-medium text-gray-500 mb-1">Proprietário</h5>
                  <p className="font-medium">{propostaSelecionada.imovelSolicitado.proprietario.nome}</p>
                  <p className="text-sm text-gray-600">{propostaSelecionada.imovelSolicitado.proprietario.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h5 className="text-sm font-medium text-gray-500 mb-3">Ações</h5>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => alterarStatusProposta(propostaSelecionada.id, 'aceita')}
                disabled={propostaSelecionada.status === 'aceita'}
                className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
                  propostaSelecionada.status === 'aceita' 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <FaCheckCircle className="mr-1" />
                Aprovar
              </button>
              
              <button 
                onClick={() => alterarStatusProposta(propostaSelecionada.id, 'recusada')}
                disabled={propostaSelecionada.status === 'recusada'}
                className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
                  propostaSelecionada.status === 'recusada' 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                <FaTimesCircle className="mr-1" />
                Recusar
              </button>
              
              <button 
                onClick={() => alterarStatusProposta(propostaSelecionada.id, 'cancelada')}
                disabled={propostaSelecionada.status === 'cancelada'}
                className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
                  propostaSelecionada.status === 'cancelada' 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                <FaBan className="mr-1" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestão de Propostas</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar proposta..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="todos">Todos os status</option>
            <option value="pendente">Pendentes</option>
            <option value="aceita">Aceitas</option>
            <option value="recusada">Recusadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : propostasFiltradas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FaExchangeAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma proposta encontrada</h2>
          <p className="text-gray-500">
            Nenhuma proposta corresponde aos critérios de busca e filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {propostasFiltradas.map(proposta => (
            <div key={proposta.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full mr-2 ${
                      proposta.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      proposta.status === 'aceita' ? 'bg-green-100 text-green-800' :
                      proposta.status === 'recusada' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {proposta.status.charAt(0).toUpperCase() + proposta.status.slice(1)}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {proposta.tipo === 'enviada' ? 'Enviada' : 'Recebida'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{formatarData(proposta.dataCriacao)}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                      <Image 
                        src={proposta.imovelOfertado.imagemUrl} 
                        alt={proposta.imovelOfertado.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Imóvel Ofertado</p>
                      <p className="text-gray-700 text-sm">{proposta.imovelOfertado.titulo}</p>
                      <p className="text-gray-500 text-sm">{proposta.imovelOfertado.proprietario.nome}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                      <Image 
                        src={proposta.imovelSolicitado.imagemUrl} 
                        alt={proposta.imovelSolicitado.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Imóvel Solicitado</p>
                      <p className="text-gray-700 text-sm">{proposta.imovelSolicitado.titulo}</p>
                      <p className="text-gray-500 text-sm">{proposta.imovelSolicitado.proprietario.nome}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 line-clamp-1">
                    <span className="font-medium">Mensagem:</span> {proposta.mensagem}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setPropostaSelecionada(proposta);
                        setShowDetalhes(true);
                      }}
                      className="p-2 border border-gray-200 rounded-md text-blue-600 hover:bg-blue-50"
                      title="Ver detalhes"
                    >
                      <FaEye />
                    </button>
                    
                    {proposta.status === 'pendente' && (
                      <>
                        <button
                          onClick={() => alterarStatusProposta(proposta.id, 'aceita')}
                          className="p-2 border border-gray-200 rounded-md text-green-600 hover:bg-green-50"
                          title="Aprovar proposta"
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          onClick={() => alterarStatusProposta(proposta.id, 'recusada')}
                          className="p-2 border border-gray-200 rounded-md text-red-600 hover:bg-red-50"
                          title="Recusar proposta"
                        >
                          <FaTimesCircle />
                        </button>
                      </>
                    )}
                    
                    {(proposta.status === 'pendente' || proposta.status === 'aceita') && (
                      <button
                        onClick={() => alterarStatusProposta(proposta.id, 'cancelada')}
                        className="p-2 border border-gray-200 rounded-md text-yellow-600 hover:bg-yellow-50"
                        title="Cancelar proposta"
                      >
                        <FaBan />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDetalhes && <ModalDetalhesProposta />}
    </>
  );
} 