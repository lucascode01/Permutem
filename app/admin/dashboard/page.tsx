'use client';

import React, { useState, useEffect } from 'react';
import { FaUsers, FaBuilding, FaExchangeAlt, FaEye, FaUserPlus, FaCheck } from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import HydrationFix from '@/app/components/HydrationFix';
import { useSupabase } from '@/app/contexts/SupabaseContext';
import { format, subDays } from 'date-fns';
import { toast } from 'react-hot-toast';

// Componente para cards de estatísticas
const StatCard = ({ title, value, icon, color }: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  color: string 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div className={`${color} h-12 w-12 rounded-full flex items-center justify-center mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { usuarios, imoveis, propostas, isLoading, recarregarUsuarios, recarregarImoveis, recarregarPropostas } = useSupabase();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    totalProperties: 0,
    activeProperties: 0,
    pendingProperties: 0,
    totalProposals: 0,
    acceptedProposals: 0,
    pendingProposals: 0,
    totalVisits: 0
  });
  
  const [chartData, setChartData] = useState({
    userGrowth: Array(7).fill(0),
    propertiesGrowth: Array(7).fill(0),
    proposalsGrowth: Array(7).fill(0)
  });
  
  const [atividades, setAtividades] = useState<{user: string, action: string, time: string}[]>([]);
  
  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      try {
        // Recarregar dados se necessário
        if (usuarios.length === 0) await recarregarUsuarios();
        if (imoveis.length === 0) await recarregarImoveis();
        if (propostas.length === 0) await recarregarPropostas();
        
        // Calcular estatísticas
        const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
        
        const newUsers = usuarios.filter(u => 
          new Date(u.data_registro) >= new Date(thirtyDaysAgo)
        ).length;
        
        const activeUsers = usuarios.filter(u => u.status === 'ativo').length;
        
        const activeProperties = imoveis.filter(i => i.status === 'aprovado').length;
        const pendingProperties = imoveis.filter(i => i.status === 'pendente').length;
        
        const acceptedProposals = propostas.filter(p => p.status === 'aceita').length;
        const pendingProposals = propostas.filter(p => p.status === 'pendente').length;
        
        // Atualizar estatísticas
        setStats({
          totalUsers: usuarios.length,
          newUsers,
          activeUsers,
          totalProperties: imoveis.length,
          activeProperties,
          pendingProperties,
          totalProposals: propostas.length,
          acceptedProposals,
          pendingProposals,
          totalVisits: Math.round(usuarios.length * 15) // Valor simulado baseado nos usuários
        });
        
        // Calcular dados para gráficos (últimos 7 dias)
        const last7Days = Array(7).fill(0).map((_, i) => subDays(new Date(), 6 - i).toISOString().split('T')[0]);
        
        const userGrowth = last7Days.map(day => 
          usuarios.filter(u => u.data_registro.split('T')[0] === day).length
        );
        
        const propertiesGrowth = last7Days.map(day => 
          imoveis.filter(i => i.data_cadastro.split('T')[0] === day).length
        );
        
        const proposalsGrowth = last7Days.map(day => 
          propostas.filter(p => p.data_criacao.split('T')[0] === day).length
        );
        
        setChartData({
          userGrowth,
          propertiesGrowth,
          proposalsGrowth
        });
        
        // Gerar atividades recentes (combinando usuários, imóveis e propostas)
        const atividades = [
          ...usuarios
            .sort((a, b) => new Date(b.data_registro).getTime() - new Date(a.data_registro).getTime())
            .slice(0, 3)
            .map(u => ({
              user: `${u.nome} ${u.sobrenome}`,
              action: "registrou-se na plataforma",
              time: formatarTempoRelativo(u.data_registro)
            })),
          ...imoveis
            .sort((a, b) => new Date(b.data_cadastro).getTime() - new Date(a.data_cadastro).getTime())
            .slice(0, 3)
            .map(i => {
              const usuario = usuarios.find(u => u.id === i.usuario_id);
              return {
                user: usuario ? `${usuario.nome} ${usuario.sobrenome}` : "Usuário",
                action: "cadastrou um novo imóvel",
                time: formatarTempoRelativo(i.data_cadastro)
              };
            }),
          ...propostas
            .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
            .slice(0, 3)
            .map(p => {
              const usuario = usuarios.find(u => u.id === p.usuario_origem_id);
              return {
                user: usuario ? `${usuario.nome} ${usuario.sobrenome}` : "Usuário",
                action: "fez uma proposta de permuta",
                time: formatarTempoRelativo(p.data_criacao)
              };
            })
        ];
        
        // Ordenar por tempo
        atividades.sort((a, b) => {
          const timeA = a.time.includes('há ') ? a.time.replace('há ', '') : a.time;
          const timeB = b.time.includes('há ') ? b.time.replace('há ', '') : b.time;
          return timeA.localeCompare(timeB);
        });
        
        setAtividades(atividades.slice(0, 5));
        
      } catch (error) {
        console.error('Erro ao carregar dados para o dashboard:', error);
        toast.error('Erro ao carregar dados do dashboard');
      }
    };
    
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, usuarios, imoveis, propostas, recarregarUsuarios, recarregarImoveis, recarregarPropostas]);
  
  // Função para formatar tempo relativo
  const formatarTempoRelativo = (dataString: string) => {
    const agora = new Date();
    const data = new Date(dataString);
    const diferencaMS = agora.getTime() - data.getTime();
    
    const minutos = Math.floor(diferencaMS / (1000 * 60));
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (minutos < 60) {
      return `há ${minutos} minutos`;
    } else if (horas < 24) {
      return `há ${horas} horas`;
    } else {
      return `há ${dias} dias`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <HydrationFix />
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
      
      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Usuários" 
          value={stats.totalUsers} 
          icon={<FaUsers className="text-white text-xl" />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Novos Usuários (30d)" 
          value={stats.newUsers} 
          icon={<FaUserPlus className="text-white text-xl" />} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Total de Imóveis" 
          value={stats.totalProperties} 
          icon={<FaBuilding className="text-white text-xl" />} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Propostas Ativas" 
          value={stats.totalProposals} 
          icon={<FaExchangeAlt className="text-white text-xl" />} 
          color="bg-orange-500" 
        />
      </div>
      
      {/* Segunda linha de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Usuários Ativos" 
          value={stats.activeUsers} 
          icon={<FaUsers className="text-white text-xl" />} 
          color="bg-teal-500" 
        />
        <StatCard 
          title="Imóveis Pendentes" 
          value={stats.pendingProperties} 
          icon={<MdPendingActions className="text-white text-xl" />} 
          color="bg-yellow-500" 
        />
        <StatCard 
          title="Propostas Aceitas" 
          value={stats.acceptedProposals} 
          icon={<FaCheck className="text-white text-xl" />} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Propostas Pendentes" 
          value={stats.pendingProposals} 
          icon={<MdPendingActions className="text-white text-xl" />} 
          color="bg-red-500" 
        />
      </div>
      
      {/* Seção de gráficos - Dados reais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Crescimento de Usuários (últimos 7 dias)</h3>
          <div className="h-64 flex items-end space-x-2">
            {chartData.userGrowth.map((value, index) => {
              const maxValue = Math.max(...chartData.userGrowth);
              const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
              return (
                <div 
                  key={index} 
                  className="bg-blue-500 hover:bg-blue-600 transition-colors w-full rounded-t-md"
                  style={{ height: `${height}%`, minHeight: value > 0 ? '10%' : '0%' }}
                >
                  <div className="text-center mt-2 text-xs text-white font-medium">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {Array(7).fill(0).map((_, i) => (
              <span key={i}>{format(subDays(new Date(), 6 - i), 'EEE')}</span>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Novos Imóveis vs Propostas (últimos 7 dias)</h3>
          <div className="h-64 flex items-end space-x-2">
            {Array(7).fill(0).map((_, index) => {
              const maxProp = Math.max(...chartData.propertiesGrowth);
              const propHeight = maxProp > 0 ? (chartData.propertiesGrowth[index] / maxProp) * 60 : 0;
              
              const maxProposal = Math.max(...chartData.proposalsGrowth);
              const proposalHeight = maxProposal > 0 ? (chartData.proposalsGrowth[index] / maxProposal) * 30 : 0;
              
              return (
                <div key={index} className="w-full space-y-1">
                  <div 
                    className="bg-purple-500 hover:bg-purple-600 transition-colors w-full rounded-t-md"
                    style={{ 
                      height: `${propHeight}%`, 
                      minHeight: chartData.propertiesGrowth[index] > 0 ? '10%' : '0%' 
                    }}
                  >
                    <div className="text-center mt-2 text-xs text-white font-medium">
                      {chartData.propertiesGrowth[index]}
                    </div>
                  </div>
                  <div 
                    className="bg-orange-500 hover:bg-orange-600 transition-colors w-full rounded-t-md"
                    style={{ 
                      height: `${proposalHeight}%`, 
                      minHeight: chartData.proposalsGrowth[index] > 0 ? '10%' : '0%' 
                    }}
                  >
                    <div className="text-center mt-2 text-xs text-white font-medium">
                      {chartData.proposalsGrowth[index]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {Array(7).fill(0).map((_, i) => (
              <span key={i}>{format(subDays(new Date(), 6 - i), 'EEE')}</span>
            ))}
          </div>
          <div className="flex items-center justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Imóveis</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Propostas</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Atividades recentes - Dados reais */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Atividades Recentes</h3>
        <div className="space-y-4">
          {atividades.length > 0 ? (
            atividades.map((activity, index) => (
              <div key={index} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                <div className="h-8 w-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-sm font-medium">
                  {activity.user.split(' ').map(name => name[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhuma atividade recente registrada</p>
          )}
        </div>
        <button className="mt-4 text-primary font-medium text-sm hover:underline">
          Ver todas as atividades
        </button>
      </div>
    </div>
  );
} 