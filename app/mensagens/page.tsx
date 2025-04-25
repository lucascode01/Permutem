'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaSearch, FaEllipsisV, FaPaperclip, FaPaperPlane, FaHome, FaCalendarAlt, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// Tipos para as mensagens
type Message = {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  read: boolean;
  propertyId?: string;
  attachment?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  };
};

type Conversation = {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
};

export default function MessagesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  
  // Participante ativo na conversa
  const activeParticipant = activeConversation 
    ? conversations.find(conv => conv.id === activeConversation) 
    : null;
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    
    // Verificar se está em layout mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simular carregamento de dados
    const loadData = async () => {
      setLoading(true);
      
      // Simular requisição ao backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dados simulados de conversas
      const mockConversations: Conversation[] = [
        {
          id: 'conv1',
          participantId: 'user1',
          participantName: 'João Silva',
          participantAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          lastMessage: 'O imóvel ainda está disponível para permuta?',
          timestamp: '2023-11-20T14:30:00',
          unreadCount: 2,
          propertyId: 'prop1',
          propertyTitle: 'Apartamento em São Paulo',
          propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
        },
        {
          id: 'conv2',
          participantId: 'user2',
          participantName: 'Maria Oliveira',
          participantAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          lastMessage: 'Podemos agendar uma visita para amanhã?',
          timestamp: '2023-11-19T10:15:00',
          unreadCount: 0,
          propertyId: 'prop2',
          propertyTitle: 'Casa em Florianópolis',
          propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'
        },
        {
          id: 'conv3',
          participantId: 'user3',
          participantName: 'Carlos Mendes',
          lastMessage: 'Qual o valor mínimo que aceita para permuta?',
          timestamp: '2023-11-18T09:22:00',
          unreadCount: 0,
          propertyId: 'prop3',
          propertyTitle: 'Terreno em Curitiba',
          propertyImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'
        }
      ];
      
      setConversations(mockConversations);
      
      // Se existir alguma conversa, selecionar a primeira por padrão (apenas desktop)
      if (mockConversations.length > 0 && !isMobile) {
        setActiveConversation(mockConversations[0].id);
        loadMessages(mockConversations[0].id);
      }
      
      setLoading(false);
    };
    
    loadData();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [user, isLoading, router]);
  
  // Carregar mensagens da conversa
  const loadMessages = async (conversationId: string) => {
    // Simular requisição ao backend
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Dados simulados de mensagens para a conversa selecionada
    if (conversationId === 'conv1') {
      const mockMessages: Message[] = [
        {
          id: 'msg1',
          text: 'Olá, gostaria de saber mais informações sobre o imóvel.',
          senderId: 'user1',
          receiverId: user?.id || '',
          timestamp: '2023-11-19T14:30:00',
          read: true
        },
        {
          id: 'msg2',
          text: 'Claro! O que você gostaria de saber?',
          senderId: user?.id || '',
          receiverId: 'user1',
          timestamp: '2023-11-19T14:35:00',
          read: true
        },
        {
          id: 'msg3',
          text: 'O imóvel aceita permuta por um apartamento em São Paulo?',
          senderId: 'user1',
          receiverId: user?.id || '',
          timestamp: '2023-11-19T14:40:00',
          read: true
        },
        {
          id: 'msg4',
          text: 'Sim, estou buscando uma permuta por um imóvel em São Paulo. Qual seria o seu apartamento?',
          senderId: user?.id || '',
          receiverId: 'user1',
          timestamp: '2023-11-19T14:45:00',
          read: true
        },
        {
          id: 'msg5',
          text: 'Tenho um apartamento de 3 quartos na região de Pinheiros.',
          senderId: 'user1',
          receiverId: user?.id || '',
          timestamp: '2023-11-20T09:15:00',
          read: true,
          attachment: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
            name: 'apartamento_frente.jpg'
          }
        },
        {
          id: 'msg6',
          text: 'O imóvel ainda está disponível para permuta?',
          senderId: 'user1',
          receiverId: user?.id || '',
          timestamp: '2023-11-20T14:30:00',
          read: false
        }
      ];
      setMessages(mockMessages);
    } else if (conversationId === 'conv2') {
      const mockMessages: Message[] = [
        {
          id: 'msg7',
          text: 'Boa tarde! Vi seu anúncio e me interessei pela casa em Florianópolis.',
          senderId: 'user2',
          receiverId: user?.id || '',
          timestamp: '2023-11-18T16:10:00',
          read: true
        },
        {
          id: 'msg8',
          text: 'Olá Maria! Obrigado pelo interesse. O imóvel está disponível para visitas.',
          senderId: user?.id || '',
          receiverId: 'user2',
          timestamp: '2023-11-18T16:30:00',
          read: true
        },
        {
          id: 'msg9',
          text: 'Ótimo! Estarei em Florianópolis na próxima semana. Podemos agendar uma visita?',
          senderId: 'user2',
          receiverId: user?.id || '',
          timestamp: '2023-11-19T10:15:00',
          read: true
        }
      ];
      setMessages(mockMessages);
    } else if (conversationId === 'conv3') {
      const mockMessages: Message[] = [
        {
          id: 'msg10',
          text: 'Olá, estou interessado no terreno em Curitiba. Aceita permuta?',
          senderId: 'user3',
          receiverId: user?.id || '',
          timestamp: '2023-11-17T11:20:00',
          read: true
        },
        {
          id: 'msg11',
          text: 'Olá Carlos! Sim, aceito permuta, preferencialmente por imóveis no litoral de SC.',
          senderId: user?.id || '',
          receiverId: 'user3',
          timestamp: '2023-11-17T11:45:00',
          read: true
        },
        {
          id: 'msg12',
          text: 'Tenho um apartamento em Balneário Camboriú. Poderia considerar?',
          senderId: 'user3',
          receiverId: user?.id || '',
          timestamp: '2023-11-17T12:10:00',
          read: true,
          propertyId: 'prop4'
        },
        {
          id: 'msg13',
          text: 'Interessante! Pode me enviar mais detalhes e fotos?',
          senderId: user?.id || '',
          receiverId: 'user3',
          timestamp: '2023-11-17T14:30:00',
          read: true
        },
        {
          id: 'msg14',
          text: 'Claro, segue algumas fotos e informações. O apartamento tem 2 quartos, 1 suíte, 80m².',
          senderId: 'user3',
          receiverId: user?.id || '',
          timestamp: '2023-11-17T15:20:00',
          read: true,
          attachment: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
            name: 'apartamento_bc.jpg'
          }
        },
        {
          id: 'msg15',
          text: 'Qual o valor mínimo que aceita para permuta?',
          senderId: 'user3',
          receiverId: user?.id || '',
          timestamp: '2023-11-18T09:22:00',
          read: true
        }
      ];
      setMessages(mockMessages);
    }
    
    // Marcar mensagens como lidas
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
    
    // No mobile, mostrar apenas a conversa
    if (isMobile) {
      setShowConversationList(false);
    }
  };
  
  // Rolar para a última mensagem quando as mensagens mudarem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Selecionar conversa
  const selectConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    loadMessages(conversationId);
  };
  
  // Enviar mensagem
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    // Adicionar mensagem ao estado
    const newMsg: Message = {
      id: `new-${Date.now()}`,
      text: newMessage,
      senderId: user?.id || '',
      receiverId: activeParticipant?.participantId || '',
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    // Atualizar última mensagem na conversa
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === activeConversation
          ? { 
              ...conv, 
              lastMessage: newMessage,
              timestamp: new Date().toISOString(),
            }
          : conv
      )
    );
  };
  
  // Filtrar conversas com base na busca
  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Formatação de data
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      // Hoje - mostrar apenas hora
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      // Ontem
      return 'Ontem';
    } else if (diffInDays < 7) {
      // Menos de uma semana
      const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return days[date.getDay()];
    } else {
      // Mais de uma semana
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
  };
  
  const formatConversationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      // Hoje - mostrar apenas hora
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      // Ontem
      return 'Ontem';
    } else {
      // Outros dias
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };
  
  // Voltar para a lista de conversas (mobile)
  const goBackToList = () => {
    setShowConversationList(true);
  };
  
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto max-w-6xl px-0 md:px-4 py-4 h-[calc(100vh-4rem)]">
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col md:flex-row">
          {/* Lista de conversas */}
          {(showConversationList || !isMobile) && (
            <div className="md:w-1/3 border-r border-gray-200 flex flex-col h-full">
              <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Mensagens</h1>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar conversas..."
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="text-center p-6">
                    <p className="text-gray-500">Nenhuma conversa encontrada</p>
                  </div>
                ) : (
                  filteredConversations.map(conversation => (
                    <div 
                      key={conversation.id}
                      onClick={() => selectConversation(conversation.id)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${activeConversation === conversation.id ? 'bg-gray-50' : ''}`}
                    >
                      <div className="flex">
                        <div className="relative mr-3">
                          {conversation.participantAvatar ? (
                            <img 
                              src={conversation.participantAvatar} 
                              alt={conversation.participantName} 
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaUser className="text-gray-500" />
                            </div>
                          )}
                          {conversation.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 truncate">{conversation.participantName}</h3>
                            <span className="text-xs text-gray-500">{formatConversationTime(conversation.timestamp)}</span>
                          </div>
                          
                          <p className={`text-sm truncate mt-1 ${conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                            {conversation.lastMessage}
                          </p>
                          
                          {conversation.propertyTitle && (
                            <div className="flex items-center mt-1">
                              <div className="w-4 h-4 rounded-sm bg-cover bg-center mr-1" style={{ backgroundImage: `url(${conversation.propertyImage})` }}></div>
                              <span className="text-xs text-gray-400 truncate">{conversation.propertyTitle}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Área de conversa */}
          {activeConversation && (!isMobile || !showConversationList) ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Cabeçalho da conversa */}
              <div className="p-4 border-b border-gray-200 flex items-center">
                {isMobile && (
                  <button 
                    onClick={goBackToList} 
                    className="mr-2 p-2 text-gray-600 hover:text-gray-900"
                  >
                    <FaArrowLeft />
                  </button>
                )}
                
                {activeParticipant?.participantAvatar ? (
                  <img 
                    src={activeParticipant.participantAvatar} 
                    alt={activeParticipant.participantName} 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <FaUser className="text-gray-500" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h2 className="font-medium text-gray-900">{activeParticipant?.participantName}</h2>
                  {activeParticipant?.propertyTitle && (
                    <div className="text-xs text-gray-500 flex items-center">
                      <FaHome className="mr-1" />
                      <span>{activeParticipant.propertyTitle}</span>
                    </div>
                  )}
                </div>
                
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <FaEllipsisV />
                </button>
              </div>
              
              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center p-6">
                    <p className="text-gray-500">Nenhuma mensagem para exibir</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const isSender = message.senderId === user?.id;
                      // Verificar se é a primeira mensagem do dia
                      const showDateSeparator = index === 0 || new Date(message.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();
                      
                      return (
                        <div key={message.id}>
                          {showDateSeparator && (
                            <div className="text-center my-4">
                              <span className="px-4 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                                {new Date(message.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                              </span>
                            </div>
                          )}
                          
                          <div className={`mb-4 max-w-xs md:max-w-md ${isSender ? 'ml-auto' : 'mr-auto'}`}>
                            <div className={`rounded-lg p-3 shadow-sm ${isSender ? 'bg-[#E9FBE5] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                              <p className="text-gray-800">{message.text}</p>
                              
                              {message.attachment && (
                                <div className="mt-2">
                                  {message.attachment.type === 'image' ? (
                                    <img 
                                      src={message.attachment.url} 
                                      alt="Anexo" 
                                      className="rounded-md max-w-full cursor-pointer"
                                    />
                                  ) : (
                                    <div className="flex items-center p-2 bg-gray-100 rounded-md">
                                      <FaPaperclip className="text-gray-500 mr-2" />
                                      <span className="text-sm text-gray-700 truncate">{message.attachment.name}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {message.propertyId && (
                                <div className="mt-2 p-2 bg-gray-100 rounded-md flex items-center">
                                  <FaHome className="text-gray-500 mr-2" />
                                  <span className="text-sm text-gray-700">Imóvel mencionado</span>
                                </div>
                              )}
                              
                              <div className={`text-xs mt-1 ${isSender ? 'text-right' : ''}`}>
                                <span className="text-gray-500">{formatMessageTime(message.timestamp)}</span>
                                {isSender && (
                                  <span className="ml-1 text-gray-400">
                                    {message.read ? '✓✓' : '✓'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              
              {/* Compositor de mensagens */}
              <div className="p-3 border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex items-center">
                  <button 
                    type="button" 
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="Anexar arquivo"
                  >
                    <FaPaperclip />
                  </button>
                  
                  <input 
                    type="text" 
                    placeholder="Digite sua mensagem..." 
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-full mx-2 focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                  />
                  
                  <button 
                    type="submit" 
                    className="p-2 bg-[#4CAF50] text-white rounded-full hover:bg-[#43a047]"
                    disabled={!newMessage.trim()}
                  >
                    <FaPaperPlane />
                  </button>
                </form>
              </div>
            </div>
          ) : !activeConversation && (!isMobile || !showConversationList) ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-6">
                <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <FaUser className="text-gray-400 w-8 h-8" />
                </div>
                <h3 className="text-gray-800 font-medium mb-2">Nenhuma conversa selecionada</h3>
                <p className="text-gray-600 mb-6">Selecione uma conversa para começar a falar</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 