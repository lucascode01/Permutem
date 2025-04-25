'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch, FaQuestion, FaExchangeAlt, FaCreditCard, FaShieldAlt, FaUserAlt } from 'react-icons/fa';

// Tipo para as perguntas do FAQ
type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: 'geral' | 'permuta' | 'conta' | 'pagamento' | 'seguranca';
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Lista de perguntas frequentes
  const faqItems: FAQItem[] = [
    // Perguntas Gerais
    {
      id: '1',
      question: 'O que é o Permutem?',
      answer: 'O Permutem é uma plataforma especializada em permutas imobiliárias, que conecta proprietários interessados em trocar seus imóveis entre si. Diferente de outros sites imobiliários, nosso foco principal está em facilitar o processo de permuta, permitindo que você encontre o imóvel ideal para suas necessidades enquanto oferece o seu em troca.',
      category: 'geral'
    },
    {
      id: '2',
      question: 'Como funciona a plataforma?',
      answer: 'Nossa plataforma funciona de maneira simples: cadastre-se, adicione seu imóvel com fotos e detalhes, e indique suas preferências para permuta (localização, tipo de imóvel, etc.). Você pode navegar pelos imóveis disponíveis, favoritar os que gostar, e entrar em contato com os proprietários para negociar. Quando encontrar um imóvel de interesse, pode enviar uma proposta de permuta diretamente pela plataforma.',
      category: 'geral'
    },
    {
      id: '3',
      question: 'É possível utilizar a plataforma gratuitamente?',
      answer: 'Sim! Oferecemos um plano gratuito que permite cadastrar um imóvel e navegar pelos anúncios disponíveis. No entanto, para acessar recursos avançados como múltiplos imóveis, destaque nos resultados de busca e estatísticas detalhadas, recomendamos nossos planos premium.',
      category: 'geral'
    },
    
    // Perguntas sobre Permuta
    {
      id: '4',
      question: 'Como funciona o processo de permuta?',
      answer: 'A permuta imobiliária é a troca de um imóvel por outro, com ou sem complemento financeiro (chamada de "torna"). Na plataforma, você indica interesse na permuta, envia uma proposta especificando qual imóvel seu está oferecendo em troca, e o outro proprietário pode aceitar, recusar ou fazer uma contraproposta. Se ambos concordarem, vocês podem prosseguir com a documentação necessária e finalizar a transação.',
      category: 'permuta'
    },
    {
      id: '5',
      question: 'Posso permutar imóveis de valores diferentes?',
      answer: 'Sim! É comum que os imóveis permutados tenham valores diferentes. Nesses casos, a diferença de valor (chamada de "torna" ou "volta") é paga pelo proprietário do imóvel de menor valor. Na nossa plataforma, você pode indicar se aceita pagar ou receber complemento financeiro na sua proposta de permuta.',
      category: 'permuta'
    },
    {
      id: '6',
      question: 'É possível permutar imóveis em diferentes cidades ou estados?',
      answer: 'Sim, é totalmente possível permutar imóveis localizados em cidades ou estados diferentes. Na verdade, esta é uma das grandes vantagens da permuta imobiliária, especialmente para quem planeja se mudar para outra região. Na nossa plataforma, você pode especificar exatamente onde está buscando um imóvel para permuta.',
      category: 'permuta'
    },
    {
      id: '7',
      question: 'A plataforma também permite permutas internacionais?',
      answer: 'Sim! O Permutem suporta permutas internacionais, permitindo que você troque seu imóvel no Brasil por propriedades em outros países, e vice-versa. Você pode indicar o país de interesse ao cadastrar seu imóvel e filtrar os resultados de busca por país. No entanto, recomendamos que consulte um advogado especializado em transações imobiliárias internacionais para orientação sobre aspectos legais específicos de cada país.',
      category: 'permuta'
    },
    
    // Perguntas sobre Conta
    {
      id: '8',
      question: 'Como criar uma conta no Permutem?',
      answer: 'Para criar uma conta, clique no botão "Cadastrar" no canto superior direito do site. Preencha o formulário com seus dados pessoais, crie uma senha segura e aceite os Termos de Uso e Política de Privacidade. Em seguida, verifique seu e-mail para confirmar sua conta. Após a confirmação, você poderá completar seu perfil e começar a cadastrar imóveis para permuta.',
      category: 'conta'
    },
    {
      id: '9',
      question: 'Como posso alterar meus dados cadastrais?',
      answer: 'Para alterar seus dados cadastrais, faça login na sua conta, clique no seu nome no canto superior direito e selecione "Perfil". Na página de perfil, você encontrará opções para editar suas informações pessoais, endereço, senha e preferências de notificação. Lembre-se de clicar em "Salvar" após fazer as alterações desejadas.',
      category: 'conta'
    },
    {
      id: '10',
      question: 'Como posso recuperar minha senha?',
      answer: 'Se esqueceu sua senha, clique em "Entrar" e depois em "Esqueceu sua senha?". Informe o e-mail cadastrado e enviaremos um link para redefinição de senha. Clique no link recebido no e-mail e siga as instruções para criar uma nova senha. Por segurança, o link expira em 24 horas.',
      category: 'conta'
    },
    
    // Perguntas sobre Pagamento
    {
      id: '11',
      question: 'Quais são os planos disponíveis?',
      answer: 'Oferecemos três planos: Gratuito (1 imóvel, funcionalidades básicas), Intermediário (até 5 imóveis, destaque na busca, estatísticas básicas) e Premium (imóveis ilimitados, prioridade nos resultados, estatísticas avançadas, suporte prioritário). Você pode comparar os planos detalhadamente em nossa página de assinaturas.',
      category: 'pagamento'
    },
    {
      id: '12',
      question: 'Como faço para contratar um plano premium?',
      answer: 'Para contratar um plano premium, acesse a página "Planos" após fazer login, escolha o plano desejado e clique em "Assinar". Você será direcionado para a página de pagamento, onde poderá escolher entre pagamento mensal ou anual (com desconto) e informar os dados do seu cartão. Após a confirmação do pagamento, seu plano será ativado imediatamente.',
      category: 'pagamento'
    },
    {
      id: '13',
      question: 'Como cancelar minha assinatura?',
      answer: 'Para cancelar sua assinatura, acesse seu perfil, vá para a seção "Meu Plano" e clique em "Cancelar Assinatura". Você precisará confirmar o cancelamento e informar o motivo. Sua assinatura continuará ativa até o fim do período pago, quando será automaticamente cancelada. Você pode reativar sua assinatura a qualquer momento antes do término do período.',
      category: 'pagamento'
    },
    
    // Perguntas sobre Segurança
    {
      id: '14',
      question: 'Como o Permutem garante a segurança das transações?',
      answer: 'O Permutem atua como uma plataforma de conexão entre proprietários e não participa diretamente das transações. No entanto, oferecemos recursos para aumentar a segurança: verificação de usuários, avaliações e comentários, chat interno para comunicação segura, e dicas de segurança para transações imobiliárias. Recomendamos sempre verificar a documentação dos imóveis e formalizar a transação com auxílio de profissionais especializados.',
      category: 'seguranca'
    },
    {
      id: '15',
      question: 'Meus dados estão protegidos na plataforma?',
      answer: 'Sim, a segurança dos seus dados é nossa prioridade. Utilizamos tecnologias avançadas de criptografia para proteger suas informações pessoais e financeiras. Nossa plataforma está em conformidade com a Lei Geral de Proteção de Dados (LGPD) e outras regulamentações aplicáveis. Para mais detalhes, consulte nossa Política de Privacidade.',
      category: 'seguranca'
    },
    {
      id: '16',
      question: 'Como denunciar um anúncio ou usuário suspeito?',
      answer: 'Se você identificar um anúncio ou usuário suspeito, clique no botão "Denunciar" disponível na página do anúncio ou no perfil do usuário. Selecione o motivo da denúncia e forneça detalhes adicionais se necessário. Nossa equipe irá analisar a denúncia e tomar as medidas cabíveis, podendo remover o anúncio ou suspender a conta em caso de violação dos nossos Termos de Uso.',
      category: 'seguranca'
    }
  ];
  
  // Filtrar perguntas por categoria e busca
  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'todas' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Alternar expansão de um item
  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // Categorias para o filtro
  const categories = [
    { id: 'todas', name: 'Todas', icon: FaQuestion },
    { id: 'geral', name: 'Geral', icon: FaQuestion },
    { id: 'permuta', name: 'Permuta', icon: FaExchangeAlt },
    { id: 'conta', name: 'Conta', icon: FaUserAlt },
    { id: 'pagamento', name: 'Pagamento', icon: FaCreditCard },
    { id: 'seguranca', name: 'Segurança', icon: FaShieldAlt }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Perguntas Frequentes</h1>
        <p className="text-gray-600 mb-8 text-center">Encontre respostas para as dúvidas mais comuns sobre nossa plataforma</p>
        
        {/* Busca */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Buscar pergunta ou resposta..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50] focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Filtros por categoria */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap flex items-center ${
                  activeCategory === category.id 
                    ? 'bg-[#4CAF50] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <category.icon className={`mr-2 ${activeCategory === category.id ? 'text-white' : 'text-[#4CAF50]'}`} />
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Lista de perguntas */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaQuestion className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-gray-800 font-medium mb-2">Nenhum resultado encontrado</h3>
              <p className="text-gray-600">
                Tente ajustar sua busca ou selecionar outra categoria.
              </p>
            </div>
          ) : (
            filteredFAQs.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-5 flex justify-between items-center text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-gray-800">{item.question}</h3>
                  {expandedItems.includes(item.id) ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                
                {expandedItems.includes(item.id) && (
                  <div className="px-5 pb-5">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* Seção de contato */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Não encontrou o que procurava?</h2>
          <p className="text-gray-600 text-center mb-6">
            Entre em contato com nossa equipe de suporte e teremos prazer em ajudar.
          </p>
          <div className="flex justify-center">
            <a href="/contato" className="px-6 py-3 bg-[#4CAF50] text-white rounded-md hover:bg-[#43a047] transition-colors">
              Entrar em contato
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 