'use client';

import React from 'react';
import PageHeader from '../components/PageHeader';
import HydrationFix from '../components/HydrationFix';
import Link from 'next/link';

export default function PrivacidadePage() {
  return (
    <>
      <HydrationFix />
      <PageHeader />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gray-50 mt-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Política de Privacidade</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                O Permutem valoriza sua privacidade. Saiba como coletamos, utilizamos e protegemos seus dados pessoais.
              </p>
            </div>
          </div>
        </section>

        {/* Conteúdo da Política de Privacidade */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-6">1. Introdução</h2>
              <p className="mb-6">
                A presente Política de Privacidade tem por finalidade demonstrar o compromisso do Permutem com a privacidade e a proteção dos dados pessoais coletados de seus usuários, estabelecendo as regras sobre a coleta, registro, armazenamento, uso, compartilhamento e eliminação dos dados coletados dentro do escopo dos serviços e funcionalidades do nosso site, de acordo com as leis em vigor, com transparência e clareza junto aos usuários.
              </p>
              <p className="mb-6">
                Como condição para acesso e uso das funcionalidades da plataforma Permutem, o usuário declara que leu e está de acordo com esta Política de Privacidade, consentindo com os tratamentos de dados aqui descritos.
              </p>

              <h2 className="text-2xl font-bold mb-6">2. Dados Coletados</h2>
              <p className="mb-6">
                O Permutem coleta os seguintes tipos de informações:
              </p>
              <h3 className="text-xl font-semibold mb-4">2.1 Dados fornecidos pelo usuário</h3>
              <ul className="list-disc ml-6 mb-6">
                <li>Nome completo</li>
                <li>E-mail</li>
                <li>Telefone de contato</li>
                <li>CPF (em caso de contratação de planos pagos)</li>
                <li>Endereço</li>
                <li>Dados de pagamento (para usuários premium)</li>
                <li>Informações sobre imóveis anunciados</li>
                <li>Fotos e vídeos dos imóveis</li>
                <li>Preferências de busca para permutas</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">2.2 Dados coletados automaticamente</h3>
              <ul className="list-disc ml-6 mb-6">
                <li>Endereço IP</li>
                <li>Informações do dispositivo utilizado (tipo, sistema operacional, navegador)</li>
                <li>Dados de geolocalização</li>
                <li>Cookies e tecnologias similares</li>
                <li>Dados de navegação e interação com a plataforma</li>
                <li>Histórico de busca e visualização de imóveis</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6">3. Uso das Informações</h2>
              <p className="mb-6">
                As informações coletadas são utilizadas para as seguintes finalidades:
              </p>
              <ul className="list-disc ml-6 mb-6">
                <li>Criar e gerenciar contas de usuários</li>
                <li>Disponibilizar e aprimorar os serviços oferecidos</li>
                <li>Permitir que usuários anunciem e busquem imóveis para permuta</li>
                <li>Conectar proprietários com interesses compatíveis</li>
                <li>Processar pagamentos e gerenciar assinaturas</li>
                <li>Enviar comunicações sobre o serviço, atualizações e promoções</li>
                <li>Personalizar a experiência do usuário</li>
                <li>Realizar análises estatísticas para melhoria da plataforma</li>
                <li>Prevenir fraudes e garantir a segurança</li>
                <li>Cumprir obrigações legais</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6">4. Compartilhamento de Dados</h2>
              <p className="mb-6">
                O Permutem pode compartilhar as informações coletadas nas seguintes circunstâncias:
              </p>
              <ul className="list-disc ml-6 mb-6">
                <li><strong>Com outros usuários:</strong> Informações de contato e dados do imóvel anunciado são compartilhados com usuários interessados em realizar permutas, de acordo com as configurações de privacidade escolhidas.</li>
                <li><strong>Parceiros de serviço:</strong> Podemos compartilhar dados com fornecedores de serviços que nos auxiliam na operação da plataforma (processamento de pagamentos, hospedagem, suporte técnico, etc.).</li>
                <li><strong>Parceiros comerciais:</strong> Mediante consentimento prévio, podemos compartilhar informações com parceiros estratégicos para oferecer serviços complementares.</li>
                <li><strong>Por exigência legal:</strong> Quando necessário para cumprir obrigações legais, ordens judiciais ou requisições de autoridades competentes.</li>
              </ul>
              <p className="mb-6">
                Em todos os casos de compartilhamento, o Permutem adota medidas para garantir a proteção e privacidade dos dados.
              </p>

              <h2 className="text-2xl font-bold mb-6">5. Armazenamento e Segurança</h2>
              <p className="mb-6">
                O Permutem adota medidas técnicas e organizacionais apropriadas para proteger os dados pessoais contra acessos não autorizados, situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão.
              </p>
              <p className="mb-6">
                Os dados são armazenados em servidores localizados no Brasil e em servidores cloud em outros países, sempre com níveis adequados de proteção. O período de armazenamento corresponde ao necessário para cumprir com as finalidades para as quais as informações foram coletadas.
              </p>

              <h2 className="text-2xl font-bold mb-6">6. Direitos dos Usuários</h2>
              <p className="mb-6">
                Em conformidade com a Lei Geral de Proteção de Dados (LGPD), os usuários possuem os seguintes direitos:
              </p>
              <ul className="list-disc ml-6 mb-6">
                <li>Confirmação da existência de tratamento de dados pessoais</li>
                <li>Acesso aos dados</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos</li>
                <li>Portabilidade dos dados</li>
                <li>Eliminação dos dados tratados com consentimento</li>
                <li>Informação sobre entidades públicas e privadas com as quais o Permutem compartilhou dados</li>
                <li>Revogação do consentimento</li>
              </ul>
              <p className="mb-6">
                Para exercer esses direitos, o usuário pode entrar em contato através do e-mail: privacidade@permutem.com.br
              </p>

              <h2 className="text-2xl font-bold mb-6">7. Cookies e Tecnologias Similares</h2>
              <p className="mb-6">
                O Permutem utiliza cookies e tecnologias similares para melhorar a experiência do usuário, permitir funcionalidades essenciais, lembrar preferências, personalizar conteúdo e anúncios, além de analisar o uso da plataforma.
              </p>
              <p className="mb-6">
                Para mais informações sobre como utilizamos cookies, consulte nossa <Link href="/cookies" className="text-primary hover:text-secondary">Política de Cookies</Link>.
              </p>

              <h2 className="text-2xl font-bold mb-6">8. Alterações na Política de Privacidade</h2>
              <p className="mb-6">
                O Permutem poderá alterar esta Política de Privacidade a qualquer momento, mediante publicação da versão atualizada em nosso site. Recomendamos que os usuários revisem periodicamente esta política para estar cientes de quaisquer alterações.
              </p>
              <p className="mb-6">
                Alterações significativas serão comunicadas aos usuários por e-mail ou através de notificações na plataforma.
              </p>

              <h2 className="text-2xl font-bold mb-6">9. Contato</h2>
              <p className="mb-6">
                Em caso de dúvidas, comentários ou solicitações relacionadas a esta Política de Privacidade, entre em contato com nosso Encarregado de Proteção de Dados através do e-mail: privacidade@permutem.com.br
              </p>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 italic">
                  Esta Política de Privacidade foi atualizada pela última vez em 15 de agosto de 2023.
                </p>
              </div>

              <div className="mt-12 text-center">
                <Link href="/termos" className="text-primary hover:text-secondary font-medium mx-4">
                  Termos e Condições de Uso
                </Link>
                <Link href="/cookies" className="text-primary hover:text-secondary font-medium mx-4">
                  Política de Cookies
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 