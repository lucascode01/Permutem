import React from 'react';
import Link from 'next/link';
import { FaExchangeAlt, FaSearch, FaBuilding } from 'react-icons/fa';

const FeatureCard = ({ 
  title, 
  description, 
  icon,
  stepNumber,
  buttonText, 
  buttonLink 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  stepNumber: number;
  buttonText: string; 
  buttonLink: string; 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 relative transition-all hover:shadow-lg">
      <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-[#0071ce] flex items-center justify-center text-white font-bold text-xl">
        {stepNumber}
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="text-[#0071ce] mb-6 text-5xl">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <Link href={buttonLink} className="inline-block bg-white border border-[#0071ce] text-[#0071ce] px-5 py-2 rounded font-medium hover:bg-[#0071ce] hover:text-white transition-colors">
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const features = [
    {
      title: 'Permute seu imóvel aqui',
      description: 'Seu imóvel pode valer uma nova oportunidade. Permute com quem também quer trocar!',
      icon: <FaExchangeAlt />,
      stepNumber: 1,
      buttonText: 'O que é o Permutem',
      buttonLink: '#',
    },
    {
      title: 'Encontre imóveis para permutar e envie suas propostas',
      description: 'Encontre imóveis que você se interessa e envie suas propostas de permuta de forma simples e rápida.',
      icon: <FaSearch />,
      stepNumber: 2,
      buttonText: 'Como funciona',
      buttonLink: '#',
    },
    {
      title: 'Anuncie seu imóvel e multiplique suas chances de permutar',
      description: 'Aumente suas chances anunciando seu imóvel para que ele seja visto no mercado todo.',
      icon: <FaBuilding />,
      stepNumber: 3,
      buttonText: 'Conheça os planos',
      buttonLink: '/planos/visualizar',
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Como funciona</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Três passos simples para você encontrar a permuta perfeita para seu imóvel
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              stepNumber={feature.stepNumber}
              buttonText={feature.buttonText}
              buttonLink={feature.buttonLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 