'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaImage, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { uploadMultipleImages } from '@/app/lib/supabase';

export default function EditarAnuncioPage() {
  const router = useRouter();
  const params = useParams();
  const anuncioId = params?.id as string;
  
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAnuncio, setIsLoadingAnuncio] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    fotos: [] as File[],
    fotosPreview: [] as string[],
    fotosExistentes: [] as string[],
    fotosParaRemover: [] as string[]
  });

  // Buscar dados do anúncio
  useEffect(() => {
    if (anuncioId && !loading) {
      // Recuperar anúncios do localStorage
      const savedAnuncios = localStorage.getItem('userAnuncios');
      if (savedAnuncios) {
        try {
          const anuncios = JSON.parse(savedAnuncios);
          const anuncio = anuncios.find((item: any) => item.id && item.id.toString() === anuncioId);
          
          if (anuncio) {
            console.log('Anúncio encontrado para edição:', anuncio);
            
            // Verificar se o usuário atual é o dono do anúncio
            if (!user) {
              toast.error('Você precisa estar logado para editar anúncios');
              router.push('/login');
              return;
            }
            
            // Para desenvolvimento, permitir a edição de todos os anúncios
            // Em produção, esta verificação será mais rigorosa
            // if (anuncio.userId !== user.id) {
            //   toast.error('Você não tem permissão para editar este anúncio');
            //   router.push('/anuncios');
            //   return;
            // }
            
            // Verificar se temos imagens salvas separadamente no localStorage
            const savedImagens = localStorage.getItem(`anuncio_imagens_${anuncioId}`);
            let imagensExistentes: string[] = [];
            
            if (savedImagens) {
              try {
                // Filtrar URLs inválidas (como blob:)
                const imagens = JSON.parse(savedImagens);
                imagensExistentes = Array.isArray(imagens) 
                  ? imagens.filter((url: any) => url && typeof url === 'string' && !url.startsWith('blob:'))
                  : [];
                
                console.log('Imagens recuperadas do localStorage (após filtro):', imagensExistentes);
              } catch (err) {
                console.error('Erro ao parsear imagens do localStorage:', err);
              }
            } else if (anuncio.imagens && Array.isArray(anuncio.imagens) && anuncio.imagens.length > 0) {
              // Se não temos no localStorage específico, mas temos no anúncio
              // Também filtrar URLs inválidas
              imagensExistentes = anuncio.imagens.filter((url: any) => url && typeof url === 'string' && !url.startsWith('blob:'));
              console.log('Usando imagens do objeto anúncio (após filtro):', imagensExistentes);
            } else if (anuncio.imagem && typeof anuncio.imagem === 'string' && !anuncio.imagem.startsWith('blob:')) {
              // Se só temos a imagem principal
              imagensExistentes = [anuncio.imagem];
              console.log('Usando imagem única do anúncio:', imagensExistentes);
            }
            
            // Preencher o formulário com os dados do anúncio
            setFormData({
              titulo: anuncio.titulo || '',
              descricao: anuncio.descricao || '',
              tipo: anuncio.tipo || 'apartamento',
              preco: anuncio.preco || '',
              area: anuncio.area || '',
              quartos: anuncio.quartos || '1',
              banheiros: anuncio.banheiros || '1',
              vagas: anuncio.vagas || '0',
              endereco: anuncio.endereco?.split(',')[0] || '',
              cidade: anuncio.cidade || '',
              estado: anuncio.estado || '',
              cep: anuncio.cep || '',
              aceitaPermuta: anuncio.aceitaPermuta || false,
              localPermuta: anuncio.localPermuta || '',
              fotos: [], // Não podemos carregar os arquivos File originais, apenas URLs
              fotosExistentes: imagensExistentes, // Guardar URLs das imagens existentes
              fotosPreview: [], // Será preenchido se o usuário adicionar novas fotos
              fotosParaRemover: [] // IDs ou URLs das fotos que devem ser removidas
            });
            
            setIsLoadingAnuncio(false);
            return;
          }
        } catch (err) {
          console.error('Erro ao carregar anúncios:', err);
        }
      }
      
      // Se não encontrou o anúncio
      toast.error('Anúncio não encontrado');
      router.push('/anuncios');
    }
  }, [anuncioId, user, loading, router]);

  // Redirecionar se o usuário não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Tratamento especial para o campo de preço
    if (name === 'preco') {
      // Remover caracteres não numéricos, exceto vírgula e ponto
      let precoLimpo = value.replace(/[^\d.,]/g, '');
      
      // Converter para formato numérico (remove pontos e substitui vírgula por ponto)
      let precoNumerico = precoLimpo.replace(/\./g, '').replace(',', '.');
      
      // Verificar se é um número válido
      const numero = parseFloat(precoNumerico);
      if (!isNaN(numero)) {
        // Formatar para exibição (sem o símbolo R$)
        const precoFormatado = numero.toLocaleString('pt-BR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
        
        setFormData(prev => ({
          ...prev,
          [name]: precoFormatado
        }));
      } else if (precoLimpo === '' || precoLimpo === ',' || precoLimpo === '.') {
        // Permitir campo vazio ou apenas vírgula/ponto
        setFormData(prev => ({
          ...prev,
          [name]: precoLimpo
        }));
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Verificar limite de arquivos
    const totalFotos = formData.fotos.length + formData.fotosExistentes.length;
    if (totalFotos + files.length > 10) {
      toast.error('Você pode adicionar no máximo 10 fotos');
      return;
    }

    const newFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    // Processar cada arquivo
    Array.from(files).forEach(file => {
      // Verificar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`O arquivo ${file.name} excede o limite de 5MB`);
        return;
      }

      // Verificar formato
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error(`O arquivo ${file.name} não é um formato permitido (JPG ou PNG)`);
        return;
      }

      newFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });

    // Atualizar o estado
    setFormData(prev => ({
      ...prev,
      fotos: [...prev.fotos, ...newFiles],
      fotosPreview: [...prev.fotosPreview, ...newPreviewUrls]
    }));

    // Limpar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    // Remover URL de preview
    URL.revokeObjectURL(formData.fotosPreview[index]);

    // Atualizar estado removendo o arquivo
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
      fotosPreview: prev.fotosPreview.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveFotoExistente = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fotosExistentes: prev.fotosExistentes.filter((_, i) => i !== index)
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
    
    // Verificar se há pelo menos uma foto (existente ou nova)
    if (formData.fotosExistentes.length === 0 && formData.fotos.length === 0) {
      toast.error('Adicione pelo menos uma foto do imóvel');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload de novas fotos, se houver
      let todasImagens = [...formData.fotosExistentes]; // Começamos com as existentes
      
      if (formData.fotos.length > 0) {
        const { urls, errors } = await uploadMultipleImages(
          formData.fotos,
          'imoveis',
          user?.id
        );
        
        if (errors.length > 0) {
          console.error('Erros ao fazer upload das imagens:', errors);
          toast.error('Algumas imagens não puderam ser enviadas');
        }
        
        if (urls.length > 0) {
          // Adicionar novas URLs à lista existente
          todasImagens = [...todasImagens, ...urls];
          console.log('Novas URLs de imagens após upload:', urls);
          console.log('Lista completa de imagens:', todasImagens);
        }
      }
      
      // Simulação de processamento para desenvolvimento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Recuperar anúncios atuais
      const savedAnuncios = localStorage.getItem('userAnuncios');
      if (!savedAnuncios) {
        throw new Error('Não foi possível localizar os anúncios');
      }
      
      const anuncios = JSON.parse(savedAnuncios);
      const anuncioIndex = anuncios.findIndex((item: any) => 
        item.id && item.id.toString() === anuncioId
      );
      
      if (anuncioIndex === -1) {
        throw new Error('Anúncio não encontrado');
      }
      
      // Atualizar os dados do anúncio
      const anuncioAtualizado = {
        ...anuncios[anuncioIndex],
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: formData.tipo,
        preco: formData.preco,
        area: formData.area,
        quartos: formData.quartos,
        banheiros: formData.banheiros,
        vagas: formData.vagas,
        endereco: `${formData.endereco}, ${formData.cidade} - ${formData.estado}`,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
        aceitaPermuta: formData.aceitaPermuta,
        localPermuta: formData.localPermuta,
        imagens: todasImagens,
        imagem: todasImagens.length > 0 ? todasImagens[0] : null,
        dataAtualizacao: new Date().toLocaleDateString('pt-BR')
      };
      
      // Atualizar a lista de anúncios
      anuncios[anuncioIndex] = anuncioAtualizado;
      localStorage.setItem('userAnuncios', JSON.stringify(anuncios));
      
      // Atualizar as imagens separadamente
      if (todasImagens.length > 0) {
        localStorage.setItem(`anuncio_imagens_${anuncioId}`, JSON.stringify(todasImagens));
      }
      
      toast.success('Anúncio atualizado com sucesso!');
      router.push('/anuncios');
    } catch (error) {
      console.error('Erro ao atualizar anúncio:', error);
      toast.error('Ocorreu um erro ao atualizar o anúncio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar um loading state enquanto verifica autenticação
  if (loading || isLoadingAnuncio) {
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
          <h1 className="text-base font-medium ml-2">Editar Anúncio</h1>
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
              
              {/* Fotos existentes */}
              {formData.fotosExistentes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-gray-700 font-medium mb-3">Fotos atuais:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.fotosExistentes.map((preview, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <div className="relative overflow-hidden rounded-md border border-gray-200 aspect-video">
                          <Image 
                            src={preview} 
                            alt={`Imagem ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            className="w-full h-full"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveFotoExistente(index)}
                          className="absolute top-2 right-2 bg-white bg-opacity-70 text-red-500 rounded-full p-1 shadow-sm hover:bg-opacity-100 transition-all"
                          title="Remover foto"
                        >
                          <FaTrash size={14} />
                        </button>
                        {index === 0 && formData.fotosPreview.length === 0 && (
                          <span className="absolute top-2 left-2 bg-[#4CAF50] text-white text-xs px-2 py-1 rounded-md">
                            Capa
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={triggerFileInput}
                >
                  <FaImage className="mx-auto text-gray-400 text-4xl mb-4" />
                  <p className="mb-2 text-gray-700">Arraste suas fotos aqui ou clique para selecionar</p>
                  <p className="text-sm text-gray-500 mb-4">Formatos aceitos: JPG, PNG (máx. 5MB cada)</p>
                  <button 
                    type="button"
                    className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50"
                  >
                    Adicionar novas fotos
                  </button>
                  
                  {/* Input de arquivo escondido */}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/jpeg, image/png, image/jpg"
                    multiple
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Você pode adicionar até 10 fotos. A primeira foto será a capa do seu anúncio.
                </p>
              </div>
              
              {/* Preview das novas imagens */}
              {formData.fotosPreview.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-gray-700 font-medium mb-3">Novas fotos:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.fotosPreview.map((preview, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <div className="relative overflow-hidden rounded-md border border-gray-200 aspect-video">
                          <Image 
                            src={preview} 
                            alt={`Imagem ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            className="w-full h-full"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="absolute top-2 right-2 bg-white bg-opacity-70 text-red-500 rounded-full p-1 shadow-sm hover:bg-opacity-100 transition-all"
                          title="Remover foto"
                        >
                          <FaTrash size={14} />
                        </button>
                        {index === 0 && formData.fotosExistentes.length === 0 && (
                          <span className="absolute top-2 left-2 bg-[#4CAF50] text-white text-xs px-2 py-1 rounded-md">
                            Capa
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
} 