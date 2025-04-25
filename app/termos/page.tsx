'use client';

import React from 'react';
import PageHeader from '../components/PageHeader';
import HydrationFix from '../components/HydrationFix';
import Link from 'next/link';

export default function TermosPage() {
  return (
    <>
      <HydrationFix />
      <PageHeader />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gray-50 mt-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Termos e Condições de Uso</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Este documento estabelece os termos e condições para utilização da plataforma Permutem.
              </p>
            </div>
          </div>
        </section>

        {/* Conteúdo dos Termos */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-6">1. Aceitação dos Termos</h2>
              <p className="mb-6">
                Ao acessar ou utilizar o site e os serviços do Permutem, o usuário confirma que leu, entendeu e concorda com estes Termos e Condições de Uso. Se você não concordar com qualquer parte destes termos, solicitamos que não utilize nossos serviços.
              </p>

              <h2 className="text-2xl font-bold mb-6">2. Descrição do Serviço</h2>
              <p className="mb-6">
                O Permutem é uma plataforma online que facilita o contato entre pessoas interessadas em permutar imóveis. Nosso serviço permite que usuários anunciem seus imóveis e busquem opções compatíveis para permuta em todo o Brasil.
              </p>
              <p className="mb-6">
                A plataforma atua apenas como um meio de conexão entre as partes interessadas, não participando diretamente das negociações, nem atuando como intermediária nas transações. O Permutem não garante a concretização das permutas, nem se responsabiliza por informações fornecidas pelos usuários em seus anúncios.
              </p>

              <h2 className="text-2xl font-bold mb-6">3. Cadastro e Conta do Usuário</h2>
              <p className="mb-6">
                Para utilizar os serviços completos do Permutem, o usuário deverá criar uma conta fornecendo informações precisas e completas. O usuário é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem em sua conta.
              </p>
              <p className="mb-6">
                O Permutem poderá recusar, suspender ou cancelar o cadastro de qualquer usuário, a seu exclusivo critério, especialmente em caso de suspeita de fraude ou fornecimento de informações falsas.
              </p>

              <h2 className="text-2xl font-bold mb-6">4. Anúncios e Conteúdo do Usuário</h2>
              <p className="mb-6">
                O usuário é o único responsável pelo conteúdo que publica na plataforma, incluindo textos, imagens e informações sobre os imóveis anunciados. Ao publicar conteúdo no Permutem, o usuário garante que:
              </p>
              <ul className="list-disc ml-6 mb-6">
                <li>É o proprietário legítimo do imóvel anunciado ou está devidamente autorizado a anunciá-lo.</li>
                <li>As informações fornecidas são verdadeiras, precisas e completas.</li>
                <li>O conteúdo não viola direitos de terceiros, incluindo direitos de propriedade intelectual.</li>
                <li>O conteúdo não é ilegal, ofensivo, difamatório ou inadequado.</li>
              </ul>
              <p className="mb-6">
                O Permutem reserva-se o direito de remover qualquer conteúdo que viole estes termos ou que seja considerado inadequado, sem aviso prévio.
              </p>

              <h2 className="text-2xl font-bold mb-6">5. Planos e Pagamentos</h2>
              <p className="mb-6">
                O Permutem oferece planos gratuitos e pagos com diferentes funcionalidades. Os detalhes sobre os planos, preços e condições específicas estão disponíveis na seção "Planos" do site.
              </p>
              <p className="mb-6">
                Ao contratar um plano pago, o usuário concorda com as condições de pagamento, renovação e cancelamento especificadas no momento da contratação. O Permutem reserva-se o direito de alterar os preços e características dos planos mediante aviso prévio.
              </p>

              <h2 className="text-2xl font-bold mb-6">6. Responsabilidades e Limitações</h2>
              <p className="mb-6">
                O Permutem não se responsabiliza por:
              </p>
              <ul className="list-disc ml-6 mb-6">
                <li>Veracidade das informações fornecidas pelos usuários em seus anúncios.</li>
                <li>Negociações e acordos realizados entre usuários da plataforma.</li>
                <li>Problemas legais, documentais ou estruturais dos imóveis anunciados.</li>
                <li>Perdas ou danos resultantes do uso da plataforma ou de negociações entre usuários.</li>
                <li>Indisponibilidade temporária do serviço por questões técnicas ou de manutenção.</li>
              </ul>
              <p className="mb-6">
                Recomendamos que os usuários realizem as devidas diligências e consultem profissionais especializados (advogados, corretores, etc.) antes de concluir qualquer negociação de permuta.
              </p>

              <h2 className="text-2xl font-bold mb-6">7. Propriedade Intelectual</h2>
              <p className="mb-6">
                Todo o conteúdo do site Permutem, incluindo mas não limitado a textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade do Permutem ou de seus fornecedores de conteúdo e está protegido por leis brasileiras e internacionais de direitos autorais.
              </p>
              <p className="mb-6">
                Os usuários não estão autorizados a modificar, reproduzir, publicar, licenciar, criar trabalhos derivados, transferir ou vender qualquer conteúdo obtido do site Permutem, sem autorização prévia por escrito.
              </p>

              <h2 className="text-2xl font-bold mb-6">8. Modificações dos Termos</h2>
              <p className="mb-6">
                O Permutem reserva-se o direito de modificar estes Termos e Condições de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação no site. O uso continuado da plataforma após tais modificações constitui aceitação dos novos termos.
              </p>
              <p className="mb-6">
                Recomendamos que os usuários revisem periodicamente estes termos para estar cientes de qualquer alteração.
              </p>

              <h2 className="text-2xl font-bold mb-6">9. Lei Aplicável e Resolução de Conflitos</h2>
              <p className="mb-6">
                Estes Termos e Condições de Uso são regidos pelas leis brasileiras. Qualquer disputa ou reclamação relacionada com estes termos será submetida à jurisdição exclusiva dos tribunais brasileiros.
              </p>
              <p className="mb-6">
                As partes comprometem-se a buscar uma solução amigável para qualquer controvérsia antes de recorrer às vias judiciais.
              </p>

              <h2 className="text-2xl font-bold mb-6">10. Contato</h2>
              <p className="mb-6">
                Se você tiver dúvidas sobre estes Termos e Condições de Uso, entre em contato conosco através do e-mail: contato@permutem.com.br
              </p>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 italic">
                  Estes Termos e Condições de Uso foram atualizados pela última vez em 15 de agosto de 2023.
                </p>
              </div>

              <div className="mt-12 text-center">
                <Link href="/privacidade" className="text-primary hover:text-secondary font-medium mx-4">
                  Política de Privacidade
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