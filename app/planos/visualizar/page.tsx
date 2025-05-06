'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheck, FaTimes, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';
import PageHeader from '../../components/PageHeader';
import type { Plano } from '../../lib/types';

// Dados estáticos de planos para a visualização pública
const PLANOS_ESTATICOS: Plano[] = [
  {
    id: 'basic',
    nome: 'Plano Proprietário',
    descricao: 'Ideal para proprietários de imóveis',
    valor_mensal: 40.00,
    valor_anual: 400.00,
    max_anuncios: 5,
    recursos: ['Até 5 imóveis cadastrados', 'Visualização de propostas', 'Suporte por email', 'Destaque nos resultados de busca'],
    ativo: true,
    ordem: 1,
    destaque: true,
    tipo_usuario: 'proprietario',
    periodo: 'mensal',
    preco: 40.00,
    limite_imoveis: 5,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  },
  {
    id: 'plus',
    nome: 'Plano Proprietário Plus',
    descricao: 'Para proprietários com múltiplos imóveis',
    valor_mensal: 75.00,
    valor_anual: 750.00,
    max_anuncios: 10,
    recursos: [
      'Até 10 imóveis cadastrados',
      'Visualização de propostas',
      'Suporte prioritário',
      'Destaque nos resultados de busca',
      'Estatísticas de visualização'
    ],
    ativo: true,
    ordem: 2,
    destaque: false,
    tipo_usuario: 'proprietario',
    periodo: 'mensal',
    preco: 75.00,
    limite_imoveis: 10,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  },
  {
    id: 'chave',
    nome: 'Plano Chave',
    descricao: 'Para corretores e imobiliárias de pequeno porte',
    valor_mensal: 180.00,
    valor_anual: 1800.00,
    max_anuncios: 30,
    recursos: [
      'Até 30 imóveis cadastrados',
      'Visualização de propostas',
      'Destaque na busca',
      'Suporte prioritário',
      'Dashboard de estatísticas'
    ],
    ativo: true,
    ordem: 1,
    destaque: false,
    tipo_usuario: 'corretor',
    periodo: 'mensal',
    preco: 180.00,
    limite_imoveis: 30,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  },
  {
    id: 'porta-aberta',
    nome: 'Plano Porta Aberta',
    descricao: 'Para imobiliárias de médio porte',
    valor_mensal: 290.00,
    valor_anual: 2900.00,
    max_anuncios: 70,
    recursos: [
      'Até 70 imóveis cadastrados',
      'Visualização de propostas',
      'Destaque na busca',
      'Análise de mercado',
      'Suporte prioritário',
      'Dashboard de estatísticas'
    ],
    ativo: true,
    ordem: 2,
    destaque: true,
    tipo_usuario: 'corretor',
    periodo: 'mensal',
    preco: 290.00,
    limite_imoveis: 70,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  },
  {
    id: 'troca-premium',
    nome: 'Plano Troca Premium',
    descricao: 'Para imobiliárias que desejam mais visibilidade',
    valor_mensal: 390.00,
    valor_anual: 3900.00,
    max_anuncios: 100,
    recursos: [
      'Até 100 imóveis cadastrados',
      'Visualização de propostas',
      'Destaque na busca',
      'Análise de mercado',
      'Suporte 24/7',
      'Dashboard completo de estatísticas',
      'Certificação de anúncios',
      'Relatórios mensais de performance'
    ],
    ativo: true,
    ordem: 3,
    destaque: false,
    tipo_usuario: 'corretor',
    periodo: 'mensal',
    preco: 390.00,
    limite_imoveis: 100,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  },
  {
    id: 'torre-alta',
    nome: 'Plano Torre Alta',
    descricao: 'Para grandes imobiliárias e redes',
    valor_mensal: 0,
    valor_anual: 0,
    max_anuncios: 999999,
    recursos: [
      'Acima de 100 imóveis cadastrados',
      'Visualização de propostas',
      'Posição privilegiada nos resultados',
      'Análise de mercado completa',
      'Suporte dedicado 24/7',
      'API para integração com sistemas',
      'Dashboard executivo de estatísticas',
      'Certificação premium de anúncios',
      'Relatórios personalizados'
    ],
    ativo: true,
    ordem: 4,
    destaque: false,
    tipo_usuario: 'corretor',
    periodo: 'mensal',
    preco: 0,
    preco_personalizado: true,
    limite_imoveis: 999999,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  }
];

export default function VisualizarPlanosPage() {
  const [userType, setUserType] = useState<'proprietario' | 'corretor'>('proprietario');

  // Filtrar planos com base no tipo de usuário selecionado
  const planosDoUsuario = PLANOS_ESTATICOS.filter(
    plano => plano.tipo_usuario === userType && plano.periodo === 'mensal'
  );

  // Ordenar planos por ordem
  const planosOrdenados = [...planosDoUsuario].sort((a, b) => a.ordem - b.ordem);

  // Função para alternar entre tipos de usuário
  const alternarTipoUsuario = (tipo: 'proprietario' | 'corretor') => {
    setUserType(tipo);
  };

  return (
    <>
      <PageHeader />
      <main className="min-h-screen flex flex-col bg-gray-50 pt-20">
        <div className="w-full bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center">
            <Link href="/como-funciona" className="flex items-center text-gray-600 hover:text-primary">
              <FaArrowLeft className="mr-2" />
              <span>Voltar para Como Funciona</span>
            </Link>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Nossos Planos
            </h1>
            
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Escolha o plano ideal para anunciar seus imóveis e encontrar as melhores oportunidades de permuta.
            </p>
            
            {/* Alternador de tipo de usuário */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => alternarTipoUsuario('proprietario')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    userType === 'proprietario' 
                      ? 'bg-primary text-white' 
                      : 'bg-transparent text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Proprietário
                </button>
                <button
                  onClick={() => alternarTipoUsuario('corretor')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    userType === 'corretor' 
                      ? 'bg-primary text-white' 
                      : 'bg-transparent text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Corretor
                </button>
              </div>
            </div>
          </div>

          {/* Se não houver planos disponíveis para o tipo de usuário */}
          {planosDoUsuario.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-center max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Nenhum plano disponível
              </h2>
              <p className="text-gray-700 mb-4">
                No momento não há planos disponíveis para este tipo de usuário.
                Por favor, entre em contato com o suporte para mais informações.
              </p>
            </div>
          ) : (
            <>
              {/* Cards de planos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {planosOrdenados.map((plano) => (
                  <PlanCard
                    key={plano.id}
                    plano={plano}
                    userType={userType}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* CTA final */}
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-gray-600 mb-6">
              Crie sua conta agora e comece a anunciar seus imóveis para permuta.
            </p>
            <div className="flex justify-center space-x-4 flex-wrap">
              <Link 
                href="/cadastro" 
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors mb-2 sm:mb-0"
              >
                Criar conta
              </Link>
              <Link 
                href="/login" 
                className="bg-white border border-primary text-primary hover:bg-gray-50 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Entrar na plataforma
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// Componente do card de plano
interface PlanCardProps {
  plano: Plano;
  userType: 'proprietario' | 'corretor';
}

function PlanCard({ plano, userType }: PlanCardProps) {
  // Verificar se é o plano Torre Alta (plano com imóveis indefinidos ou preço personalizado)
  const isTorreAlta = plano.nome === 'Plano Torre Alta' || (plano.preco_personalizado && plano.limite_imoveis === 999999);

  // Função para abrir WhatsApp para contato sobre plano personalizado
  const contatoWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20obter%20mais%20informações%20sobre%20o%20plano%20personalizado', '_blank');
  };

  return (
    <div className={`
      relative bg-white rounded-xl overflow-hidden transition-all border-2
      ${plano.destaque ? 'border-[#0071ce] shadow-lg' : 'border-gray-200 shadow-sm hover:shadow-md'}
    `}>
      {plano.destaque && (
        <div className="absolute top-0 right-0 bg-[#0071ce] text-white px-4 py-1 text-sm font-medium">
          Mais Popular
        </div>
      )}
      
      {plano.preco_personalizado && (
        <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 text-sm font-medium">
          Personalizado
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{plano.nome}</h3>
        <p className="text-gray-600 mb-4 min-h-[48px]">{plano.descricao}</p>
        
        {plano.preco_personalizado ? (
          <div className="text-center mb-6">
            <span className="text-2xl font-bold text-gray-800">Preço personalizado</span>
            <p className="text-sm text-gray-500">Entre em contato para um orçamento</p>
          </div>
        ) : (
          <div className="text-center mb-6">
            <span className="text-3xl font-bold text-gray-800">
              R$ {((plano.preco !== undefined) ? plano.preco : plano.valor_mensal).toFixed(2).replace('.', ',')}
            </span>
            <span className="text-gray-500">/mês</span>
          </div>
        )}
        
        <div className="space-y-3 mb-6">
          {plano.recursos.map((recurso, index) => (
            <div key={index} className="flex items-start">
              <div className="shrink-0 mt-1">
                <FaCheck className="h-4 w-4 text-green-500" />
              </div>
              <p className="ml-2 text-sm text-gray-600">{recurso}</p>
            </div>
          ))}
        </div>
        
        <div className="pt-4">
          {isTorreAlta || plano.preco_personalizado ? (
            <button
              onClick={contatoWhatsApp}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Solicitar orçamento
            </button>
          ) : (
            <Link 
              href={`/cadastro?userType=${userType}&plano=${plano.id}`}
              className="block w-full bg-primary hover:bg-primary-dark text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Selecionar plano
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 