'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaBuilding, FaEye, FaCheckCircle, FaTimesCircle, FaEdit, FaBan, FaStar } from 'react-icons/fa';
import Image from 'next/image';
import { useSupabase } from '@/app/contexts/SupabaseContext';
import { toast } from 'react-hot-toast';
import type { Types } from '@/app/lib/supabase';

// Tipo estendido que combina o Imovel do Supabase com informações de proprietário
type ImovelComProprietario = Types.Imovel & {
  proprietario?: {
    id: string;
    nome: string;
    email: string;
  };
  // Campos adicionais para compatibilidade com o restante do código
  localizacao?: string;
  imagens?: string[];
  aceita_permuta?: boolean;
  data_cadastro?: string;
};

export default function ImoveisAdminPage() {
  const { imoveis, usuarios, alterarStatusImovel, alterarDestaqueImovel, isLoading, recarregarImoveis, recarregarUsuarios } = useSupabase();
  
  const [imoveisProcessados, setImoveisProcessados] = useState<ImovelComProprietario[]>([]);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [imovelSelecionado, setImovelSelecionado] = useState<ImovelComProprietario | null>(null);
  const [showDetalhes, setShowDetalhes] = useState<boolean>(false);
  const [processandoAcao, setProcessandoAcao] = useState<string | null>(null);

  // Processar imóveis e adicionar informações de proprietário
  useEffect(() => {
    if (!isLoading && imoveis.length > 0 && usuarios.length > 0) {
      const imoveisComDono = imoveis.map(imovel => {
        const proprietario = usuarios.find(u => u.id === imovel.user_id);
        // Criar um objeto com campos adicionais para compatibilidade
        const imagens = imovel.fotos || [];
        const localizacao = imovel.endereco ? 
          `${imovel.endereco.cidade}, ${imovel.endereco.uf}` : 'Localização não informada';
        
        return {
          ...imovel,
          proprietario: proprietario ? {
            id: proprietario.id,
            nome: `${proprietario.primeiro_nome} ${proprietario.ultimo_nome}`,
            email: proprietario.email
          } : undefined,
          localizacao,
          imagens,
          aceita_permuta: imovel.finalidade === 'permuta' || imovel.finalidade === 'ambos',
          data_cadastro: imovel.criado_em
        };
      });
      
      setImoveisProcessados(imoveisComDono);
    }
  }, [imoveis, usuarios, isLoading]);

  // Carregar dados iniciais se necessário
  useEffect(() => {
    const carregarDados = async () => {
      try {
        if (imoveis.length === 0) await recarregarImoveis();
        if (usuarios.length === 0) await recarregarUsuarios();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Não foi possível carregar os dados dos imóveis');
      }
    };
    
    if (!isLoading) {
      carregarDados();
    }
  }, [isLoading, imoveis.length, usuarios.length, recarregarImoveis, recarregarUsuarios]);

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

  // Filtrar imóveis
  const imoveisFiltrados = imoveisProcessados.filter(imovel => {
    // Filtrar por status
    if (filtroStatus !== 'todos' && imovel.status !== filtroStatus) {
      return false;
    }

    // Filtrar por tipo
    if (filtroTipo !== 'todos' && imovel.tipo !== filtroTipo) {
      return false;
    }

    // Filtrar por busca
    if (busca) {
      const termoBuscaLower = busca.toLowerCase();
      return (
        imovel.titulo.toLowerCase().includes(termoBuscaLower) ||
        (imovel.localizacao?.toLowerCase().includes(termoBuscaLower) || false) ||
        (imovel.proprietario?.nome.toLowerCase().includes(termoBuscaLower) || false)
      );
    }

    return true;
  });

  // Tipos de imóveis únicos para o filtro
  const tiposImoveis = Array.from(new Set(imoveisProcessados.map(imovel => imovel.tipo)));

  // Alterar status do imóvel no Supabase
  const handleAlterarStatus = async (id: string, novoStatus: 'ativo' | 'inativo' | 'vendido' | 'permutado') => {
    try {
      setProcessandoAcao(`status-${id}`);
      // Mapear os status da interface para os status do tipo Imovel
      const statusMap: Record<string, 'ativo' | 'inativo' | 'vendido' | 'permutado'> = {
        'aprovado': 'ativo',
        'pendente': 'inativo',
        'reprovado': 'inativo',
        'pausado': 'inativo'
      };
      
      const statusImovel = statusMap[novoStatus];
      const sucesso = await alterarStatusImovel(id, statusImovel);
      
      if (sucesso) {
        // Status já foi atualizado pelo context
        if (imovelSelecionado?.id === id) {
          setImovelSelecionado({
            ...imovelSelecionado,
            status: novoStatus as any // Forçar tipo para compatibilidade
          });
        }
        toast.success(`Status do imóvel alterado para ${novoStatus}`);
      } else {
        toast.error('Erro ao alterar status do imóvel');
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Não foi possível alterar o status do imóvel');
    } finally {
      setProcessandoAcao(null);
    }
  };

  // Alternar destaque do imóvel no Supabase
  const handleAlternarDestaque = async (id: string, destacadoAtual: boolean) => {
    try {
      setProcessandoAcao(`destaque-${id}`);
      const sucesso = await alterarDestaqueImovel(id, !destacadoAtual);
      
      if (sucesso) {
        // Destaque já foi atualizado pelo context
        if (imovelSelecionado?.id === id) {
          setImovelSelecionado({
            ...imovelSelecionado,
            destaque: !destacadoAtual
          });
        }
        
        const acao = !destacadoAtual ? 'adicionado aos destaques' : 'removido dos destaques';
        toast.success(`Imóvel ${acao}`);
      } else {
        toast.error('Erro ao alterar destaque do imóvel');
      }
    } catch (error) {
      console.error('Erro ao alterar destaque:', error);
      toast.error('Não foi possível alterar o destaque do imóvel');
    } finally {
      setProcessandoAcao(null);
    }
  };

  // Abrir modal de detalhes
  const mostrarDetalhes = (imovel: ImovelComProprietario) => {
    setImovelSelecionado(imovel);
    setShowDetalhes(true);
  };

  // Modal de detalhes do imóvel
  const ModalDetalhesImovel = () => {
    if (!imovelSelecionado) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold">Detalhes do Imóvel</h3>
            <button
              onClick={() => setShowDetalhes(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                {imovelSelecionado.imagens && imovelSelecionado.imagens.length > 0 && (
                  <Image
                    src={imovelSelecionado.imagens[0]}
                    alt={imovelSelecionado.titulo}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {imovelSelecionado.imagens && imovelSelecionado.imagens.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded overflow-hidden">
                    <Image
                      src={img}
                      alt={`Imagem ${idx + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {imovelSelecionado.imagens && imovelSelecionado.imagens.length > 5 && (
                  <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium">+{imovelSelecionado.imagens.length - 5}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">{imovelSelecionado.titulo}</h3>
              <p className="text-gray-600 mb-4">{imovelSelecionado.localizacao}</p>

              <div className="mb-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Tipo</span>
                  <span className="font-medium">{imovelSelecionado.tipo}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Preço</span>
                  <span className="font-medium">{formatarPreco(imovelSelecionado.preco)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Área</span>
                  <span className="font-medium">{imovelSelecionado.area} m²</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Quartos</span>
                  <span className="font-medium">{imovelSelecionado.quartos}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Banheiros</span>
                  <span className="font-medium">{imovelSelecionado.banheiros}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Aceita Permuta</span>
                  <span className="font-medium">{imovelSelecionado.aceita_permuta ? 'Sim' : 'Não'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Data de Cadastro</span>
                  <span className="font-medium">{formatarData(imovelSelecionado.data_cadastro || '')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${
                    imovelSelecionado.status === 'ativo' ? 'text-green-600' : 
                    imovelSelecionado.status === 'inativo' ? 'text-yellow-600' : 
                    imovelSelecionado.status === 'vendido' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {imovelSelecionado.status.charAt(0).toUpperCase() + imovelSelecionado.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Destaque</span>
                  <span className="font-medium">{imovelSelecionado.destaque ? 'Sim' : 'Não'}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-bold mb-2">Proprietário</h4>
                <div className="border rounded-lg p-3">
                  <p><span className="font-medium">Nome:</span> {imovelSelecionado.proprietario?.nome || 'Não informado'}</p>
                  <p><span className="font-medium">Email:</span> {imovelSelecionado.proprietario?.email || 'Não informado'}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                <button
                  onClick={() => handleAlterarStatus(imovelSelecionado.id, 'ativo')}
                  disabled={processandoAcao === `status-${imovelSelecionado.id}` || imovelSelecionado.status === 'ativo'}
                  className={`px-3 py-2 rounded ${
                    imovelSelecionado.status === 'ativo' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
                  } flex items-center`}
                >
                  <FaCheckCircle className="mr-1" /> {processandoAcao === `status-${imovelSelecionado.id}` ? 'Processando...' : 'Ativar'}
                </button>
                <button
                  onClick={() => handleAlterarStatus(imovelSelecionado.id, 'inativo')}
                  disabled={processandoAcao === `status-${imovelSelecionado.id}` || imovelSelecionado.status === 'inativo'}
                  className={`px-3 py-2 rounded ${
                    imovelSelecionado.status === 'inativo' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  } flex items-center`}
                >
                  <FaFilter className="mr-1" /> {processandoAcao === `status-${imovelSelecionado.id}` ? 'Processando...' : 'Inativar'}
                </button>
                <button
                  onClick={() => handleAlterarStatus(imovelSelecionado.id, 'vendido')}
                  disabled={processandoAcao === `status-${imovelSelecionado.id}` || imovelSelecionado.status === 'vendido'}
                  className={`px-3 py-2 rounded ${
                    imovelSelecionado.status === 'vendido' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
                  } flex items-center`}
                >
                  <FaTimesCircle className="mr-1" /> {processandoAcao === `status-${imovelSelecionado.id}` ? 'Processando...' : 'Marcar como Vendido'}
                </button>
                <button
                  onClick={() => handleAlterarStatus(imovelSelecionado.id, 'permutado')}
                  disabled={processandoAcao === `status-${imovelSelecionado.id}` || imovelSelecionado.status === 'permutado'}
                  className={`px-3 py-2 rounded ${
                    imovelSelecionado.status === 'permutado' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600 text-white'
                  } flex items-center`}
                >
                  <FaBan className="mr-1" /> {processandoAcao === `status-${imovelSelecionado.id}` ? 'Processando...' : 'Marcar como Permutado'}
                </button>
                <button
                  onClick={() => handleAlternarDestaque(imovelSelecionado.id, imovelSelecionado.destaque || false)}
                  disabled={processandoAcao === `destaque-${imovelSelecionado.id}`}
                  className={`px-3 py-2 rounded ${
                    imovelSelecionado.destaque ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white flex items-center`}
                >
                  <FaStar className="mr-1" /> 
                  {processandoAcao === `destaque-${imovelSelecionado.id}` ? 'Processando...' : 
                   imovelSelecionado.destaque ? 'Remover Destaque' : 'Destacar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gerenciar Imóveis</h1>
      
      {/* Filtros e busca */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por título, localização ou proprietário..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="todos">Todos os Status</option>
            <option value="aprovado">Aprovados</option>
            <option value="pendente">Pendentes</option>
            <option value="reprovado">Reprovados</option>
            <option value="pausado">Pausados</option>
          </select>
          
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="todos">Todos os Tipos</option>
            {tiposImoveis.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Tabela de imóveis */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 text-left">Imóvel</th>
              <th className="py-3 px-4 text-left">Proprietário</th>
              <th className="py-3 px-4 text-left">Localização</th>
              <th className="py-3 px-4 text-left">Preço</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Destaque</th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {imoveisFiltrados.length > 0 ? (
              imoveisFiltrados.map((imovel) => (
                <tr key={imovel.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 rounded overflow-hidden bg-gray-200 mr-3">
                        {imovel.imagens && imovel.imagens.length > 0 && (
                          <Image
                            src={imovel.imagens[0]}
                            alt={imovel.titulo}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{imovel.titulo}</p>
                        <p className="text-xs text-gray-500">{imovel.tipo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{imovel.proprietario?.nome || 'Não informado'}</p>
                    <p className="text-xs text-gray-500">{imovel.proprietario?.email || ''}</p>
                  </td>
                  <td className="py-3 px-4">{imovel.localizacao}</td>
                  <td className="py-3 px-4">{formatarPreco(imovel.preco)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      imovel.status === 'aprovado' ? 'bg-green-100 text-green-800' : 
                      imovel.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                      imovel.status === 'reprovado' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {imovel.status.charAt(0).toUpperCase() + imovel.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      imovel.destaque ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {imovel.destaque ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => mostrarDetalhes(imovel)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Ver detalhes"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleAlternarDestaque(imovel.id, imovel.destaque || false)}
                        disabled={processandoAcao === `destaque-${imovel.id}`}
                        className={`p-1 ${
                          imovel.destaque ? 'text-orange-600 hover:text-orange-800' : 'text-gray-600 hover:text-gray-800'
                        } transition-colors`}
                        title={imovel.destaque ? 'Remover destaque' : 'Destacar imóvel'}
                      >
                        <FaStar />
                      </button>
                      {imovel.status !== 'aprovado' && (
                        <button
                          onClick={() => handleAlterarStatus(imovel.id, 'aprovado')}
                          disabled={processandoAcao === `status-${imovel.id}`}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                          title="Aprovar"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                      {imovel.status !== 'reprovado' && (
                        <button
                          onClick={() => handleAlterarStatus(imovel.id, 'reprovado')}
                          disabled={processandoAcao === `status-${imovel.id}`}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="Reprovar"
                        >
                          <FaTimesCircle />
                        </button>
                      )}
                      {imovel.status !== 'pausado' && (
                        <button
                          onClick={() => handleAlterarStatus(imovel.id, 'pausado')}
                          disabled={processandoAcao === `status-${imovel.id}`}
                          className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                          title="Pausar"
                        >
                          <FaBan />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  Nenhum imóvel encontrado com os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal de detalhes */}
      {showDetalhes && <ModalDetalhesImovel />}
    </div>
  );
} 