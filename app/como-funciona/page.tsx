'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaExchangeAlt, FaHome, FaSearch, FaComments, FaFileContract, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import HydrationFix from '../components/HydrationFix';

// Importando o componente HowItWorks
import HowItWorks from '../components/HowItWorks';

// Tipo para as perguntas frequentes
type FAQ = {
  question: string;
  answer: string;
};

export default function ComoFuncionaPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  
  // Lista de etapas do processo
  const steps = [
    {
      title: 'Cadastre seu imóvel',
      description: 'Adicione fotos, descrição detalhada e especifique suas preferências para permuta (localização, tipo de imóvel, etc).',
      icon: FaHome,
      color: 'bg-blue-500'
    },
    {
      title: 'Busque imóveis compatíveis',
      description: 'Utilize os filtros de busca para encontrar imóveis que correspondam aos seus interesses para permuta.',
      icon: FaSearch,
      color: 'bg-green-500'
    },
    {
      title: 'Negocie com o proprietário',
      description: 'Entre em contato com proprietários e discuta detalhes sobre os imóveis e condições para permuta.',
      icon: FaComments,
      color: 'bg-yellow-500'
    },
    {
      title: 'Formalize a proposta',
      description: 'Envie uma proposta oficial através da plataforma, especificando o imóvel oferecido e eventuais complementos.',
      icon: FaFileContract,
      color: 'bg-orange-500'
    },
    {
      title: 'Conclua a permuta',
      description: 'Após aceite da proposta, finalize a transação com auxílio de profissionais (advogados, cartórios) para garantir segurança jurídica.',
      icon: FaCheckCircle,
      color: 'bg-purple-500'
    }
  ];
  
  // Perguntas frequentes sobre permuta
  const faqs: FAQ[] = [
    {
      question: 'O que é permuta imobiliária?',
      answer: 'Permuta imobiliária é a troca de um imóvel por outro, com ou sem complemento financeiro (chamado de "torna"). É uma alternativa à compra e venda tradicional, onde os proprietários trocam seus imóveis entre si, permitindo que ambos adquiram propriedades que atendam melhor às suas necessidades sem necessariamente envolver grandes quantias em dinheiro.'
    },
    {
      question: 'Quais são as vantagens da permuta?',
      answer: 'A permuta imobiliária oferece diversas vantagens: redução da necessidade de capital para aquisição de um novo imóvel, possibilidade de economia em impostos e taxas (em alguns casos), facilidade para mudar para outra cidade ou região, agilidade na transação quando comparada a vender um imóvel e depois comprar outro, e flexibilidade nas negociações.'
    },
    {
      question: 'Posso permutar imóveis de valores diferentes?',
      answer: 'Sim! É muito comum que os imóveis permutados tenham valores diferentes. Nesses casos, a diferença de valor (chamada de "torna") é paga pelo proprietário do imóvel de menor valor. Na nossa plataforma, você pode indicar se aceita pagar ou receber complemento financeiro na sua proposta de permuta.'
    },
    {
      question: 'É possível fazer permuta de imóveis em cidades diferentes?',
      answer: 'Sim, é totalmente possível permutar imóveis localizados em cidades ou estados diferentes. Na verdade, esta é uma das grandes vantagens da permuta imobiliária, especialmente para quem planeja se mudar para outra região. Na nossa plataforma, você pode especificar exatamente onde está buscando um imóvel para permuta.'
    },
    {
      question: 'Quais documentos são necessários para uma permuta?',
      answer: 'Os documentos necessários para uma permuta são semelhantes aos de uma compra e venda: certidão de matrícula atualizada dos imóveis, IPTU, RGI, certidões negativas de débitos, documentos pessoais dos proprietários (RG, CPF, certidão de casamento se aplicável), entre outros. Recomendamos consultar um advogado especializado para garantir que toda a documentação esteja em ordem.'
    },
    {
      question: 'Como funcionam os impostos em uma permuta?',
      answer: 'Na permuta imobiliária, incidem os mesmos impostos de uma transação normal: ITBI (Imposto sobre Transmissão de Bens Imóveis) e, eventualmente, Imposto de Renda sobre ganho de capital. No entanto, o ITBI geralmente incide apenas sobre a diferença de valores (torna), quando há. Já o IR pode ter tratamento diferenciado em permutas, com possibilidade de diferimento. Consulte um contador ou advogado tributarista para orientações específicas ao seu caso.'
    },
    {
      question: 'A plataforma Permutem cobra alguma taxa pela permuta?',
      answer: 'O Permutem não cobra comissão ou taxas sobre o valor da permuta realizada. Nossa receita vem dos planos de assinatura que oferecem recursos adicionais aos usuários. Atuamos apenas como uma plataforma de conexão entre proprietários interessados em permutar seus imóveis.'
    }
  ];
  
  // Benefícios da permuta
  const benefits = [
    {
      title: 'Economia Financeira',
      description: 'Reduza a necessidade de capital para adquirir um novo imóvel e economize em impostos em determinadas situações.'
    },
    {
      title: 'Facilidade de Mudança',
      description: 'Permute seu imóvel por outro em uma cidade diferente, facilitando relocações para trabalho ou família.'
    },
    {
      title: 'Agilidade na Transação',
      description: 'Evite o processo de vender um imóvel para depois comprar outro, realizando tudo em uma única transação.'
    },
    {
      title: 'Flexibilidade de Negociação',
      description: 'Possibilidade de ajustes nas condições da permuta, incluindo complementos financeiros e prazos.'
    }
  ];
  
  // Alternar a expansão de uma FAQ
  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };
  
  return (
    <>
      <HydrationFix />
      <PageHeader />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gray-50 mt-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Como funciona o Permutem</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Somos o único portal do mundo de permuta internacional de imóveis, conectando proprietários do Brasil, EUA e Portugal.
              </p>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <HowItWorks />

        {/* Benefícios Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Benefícios de usar o Permutem</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Descubra como nossa plataforma facilita a permuta de imóveis no Brasil e internacionalmente
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Alcance Nacional</h3>
                <p className="text-gray-600">Acesso a proprietários em todo o Brasil, expandindo suas possibilidades de negócio.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Economia</h3>
                <p className="text-gray-600">Custos reduzidos em comparação com métodos tradicionais de venda e compra de imóveis.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Segurança</h3>
                <p className="text-gray-600">Plataforma segura com verificação de usuários e suporte especializado durante todo o processo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold mb-4">Pronto para permutar seu imóvel?</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                Comece agora mesmo e encontre a melhor opção para sua permuta nacional ou internacional.
              </p>
              <div className="flex justify-center space-x-4 flex-wrap">
                <Link href="/cadastro" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors mb-2 sm:mb-0">
                  Anunciar meu imóvel
                </Link>
                <Link href="/planos/visualizar" className="bg-white border border-primary text-primary hover:bg-gray-50 font-bold py-3 px-6 rounded-lg transition-colors mb-2 sm:mb-0">
                  Conheça nossos planos
                </Link>
                <Link href="/ajuda" className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-6 rounded-lg transition-colors">
                  Saiba mais
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 