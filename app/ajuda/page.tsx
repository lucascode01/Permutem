import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '../components/PageHeader';
import HydrationFix from '../components/HydrationFix';

export default function AjudaPage() {
  return (
    <>
      <HydrationFix />
      <PageHeader />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gray-50 mt-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Central de Ajuda</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Estamos aqui para ajudar você em todas as etapas do processo de permuta de imóveis.
              </p>
            </div>
          </div>
        </section>

        {/* Perguntas Frequentes Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Confira as respostas para as dúvidas mais comuns sobre o processo de permuta
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-primary">O que é permuta de imóveis?</h3>
                <p className="text-gray-600">Permuta de imóveis é a troca de um imóvel por outro, com ou sem complementação em dinheiro. É uma alternativa à compra e venda tradicional, permitindo maior flexibilidade nas negociações.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-primary">Como funciona a permuta internacional?</h3>
                <p className="text-gray-600">A permuta internacional permite trocar imóveis entre países diferentes. O Permuti conecta proprietários do Brasil, EUA e Portugal, facilitando o processo com suporte especializado.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-primary">Quais são os custos envolvidos?</h3>
                <p className="text-gray-600">Os custos para anunciar seu imóvel são acessíveis, com planos a partir de US$ 25 por mês, com os primeiros 30 dias gratuitos. Não cobramos comissão sobre as permutas realizadas.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-primary">Como são feitas as avaliações dos imóveis?</h3>
                <p className="text-gray-600">As avaliações são feitas pelos próprios proprietários ou corretores parceiros. Recomendamos sempre buscar avaliações profissionais independentes antes de finalizar qualquer negociação.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Formulário de Contato Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Ainda tem dúvidas?</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Preencha o formulário ao lado e nossa equipe entrará em contato o mais rápido possível para ajudar com suas dúvidas.
                </p>
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary rounded-full p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">E-mail</h3>
                      <p className="text-gray-600">contato@permuti.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-primary rounded-full p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Telefone</h3>
                      <p className="text-gray-600">+55 (11) 1234-5678</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-6">Formulário de Contato</h3>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">Nome completo</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">E-mail</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Digite seu e-mail"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 mb-2">Assunto</label>
                    <select 
                      id="subject" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="duvida">Dúvida sobre permuta</option>
                      <option value="problemas">Problemas no site</option>
                      <option value="sugestao">Sugestão</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-2">Mensagem</label>
                    <textarea 
                      id="message" 
                      rows={5} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Digite sua mensagem"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Enviar mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 