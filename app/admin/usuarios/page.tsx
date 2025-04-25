'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserEdit, FaUserTimes, FaUserCheck, FaEnvelope, FaPhone, FaEye } from 'react-icons/fa';

type Usuario = {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  dataRegistro: string;
  ultimoLogin: string;
  status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado';
  tipo: 'proprietario' | 'corretor' | 'admin';
  imoveisCadastrados: number;
  planoAtual: string;
  verificado: boolean;
};

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [showDetalhes, setShowDetalhes] = useState<boolean>(false);

  // Carregar dados dos usuários
  useEffect(() => {
    const carregarUsuarios = () => {
      // Simulação de chamada à API
      setTimeout(() => {
        const mockUsuarios: Usuario[] = [
          {
            id: '1',
            nome: 'João',
            sobrenome: 'Silva',
            email: 'joao.silva@exemplo.com',
            telefone: '(11) 98765-4321',
            dataRegistro: '2023-06-15',
            ultimoLogin: '2023-09-20',
            status: 'ativo',
            tipo: 'proprietario',
            imoveisCadastrados: 3,
            planoAtual: 'Básico',
            verificado: true
          },
          {
            id: '2',
            nome: 'Maria',
            sobrenome: 'Santos',
            email: 'maria.santos@exemplo.com',
            telefone: '(21) 98765-4322',
            dataRegistro: '2023-07-10',
            ultimoLogin: '2023-09-18',
            status: 'ativo',
            tipo: 'corretor',
            imoveisCadastrados: 12,
            planoAtual: 'Premium',
            verificado: true
          },
          {
            id: '3',
            nome: 'Carlos',
            sobrenome: 'Oliveira',
            email: 'carlos.oliveira@exemplo.com',
            telefone: '(31) 98765-4323',
            dataRegistro: '2023-08-05',
            ultimoLogin: '2023-09-19',
            status: 'pendente',
            tipo: 'proprietario',
            imoveisCadastrados: 1,
            planoAtual: 'Experimental',
            verificado: false
          },
          {
            id: '4',
            nome: 'Ana',
            sobrenome: 'Souza',
            email: 'ana.souza@exemplo.com',
            telefone: '(41) 98765-4324',
            dataRegistro: '2023-05-20',
            ultimoLogin: '2023-08-30',
            status: 'inativo',
            tipo: 'proprietario',
            imoveisCadastrados: 0,
            planoAtual: 'Nenhum',
            verificado: true
          },
          {
            id: '5',
            nome: 'Roberto',
            sobrenome: 'Alves',
            email: 'roberto.alves@exemplo.com',
            telefone: '(51) 98765-4325',
            dataRegistro: '2023-09-01',
            ultimoLogin: '2023-09-15',
            status: 'bloqueado',
            tipo: 'corretor',
            imoveisCadastrados: 5,
            planoAtual: 'Intermediário',
            verificado: true
          },
          {
            id: '6',
            nome: 'Admin',
            sobrenome: 'Sistema',
            email: 'admin@permutem.com.br',
            telefone: '(11) 99999-9999',
            dataRegistro: '2023-01-01',
            ultimoLogin: '2023-09-21',
            status: 'ativo',
            tipo: 'admin',
            imoveisCadastrados: 0,
            planoAtual: 'N/A',
            verificado: true
          },
          {
            id: '7',
            nome: 'Fernanda',
            sobrenome: 'Costa',
            email: 'fernanda.costa@exemplo.com',
            telefone: '(21) 98765-4326',
            dataRegistro: '2023-08-15',
            ultimoLogin: '2023-09-10',
            status: 'ativo',
            tipo: 'proprietario',
            imoveisCadastrados: 2,
            planoAtual: 'Básico',
            verificado: true
          }
        ];

        setUsuarios(mockUsuarios);
        setLoading(false);
      }, 1000);
    };

    carregarUsuarios();
  }, []);

  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Filtrar usuários
  const usuariosFiltrados = usuarios.filter(usuario => {
    // Filtrar por status
    if (filtroStatus !== 'todos' && usuario.status !== filtroStatus) {
      return false;
    }

    // Filtrar por tipo
    if (filtroTipo !== 'todos' && usuario.tipo !== filtroTipo) {
      return false;
    }

    // Filtrar por busca
    if (busca) {
      const termoBuscaLower = busca.toLowerCase();
      return (
        usuario.nome.toLowerCase().includes(termoBuscaLower) ||
        usuario.sobrenome.toLowerCase().includes(termoBuscaLower) ||
        usuario.email.toLowerCase().includes(termoBuscaLower) ||
        usuario.telefone.includes(busca)
      );
    }

    return true;
  });

  // Alterar status do usuário
  const alterarStatusUsuario = (id: string, novoStatus: 'ativo' | 'inativo' | 'pendente' | 'bloqueado') => {
    setUsuarios(
      usuarios.map(usuario =>
        usuario.id === id ? { ...usuario, status: novoStatus } : usuario
      )
    );
    
    if (usuarioSelecionado?.id === id) {
      setUsuarioSelecionado({
        ...usuarioSelecionado,
        status: novoStatus
      });
    }
  };

  // Modal de detalhes do usuário
  const ModalDetalhesUsuario = () => {
    if (!usuarioSelecionado) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold">Detalhes do Usuário</h3>
            <button
              onClick={() => setShowDetalhes(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-medium">{usuarioSelecionado.nome} {usuarioSelecionado.sobrenome}</h4>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                usuarioSelecionado.status === 'ativo' ? 'bg-green-100 text-green-800' :
                usuarioSelecionado.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                usuarioSelecionado.status === 'bloqueado' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {usuarioSelecionado.status.charAt(0).toUpperCase() + usuarioSelecionado.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <FaEnvelope className="mr-2" />
              {usuarioSelecionado.email}
              {usuarioSelecionado.verificado && (
                <span className="ml-2 text-green-600 text-xs font-medium">✓ Verificado</span>
              )}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <FaPhone className="mr-2" />
              {usuarioSelecionado.telefone}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">Tipo de Usuário</h5>
              <p className="font-medium">{usuarioSelecionado.tipo.charAt(0).toUpperCase() + usuarioSelecionado.tipo.slice(1)}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">Plano Atual</h5>
              <p className="font-medium">{usuarioSelecionado.planoAtual}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">Data de Registro</h5>
              <p>{formatarData(usuarioSelecionado.dataRegistro)}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">Último Login</h5>
              <p>{formatarData(usuarioSelecionado.ultimoLogin)}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">Imóveis Cadastrados</h5>
              <p>{usuarioSelecionado.imoveisCadastrados}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h5 className="text-sm font-medium text-gray-500 mb-3">Ações</h5>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => alterarStatusUsuario(usuarioSelecionado.id, 'ativo')}
                disabled={usuarioSelecionado.status === 'ativo'}
                className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
                  usuarioSelecionado.status === 'ativo' 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <FaUserCheck className="mr-1" />
                Ativar
              </button>
              
              <button 
                onClick={() => alterarStatusUsuario(usuarioSelecionado.id, 'inativo')}
                disabled={usuarioSelecionado.status === 'inativo'}
                className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
                  usuarioSelecionado.status === 'inativo' 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                <FaUserEdit className="mr-1" />
                Inativar
              </button>
              
              <button 
                onClick={() => alterarStatusUsuario(usuarioSelecionado.id, 'bloqueado')}
                disabled={usuarioSelecionado.status === 'bloqueado'}
                className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
                  usuarioSelecionado.status === 'bloqueado' 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                <FaUserTimes className="mr-1" />
                Bloquear
              </button>

              <button 
                onClick={() => alert('Funcionalidade de envio de e-mail não implementada')}
                className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center"
              >
                <FaEnvelope className="mr-1" />
                Enviar E-mail
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
        <h1 className="text-2xl font-bold text-gray-800">Gestão de Usuários</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuário..."
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
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
            <option value="pendente">Pendentes</option>
            <option value="bloqueado">Bloqueados</option>
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="todos">Todos os tipos</option>
            <option value="proprietario">Proprietários</option>
            <option value="corretor">Corretores</option>
            <option value="admin">Administradores</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaUserTimes className="text-gray-400 w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhum usuário encontrado</h2>
          <p className="text-gray-500">
            Nenhum usuário corresponde aos critérios de busca e filtros aplicados.
          </p>
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
                  Contato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registro
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
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                        {usuario.nome.charAt(0)}{usuario.sobrenome.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.nome} {usuario.sobrenome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {usuario.planoAtual}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{usuario.email}</div>
                    <div className="text-sm text-gray-500">{usuario.telefone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.tipo === 'proprietario' ? 'bg-blue-100 text-blue-800' :
                      usuario.tipo === 'corretor' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatarData(usuario.dataRegistro)}</div>
                    <div className="text-sm text-gray-500">
                      Último acesso: {formatarData(usuario.ultimoLogin)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.status === 'ativo' ? 'bg-green-100 text-green-800' :
                      usuario.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      usuario.status === 'bloqueado' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {usuario.status.charAt(0).toUpperCase() + usuario.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setUsuarioSelecionado(usuario);
                        setShowDetalhes(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Ver detalhes"
                    >
                      <FaEye className="h-5 w-5" />
                    </button>

                    {usuario.status !== 'ativo' && (
                      <button
                        onClick={() => alterarStatusUsuario(usuario.id, 'ativo')}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Ativar usuário"
                      >
                        <FaUserCheck className="h-5 w-5" />
                      </button>
                    )}

                    {usuario.status !== 'bloqueado' && (
                      <button
                        onClick={() => alterarStatusUsuario(usuario.id, 'bloqueado')}
                        className="text-red-600 hover:text-red-900"
                        title="Bloquear usuário"
                      >
                        <FaUserTimes className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDetalhes && <ModalDetalhesUsuario />}
    </>
  );
} 