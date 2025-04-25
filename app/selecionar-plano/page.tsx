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
  const { user, isLoading } = useAuth();
  const { planos } = useSupabase();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirecionar se o usuário não estiver logado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Filtrar planos com base no tipo de usuário
  const planosDoUsuario = planos.filter(
    plano => plano.tipo_usuario === user?.userType && plano.periodo === 'mensal'
  );

  // Ordenar planos por ordem
  const planosOrdenados = [...planosDoUsuario].sort((a, b) => a.ordem - b.ordem);

  const handlePlanSelect = (planoId: string) => {
    // Buscar o plano para verificar se é o Torre Alta
    const plano = planos.find(p => p.id === planoId);
    
    // Não permitir selecionar o plano Torre Alta
    if (plano && (plano.nome === 'Plano Torre Alta' || 
        (plano.preco_personalizado && plano.limite_imoveis === 999999))) {
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
      router.push(`/checkout?plano_id=${selectedPlanId}`);
      
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      toast.error('Erro ao processar o pagamento. Por favor, tente novamente.');
      setIsProcessing(false);
    }
  };

  // Renderizar um loading state enquanto verifica autenticação
  if (isLoading) {
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
            {user?.userType === 'proprietario' 
              ? 'Escolha o plano ideal para anunciar seus imóveis e encontrar as melhores oportunidades de permuta.'
              : 'Escolha o plano ideal para sua imobiliária e comece a anunciar seus imóveis para permuta.'}
          </p>
        </div>

        {/* Cards de planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {planosOrdenados.map((plano) => (
            <PlanCard
              key={plano.id}
              plano={plano}
              isSelected={selectedPlanId === plano.id}
              onSelect={() => handlePlanSelect(plano.id)}
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
          <p className="mt-1">Todas as transações são processadas com segurança pela Stripe.</p>
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
    preco: number;
    recursos: string[];
    destaque: boolean;
    preco_personalizado?: boolean;
    limite_imoveis?: number;
  };
  isSelected: boolean;
  onSelect: () => void;
}

function PlanCard({ plano, isSelected, onSelect }: PlanCardProps) {
  // Função para abrir o WhatsApp para contato
  const abrirWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que o clique afete o card inteiro
    window.open('https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20fazer%20um%20orçamento%20para%20o%20plano%20Torre%20Alta', '_blank');
  };

  // Verificar se é o plano Torre Alta (plano com imóveis indefinidos ou preço personalizado)
  const isTorreAlta = plano.nome === 'Plano Torre Alta' || (plano.preco_personalizado && plano.limite_imoveis === 999999);

  return (
    <div 
      className={`
        relative bg-white rounded-xl overflow-hidden transition-all border-2
        ${isSelected && !isTorreAlta
          ? 'border-[#0071ce] shadow-lg transform scale-[1.02]' 
          : 'border-gray-200 shadow-sm hover:shadow-md'
        }
        ${plano.destaque ? 'ring-2 ring-[#0071ce] ring-opacity-50' : ''}
      `}
      onClick={isTorreAlta ? undefined : onSelect}
    >
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
        <h3 className="text-xl font-bold text-gray-800">{plano.nome}</h3>
        <p className="text-gray-600 text-sm mb-3">{plano.descricao}</p>
        
        <div className="mb-6">
          {plano.preco_personalizado ? (
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-800">Consulte</span>
              <button className="ml-2 text-gray-500 hover:text-[#0071ce]">
                <FaQuestionCircle />
              </button>
            </div>
          ) : (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">
                R$ {plano.preco.toFixed(2)}
              </span>
              <span className="text-gray-600 ml-1">/mês</span>
            </div>
          )}
        </div>
        
        {plano.limite_imoveis && plano.limite_imoveis < 999999 && (
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
            Até {plano.limite_imoveis} imóveis
          </div>
        )}
        
        {plano.limite_imoveis && plano.limite_imoveis === 999999 && (
          <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
            Imóveis ilimitados
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
            Fazer Orçamento
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
            {isSelected ? 'Selecionado' : 'Selecionar Plano'}
          </button>
        )}
      </div>
    </div>
  );
} 