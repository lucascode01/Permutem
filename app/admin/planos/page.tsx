'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaCheck, FaTimes } from 'react-icons/fa';

type Plano = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  periodo: 'mensal';
  recursos: string[];
  ativo: boolean;
  destaque: boolean;
  ordem: number;
  tipo_usuario?: 'proprietario' | 'corretor' | 'admin';
  limite_imoveis?: number;
  preco_personalizado?: boolean;
};

type Assinatura = {
  id: string;
  usuarioId: string;
  usuario: string;
  planoId: string;
  plano: string;
  dataInicio: string;
  dataFim: string;
  status: 'ativa' | 'pendente' | 'cancelada' | 'expirada';
  renovacaoAutomatica: boolean;
  valorPago: number;
  ultimoPagamento: string;
};

export default function PlanosAdminPage() {
  const [activeTab, setActiveTab] = useState<'planos' | 'assinaturas'>('planos');
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [planoEditando, setPlanoEditando] = useState<Plano | null>(null);
  const [busca, setBusca] = useState<string>('');

  // Carregar dados
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Simular chamada à API
        setTimeout(() => {
          // Mock de planos
          const mockPlanos: Plano[] = [
            {
              id: '1',
              nome: 'Básico',
              descricao: 'Ideal para pequenos proprietários',
              preco: 29.90,
              periodo: 'mensal',
              recursos: [
                'Até 3 imóveis cadastrados',
                'Visualização de propostas',
                'Suporte por email'
              ],
              ativo: true,
              destaque: false,
              ordem: 1
            },
            {
              id: '2',
              nome: 'Intermediário',
              descricao: 'Perfeito para quem deseja mais opções',
              preco: 59.90,
              periodo: 'mensal',
              recursos: [
                'Até 10 imóveis cadastrados',
                'Visualização de propostas',
                'Destaque na busca',
                'Suporte prioritário'
              ],
              ativo: true,
              destaque: true,
              ordem: 2
            },
            {
              id: '3',
              nome: 'Premium',
              descricao: 'Para profissionais e corretores',
              preco: 99.90,
              periodo: 'mensal',
              recursos: [
                'Imóveis ilimitados',
                'Visualização de propostas',
                'Destaque na busca',
                'Análise de mercado',
                'Suporte 24/7',
                'Certificação de anúncios'
              ],
              ativo: true,
              destaque: false,
              ordem: 3
            },
            {
              id: '4',
              nome: 'Experimental',
              descricao: 'Teste nossa plataforma gratuitamente',
              preco: 0,
              periodo: 'mensal',
              recursos: [
                'Até 1 imóvel cadastrado',
                'Visualização limitada',
                'Período de 14 dias'
              ],
              ativo: false,
              destaque: false,
              ordem: 4
            }
          ];

          // Mock de assinaturas
          const mockAssinaturas: Assinatura[] = [
            {
              id: '1',
              usuarioId: 'user1',
              usuario: 'João Silva',
              planoId: '2',
              plano: 'Intermediário',
              dataInicio: '2023-08-15',
              dataFim: '2023-09-15',
              status: 'ativa',
              renovacaoAutomatica: true,
              valorPago: 59.90,
              ultimoPagamento: '2023-08-15'
            },
            {
              id: '2',
              usuarioId: 'user2',
              usuario: 'Maria Santos',
              planoId: '3',
              plano: 'Premium',
              dataInicio: '2023-07-10',
              dataFim: '2023-08-10',
              status: 'expirada',
              renovacaoAutomatica: false,
              valorPago: 99.90,
              ultimoPagamento: '2023-07-10'
            },
            {
              id: '3',
              usuarioId: 'user3',
              usuario: 'Carlos Oliveira',
              planoId: '1',
              plano: 'Básico',
              dataInicio: '2023-09-01',
              dataFim: '2023-10-01',
              status: 'ativa',
              renovacaoAutomatica: true,
              valorPago: 29.90,
              ultimoPagamento: '2023-09-01'
            },
            {
              id: '4',
              usuarioId: 'user4',
              usuario: 'Ana Souza',
              planoId: '2',
              plano: 'Intermediário',
              dataInicio: '2023-08-20',
              dataFim: '2023-09-20',
              status: 'pendente',
              renovacaoAutomatica: true,
              valorPago: 59.90,
              ultimoPagamento: '2023-08-20'
            },
            {
              id: '5',
              usuarioId: 'user5',
              usuario: 'Roberto Alves',
              planoId: '3',
              plano: 'Premium',
              dataInicio: '2023-08-10',
              dataFim: '2023-09-10',
              status: 'cancelada',
              renovacaoAutomatica: false,
              valorPago: 99.90,
              ultimoPagamento: '2023-08-10'
            },
          ];

          setPlanos(mockPlanos);
          setAssinaturas(mockAssinaturas);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    };

    carregarDados();
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
    return data.toLocaleDateString('pt-BR');
  };

  // Filtrar planos por busca
  const planosFiltrados = planos.filter(plano => 
    plano.nome.toLowerCase().includes(busca.toLowerCase()) ||
    plano.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  // Filtrar assinaturas por busca
  const assinaturasFiltradas = assinaturas.filter(assinatura =>
    assinatura.usuario.toLowerCase().includes(busca.toLowerCase()) ||
    assinatura.plano.toLowerCase().includes(busca.toLowerCase())
  );

  // Toggle ativo/inativo
  const toggleAtivoPlano = (id: string) => {
    setPlanos(planos.map(plano =>
      plano.id === id ? { ...plano, ativo: !plano.ativo } : plano
    ));
  };

  // Toggle destaque
  const toggleDestaquePlano = (id: string) => {
    setPlanos(planos.map(plano =>
      plano.id === id ? { ...plano, destaque: !plano.destaque } : plano
    ));
  };

  // Abrir modal para editar plano
  const abrirModalEditarPlano = (plano: Plano) => {
    setPlanoEditando({ ...plano });
    setShowModal(true);
  };

  // Abrir modal para novo plano
  const abrirModalNovoPlano = () => {
    setPlanoEditando({
      id: '',
      nome: '',
      descricao: '',
      preco: 0,
      periodo: 'mensal',
      recursos: [''],
      ativo: true,
      destaque: false,
      ordem: planos.length + 1
    });
    setShowModal(true);
  };

  // Salvar plano
  const salvarPlano = () => {
    if (!planoEditando) return;

    if (planoEditando.id) {
      // Atualizar plano existente
      setPlanos(planos.map(plano =>
        plano.id === planoEditando.id ? planoEditando : plano
      ));
    } else {
      // Criar novo plano
      const novoPlano = {
        ...planoEditando,
        id: (planos.length + 1).toString()
      };
      setPlanos([...planos, novoPlano]);
    }

    setShowModal(false);
    setPlanoEditando(null);
  };

  // Excluir plano
  const excluirPlano = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      setPlanos(planos.filter(plano => plano.id !== id));
    }
  };

  // Modal para editar/criar plano
  const ModalPlano = () => {
    if (!planoEditando) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold">
              {planoEditando.id ? 'Editar Plano' : 'Novo Plano'}
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Plano</label>
              <input
                type="text"
                value={planoEditando.nome}
                onChange={(e) => setPlanoEditando({ ...planoEditando, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={planoEditando.descricao}
                onChange={(e) => setPlanoEditando({ ...planoEditando, descricao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  value={planoEditando.preco}
                  onChange={(e) => setPlanoEditando({ ...planoEditando, preco: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                <select
                  value={planoEditando.periodo}
                  onChange={(e) => setPlanoEditando({ ...planoEditando, periodo: e.target.value as 'mensal' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="mensal">Mensal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recursos (um por linha)</label>
              <textarea
                value={planoEditando.recursos.join('\n')}
                onChange={(e) => setPlanoEditando({ ...planoEditando, recursos: e.target.value.split('\n').filter(r => r.trim() !== '') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                rows={5}
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={planoEditando.ativo}
                  onChange={(e) => setPlanoEditando({ ...planoEditando, ativo: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">Ativo</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="destaque"
                  checked={planoEditando.destaque}
                  onChange={(e) => setPlanoEditando({ ...planoEditando, destaque: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="destaque" className="ml-2 block text-sm text-gray-700">Destaque</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordem de exibição</label>
              <input
                type="number"
                value={planoEditando.ordem}
                onChange={(e) => setPlanoEditando({ ...planoEditando, ordem: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={salvarPlano}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Gestão de Planos e Assinaturas</h1>
        <div className="flex items-center space-x-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('planos')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'planos'
                  ? 'bg-primary text-white rounded-l-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border rounded-l-md'
              }`}
            >
              Planos
            </button>
            <button
              onClick={() => setActiveTab('assinaturas')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'assinaturas'
                  ? 'bg-primary text-white rounded-r-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border rounded-r-md'
              }`}
            >
              Assinaturas
            </button>
          </div>

          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {activeTab === 'planos' && (
            <button
              onClick={abrirModalNovoPlano}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Novo Plano
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : activeTab === 'planos' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recursos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {planosFiltrados.map((plano) => (
                <tr key={plano.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start flex-col">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{plano.nome}</div>
                        {plano.destaque && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Destaque
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{plano.descricao}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatarPreco(plano.preco)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="text-sm text-gray-500 list-disc list-inside">
                      {plano.recursos.map((recurso, index) => (
                        <li key={index} className="truncate max-w-xs">{recurso}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAtivoPlano(plano.id)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plano.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {plano.ativo ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => abrirModalEditarPlano(plano)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => excluirPlano(plano.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plano
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renovação
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assinaturasFiltradas.map((assinatura) => (
                <tr key={assinatura.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{assinatura.usuario}</div>
                    <div className="text-sm text-gray-500">ID: {assinatura.usuarioId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{assinatura.plano}</div>
                    <div className="text-sm text-gray-500">{formatarPreco(assinatura.valorPago)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatarData(assinatura.dataInicio)} - {formatarData(assinatura.dataFim)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Último pagamento: {formatarData(assinatura.ultimoPagamento)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      assinatura.status === 'ativa' ? 'bg-green-100 text-green-800' :
                      assinatura.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      assinatura.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {assinatura.status.charAt(0).toUpperCase() + assinatura.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {assinatura.renovacaoAutomatica ? (
                      <span className="flex items-center text-green-600">
                        <FaCheck className="mr-1" /> Automática
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <FaTimes className="mr-1" /> Manual
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <ModalPlano />}
    </>
  );
} 