import React from 'react';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: 'Roberto Silva',
    location: 'São Paulo, Brasil',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: 'Consegui trocar meu apartamento em São Paulo por uma casa no litoral. O processo foi simples e a equipe me ajudou em cada etapa!',
    rating: 5
  },
  {
    id: 2,
    name: 'Ana Maria Gomes',
    location: 'Miami, EUA',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote: 'Excelente plataforma! Troquei meu imóvel em Miami por um em Portugal em apenas 2 meses. Tudo foi transparente e seguro.',
    rating: 5
  },
  {
    id: 3,
    name: 'Carlos Mendes',
    location: 'Lisboa, Portugal',
    image: 'https://randomuser.me/api/portraits/men/62.jpg',
    quote: 'A Permutem superou minhas expectativas. O suporte jurídico que eles oferecem foi fundamental para minha tranquilidade durante todo o processo.',
    rating: 4
  }
];

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, i) => (
    <FaStar 
      key={i} 
      className={i < rating ? 'text-[#0071ce]' : 'text-gray-300'} 
    />
  ));
};

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">O que dizem nossos clientes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Histórias reais de pessoas que realizaram suas trocas de imóveis através da nossa plataforma
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full mr-4 object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-gray-700 italic">&ldquo;{testimonial.quote}&rdquo;</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button className="bg-white border border-[#0071ce] text-[#0071ce] px-6 py-3 rounded font-medium hover:bg-[#0071ce] hover:text-white transition-colors">
            Ver mais depoimentos
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 