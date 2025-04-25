'use client';

import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaLock, FaEnvelope, FaBell, FaMoon, FaSave, FaUndoAlt } from 'react-icons/fa';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguranca' | 'notificacoes' | 'aparencia'>('perfil');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    nome: 'Admin',
    sobrenome: 'Sistema',
    email: 'admin@permutem.com.br',
    telefone: '(31) 99999-9999',
    cargo: 'Administrador',
    senha: '********',
    confirmSenha: '********',
    senhaAtual: '',
    emailNotifications: true,
    loginNotifications: true,
    darkMode: false,
    contrastMode: false,
  });
  
  const [formStatus, setFormStatus] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
  }>({
    status: 'idle',
    message: '',
  });

  useEffect(() => {
    // Simulação de carregamento de dados
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const handleTabChange = (tab: 'perfil' | 'seguranca' | 'notificacoes' | 'aparencia') => {
    setActiveTab(tab);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ status: 'submitting', message: '' });
    
    // Simulação de salvamento de dados
    setTimeout(() => {
      setFormStatus({ 
        status: 'success', 
        message: 'Dados atualizados com sucesso!'
      });
      
      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setFormStatus({ status: 'idle', message: '' });
      }, 3000);
    }, 1000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ status: 'submitting', message: '' });
    
    // Verificar se as senhas coincidem
    if (userData.senha !== userData.confirmSenha) {
      setFormStatus({ 
        status: 'error', 
        message: 'As senhas não coincidem.'
      });
      return;
    }
    
    // Simulação de salvamento de senha
    setTimeout(() => {
      setFormStatus({ 
        status: 'success', 
        message: 'Senha atualizada com sucesso!'
      });
      
      // Limpar campos de senha
      setUserData(prev => ({
        ...prev,
        senhaAtual: '',
        senha: '********',
        confirmSenha: '********'
      }));
      
      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setFormStatus({ status: 'idle', message: '' });
      }, 3000);
    }, 1000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ status: 'submitting', message: '' });
    
    // Simulação de salvamento de configurações de notificações
    setTimeout(() => {
      setFormStatus({ 
        status: 'success', 
        message: 'Preferências de notificações atualizadas!'
      });
      
      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setFormStatus({ status: 'idle', message: '' });
      }, 3000);
    }, 800);
  };

  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ status: 'submitting', message: '' });
    
    // Simulação de salvamento de configurações de aparência
    setTimeout(() => {
      setFormStatus({ 
        status: 'success', 
        message: 'Preferências de aparência atualizadas!'
      });
      
      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setFormStatus({ status: 'idle', message: '' });
      }, 3000);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Configurações</h1>
        <p className="mt-1 text-gray-500">Gerencie seu perfil e preferências do sistema</p>
      </div>

      {/* Conteúdo principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs de navegação */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'perfil' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange('perfil')}
          >
            <div className="flex items-center">
              <FaUserCircle className="mr-2" />
              <span>Perfil</span>
            </div>
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'seguranca' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange('seguranca')}
          >
            <div className="flex items-center">
              <FaLock className="mr-2" />
              <span>Segurança</span>
            </div>
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'notificacoes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange('notificacoes')}
          >
            <div className="flex items-center">
              <FaBell className="mr-2" />
              <span>Notificações</span>
            </div>
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'aparencia' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange('aparencia')}
          >
            <div className="flex items-center">
              <FaMoon className="mr-2" />
              <span>Aparência</span>
            </div>
          </button>
        </div>

        {/* Conteúdo da tab ativa */}
        <div className="p-6">
          {/* Mensagem de status */}
          {formStatus.message && (
            <div className={`mb-6 p-3 rounded-md ${
              formStatus.status === 'success' ? 'bg-green-50 text-green-600' : 
              formStatus.status === 'error' ? 'bg-red-50 text-red-600' : 
              'bg-blue-50 text-blue-600'
            }`}>
              {formStatus.message}
            </div>
          )}

          {/* Tab de Perfil */}
          {activeTab === 'perfil' && (
            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={userData.nome}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                  <input
                    type="text"
                    name="sobrenome"
                    value={userData.sobrenome}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={userData.telefone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <input
                    type="text"
                    name="cargo"
                    value={userData.cargo}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="flex items-center">
                    <FaUndoAlt className="mr-2" />
                    <span>Cancelar</span>
                  </div>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={formStatus.status === 'submitting'}
                >
                  <div className="flex items-center">
                    <FaSave className="mr-2" />
                    <span>{formStatus.status === 'submitting' ? 'Salvando...' : 'Salvar Alterações'}</span>
                  </div>
                </button>
              </div>
            </form>
          )}

          {/* Tab de Segurança */}
          {activeTab === 'seguranca' && (
            <form onSubmit={handleSavePassword}>
              <div className="max-w-md">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                  <input
                    type="password"
                    name="senhaAtual"
                    value={userData.senhaAtual}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite sua senha atual"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                  <input
                    type="password"
                    name="senha"
                    value={userData.senha}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a nova senha"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    name="confirmSenha"
                    value={userData.confirmSenha}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirme a nova senha"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center">
                      <FaUndoAlt className="mr-2" />
                      <span>Cancelar</span>
                    </div>
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={formStatus.status === 'submitting'}
                  >
                    <div className="flex items-center">
                      <FaSave className="mr-2" />
                      <span>{formStatus.status === 'submitting' ? 'Salvando...' : 'Atualizar Senha'}</span>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Tab de Notificações */}
          {activeTab === 'notificacoes' && (
            <form onSubmit={handleSaveNotifications}>
              <div className="space-y-4 max-w-xl">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Preferências de Notificações</h3>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Notificações por E-mail</h4>
                      <p className="text-xs text-gray-500 mt-1">Receber alertas e relatórios via e-mail</p>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="emailNotifications"
                          checked={userData.emailNotifications}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Alertas de Login</h4>
                      <p className="text-xs text-gray-500 mt-1">Receber notificações para novos logins em seu conta</p>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="loginNotifications"
                          checked={userData.loginNotifications}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Relatórios automáticos</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="report-daily"
                        name="report-frequency"
                        type="radio"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="report-daily" className="ml-3 text-sm text-gray-700">
                        Diário
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="report-weekly"
                        name="report-frequency"
                        type="radio"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="report-weekly" className="ml-3 text-sm text-gray-700">
                        Semanal
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="report-monthly"
                        name="report-frequency"
                        type="radio"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="report-monthly" className="ml-3 text-sm text-gray-700">
                        Mensal
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center">
                      <FaUndoAlt className="mr-2" />
                      <span>Cancelar</span>
                    </div>
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={formStatus.status === 'submitting'}
                  >
                    <div className="flex items-center">
                      <FaSave className="mr-2" />
                      <span>{formStatus.status === 'submitting' ? 'Salvando...' : 'Salvar Preferências'}</span>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Tab de Aparência */}
          {activeTab === 'aparencia' && (
            <form onSubmit={handleSaveAppearance}>
              <div className="space-y-4 max-w-xl">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Preferências de Aparência</h3>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Modo Escuro</h4>
                      <p className="text-xs text-gray-500 mt-1">Alterar para tema escuro</p>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="darkMode"
                          checked={userData.darkMode}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Alto Contraste</h4>
                      <p className="text-xs text-gray-500 mt-1">Melhorar legibilidade com alto contraste</p>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="contrastMode"
                          checked={userData.contrastMode}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Tamanho da Fonte</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="font-small"
                        name="font-size"
                        type="radio"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="font-small" className="ml-3 text-sm text-gray-700">
                        Pequena
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="font-medium"
                        name="font-size"
                        type="radio"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="font-medium" className="ml-3 text-sm text-gray-700">
                        Média (Padrão)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="font-large"
                        name="font-size"
                        type="radio"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="font-large" className="ml-3 text-sm text-gray-700">
                        Grande
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center">
                      <FaUndoAlt className="mr-2" />
                      <span>Restaurar Padrões</span>
                    </div>
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={formStatus.status === 'submitting'}
                  >
                    <div className="flex items-center">
                      <FaSave className="mr-2" />
                      <span>{formStatus.status === 'submitting' ? 'Salvando...' : 'Salvar Preferências'}</span>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 