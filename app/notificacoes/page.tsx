'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBell, FaEnvelope, FaExchangeAlt, FaHeart, FaEye, FaCommentAlt, FaTrash, FaCheck } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// Tipo para notificações
type Notification = {
  id: string;
  type: 'proposal' | 'message' | 'favorite' | 'view' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionLink?: string;
  propertyId?: string;
  propertyTitle?: string;
  senderName?: string;
};

export default function NotificationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    
    // Simular carregamento de dados
    const loadData = async () => {
      setLoading(true);
      
      // Simular requisição ao backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dados simulados de notificações
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'proposal',
          title: 'Nova proposta de permuta',
          message: 'João Silva enviou uma proposta de permuta para seu imóvel "Apartamento em São Paulo".',
          date: '2023-11-20T14:30:00',
          read: false,
          actionLink: '/propostas/3',
          propertyId: '1',
          propertyTitle: 'Apartamento em São Paulo',
          senderName: 'João Silva'
        },
        {
          id: '2',
          type: 'message',
          title: 'Nova mensagem',
          message: 'Maria Oliveira enviou uma mensagem sobre seu imóvel "Casa em Florianópolis".',
          date: '2023-11-19T10:15:00',
          read: true,
          actionLink: '/mensagens/5',
          propertyId: '2',
          propertyTitle: 'Casa em Florianópolis',
          senderName: 'Maria Oliveira'
        },
        {
          id: '3',
          type: 'favorite',
          title: 'Novo favorito',
          message: 'Seu imóvel "Terreno em Curitiba" foi adicionado aos favoritos por 3 usuários nas últimas 24 horas.',
          date: '2023-11-18T20:45:00',
          read: false,
          propertyId: '3',
          propertyTitle: 'Terreno em Curitiba'
        },
        {
          id: '4',
          type: 'view',
          title: 'Seu anúncio está em alta!',
          message: 'Seu imóvel "Apartamento em São Paulo" recebeu 15 visualizações nas últimas 24 horas.',
          date: '2023-11-17T16:20:00',
          read: true,
          propertyId: '1',
          propertyTitle: 'Apartamento em São Paulo'
        },
        {
          id: '5',
          type: 'system',
          title: 'Seu plano foi renovado',
          message: 'Seu plano Premium foi renovado automaticamente e é válido até 15/12/2023.',
          date: '2023-11-15T08:00:00',
          read: true,
          actionLink: '/perfil/plano'
        },
        {
          id: '6',
          type: 'system',
          title: 'Novos imóveis compatíveis',
          message: 'Encontramos 5 novos imóveis que combinam com suas preferências de permuta.',
          date: '2023-11-14T12:10:00',
          read: true,
          actionLink: '/buscar-imoveis?q=compatíveis'
        },
        {
          id: '7',
          type: 'proposal',
          title: 'Proposta aceita',
          message: 'Ana Paula aceitou sua proposta de permuta para o imóvel "Casa na Praia".',
          date: '2023-11-13T11:30:00',
          read: false,
          actionLink: '/propostas/2',
          propertyId: '4',
          propertyTitle: 'Casa na Praia',
          senderName: 'Ana Paula'
        }
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    };
    
    loadData();
  }, [user, isLoading, router]);
  
  // Filtrar notificações
  const filteredNotifications = (() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(notification => !notification.read);
    return notifications.filter(notification => notification.type === filter);
  })();
  
  // Formatar data relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h atrás`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };
  
  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };
  
  // Marcar uma como lida
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Excluir notificação
  const deleteNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };
  
  // Obter ícone com base no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'proposal':
        return <FaExchangeAlt className="text-blue-500" />;
      case 'message':
        return <FaEnvelope className="text-green-500" />;
      case 'favorite':
        return <FaHeart className="text-red-500" />;
      case 'view':
        return <FaEye className="text-purple-500" />;
      case 'system':
        return <FaBell className="text-orange-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  
  // Contagem de não lidas
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notificações</h1>
            <p className="text-gray-600">
              {unreadCount === 0 
                ? 'Você não tem novas notificações' 
                : `Você tem ${unreadCount} ${unreadCount === 1 ? 'nova notificação' : 'novas notificações'}`}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#43a047] transition-colors"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>
        
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Todas
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${filter === 'unread' ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Não lidas
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setFilter('proposal')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap flex items-center ${filter === 'proposal' ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FaExchangeAlt className={`mr-1 ${filter === 'proposal' ? 'text-white' : 'text-blue-500'}`} />
              Propostas
            </button>
            <button 
              onClick={() => setFilter('message')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap flex items-center ${filter === 'message' ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FaEnvelope className={`mr-1 ${filter === 'message' ? 'text-white' : 'text-green-500'}`} />
              Mensagens
            </button>
            <button 
              onClick={() => setFilter('system')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap flex items-center ${filter === 'system' ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FaBell className={`mr-1 ${filter === 'system' ? 'text-white' : 'text-orange-500'}`} />
              Sistema
            </button>
          </div>
        </div>
        
        {/* Lista de notificações */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaBell className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-gray-800 font-medium mb-2">Nenhuma notificação encontrada</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Você não tem notificações no momento.' 
                  : 'Nenhuma notificação corresponde ao filtro selecionado.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${!notification.read ? 'border-l-4 border-[#4CAF50]' : ''}`}
              >
                <div className="p-4 md:p-5">
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-3 rounded-full mr-4">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                        <span className="text-sm text-gray-500">{formatRelativeTime(notification.date)}</span>
                      </div>
                      
                      <p className="mt-1 text-gray-700">{notification.message}</p>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex space-x-2">
                          {notification.actionLink && (
                            <button 
                              onClick={() => {
                                markAsRead(notification.id);
                                router.push(notification.actionLink!);
                              }}
                              className="px-3 py-1 bg-[#4CAF50] text-white text-sm rounded-md hover:bg-[#43a047] transition-colors"
                            >
                              Ver detalhes
                            </button>
                          )}
                          
                          {!notification.read && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors flex items-center"
                            >
                              <FaCheck className="mr-1" />
                              Marcar como lida
                            </button>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Excluir notificação"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Paginação (simplificada para o exemplo) */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 mx-1">
              Anterior
            </button>
            <button className="px-4 py-2 bg-[#4CAF50] text-white rounded-md mx-1">
              1
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 mx-1">
              2
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 mx-1">
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 