'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaHome, 
  FaBuilding, 
  FaDollarSign, 
  FaMapMarkerAlt,
  FaEye,
  FaBell,
  FaShare,
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

export default function AnuncioDetalhesPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('detalhes');
  const id = parseInt(params.id);

  // Dados simulados do anúncio
  const anuncio = {
    id: id,
    titulo: 'Apartamento 2 quartos em Botafogo',
    descricao: 'Excelente apartamento em localização privilegiada, próximo de comércios, transportes e com vista para o Pão de Açúcar. Condomínio com portaria 24h, piscina e academia.',
    tipo: 'Apartamento',
    preco: 'R$ 450.000',
    endereco: 'Rua São Clemente, Botafogo - Rio de Janeiro',
    imagem: '/placeholder-image.jpg',
    status: 'ativo',
    destaque: true,
    dataCriacao: '15/07/2023',
    ultimaAtualizacao: '20/08/2023',
    caracteristicas: [
      { nome: 'Área', valor: '75 m²' },
      { nome: 'Quartos', valor: '2' },
      { nome: 'Banheiros', valor: '1' },
      { nome: 'Vagas', valor: '1' },
      { nome: 'Andar', valor: '5º andar' }
    ],
    estatisticas: {
      visualizacoes: 145,
      salvos: 32,
      propostas: 3,
      compartilhamentos: 8
    },
    propostas: [
      { id: 1, nome: 'Carlos Silva', valor: 'R$ 430.000', data: '18/08/2023', status: 'pendente' },
      { id: 2, nome: 'Maria Oliveira', valor: 'R$ 445.000', data: '22/08/2023', status: 'recusada' },
      { id: 3, nome: 'João Santos', valor: 'R$ 448.000', data: '28/08/2023', status: 'aceita' }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white text-gray-800 border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/anuncios" className="text-gray-500 hover:text-gray-700 transition-colors mr-3">
              <FaArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-base font-medium ml-2">Detalhes do Anúncio</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-800 border border-gray-300 px-3 py-1 rounded-md text-sm"
            >
              Voltar ao Dashboard
            </Link>
            <Link 
              href={`/anuncios/editar/${id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Editar
            </Link>
          </div>
        </div>
      </header>

      {/* Banner de status do anúncio */}
      {anuncio.status !== 'ativo' && (
        <div className="bg-yellow-50 border-y border-yellow-100 px-4 py-3 flex items-center justify-center">
          <FaExclamationTriangle className="mr-2 text-yellow-500" />
          <span className="text-yellow-700">Este anúncio está inativo no momento. Ative-o para que os usuários possam visualizá-lo.</span>
          <button className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-medium">
            Ativar anúncio
          </button>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-6">
        {/* Título e status */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{anuncio.titulo}</h2>
            <div className="flex items-center mt-1">
              <span className="text-gray-600">{anuncio.endereco}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                anuncio.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {anuncio.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
              {anuncio.destaque && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  Destaque
                </span>
              )}
            </div>
          </div>
          <div className="text-2xl font-bold text-[#4CAF50]">{anuncio.preco}</div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('detalhes')}
            className={`pb-2 px-4 font-medium text-sm ${activeTab === 'detalhes' 
              ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Detalhes
          </button>
          <button 
            onClick={() => setActiveTab('propostas')}
            className={`pb-2 px-4 font-medium text-sm ${activeTab === 'propostas' 
              ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Propostas ({anuncio.propostas.length})
          </button>
          <button 
            onClick={() => setActiveTab('estatisticas')}
            className={`pb-2 px-4 font-medium text-sm ${activeTab === 'estatisticas' 
              ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Estatísticas
          </button>
        </div>

        {/* Conteúdo da Tab */}
        {activeTab === 'detalhes' && (
          <div>
            {/* Barra de ações */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6 flex flex-wrap justify-between items-center">
              <div className="flex items-center">
                <div className={`px-2 py-1 rounded-md text-sm font-medium ${
                  anuncio.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  Status: {anuncio.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </div>
                {anuncio.destaque && (
                  <div className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm font-medium">
                    Anúncio em Destaque
                  </div>
                )}
              </div>
              <div className="flex space-x-2 mt-3 md:mt-0">
                <button className="flex items-center text-gray-700 border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-100">
                  <FaShare className="mr-1" /> Compartilhar
                </button>
                <button className="flex items-center text-blue-600 border border-blue-300 px-3 py-1 rounded-md text-sm hover:bg-blue-50">
                  <FaEdit className="mr-1" /> Editar
                </button>
                <button className="flex items-center text-gray-700 border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-100">
                  {anuncio.status === 'ativo' ? (
                    <><FaTimesCircle className="mr-1" /> Desativar</>
                  ) : (
                    <><FaCheckCircle className="mr-1" /> Ativar</>
                  )}
                </button>
                <button className="flex items-center text-red-600 border border-red-300 px-3 py-1 rounded-md text-sm hover:bg-red-50">
                  <FaTrash className="mr-1" /> Excluir
                </button>
              </div>
            </div>

            {/* Imagem principal e galeria */}
            <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <FaHome className="text-gray-400 w-20 h-20" />
              </div>
            </div>

            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                  <FaEye className="text-blue-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Visualizações</div>
                  <div className="text-lg font-bold">{anuncio.estatisticas.visualizacoes}</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                  <FaBell className="text-green-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Propostas</div>
                  <div className="text-lg font-bold">{anuncio.estatisticas.propostas}</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mr-3">
                  <FaShare className="text-yellow-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Compartilhamentos</div>
                  <div className="text-lg font-bold">{anuncio.estatisticas.compartilhamentos}</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                  <FaCalendarAlt className="text-purple-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Dias ativos</div>
                  <div className="text-lg font-bold">32</div>
                </div>
              </div>
            </div>

            {/* Informações do imóvel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="col-span-2">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium mb-3">Descrição</h3>
                  <p className="text-gray-700 mb-6">{anuncio.descricao}</p>
                  
                  <h3 className="text-lg font-medium mb-3">Características</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {anuncio.caracteristicas.map((caracteristica, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-3">
                          <span className="text-[#4CAF50] font-medium">{caracteristica.valor}</span>
                        </div>
                        <span className="text-gray-700">{caracteristica.nome}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-medium mt-6 mb-3">Localização</h3>
                  <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Mapa indisponível</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
                  <h3 className="text-lg font-medium mb-4">Informações Gerais</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                        <FaCalendarAlt className="text-[#4CAF50]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Publicado em</p>
                        <p className="text-gray-700">{anuncio.dataCriacao}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                        <FaCalendarAlt className="text-[#4CAF50]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Última atualização</p>
                        <p className="text-gray-700">{anuncio.ultimaAtualizacao}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                        <FaBuilding className="text-[#4CAF50]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tipo de imóvel</p>
                        <p className="text-gray-700">{anuncio.tipo}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Ações</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-[#4CAF50] hover:bg-[#43a047] text-white py-2 rounded-md font-medium">
                      Editar anúncio
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-50">
                      {anuncio.status === 'ativo' ? 'Desativar' : 'Ativar'} anúncio
                    </button>
                    <button className="w-full border border-red-300 text-red-500 py-2 rounded-md font-medium hover:bg-red-50">
                      Excluir anúncio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'propostas' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Propostas recebidas</h3>
            
            {anuncio.propostas.length === 0 ? (
              <div className="text-center py-10">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaBell className="text-gray-400 w-8 h-8" />
                </div>
                <h3 className="text-gray-800 font-medium mb-2">Nenhuma proposta recebida</h3>
                <p className="text-gray-600">Seu anúncio ainda não recebeu propostas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {anuncio.propostas.map(proposta => (
                  <div key={proposta.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{proposta.nome}</h4>
                        <p className="text-sm text-gray-500">Proposta enviada em {proposta.data}</p>
                      </div>
                      <div className="text-lg font-bold text-[#4CAF50]">{proposta.valor}</div>
                    </div>
                    <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        proposta.status === 'aceita' 
                          ? 'bg-green-100 text-green-800' 
                          : proposta.status === 'recusada'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {proposta.status === 'aceita' 
                          ? 'Aceita' 
                          : proposta.status === 'recusada'
                            ? 'Recusada'
                            : 'Pendente'
                        }
                      </span>
                      
                      {proposta.status === 'pendente' && (
                        <div className="ml-auto space-x-2">
                          <button className="bg-[#4CAF50] text-white px-3 py-1 rounded-md text-sm hover:bg-[#43a047]">
                            Aceitar
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-50">
                            Recusar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'estatisticas' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-6">Estatísticas do Anúncio</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <FaEye className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{anuncio.estatisticas.visualizacoes}</p>
                    <p className="text-sm text-gray-500">Visualizações</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                    <FaBell className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{anuncio.estatisticas.propostas}</p>
                    <p className="text-sm text-gray-500">Propostas</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                    <FaShare className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{anuncio.estatisticas.compartilhamentos}</p>
                    <p className="text-sm text-gray-500">Compartilhamentos</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mr-3">
                    <FaChartLine className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{anuncio.estatisticas.salvos}</p>
                    <p className="text-sm text-gray-500">Salvos</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-800 mb-3">Desempenho do anúncio</h4>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-8">
              <span className="text-gray-500">Gráfico de desempenho (simulado)</span>
            </div>
            
            <div className="flex justify-end">
              <button className="bg-[#4CAF50] text-white px-4 py-2 rounded-md text-sm hover:bg-[#43a047]">
                Exportar relatório
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 