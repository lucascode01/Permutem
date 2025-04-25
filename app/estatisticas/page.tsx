'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaChartBar, FaEye, FaHeart, FaShareAlt, FaExchangeAlt, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// Tipos para as estatísticas
type PropertyStats = {
  id: string;
  title: string;
  imageUrl: string;
  views: number;
  favorites: number;
  shares: number;
  exchangeRequests: number;
  impressions: number;
};

type DailyStats = {
  date: string;
  views: number;
  favorites: number;
  shares: number;
  exchangeRequests: number;
};

export default function StatisticsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [period, setPeriod] = useState('7dias');
  const [selectedProperty, setSelectedProperty] = useState('todos');
  const [loading, setLoading] = useState(true);
  
  // Dados simulados para estatísticas
  const [properties, setProperties] = useState<PropertyStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  
  // Estatísticas gerais
  const [totalViews, setTotalViews] = useState(0);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [totalExchangeRequests, setTotalExchangeRequests] = useState(0);
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    
    // Simular carregamento de dados
    const loadData = async () => {
      setLoading(true);
      
      // Simular requisição ao backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados para propriedades
      const mockProperties: PropertyStats[] = [
        {
          id: '1',
          title: 'Apartamento em São Paulo',
          imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          views: 234,
          favorites: 18,
          shares: 12,
          exchangeRequests: 5,
          impressions: 876
        },
        {
          id: '2',
          title: 'Casa em Florianópolis',
          imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
          views: 187,
          favorites: 22,
          shares: 8,
          exchangeRequests: 3,
          impressions: 657
        },
        {
          id: '3',
          title: 'Terreno em Curitiba',
          imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
          views: 103,
          favorites: 7,
          shares: 5,
          exchangeRequests: 1,
          impressions: 321
        }
      ];
      
      setProperties(mockProperties);
      
      // Calcular totais
      const totals = mockProperties.reduce(
        (acc, property) => {
          return {
            views: acc.views + property.views,
            favorites: acc.favorites + property.favorites,
            shares: acc.shares + property.shares,
            exchangeRequests: acc.exchangeRequests + property.exchangeRequests
          };
        },
        { views: 0, favorites: 0, shares: 0, exchangeRequests: 0 }
      );
      
      setTotalViews(totals.views);
      setTotalFavorites(totals.favorites);
      setTotalShares(totals.shares);
      setTotalExchangeRequests(totals.exchangeRequests);
      
      // Gerar dados diários com base no período selecionado
      generateDailyStats(period);
      
      setLoading(false);
    };
    
    loadData();
  }, [user, isLoading, router]);
  
  // Atualiza as estatísticas diárias quando o período ou propriedade selecionada muda
  useEffect(() => {
    if (!loading) {
      generateDailyStats(period);
    }
  }, [period, selectedProperty]);
  
  // Função para gerar estatísticas diárias simuladas
  const generateDailyStats = (selectedPeriod: string) => {
    const days = selectedPeriod === '7dias' ? 7 : selectedPeriod === '30dias' ? 30 : 90;
    const mockDailyStats: DailyStats[] = [];
    
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Formatando a data como DD/MM
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const formattedDate = `${day}/${month}`;
      
      // Valores aleatórios para as estatísticas
      mockDailyStats.push({
        date: formattedDate,
        views: Math.floor(Math.random() * 50) + 5,
        favorites: Math.floor(Math.random() * 8) + 1,
        shares: Math.floor(Math.random() * 5) + 1,
        exchangeRequests: Math.floor(Math.random() * 2)
      });
    }
    
    setDailyStats(mockDailyStats);
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
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Estatísticas</h1>
        <p className="text-gray-600 mb-6">Acompanhe o desempenho dos seus anúncios</p>
        
        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="7dias">Últimos 7 dias</option>
              <option value="30dias">Últimos 30 dias</option>
              <option value="90dias">Últimos 90 dias</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imóvel
            </label>
            <select 
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="todos">Todos os imóveis</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FaEye className="text-green-600 h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Visualizações</h3>
                <p className="text-2xl font-semibold">{totalViews}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">
              +12% em relação ao período anterior
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <FaHeart className="text-red-600 h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Favoritos</h3>
                <p className="text-2xl font-semibold">{totalFavorites}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">
              +8% em relação ao período anterior
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FaShareAlt className="text-blue-600 h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Compartilhamentos</h3>
                <p className="text-2xl font-semibold">{totalShares}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">
              +5% em relação ao período anterior
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <FaExchangeAlt className="text-purple-600 h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Propostas de Permuta</h3>
                <p className="text-2xl font-semibold">{totalExchangeRequests}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">
              +20% em relação ao período anterior
            </div>
          </div>
        </div>
        
        {/* Gráfico de Tendência (Mock) */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Tendência de Visualizações</h2>
          
          <div className="h-64 relative">
            {/* Eixo Y */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>50</span>
              <span>40</span>
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>
            
            {/* Gráfico */}
            <div className="ml-8 h-full flex items-end">
              {dailyStats.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-4/5 bg-green-500 rounded-t"
                    style={{ height: `${(day.views / 50) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{day.date}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span className="text-xs text-gray-500">Visualizações</span>
            </div>
          </div>
        </div>
        
        {/* Tabela de Imóveis e Estatísticas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-5 py-4 border-b">
            <h2 className="text-lg font-semibold">Desempenho por Imóvel</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Imóvel</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Visualizações</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Favoritos</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Taxa de Conversão</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Propostas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.map(property => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${property.imageUrl})` }}></div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.favorites}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((property.favorites / property.impressions) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.exchangeRequests}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Dicas de Otimização */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Dicas para Melhorar seu Desempenho</h2>
          
          <div className="space-y-4">
            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
              <h3 className="font-medium text-yellow-800 mb-2">Melhore suas fotos</h3>
              <p className="text-sm text-yellow-700">Imóveis com fotos de qualidade recebem até 3x mais visualizações. Considere adicionar mais fotos ou melhorar a qualidade das existentes.</p>
            </div>
            
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">Complete a descrição</h3>
              <p className="text-sm text-blue-700">Descrições detalhadas aumentam o interesse no seu imóvel. Adicione mais detalhes sobre a localização, comodidades e estado de conservação.</p>
            </div>
            
            <div className="p-4 border border-green-200 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Atualize seu anúncio</h3>
              <p className="text-sm text-green-700">Anúncios atualizados recentemente têm maior visibilidade. Faça pequenas atualizações periódicas para manter seu anúncio em destaque.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 