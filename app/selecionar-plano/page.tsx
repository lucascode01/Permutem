'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';
import { FaCheck, FaTimes, FaQuestionCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { createCheckoutSession } from '../lib/checkout';

export default function SelecionarPlanoPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { planos } = useSupabase();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState<'proprietario' | 'corretor'>('proprietario');
  const [periodoPlano, setPeriodoPlano] = useState<'mensal' | 'anual'>('mensal');

  // Redirecionar se o usuário não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user && user.user_metadata && user.user_metadata.tipo_usuario) {
      setTipoUsuario(user.user_metadata.tipo_usuario as 'proprietario' | 'corretor');
    }
  }, [user, loading, router]);

  // Filtrar planos com base no tipo de usuário e período
  const planosDoUsuario = planos.filter(
    plano => plano.tipo_usuario === tipoUsuario
  );

  // Ordenar planos por ordem
  const planosOrdenados = [...planosDoUsuario].sort((a, b) => a.ordem - b.ordem);

  const handlePlanSelect = (planoId: string) => {
    // Buscar o plano para verificar se é o Torre Alta
    const plano = planos.find(p => p.id === planoId);
    
    // Não permitir selecionar o plano Torre Alta
    if (plano && (plano.nome === 'Plano Torre Alta' || 
        (plano.preco_personalizado && plano.limite_imoveis === null))) {
      return; // Não faz nada, pois este plano não é selecionável
    }
    
    setSelectedPlanId(planoId);
  };

  const handleCheckout = async () => {
    if (!selectedPlanId) {
      toast.error('Por favor, selecione um plano para continuar');
      return;
    }

    setIsProcessing(true);

    try {
      // Buscar o plano selecionado
      const planoSelecionado = planos.find(p => p.id === selectedPlanId);
      
      if (!planoSelecionado) {
        throw new Error('Plano não encontrado');
      }
      
      if (planoSelecionado.preco_personalizado) {
        // Para planos com preço personalizado, redirecionar para contato via WhatsApp
        window.open('https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20fazer%20um%20orçamento%20para%20o%20plano%20personalizado', '_blank');
        setIsProcessing(false);
        return;
      }
      
      // Redirecionar para a página de checkout com o ID do plano
      router.push(`/checkout?plano_id=${selectedPlanId}&periodo=${periodoPlano}`);
      
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      toast.error('Erro ao processar o pagamento. Por favor, tente novamente.');
      setIsProcessing(false);
    }
  };

  // Calcular preço com desconto para plano anual
  const calcularPrecoAnual = (precoMensal: number) => {
    // Aplicar desconto de 16% em planos anuais
    return precoMensal * 12 * 0.84;
  };

  // Renderizar um loading state enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0071ce] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não houver planos disponíveis para o tipo de usuário
  if (planosDoUsuario.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Nenhum plano disponível
            </h1>
            <p className="text-gray-700 mb-4">
              No momento não há planos disponíveis para o seu tipo de usuário.
              Por favor, entre em contato com o suporte para mais informações.
            </p>
            <Link href="/dashboard" className="inline-block bg-[#0071ce] hover:bg-blue-700 text-white font-medium py-3 px-6 rounded transition-colors">
              Ir para o Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Escolha seu plano
          </h1>
          
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Selecione o plano que melhor se adapta às suas necessidades
          </p>

          {/* Seleção de tipo de usuário */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full shadow-sm p-1 inline-flex">
              <button
                onClick={() => setTipoUsuario('proprietario')}
                className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                  tipoUsuario === 'proprietario' 
                    ? 'bg-[#0071ce] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Proprietário
              </button>
              <button
                onClick={() => setTipoUsuario('corretor')}
                className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                  tipoUsuario === 'corretor' 
                    ? 'bg-[#0071ce] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Corretor
              </button>
            </div>
          </div>

          {/* Toggle Mensal/Anual */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-full p-1 inline-flex">
              <button
                onClick={() => setPeriodoPlano('mensal')}
                className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                  periodoPlano === 'mensal' 
                    ? 'bg-white shadow-sm text-gray-800' 
                    : 'text-gray-600'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setPeriodoPlano('anual')}
                className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                  periodoPlano === 'anual' 
                    ? 'bg-white shadow-sm text-gray-800' 
                    : 'text-gray-600'
                }`}
              >
                Anual <span className="text-green-500 text-xs ml-1">Economize 16%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cards de planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {planosOrdenados.map((plano) => (
            <PlanCard
              key={plano.id}
              plano={plano}
              isSelected={selectedPlanId === plano.id}
              onSelect={() => handlePlanSelect(plano.id)}
              periodoPlano={periodoPlano}
              calcularPrecoAnual={calcularPrecoAnual}
            />
          ))}
        </div>

        {/* Botão de checkout */}
        <div className="text-center">
          <button
            onClick={handleCheckout}
            disabled={!selectedPlanId || isProcessing}
            className={`
              px-8 py-3 text-lg font-medium rounded-lg transition-all
              ${!selectedPlanId 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#0071ce] hover:bg-blue-700 text-white'
              }
            `}
          >
            {isProcessing ? (
              <>
                <span className="inline-block animate-spin mr-2">⟳</span>
                Processando...
              </>
            ) : (
              'Continuar para pagamento'
            )}
          </button>
        </div>
        
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Você pode cancelar sua assinatura a qualquer momento.</p>
          <p className="mt-1">Todas as transações são processadas com segurança.</p>
        </div>
      </div>
    </div>
  );
}

// Componente do cabeçalho
function Header() {
  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center">
        <Link href="/" className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div className="flex-1 flex justify-center">
          <Image 
            src="/images/permutem-logo.png" 
            alt="Permutem" 
            width={150} 
            height={40} 
            className="h-10 w-auto"
          />
        </div>
        <div className="w-6"></div> {/* Espaçador para centralizar a logo */}
      </div>
    </div>
  );
}

// Componente do card de plano
interface PlanCardProps {
  plano: {
    id: string;
    nome: string;
    descricao: string;
    preco?: number;
    valor_mensal: number; 
    valor_anual: number;
    recursos: string[];
    destaque: boolean;
    preco_personalizado?: boolean;
    limite_imoveis?: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  periodoPlano: 'mensal' | 'anual';
  calcularPrecoAnual: (precoMensal: number) => number;
}

function PlanCard({ plano, isSelected, onSelect, periodoPlano, calcularPrecoAnual }: PlanCardProps) {
  // Função para abrir o WhatsApp para contato
  const abrirWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que o clique afete o card inteiro
    window.open('https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20fazer%20um%20orçamento%20para%20o%20plano%20Torre%20Alta', '_blank');
  };

  // Verificar se é o plano Torre Alta (plano com imóveis indefinidos ou preço personalizado)
  const isTorreAlta = plano.nome === 'Plano Torre Alta' || plano.preco_personalizado;

  // Determinar o preço a ser exibido com base no período selecionado
  const precoExibido = periodoPlano === 'mensal' 
    ? (plano.preco || plano.valor_mensal) 
    : (plano.valor_anual || calcularPrecoAnual(plano.preco || plano.valor_mensal));

  return (
    <div 
      className={`
        relative bg-white rounded-xl overflow-hidden transition-all border 
        ${isSelected && !isTorreAlta
          ? 'border-[#0071ce] shadow-lg transform scale-[1.02]' 
          : 'border-gray-200 shadow-sm hover:shadow-md'
        }
        ${plano.destaque ? 'ring-1 ring-[#0071ce]' : ''}
      `}
      onClick={isTorreAlta ? undefined : onSelect}
    >
      {plano.destaque && (
        <div className="w-full bg-[#0071ce] text-white px-4 py-2 text-center font-medium">
          MAIS POPULAR
        </div>
      )}
      
      {plano.preco_personalizado && (
        <div className="w-full bg-purple-600 text-white px-4 py-2 text-center font-medium">
          Personalizado
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">{plano.nome}</h3>
        <p className="text-gray-600 text-sm mb-3">{plano.descricao}</p>
        
        <div className="mb-6">
          {plano.preco_personalizado ? (
            <div>
              <p className="text-2xl font-bold text-gray-800">Preço personalizado</p>
              <p className="text-sm text-gray-500">Entre em contato para um orçamento</p>
            </div>
          ) : (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">
                R$ {periodoPlano === 'mensal' 
                  ? Number(plano.preco || plano.valor_mensal).toFixed(2).replace('.', ',')
                  : Number(plano.valor_anual || calcularPrecoAnual(plano.preco || plano.valor_mensal)).toFixed(2).replace('.', ',')}
              </span>
              <span className="text-gray-600 ml-1">/{periodoPlano === 'mensal' ? 'mês' : 'ano'}</span>
            </div>
          )}
        </div>
        
        {plano.limite_imoveis && plano.limite_imoveis < 999999 && (
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
            {plano.limite_imoveis} {plano.limite_imoveis === 1 ? 'imóvel' : 'imóveis'}
          </div>
        )}
        
        <ul className="space-y-2 mb-6">
          {plano.recursos.map((recurso, index) => (
            <li key={index} className="flex items-start">
              <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{recurso}</span>
            </li>
          ))}
        </ul>
        
        {isTorreAlta ? (
          <button
            onClick={abrirWhatsApp}
            className="w-full py-2 rounded font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Solicitar orçamento
          </button>
        ) : (
          <button
            onClick={onSelect}
            className={`
              w-full py-2 rounded font-medium transition-colors
              ${isSelected
                ? 'bg-[#0071ce] text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }
            `}
          >
            {isSelected ? 'Selecionado' : 'Assinar plano'}
          </button>
        )}
      </div>
    </div>
  );
} 