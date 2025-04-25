'use client';

import React, { useState, useEffect } from 'react';
import { FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaChartLine, FaRegCreditCard, FaUserPlus, FaArrowUp, FaArrowDown, FaSearchDollar, FaFileDownload, FaExchangeAlt } from 'react-icons/fa';

// Componente para exibir card de métricas
const MetricCard = ({ title, value, icon, change, changeType, subtitle }: 
  { title: string, value: string, icon: React.ReactNode, change?: string, changeType?: 'up' | 'down', subtitle?: string }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
          {icon}
        </div>
      </div>
      {change && (
        <div className="mt-3 flex items-center">
          {changeType === 'up' ? (
            <FaArrowUp className="text-green-500 mr-1 text-xs" />
          ) : (
            <FaArrowDown className="text-red-500 mr-1 text-xs" />
          )}
          <span className={`text-xs font-medium ${changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
};

// Componente para exibir gráfico de barras simples
const SimpleBarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="pt-2">
      {data.map((item, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-800">R$ {item.value.toLocaleString('pt-BR')}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente para exibir tabela de transações recentes
const RecentTransactions = ({ transactions }: { transactions: any[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                    {transaction.customer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{transaction.customer.name}</div>
                    <div className="text-xs text-gray-500">{transaction.customer.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">{transaction.plan}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">{transaction.date}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">R$ {transaction.amount}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  transaction.status === 'Completo' ? 'bg-green-100 text-green-800' : 
                  transaction.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Componente para exibir detalhes de assinaturas
const SubscriptionDetails = ({ planos }: { planos: any[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {planos.map((plano, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase">{plano.nome}</div>
          <div className="mt-1 flex items-baseline">
            <span className="text-2xl font-semibold text-gray-900">
              {plano.assinantes}
            </span>
            <span className="ml-1 text-sm text-gray-500">assinantes</span>
          </div>
          <div className="mt-3">
            <div className="text-xs text-gray-500">Receita Mensal</div>
            <div className="font-medium text-gray-900">R$ {plano.receitaMensal}</div>
          </div>
          <div className="mt-2">
            <div className="text-xs text-gray-500">Preço</div>
            <div className="font-medium text-gray-900">R$ {plano.preco}/mês</div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Taxa de renovação</span>
              <span className="font-medium text-gray-900">{plano.taxaRenovacao}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function FinanceiroPage() {
  const [periodoAtivo, setPeriodoAtivo] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  const [isLoading, setIsLoading] = useState(true);
  const [financeData, setFinanceData] = useState<any>(null);

  useEffect(() => {
    // Simulação de carregamento de dados
    setIsLoading(true);
    setTimeout(() => {
      // Dados simulados
      const dadosFinanceiros = {
        metricas: {
          receitaTotal: 'R$ 45.289,00',
          receitaMensal: 'R$ 12.458,00',
          assinantesAtivos: '143',
          ticketMedio: 'R$ 87,12',
        },
        comparativo: {
          dia: {
            receita: 'R$ 580,00',
            mudanca: '12%',
            direcao: 'up',
            subtitulo: 'vs ontem',
          },
          semana: {
            receita: 'R$ 3.850,00',
            mudanca: '8%',
            direcao: 'up',
            subtitulo: 'vs semana passada',
          },
          mes: {
            receita: 'R$ 12.458,00',
            mudanca: '5%',
            direcao: 'up',
            subtitulo: 'vs mês passado',
          },
          ano: {
            receita: 'R$ 45.289,00',
            mudanca: '24%',
            direcao: 'up',
            subtitulo: 'vs mesmo período ano passado',
          },
        },
        dadosGrafico: {
          dia: [
            { label: '00h-04h', value: 120 },
            { label: '04h-08h', value: 80 },
            { label: '08h-12h', value: 200 },
            { label: '12h-16h', value: 350 },
            { label: '16h-20h', value: 290 },
            { label: '20h-00h', value: 180 },
          ],
          semana: [
            { label: 'Segunda', value: 580 },
            { label: 'Terça', value: 450 },
            { label: 'Quarta', value: 620 },
            { label: 'Quinta', value: 780 },
            { label: 'Sexta', value: 890 },
            { label: 'Sábado', value: 450 },
            { label: 'Domingo', value: 380 },
          ],
          mes: [
            { label: 'Semana 1', value: 2180 },
            { label: 'Semana 2', value: 2950 },
            { label: 'Semana 3', value: 3720 },
            { label: 'Semana 4', value: 3608 },
          ],
          ano: [
            { label: 'Jan', value: 8500 },
            { label: 'Fev', value: 7200 },
            { label: 'Mar', value: 9800 },
            { label: 'Abr', value: 7900 },
            { label: 'Mai', value: 9400 },
            { label: 'Jun', value: 11200 },
            { label: 'Jul', value: 9800 },
            { label: 'Ago', value: 12458 },
            { label: 'Set', value: 0 },
            { label: 'Out', value: 0 },
            { label: 'Nov', value: 0 },
            { label: 'Dez', value: 0 },
          ],
        },
        transacoesRecentes: [
          {
            customer: { name: 'João Silva', email: 'joao@email.com' },
            plan: 'Plano Premium',
            date: '15/08/2023',
            amount: '129,90',
            status: 'Completo',
          },
          {
            customer: { name: 'Maria Souza', email: 'maria@email.com' },
            plan: 'Plano Básico',
            date: '14/08/2023',
            amount: '49,90',
            status: 'Completo',
          },
          {
            customer: { name: 'Pedro Santos', email: 'pedro@email.com' },
            plan: 'Plano Premium',
            date: '12/08/2023',
            amount: '129,90',
            status: 'Completo',
          },
          {
            customer: { name: 'Ana Oliveira', email: 'ana@email.com' },
            plan: 'Plano Intermediário',
            date: '10/08/2023',
            amount: '79,90',
            status: 'Completo',
          },
          {
            customer: { name: 'Carlos Ferreira', email: 'carlos@email.com' },
            plan: 'Plano Premium',
            date: '08/08/2023',
            amount: '129,90',
            status: 'Completo',
          },
        ],
        planos: [
          {
            nome: 'Plano Básico',
            assinantes: 65,
            receitaMensal: '3.243,50',
            preco: '49,90',
            taxaRenovacao: 87,
          },
          {
            nome: 'Plano Intermediário',
            assinantes: 48,
            receitaMensal: '3.835,20',
            preco: '79,90',
            taxaRenovacao: 92,
          },
          {
            nome: 'Plano Premium',
            assinantes: 30,
            receitaMensal: '3.897,00',
            preco: '129,90',
            taxaRenovacao: 95,
          },
          {
            nome: 'Plano Corretor',
            assinantes: 12,
            receitaMensal: '1.482,30',
            preco: '199,90',
            taxaRenovacao: 90,
          },
        ],
      };

      setFinanceData(dadosFinanceiros);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading || !financeData) {
    return (
      <div className="h-full flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Financeiro</h1>
          <p className="mt-1 text-gray-500">Acompanhe o desempenho financeiro da plataforma</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="flex items-center text-sm bg-white border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 hover:bg-gray-50">
            <FaSearchDollar className="mr-2 text-gray-500" />
            <span>Filtrar</span>
          </button>
          <button className="flex items-center text-sm bg-white border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 hover:bg-gray-50">
            <FaFileDownload className="mr-2 text-gray-500" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Receita Total"
          value={financeData.metricas.receitaTotal}
          icon={<FaChartLine size={20} />}
        />
        <MetricCard 
          title="Receita Mensal"
          value={financeData.metricas.receitaMensal}
          icon={<FaRegCreditCard size={20} />}
        />
        <MetricCard 
          title="Assinantes Ativos"
          value={financeData.metricas.assinantesAtivos}
          icon={<FaUserPlus size={20} />}
        />
        <MetricCard 
          title="Ticket Médio"
          value={financeData.metricas.ticketMedio}
          icon={<FaExchangeAlt size={20} />}
        />
      </div>

      {/* Análise de receita */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-800">Análise de Receita</h2>
        </div>
        <div className="px-6 py-4">
          {/* Botões de período */}
          <div className="flex mb-6 border border-gray-200 rounded-lg divide-x divide-gray-200 overflow-hidden">
            <button 
              className={`flex-1 px-4 py-2 text-sm font-medium ${periodoAtivo === 'dia' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setPeriodoAtivo('dia')}
            >
              <div className="flex items-center justify-center">
                <FaCalendarDay className="mr-2" />
                <span>Diário</span>
              </div>
            </button>
            <button 
              className={`flex-1 px-4 py-2 text-sm font-medium ${periodoAtivo === 'semana' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setPeriodoAtivo('semana')}
            >
              <div className="flex items-center justify-center">
                <FaCalendarWeek className="mr-2" />
                <span>Semanal</span>
              </div>
            </button>
            <button 
              className={`flex-1 px-4 py-2 text-sm font-medium ${periodoAtivo === 'mes' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setPeriodoAtivo('mes')}
            >
              <div className="flex items-center justify-center">
                <FaCalendarAlt className="mr-2" />
                <span>Mensal</span>
              </div>
            </button>
            <button 
              className={`flex-1 px-4 py-2 text-sm font-medium ${periodoAtivo === 'ano' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setPeriodoAtivo('ano')}
            >
              <div className="flex items-center justify-center">
                <FaCalendarAlt className="mr-2" />
                <span>Anual</span>
              </div>
            </button>
          </div>
          
          {/* Dados do período */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <MetricCard 
                title={periodoAtivo === 'dia' ? 'Receita Diária' : 
                       periodoAtivo === 'semana' ? 'Receita Semanal' : 
                       periodoAtivo === 'mes' ? 'Receita Mensal' : 'Receita Anual'}
                value={financeData.comparativo[periodoAtivo].receita}
                icon={<FaChartLine size={20} />}
                change={financeData.comparativo[periodoAtivo].mudanca}
                changeType={financeData.comparativo[periodoAtivo].direcao}
                subtitle={financeData.comparativo[periodoAtivo].subtitulo}
              />
            </div>
            <div className="md:col-span-2">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 h-full">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Receita por Período</h3>
                <SimpleBarChart data={financeData.dadosGrafico[periodoAtivo]} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assinaturas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-800">Assinaturas</h2>
        </div>
        <div className="px-6 py-4">
          <SubscriptionDetails planos={financeData.planos} />
        </div>
      </div>

      {/* Transações Recentes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">Transações Recentes</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <RecentTransactions transactions={financeData.transacoesRecentes} />
        </div>
      </div>
    </div>
  );
} 