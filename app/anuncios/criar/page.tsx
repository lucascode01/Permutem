'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaImage, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

export default function CriarAnuncioPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'apartamento',
    preco: '',
    area: '',
    quartos: '1',
    banheiros: '1',
    vagas: '0',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    aceitaPermuta: false,
    localPermuta: '',
  });

  // Redirecionar se o usuário não estiver logado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const goToNextStep = () => {
    setStep(prevStep => prevStep + 1);
    window.scrollTo(0, 0);
  };

  const goToPrevStep = () => {
    setStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulação de envio para API
      console.log('Dados a serem enviados:', formData);
      
      // Aguarde 1 segundo para simular envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecione para a página de anúncios
      router.push('/anuncios');
    } catch (error) {
      console.error('Erro ao enviar anúncio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar um loading state enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-12">
      {/* Cabeçalho */}
      <header className="bg-white text-gray-800 border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 pt-6 pb-4 flex items-center">
          <Link href="/anuncios" className="text-gray-500 hover:text-gray-700 transition-colors mr-3">
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-medium ml-2">Cadastrar Imóvel</h1>
        </div>
      </header>

      {/* Progresso */}
      <div className="bg-white border-b mt-4">
        <div className="container mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 1 ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-[#4CAF50]' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${step >= 2 ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <div className={`flex-1 h-1 ${step >= 3 ? 'bg-[#4CAF50]' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 ${step >= 3 ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Dados básicos</span>
            <span className="text-gray-600">Localização</span>
            <span className="text-gray-600">Fotos</span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Informações Básicas</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="titulo" className="block text-gray-700 mb-1">Título do anúncio</label>
                  <input 
                    type="text" 
                    id="titulo" 
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Ex: Apartamento 2 quartos em Botafogo"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="descricao" className="block text-gray-700 mb-1">Descrição</label>
                  <textarea 
                    id="descricao" 
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Descreva seu imóvel com detalhes..."
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="tipo" className="block text-gray-700 mb-1">Tipo de imóvel</label>
                  <select 
                    id="tipo" 
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    required
                  >
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Imóvel Comercial</option>
                    <option value="rural">Imóvel Rural</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="preco" className="block text-gray-700 mb-1">Preço (R$)</label>
                  <input 
                    type="text" 
                    id="preco" 
                    name="preco"
                    value={formData.preco}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Ex: 450000"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="area" className="block text-gray-700 mb-1">Área (m²)</label>
                    <input 
                      type="text" 
                      id="area" 
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                      placeholder="Ex: 75"
                    />
                  </div>
                  <div>
                    <label htmlFor="quartos" className="block text-gray-700 mb-1">Quartos</label>
                    <select 
                      id="quartos" 
                      name="quartos"
                      value={formData.quartos}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="banheiros" className="block text-gray-700 mb-1">Banheiros</label>
                    <select 
                      id="banheiros" 
                      name="banheiros"
                      value={formData.banheiros}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vagas" className="block text-gray-700 mb-1">Vagas de garagem</label>
                    <select 
                      id="vagas" 
                      name="vagas"
                      value={formData.vagas}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4+">4+</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="aceitaPermuta" 
                    name="aceitaPermuta"
                    checked={formData.aceitaPermuta}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                  />
                  <label htmlFor="aceitaPermuta" className="ml-2 block text-gray-700">
                    Aceito permuta em outro imóvel
                  </label>
                </div>
                
                {formData.aceitaPermuta && (
                  <div>
                    <label htmlFor="localPermuta" className="block text-gray-700 mb-1">Onde aceitaria imóvel para permuta?</label>
                    <input 
                      type="text" 
                      id="localPermuta" 
                      name="localPermuta"
                      value={formData.localPermuta}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                      placeholder="Ex: São Paulo, Rio de Janeiro"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={goToNextStep}
                  className="bg-[#4CAF50] hover:bg-[#43a047] text-white font-medium py-2 px-6 rounded-md"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Localização</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="endereco" className="block text-gray-700 mb-1">Endereço</label>
                  <input 
                    type="text" 
                    id="endereco" 
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Ex: Rua São Clemente, 123"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cidade" className="block text-gray-700 mb-1">Cidade</label>
                    <input 
                      type="text" 
                      id="cidade" 
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                      placeholder="Ex: Rio de Janeiro"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="estado" className="block text-gray-700 mb-1">Estado</label>
                    <input 
                      type="text" 
                      id="estado" 
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                      placeholder="Ex: RJ"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="cep" className="block text-gray-700 mb-1">CEP</label>
                  <input 
                    type="text" 
                    id="cep" 
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Ex: 22000-000"
                  />
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md flex items-center mt-4">
                  <FaMapMarkerAlt className="text-[#4CAF50] mr-3 text-xl" />
                  <p className="text-gray-600 text-sm">
                    A localização exata do seu imóvel não será exibida publicamente. Apenas o bairro e a cidade serão mostrados no anúncio.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button 
                  onClick={goToPrevStep}
                  className="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button 
                  onClick={goToNextStep}
                  className="bg-[#4CAF50] hover:bg-[#43a047] text-white font-medium py-2 px-6 rounded-md"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-6">Fotos do Imóvel</h2>
              
              <div className="mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FaImage className="mx-auto text-gray-400 text-4xl mb-4" />
                  <p className="mb-2 text-gray-700">Arraste suas fotos aqui ou clique para selecionar</p>
                  <p className="text-sm text-gray-500 mb-4">Formatos aceitos: JPG, PNG (máx. 5MB cada)</p>
                  <button 
                    type="button"
                    className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50"
                  >
                    Selecionar fotos
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Você pode adicionar até 10 fotos. A primeira foto será a capa do seu anúncio.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md mb-8">
                <h3 className="text-yellow-800 font-medium mb-2">Dicas para fotos de qualidade:</h3>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Use fotos bem iluminadas e nítidas</li>
                  <li>Capture todos os cômodos principais</li>
                  <li>Organize e limpe o ambiente antes de fotografar</li>
                  <li>Fotos horizontais funcionam melhor</li>
                </ul>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button 
                  type="button"
                  onClick={goToPrevStep}
                  className="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#4CAF50] hover:bg-[#43a047] text-white font-medium py-2 px-6 rounded-md disabled:opacity-70"
                >
                  {isSubmitting ? 'Publicando...' : 'Publicar Anúncio'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
} 