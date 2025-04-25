'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';
import { toast } from 'react-hot-toast';
import { FaLock, FaCreditCard, FaRegCreditCard } from 'react-icons/fa';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const { planos } = useSupabase();
  const [isProcessing, setIsProcessing] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<any>(null);
  const [formPagamento, setFormPagamento] = useState({
    numeroCartao: '',
    nomeCartao: '',
    validade: '',
    cvv: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: '',
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  // Obter o ID do plano da URL
  const planoId = searchParams.get('plano_id');

  // Redirecionamento se não estiver logado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Buscar detalhes do plano selecionado
  useEffect(() => {
    if (planoId && planos.length > 0) {
      const plano = planos.find(p => p.id === planoId);
      if (plano) {
        setPlanoSelecionado(plano);
      } else {
        // Plano não encontrado, redirecionar
        toast.error('Plano não encontrado');
        router.push('/selecionar-plano');
      }
    } else if (!planoId && !isLoading) {
      // Sem ID de plano, redirecionar
      router.push('/selecionar-plano');
    }
  }, [planoId, planos, router, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let novoValor = value;

    // Formatação para campos específicos
    if (name === 'numeroCartao') {
      // Formatar número do cartão (4 dígitos + espaço)
      novoValor = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    } else if (name === 'validade') {
      // Formatar validade (MM/AA)
      novoValor = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    } else if (name === 'cvv') {
      // Apenas números para CVV, máximo 4 dígitos
      novoValor = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormPagamento(prev => ({
      ...prev,
      [name]: novoValor
    }));

    // Limpar erro quando o usuário digita
    if (erros[name]) {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros[name];
        return novosErros;
      });
    }
  };

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};
    
    // Validar número do cartão (simplificado)
    if (formPagamento.numeroCartao.replace(/\s/g, '').length < 16) {
      novosErros.numeroCartao = 'Número de cartão inválido';
    }
    
    // Validar nome no cartão
    if (!formPagamento.nomeCartao.trim()) {
      novosErros.nomeCartao = 'Nome é obrigatório';
    }
    
    // Validar validade
    if (!/^\d{2}\/\d{2}$/.test(formPagamento.validade)) {
      novosErros.validade = 'Data inválida (MM/AA)';
    } else {
      const [mes, ano] = formPagamento.validade.split('/');
      const dataAtual = new Date();
      const anoAtual = dataAtual.getFullYear() % 100;
      const mesAtual = dataAtual.getMonth() + 1;
      
      if (parseInt(mes) < 1 || parseInt(mes) > 12) {
        novosErros.validade = 'Mês inválido';
      } else if ((parseInt(ano) < anoAtual) || 
                (parseInt(ano) === anoAtual && parseInt(mes) < mesAtual)) {
        novosErros.validade = 'Cartão expirado';
      }
    }
    
    // Validar CVV
    if (!/^\d{3,4}$/.test(formPagamento.cvv)) {
      novosErros.cvv = 'CVV inválido';
    }
    
    // Validar CEP
    if (!formPagamento.cep.trim()) {
      novosErros.cep = 'CEP é obrigatório';
    }
    
    // Validar endereço
    if (!formPagamento.endereco.trim()) {
      novosErros.endereco = 'Endereço é obrigatório';
    }
    
    // Validar cidade
    if (!formPagamento.cidade.trim()) {
      novosErros.cidade = 'Cidade é obrigatória';
    }
    
    // Validar estado
    if (!formPagamento.estado.trim()) {
      novosErros.estado = 'Estado é obrigatório';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }
    
    if (!planoSelecionado) {
      toast.error('Nenhum plano selecionado');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulação de processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulação de sucesso - em produção, aqui teria a integração real com Stripe
      const successRate = 0.9; // 90% de chance de sucesso no pagamento
      const isSuccess = Math.random() < successRate;
      
      if (isSuccess) {
        // Redirecionar para página de sucesso
        toast.success('Pagamento aprovado!');
        
        // Simular a criação de uma sessão Stripe
        const sessionId = `sim_${Date.now()}_${planoSelecionado.id}`;
        router.push(`/checkout-success?session_id=${sessionId}`);
      } else {
        // Simular erro de pagamento
        toast.error('Pagamento recusado. Verifique os dados do cartão.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Ocorreu um erro ao processar o pagamento');
      setIsProcessing(false);
    }
  };

  if (isLoading || !planoSelecionado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0071ce] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center">
          <Link href="/selecionar-plano" className="mr-4">
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
          <div className="w-6"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Finalizar Assinatura</h1>
          <p className="text-gray-600">Informe os dados de pagamento para ativar sua assinatura</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Resumo do plano */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-sm p-6 h-min">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">Resumo do Pedido</h2>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Plano:</span>
                <span className="font-medium">{planoSelecionado.nome}</span>
              </div>
              
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Período:</span>
                <span>Mensal</span>
              </div>
              
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Valor:</span>
                <span className="font-medium">R$ {planoSelecionado.preco.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t pt-3 mt-4">
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-[#0071ce]">R$ {planoSelecionado.preco.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Você será cobrado mensalmente. Sua assinatura pode ser cancelada a qualquer momento.
              </p>
              <div className="flex items-center mt-3 text-sm text-gray-600">
                <FaLock className="text-green-600 mr-1" /> Pagamento seguro via Stripe
              </div>
            </div>
          </div>

          {/* Formulário de pagamento */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">Informações de Pagamento</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="flex items-center mb-4 space-x-2">
                  <FaRegCreditCard className="text-gray-600" />
                  <h3 className="font-medium">Dados do Cartão</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      name="numeroCartao"
                      value={formPagamento.numeroCartao}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-3 py-2 border ${erros.numeroCartao ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071ce]`}
                    />
                    {erros.numeroCartao && (
                      <p className="mt-1 text-sm text-red-500">{erros.numeroCartao}</p>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      name="nomeCartao"
                      value={formPagamento.nomeCartao}
                      onChange={handleInputChange}
                      placeholder="NOME COMO ESTÁ NO CARTÃO"
                      className={`w-full px-3 py-2 border ${erros.nomeCartao ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071ce]`}
                    />
                    {erros.nomeCartao && (
                      <p className="mt-1 text-sm text-red-500">{erros.nomeCartao}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validade (MM/AA)
                    </label>
                    <input
                      type="text"
                      name="validade"
                      value={formPagamento.validade}
                      onChange={handleInputChange}
                      placeholder="MM/AA"
                      className={`w-full px-3 py-2 border ${erros.validade ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071ce]`}
                    />
                    {erros.validade && (
                      <p className="mt-1 text-sm text-red-500">{erros.validade}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código de Segurança (CVV)
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formPagamento.cvv}
                      onChange={handleInputChange}
                      placeholder="CVV"
                      className={`w-full px-3 py-2 border ${erros.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071ce]`}
                    />
                    {erros.cvv && (
                      <p className="mt-1 text-sm text-red-500">{erros.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4 space-x-2">
                  <FaCreditCard className="text-gray-600" />
                  <h3 className="font-medium">Endereço de Cobrança</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={formPagamento.cep}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                      className={`w-full px-3 py-2 border ${erros.cep ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071ce]`}
                    />
                    {erros.cep && (
                      <p className="mt-1 text-sm text-red-500">{erros.cep}</p>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      name="endereco"
                      value={formPagamento.endereco}
                      onChange={handleInputChange}
                      placeholder="Rua, número, complemento"
                      className={`w-full px-3 py-2 border ${erros.endereco ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071ce]`}
                    />
                    {erros.endereco && (
                      <p className="mt-1 text-sm text-red-500">{erros.endereco}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      value={formPagamento.cidade}
                      onChange={handleInputChange}
                      placeholder="Sua cidade"
                      className={`w-full px-3 py-2 border ${erros.cidade ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071ce]`}
                    />
                    {erros.cidade && (
                      <p className="mt-1 text-sm text-red-500">{erros.cidade}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      name="estado"
                      value={formPagamento.estado}
                      onChange={handleInputChange}
                      placeholder="UF"
                      className={`w-full px-3 py-2 border ${erros.estado ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071ce]`}
                    />
                    {erros.estado && (
                      <p className="mt-1 text-sm text-red-500">{erros.estado}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6 mt-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#0071ce] hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⟳</span>
                      Processando pagamento...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" />
                      Pagar R$ {planoSelecionado.preco.toFixed(2)}
                    </>
                  )}
                </button>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                  Ao finalizar seu pagamento, você concorda com os{' '}
                  <Link href="/termos" className="text-[#0071ce]">
                    Termos de Serviço
                  </Link>{' '}
                  e{' '}
                  <Link href="/privacidade" className="text-[#0071ce]">
                    Política de Privacidade
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 