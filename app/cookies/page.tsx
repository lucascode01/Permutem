'use client';

import React from 'react';
import PageHeader from '../components/PageHeader';
import HydrationFix from '../components/HydrationFix';
import Link from 'next/link';

export default function CookiesPage() {
  return (
    <>
      <HydrationFix />
      <PageHeader />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gray-50 mt-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Política de Cookies</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Entenda como usamos cookies e tecnologias similares para melhorar sua experiência no Permutem.
              </p>
            </div>
          </div>
        </section>

        {/* Conteúdo da Política de Cookies */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-6">1. O que são Cookies?</h2>
              <p className="mb-6">
                Cookies são pequenos arquivos de texto que são armazenados em seu dispositivo (computador, smartphone ou tablet) quando você visita websites. Eles são amplamente utilizados para fazer os websites funcionarem de maneira mais eficiente, bem como fornecer informações aos proprietários do site.
              </p>
              <p className="mb-6">
                Os cookies permitem que um website reconheça seu dispositivo e lembre-se de determinadas informações sobre a sua visita, como suas preferências de idioma, tamanho de fonte e outras configurações. Isso pode facilitar sua próxima visita e tornar o site mais útil para você.
              </p>

              <h2 className="text-2xl font-bold mb-6">2. Como o Permutem utiliza Cookies</h2>
              <p className="mb-6">
                O Permutem utiliza cookies e tecnologias similares para diversos fins, incluindo:
              </p>

              <h3 className="text-xl font-semibold mb-4">2.1 Cookies essenciais</h3>
              <p className="mb-6">
                Estes cookies são necessários para o funcionamento básico do site. Eles permitem que você navegue pelo site e utilize recursos essenciais, como áreas seguras, carrinho de compras e faturamento eletrônico. Esses cookies não coletam informações que possam ser utilizadas para fins de marketing ou para rastrear sua navegação na internet.
              </p>
              <p className="mb-6">
                Exemplos: cookies de sessão para autenticação, cookies de segurança, cookies de balanceamento de carga.
              </p>

              <h3 className="text-xl font-semibold mb-4">2.2 Cookies de preferências</h3>
              <p className="mb-6">
                Estes cookies permitem que o site se lembre de escolhas que você fez no passado, como idioma preferido, região, tamanho do texto e outras configurações personalizadas. Eles tornam sua experiência mais personalizada e evitam que você precise configurar suas preferências sempre que visitar o site.
              </p>
              <p className="mb-6">
                Exemplos: cookies de preferência de idioma, cookies para lembrar formulários preenchidos, cookies de visualização de resultados de busca.
              </p>

              <h3 className="text-xl font-semibold mb-4">2.3 Cookies analíticos</h3>
              <p className="mb-6">
                Utilizamos cookies analíticos para entender como os visitantes interagem com nosso site. Esses cookies nos ajudam a melhorar o desempenho do site, identificar problemas de navegação e compreender quais conteúdos são mais relevantes para nossos usuários.
              </p>
              <p className="mb-6">
                Exemplos: Google Analytics, Hotjar, ferramentas de análise de desempenho de páginas.
              </p>

              <h3 className="text-xl font-semibold mb-4">2.4 Cookies de marketing</h3>
              <p className="mb-6">
                Estes cookies são utilizados para rastrear visitantes em diferentes websites. Eles são usados para exibir anúncios mais relevantes e personalizados para o usuário, limitar a quantidade de vezes que um anúncio é exibido, medir a eficácia de campanhas publicitárias e entender o comportamento do usuário após visualizar um anúncio.
              </p>
              <p className="mb-6">
                Exemplos: cookies para rastreamento de conversão, cookies para remarketing, cookies de redes sociais.
              </p>

              <h2 className="text-2xl font-bold mb-6">3. Tipos de Cookies por Duração</h2>
              <p className="mb-6">
                Além das categorias acima, os cookies também podem ser classificados de acordo com o tempo que permanecem armazenados em seu dispositivo:
              </p>
              <ul className="list-disc ml-6 mb-6">
                <li><strong>Cookies de sessão:</strong> São temporários e permanecem no seu dispositivo apenas até que você feche o navegador.</li>
                <li><strong>Cookies persistentes:</strong> Permanecem no seu dispositivo por um período determinado (que pode variar de algumas horas a vários anos) ou até que você os exclua manualmente.</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6">4. Cookies de Terceiros</h2>
              <p className="mb-6">
                Alguns cookies são colocados por terceiros em nosso site. Estes terceiros podem incluir:
              </p>
              <ul className="list-disc ml-6 mb-6">
                <li><strong>Provedores de serviços de análise:</strong> Como Google Analytics, que nos ajudam a entender como os usuários interagem com nosso site.</li>
                <li><strong>Redes de publicidade:</strong> Que nos ajudam a veicular anúncios relevantes para você em outros sites.</li>
                <li><strong>Redes sociais:</strong> Como Facebook, Twitter e Instagram, que podem usar cookies para melhorar suas experiências de publicidade e compartilhamento de conteúdo.</li>
                <li><strong>Parceiros comerciais:</strong> Empresas com as quais trabalhamos e que podem usar cookies para fornecer seus serviços no nosso site.</li>
              </ul>
              <p className="mb-6">
                Observe que não temos controle sobre os cookies de terceiros. Para obter mais informações sobre como esses terceiros usam cookies, consulte suas respectivas políticas de privacidade e cookies.
              </p>

              <h2 className="text-2xl font-bold mb-6">5. Gerenciamento de Cookies</h2>
              <p className="mb-6">
                A maioria dos navegadores permite que você controle cookies através das configurações de preferências. As configurações típicas incluem:
              </p>
              <ul className="list-disc ml-6 mb-6">
                <li>Aceitar todos os cookies</li>
                <li>Ser notificado quando cookies são definidos e decidir caso a caso</li>
                <li>Rejeitar todos os cookies</li>
                <li>Excluir cookies existentes</li>
              </ul>
              <p className="mb-6">
                Para gerenciar cookies no seu navegador, você pode acessar as configurações ou preferências e procurar pela seção de cookies ou privacidade. Cada navegador tem procedimentos diferentes:
              </p>
              <ul className="list-disc ml-6 mb-6">
                <li><strong>Google Chrome:</strong> Menu → Configurações → Privacidade e segurança → Cookies e outros dados do site</li>
                <li><strong>Mozilla Firefox:</strong> Menu → Opções → Privacidade e Segurança → Cookies e dados do site</li>
                <li><strong>Safari:</strong> Preferências → Privacidade</li>
                <li><strong>Microsoft Edge:</strong> Menu → Configurações → Cookies e permissões do site</li>
              </ul>
              <p className="mb-6">
                Observe que, se você optar por desativar cookies, algumas funcionalidades do site podem não funcionar corretamente, e sua experiência de navegação pode ser afetada.
              </p>

              <h2 className="text-2xl font-bold mb-6">6. Banner de Cookies</h2>
              <p className="mb-6">
                Quando você visita o site Permutem pela primeira vez, um banner de cookies é exibido, informando sobre o uso de cookies e tecnologias similares. Você pode aceitar todos os cookies, personalizar suas configurações ou recusar cookies não essenciais.
              </p>
              <p className="mb-6">
                Suas preferências de cookies podem ser alteradas a qualquer momento acessando as configurações de cookies no rodapé do nosso site.
              </p>

              <h2 className="text-2xl font-bold mb-6">7. Alterações na Política de Cookies</h2>
              <p className="mb-6">
                O Permutem pode atualizar esta Política de Cookies periodicamente para refletir alterações em nossas práticas de uso de cookies ou por outros motivos operacionais, legais ou regulatórios. Portanto, recomendamos que você visite esta página regularmente para manter-se informado sobre o uso de cookies e tecnologias relacionadas.
              </p>
              <p className="mb-6">
                As alterações significativas serão notificadas por meio de um aviso visível em nosso site.
              </p>

              <h2 className="text-2xl font-bold mb-6">8. Contato</h2>
              <p className="mb-6">
                Se você tiver dúvidas ou preocupações sobre como utilizamos cookies e outras tecnologias de rastreamento, entre em contato conosco através do e-mail: privacidade@permutem.com.br
              </p>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 italic">
                  Esta Política de Cookies foi atualizada pela última vez em 15 de agosto de 2023.
                </p>
              </div>

              <div className="mt-12 text-center">
                <Link href="/termos" className="text-primary hover:text-secondary font-medium mx-4">
                  Termos e Condições de Uso
                </Link>
                <Link href="/privacidade" className="text-primary hover:text-secondary font-medium mx-4">
                  Política de Privacidade
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 