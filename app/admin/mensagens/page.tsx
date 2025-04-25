'use client';

import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaTrashAlt, FaReply, FaSearch, FaFilter } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import HydrationFix, { ClientOnly } from '@/app/components/HydrationFix';

type Mensagem = {
  id: string;
  de: {
    id: string;
    nome: string;
    email: string;
    avatar?: string;
  };
  para: {
    id: string;
    nome: string;
    email: string;
    avatar?: string;
  };
  assunto: string;
  conteudo: string;
  dataEnvio: Date;
  lida: boolean;
  importante: boolean;
  tipo: 'suporte' | 'contato' | 'sistema' | 'proposta';
};

export default function MensagensPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [mensagemSelecionada, setMensagemSelecionada] = useState<Mensagem | null>(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [respostaTexto, setRespostaTexto] = useState('');
  const [mostrarFormResposta, setMostrarFormResposta] = useState(false);

  useEffect(() => {
    // Simulação de carregamento de dados da API
    const carregarMensagens = async () => {
      setIsLoading(true);

      // Simula um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dados mockados
      const mockMensagens: Mensagem[] = [
        {
          id: '1',
          de: {
            id: 'user1',
            nome: 'Marina Silva',
            email: 'marina.silva@exemplo.com',
            avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
          },
          para: {
            id: 'admin',
            nome: 'Suporte Permutem',
            email: 'suporte@permutem.com'
          },
          assunto: 'Dúvida sobre proposta de permuta',
          conteudo: 'Olá, gostaria de saber como posso aceitar uma proposta de permuta que recebi. Não estou encontrando essa opção no sistema. Poderiam me ajudar?',
          dataEnvio: new Date('2023-09-15T14:35:00'),
          lida: true,
          importante: true,
          tipo: 'suporte'
        },
        {
          id: '2',
          de: {
            id: 'user2',
            nome: 'Carlos Oliveira',
            email: 'carlos.oliveira@exemplo.com',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          para: {
            id: 'admin',
            nome: 'Suporte Permutem',
            email: 'suporte@permutem.com'
          },
          assunto: 'Problema com upload de imagens',
          conteudo: 'Estou tentando cadastrar meu imóvel, mas não consigo fazer upload das fotos. O sistema dá um erro quando tento anexar mais de 3 imagens.',
          dataEnvio: new Date('2023-09-14T09:22:00'),
          lida: false,
          importante: true,
          tipo: 'suporte'
        },
        {
          id: '3',
          de: {
            id: 'sistema',
            nome: 'Sistema Permutem',
            email: 'sistema@permutem.com'
          },
          para: {
            id: 'user3',
            nome: 'Ana Beatriz',
            email: 'ana.beatriz@exemplo.com'
          },
          assunto: 'Novo cadastro de usuário',
          conteudo: 'Foi detectado um novo cadastro de usuário no sistema. Nome: João Paulo, Email: joao.paulo@exemplo.com. Favor verificar.',
          dataEnvio: new Date('2023-09-13T16:45:00'),
          lida: true,
          importante: false,
          tipo: 'sistema'
        },
        {
          id: '4',
          de: {
            id: 'user4',
            nome: 'Roberto Santos',
            email: 'roberto.santos@exemplo.com',
            avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
          },
          para: {
            id: 'admin',
            nome: 'Contato Permutem',
            email: 'contato@permutem.com'
          },
          assunto: 'Interesse em parceria comercial',
          conteudo: 'Sou proprietário de uma imobiliária e tenho interesse em formar uma parceria com a plataforma Permutem. Como podemos iniciar essa conversa?',
          dataEnvio: new Date('2023-09-12T10:15:00'),
          lida: true,
          importante: true,
          tipo: 'contato'
        },
        {
          id: '5',
          de: {
            id: 'user5',
            nome: 'Juliana Mendes',
            email: 'juliana.mendes@exemplo.com',
            avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
          },
          para: {
            id: 'admin',
            nome: 'Suporte Permutem',
            email: 'suporte@permutem.com'
          },
          assunto: 'Dúvida sobre taxas do sistema',
          conteudo: 'Olá, gostaria de entender melhor como funcionam as taxas para anunciar na plataforma e se há custos adicionais quando uma permuta é concretizada.',
          dataEnvio: new Date('2023-09-11T15:20:00'),
          lida: false,
          importante: false,
          tipo: 'suporte'
        },
        {
          id: '6',
          de: {
            id: 'sistema',
            nome: 'Sistema Permutem',
            email: 'sistema@permutem.com'
          },
          para: {
            id: 'admin',
            nome: 'Administrador',
            email: 'admin@permutem.com'
          },
          assunto: 'Nova proposta de permuta registrada',
          conteudo: 'Uma nova proposta de permuta foi registrada. Imóvel A: Apartamento em Copacabana (ID: 1234), Imóvel B: Casa em Niterói (ID: 5678).',
          dataEnvio: new Date('2023-09-10T08:30:00'),
          lida: true,
          importante: false,
          tipo: 'proposta'
        }
      ];

      setMensagens(mockMensagens);
      setIsLoading(false);
    };

    carregarMensagens();
  }, []);

  const filtrarMensagens = () => {
    let mensagensFiltradas = [...mensagens];

    // Filtrar por tipo
    if (filtroTipo !== 'todos') {
      mensagensFiltradas = mensagensFiltradas.filter(msg => msg.tipo === filtroTipo);
    }

    // Filtrar por termo de busca
    if (termoBusca) {
      const termoLowerCase = termoBusca.toLowerCase();
      mensagensFiltradas = mensagensFiltradas.filter(msg => 
        msg.assunto.toLowerCase().includes(termoLowerCase) ||
        msg.conteudo.toLowerCase().includes(termoLowerCase) ||
        msg.de.nome.toLowerCase().includes(termoLowerCase) ||
        msg.de.email.toLowerCase().includes(termoLowerCase)
      );
    }

    return mensagensFiltradas;
  };

  const formatarData = (data: Date) => {
    return format(data, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  const handleVerMensagem = (mensagem: Mensagem) => {
    // Marcar como lida
    if (!mensagem.lida) {
      const mensagensAtualizadas = mensagens.map(msg => 
        msg.id === mensagem.id ? { ...msg, lida: true } : msg
      );
      setMensagens(mensagensAtualizadas);
    }
    
    setMensagemSelecionada(mensagem);
    setMostrarDetalhes(true);
  };

  const handleExcluirMensagem = (id: string) => {
    setMensagens(mensagens.filter(msg => msg.id !== id));
    if (mensagemSelecionada?.id === id) {
      setMensagemSelecionada(null);
      setMostrarDetalhes(false);
    }
  };

  const handleResponder = () => {
    setMostrarFormResposta(true);
  };

  const handleEnviarResposta = () => {
    if (!respostaTexto.trim() || !mensagemSelecionada) return;
    
    // Lógica de envio de resposta aqui
    alert(`Resposta enviada para ${mensagemSelecionada.de.nome}: ${respostaTexto}`);
    
    setRespostaTexto('');
    setMostrarFormResposta(false);
  };

  const mensagensFiltradas = filtrarMensagens();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <HydrationFix>
        <ClientOnly>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Gerenciamento de Mensagens</h1>
          
          {/* Barra de ferramentas e filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[250px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar mensagens..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <FaFilter className="text-gray-400 mr-2" />
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="todos">Todos os tipos</option>
                    <option value="suporte">Suporte</option>
                    <option value="contato">Contato</option>
                    <option value="sistema">Sistema</option>
                    <option value="proposta">Proposta</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de mensagens */}
            <div className={`lg:col-span-${mostrarDetalhes ? 1 : 3}`}>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-medium text-gray-800">Mensagens ({mensagensFiltradas.length})</h2>
                </div>
                
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {mensagensFiltradas.length > 0 ? (
                    mensagensFiltradas.map((mensagem) => (
                      <div 
                        key={mensagem.id} 
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${!mensagem.lida ? 'bg-blue-50' : ''}`}
                        onClick={() => handleVerMensagem(mensagem)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 overflow-hidden">
                              {mensagem.de.avatar ? (
                                <img src={mensagem.de.avatar} alt={mensagem.de.nome} className="h-full w-full object-cover" />
                              ) : (
                                mensagem.de.nome.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${!mensagem.lida ? 'text-gray-900' : 'text-gray-700'}`}>
                                {mensagem.de.nome}
                              </p>
                              <p className={`text-sm ${!mensagem.lida ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                                {mensagem.assunto}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(mensagem.dataEnvio, "dd/MM/yyyy HH:mm")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {mensagem.importante && (
                              <span className="h-2 w-2 bg-red-500 rounded-full" title="Importante"></span>
                            )}
                            <div className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                              {mensagem.tipo === 'suporte' && 'Suporte'}
                              {mensagem.tipo === 'contato' && 'Contato'}
                              {mensagem.tipo === 'sistema' && 'Sistema'}
                              {mensagem.tipo === 'proposta' && 'Proposta'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      Nenhuma mensagem encontrada.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Detalhes da mensagem */}
            {mostrarDetalhes && mensagemSelecionada && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="font-medium text-gray-800">{mensagemSelecionada.assunto}</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleResponder}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Responder"
                      >
                        <FaReply />
                      </button>
                      <button
                        onClick={() => handleExcluirMensagem(mensagemSelecionada.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Excluir"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 overflow-hidden">
                          {mensagemSelecionada.de.avatar ? (
                            <img src={mensagemSelecionada.de.avatar} alt={mensagemSelecionada.de.nome} className="h-full w-full object-cover" />
                          ) : (
                            mensagemSelecionada.de.nome.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{mensagemSelecionada.de.nome}</p>
                          <p className="text-sm text-gray-600">{mensagemSelecionada.de.email}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatarData(mensagemSelecionada.dataEnvio)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-gray-800 whitespace-pre-line">{mensagemSelecionada.conteudo}</p>
                    </div>
                    
                    {mostrarFormResposta && (
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-800 mb-2">Responder</h3>
                        <textarea
                          value={respostaTexto}
                          onChange={(e) => setRespostaTexto(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[150px]"
                          placeholder="Digite sua resposta aqui..."
                        ></textarea>
                        <div className="flex justify-end mt-3 space-x-3">
                          <button
                            onClick={() => setMostrarFormResposta(false)}
                            className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleEnviarResposta}
                            className="py-2 px-4 bg-primary text-white rounded-md hover:bg-opacity-90"
                            disabled={!respostaTexto.trim()}
                          >
                            Enviar Resposta
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ClientOnly>
      </HydrationFix>
    </div>
  );
} 