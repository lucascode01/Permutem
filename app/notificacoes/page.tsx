'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaBell, FaRegBell, FaCheck, FaTimes, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { notificacoesService } from '../lib/services/notificacoes-service';
import { Notificacao } from '../lib/types';
import { toast } from 'react-hot-toast';
import { checkSubscriptionStatus } from '../lib/checkout';

export default function NotificacoesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [isLoadingNotificacoes, setIsLoadingNotificacoes] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
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
  
  // Carregar notificações
  useEffect(() => {
    const carregarNotificacoes = async () => {
      if (!user?.id) {
        console.log('Usuário não logado, não carregando notificações');
        setIsLoadingNotificacoes(false);
        return;
      }

      if (!planoAtivo) {
        console.log('Usuário sem plano ativo, não carregando notificações');
        setIsLoadingNotificacoes(false);
        return;
      }
      
      setIsLoadingNotificacoes(true);
      setErro(null);
      
      try {
        console.log('Carregando notificações para usuário:', user.id);
        const { data, error } = await notificacoesService.listarNotificacoes(user.id);
        
        if (error) {
          console.error('Erro ao carregar notificações:', error);
          setErro('Não foi possível carregar suas notificações. Tente novamente mais tarde.');
          toast.error('Erro ao carregar notificações');
          setNotificacoes([]);
          return;
        }
        
        console.log('Notificações carregadas:', data);
        setNotificacoes(data || []);
      } catch (error) {
        console.error('Erro inesperado ao carregar notificações:', error);
        setErro('Ocorreu um erro inesperado. Tente novamente mais tarde.');
        toast.error('Erro ao processar notificações');
        setNotificacoes([]);
      } finally {
        console.log('Finalizando carregamento de notificações');
        setIsLoadingNotificacoes(false);
      }
    };
    
    if (user?.id && planoAtivo && !verificandoPlano) {
      console.log('Iniciando carregamento de notificações');
      carregarNotificacoes();
    } else if (!verificandoPlano) {
      console.log('Não carregando notificações: usuário sem plano ativo ou não logado');
      setIsLoadingNotificacoes(false);
    }
  }, [user, planoAtivo, verificandoPlano]);

  const marcarComoLida = async (id: string) => {
    try {
      await notificacoesService.marcarComoLida(id);
      
      // Atualizar o estado localmente
      setNotificacoes(prev => 
        prev.map(notificacao => 
          notificacao.id === id 
            ? { ...notificacao, lida: true } 
            : notificacao
        )
      );
      
      toast.success('Notificação marcada como lida');
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast.error('Não foi possível atualizar a notificação');
    }
  };

  const removerNotificacao = async (id: string) => {
    try {
      await notificacoesService.removerNotificacao(id);
      
      // Remover do estado local
      setNotificacoes(prev => prev.filter(notificacao => notificacao.id !== id));
      
      toast.success('Notificação removida');
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
      toast.error('Não foi possível remover a notificação');
    }
  };

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      const agora = new Date();
      
      // Diferença em milissegundos
      const diff = agora.getTime() - data.getTime();
      
      // Menos de 24 horas
      if (diff < 24 * 60 * 60 * 1000) {
        // Menos de 1 hora
        if (diff < 60 * 60 * 1000) {
          const minutos = Math.floor(diff / (60 * 1000));
          return `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'} atrás`;
        }
        
        const horas = Math.floor(diff / (60 * 60 * 1000));
        return `${horas} ${horas === 1 ? 'hora' : 'horas'} atrás`;
      }
      
      // Menos de 7 dias
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        const dias = Math.floor(diff / (24 * 60 * 60 * 1000));
        return `${dias} ${dias === 1 ? 'dia' : 'dias'} atrás`;
      }
      
      // Data formatada
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error, dataString);
      return 'Data desconhecida';
    }
  };

  // Renderizar um loading state enquanto verifica autenticação
  if (loading || verificandoPlano) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cabeçalho */}
      <header className="bg-white shadow-md px-4 py-3 flex items-center">
        <button 
          onClick={() => router.back()}
          className="mr-4 text-gray-600 hover:text-gray-900 transition"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaBell className="mr-2 text-[#4CAF50]" /> 
          Notificações
        </h1>
      </header>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {isLoadingNotificacoes ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando notificações...</p>
            </div>
          </div>
        ) : !planoAtivo ? (
          <div className="text-center py-10">
            <FaExclamationTriangle className="mx-auto mb-4 text-yellow-500" size={40} />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Plano Inativo</h2>
            <p className="text-gray-600 mb-6">
              Você não possui um plano ativo. Para acessar as notificações, é necessário assinar um plano.
            </p>
            <Link 
              href="/dashboard/escolher-plano" 
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#3d9840] transition"
            >
              Ver planos disponíveis
            </Link>
          </div>
        ) : erro ? (
          <div className="text-center py-10">
            <FaExclamationTriangle className="mx-auto mb-4 text-red-500" size={40} />
            <p className="text-gray-700 mb-6">{erro}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#3d9840] transition"
            >
              Tentar novamente
            </button>
          </div>
        ) : notificacoes.length === 0 ? (
          <div className="text-center py-10">
            <FaRegBell className="mx-auto mb-4 text-gray-400" size={50} />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Sem notificações</h2>
            <p className="text-gray-500">Você não tem nenhuma notificação no momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notificacoes.map(notificacao => (
              <div 
                key={notificacao.id} 
                className={`border rounded-lg p-4 transition ${notificacao.lida ? 'bg-white' : 'bg-green-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-medium ${notificacao.lida ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notificacao.titulo}
                  </h3>
                  <div className="flex space-x-2">
                    {!notificacao.lida && (
                      <button 
                        onClick={() => marcarComoLida(notificacao.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Marcar como lida"
                      >
                        <FaCheck size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => removerNotificacao(notificacao.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Remover notificação"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{notificacao.conteudo}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 flex items-center">
                    <FaClock className="mr-1" size={12} />
                    {formatarData(notificacao.criado_em)}
                  </span>
                  {notificacao.link && (
                    <Link href={notificacao.link} className="text-[#4CAF50] hover:underline text-sm">
                      Ver detalhes
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 