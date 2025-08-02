import { Usuario, Imovel, Proposta, Plano } from './types';
import { v4 as uuidv4 } from 'uuid';

// Função para gerar uma data aleatória nos últimos 30 dias
const randomDate = (daysAgo = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Função geradora de dados simulados
export const mockDataGenerator = () => {
  // Gerar usuários simulados
  const usuarios: Usuario[] = [
    {
      id: '1',
      email: 'admin@permutem.com',
      primeiro_nome: 'Admin',
      ultimo_nome: 'Sistema',
      tipo_usuario: 'admin',
      telefone: '(11) 99999-9999',
      data_registro: randomDate(60),
      status: 'ativo',
      verificado: true
    },
    {
      id: '2',
      email: 'joao@exemplo.com',
      primeiro_nome: 'João',
      ultimo_nome: 'Silva',
      tipo_usuario: 'proprietario',
      telefone: '(11) 98888-8888',
      data_registro: randomDate(45),
      status: 'ativo',
      created_at: randomDate(45),
      updated_at: randomDate(3)
    },
    {
      id: '3',
      email: 'maria@exemplo.com',
      primeiro_nome: 'Maria',
      ultimo_nome: 'Santos',
      tipo_usuario: 'corretor',
      telefone: '(21) 97777-7777',
      data_registro: randomDate(30),
      status: 'ativo',
      created_at: randomDate(30),
      updated_at: randomDate(5)
    },
    {
      id: '4',
      email: 'pedro@exemplo.com',
      nome: 'Pedro',
      sobrenome: 'Oliveira',
      tipo: 'proprietario',
      telefone: '(31) 96666-6666',
      data_registro: randomDate(15),
      ultimo_login: randomDate(2),
      status: 'pendente',
      verificado: false
    },
    {
      id: '5',
      email: 'ana@exemplo.com',
      nome: 'Ana',
      sobrenome: 'Pereira',
      tipo: 'proprietario',
      telefone: '(41) 95555-5555',
      data_registro: randomDate(10),
      ultimo_login: randomDate(1),
      status: 'bloqueado',
      verificado: true,
      plano_id: '1'
    }
  ];

  // Gerar imóveis simulados
  const imoveis: Imovel[] = [
    {
      id: '1',
      usuario_id: '2',
      titulo: 'Apartamento com vista para o mar em Santos',
      descricao: 'Lindo apartamento com 3 quartos, vista para o mar, próximo à praia e ao comércio local.',
      tipo: 'Apartamento',
      localizacao: 'Av. da Praia, 1000',
      cidade: 'Santos',
      estado: 'SP',
      pais: 'Brasil',
      preco: 850000,
      preco_usd: 150000,
      area: 120,
      quartos: 3,
      banheiros: 2,
      aceita_permuta: true,
      status: 'aprovado',
      data_cadastro: randomDate(25),
      destaque: true,
      imagens: [
        '/images/imoveis/apartamento1.jpg',
        '/images/imoveis/apartamento2.jpg',
        '/images/imoveis/apartamento3.jpg'
      ]
    },
    {
      id: '2',
      usuario_id: '2',
      titulo: 'Casa em condomínio fechado em Campinas',
      descricao: 'Casa espaçosa em condomínio fechado com total segurança, área de lazer completa e muito espaço verde.',
      tipo: 'Casa',
      localizacao: 'Rua das Palmeiras, 500, Condomínio Green Valley',
      cidade: 'Campinas',
      estado: 'SP',
      pais: 'Brasil',
      preco: 1200000,
      preco_usd: 210000,
      area: 280,
      quartos: 4,
      banheiros: 3,
      aceita_permuta: true,
      status: 'aprovado',
      data_cadastro: randomDate(18),
      destaque: true,
      imagens: [
        '/images/imoveis/casa1.jpg',
        '/images/imoveis/casa2.jpg',
        '/images/imoveis/casa3.jpg',
        '/images/imoveis/casa4.jpg'
      ]
    },
    {
      id: '3',
      usuario_id: '3',
      titulo: 'Cobertura duplex em Ipanema',
      descricao: 'Luxuosa cobertura duplex com vista panorâmica, piscina privativa e acabamento de alto padrão.',
      tipo: 'Cobertura',
      localizacao: 'Rua Visconde de Pirajá, 300',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      pais: 'Brasil',
      preco: 4500000,
      preco_usd: 790000,
      area: 350,
      quartos: 5,
      banheiros: 4,
      aceita_permuta: true,
      status: 'aprovado',
      data_cadastro: randomDate(12),
      destaque: true,
      imagens: [
        '/images/imoveis/cobertura1.jpg',
        '/images/imoveis/cobertura2.jpg',
        '/images/imoveis/cobertura3.jpg'
      ]
    },
    {
      id: '4',
      usuario_id: '3',
      titulo: 'Terreno em área nobre de Florianópolis',
      descricao: 'Terreno plano em localização privilegiada, ideal para construção de casa de alto padrão.',
      tipo: 'Terreno',
      localizacao: 'Estrada do Jurerê, Km 5',
      cidade: 'Florianópolis',
      estado: 'SC',
      pais: 'Brasil',
      preco: 750000,
      preco_usd: 130000,
      area: 1200,
      quartos: 0,
      banheiros: 0,
      aceita_permuta: true,
      status: 'aprovado',
      data_cadastro: randomDate(30),
      destaque: false,
      imagens: [
        '/images/imoveis/terreno1.jpg',
        '/images/imoveis/terreno2.jpg'
      ]
    },
    {
      id: '5',
      usuario_id: '4',
      titulo: 'Fazenda produtiva próxima a Ribeirão Preto',
      descricao: 'Fazenda com 50 hectares, casa sede, currais, estábulos e plantação de café.',
      tipo: 'Rural',
      localizacao: 'Rodovia SP-333, Km 45',
      cidade: 'Ribeirão Preto',
      estado: 'SP',
      pais: 'Brasil',
      preco: 3800000,
      preco_usd: 670000,
      area: 500000,
      quartos: 6,
      banheiros: 4,
      aceita_permuta: true,
      status: 'pendente',
      data_cadastro: randomDate(5),
      destaque: false,
      imagens: [
        '/images/imoveis/fazenda1.jpg',
        '/images/imoveis/fazenda2.jpg',
        '/images/imoveis/fazenda3.jpg'
      ]
    }
  ];

  // Gerar propostas simuladas
  const propostas: Proposta[] = [
    {
      id: '1',
      usuario_origem_id: '2',
      usuario_destino_id: '3',
      imovel_origem_id: '1',
      imovel_destino_id: '3',
      mensagem: 'Tenho interesse em permutar meu apartamento em Santos pela sua cobertura em Ipanema. Podemos conversar sobre valores e condições?',
      status: 'pendente',
      data_criacao: randomDate(4),
      data_atualizacao: randomDate(4)
    },
    {
      id: '2',
      usuario_origem_id: '3',
      usuario_destino_id: '2',
      imovel_origem_id: '4',
      imovel_destino_id: '2',
      mensagem: 'Gostaria de propor uma permuta do meu terreno em Florianópolis pela sua casa em Campinas. Estou disposto a pagar a diferença.',
      status: 'aceita',
      data_criacao: randomDate(10),
      data_atualizacao: randomDate(8)
    },
    {
      id: '3',
      usuario_origem_id: '4',
      usuario_destino_id: '3',
      imovel_origem_id: '5',
      imovel_destino_id: '3',
      mensagem: 'Tenho interesse em permutar minha fazenda pela sua cobertura, o que acha?',
      status: 'recusada',
      data_criacao: randomDate(15),
      data_atualizacao: randomDate(13)
    }
  ];

  // Gerar planos simulados
  const planos: Plano[] = [
    // Plano para proprietários
    {
      id: '1',
      nome: 'Plano Proprietário',
      descricao: 'Ideal para proprietários de imóveis',
      preco: 40.00,
      periodo: 'mensal',
      recursos: [
        'Até 5 imóveis cadastrados',
        'Visualização de propostas',
        'Suporte por email',
        'Destaque nos resultados de busca'
      ],
      ativo: true,
      destaque: true,
      ordem: 1,
      tipo_usuario: 'proprietario',
      limite_imoveis: 5
    },
    
    // Planos para corretores/imobiliárias
    {
      id: '2',
      nome: 'Plano Chave',
      descricao: 'Para corretores e imobiliárias de pequeno porte',
      preco: 180.00,
      periodo: 'mensal',
      recursos: [
        'Até 30 imóveis cadastrados',
        'Visualização de propostas',
        'Destaque na busca',
        'Suporte prioritário',
        'Dashboard de estatísticas'
      ],
      ativo: true,
      destaque: false,
      ordem: 2,
      tipo_usuario: 'corretor',
      limite_imoveis: 30
    },
    {
      id: '3',
      nome: 'Plano Porta Aberta',
      descricao: 'Para imobiliárias de médio porte',
      preco: 290.00,
      periodo: 'mensal',
      recursos: [
        'Até 70 imóveis cadastrados',
        'Visualização de propostas',
        'Destaque na busca',
        'Análise de mercado',
        'Suporte prioritário',
        'Dashboard de estatísticas'
      ],
      ativo: true,
      destaque: true,
      ordem: 3,
      tipo_usuario: 'corretor',
      limite_imoveis: 70
    },
    {
      id: '4',
      nome: 'Plano Troca Premium',
      descricao: 'Para imobiliárias que desejam mais visibilidade',
      preco: 390.00,
      periodo: 'mensal',
      recursos: [
        'Até 100 imóveis cadastrados',
        'Visualização de propostas',
        'Destaque na busca',
        'Análise de mercado',
        'Suporte 24/7',
        'Dashboard completo de estatísticas',
        'Certificação de anúncios',
        'Relatórios mensais de performance'
      ],
      ativo: true,
      destaque: false,
      ordem: 4,
      tipo_usuario: 'corretor',
      limite_imoveis: 100
    },
    {
      id: '5',
      nome: 'Plano Torre Alta',
      descricao: 'Para grandes imobiliárias e redes',
      preco: 0,
      periodo: 'mensal',
      recursos: [
        'Acima de 100 imóveis cadastrados',
        'Visualização de propostas',
        'Posição privilegiada nos resultados',
        'Análise de mercado completa',
        'Suporte dedicado 24/7',
        'API para integração com sistemas',
        'Dashboard executivo de estatísticas',
        'Certificação premium de anúncios',
        'Relatórios personalizados'
      ],
      ativo: true,
      destaque: false,
      ordem: 5,
      tipo_usuario: 'corretor',
      preco_personalizado: true,
      limite_imoveis: 999999
    }
  ];

  // Definir imóveis em destaque
  const imoveisDestaque = imoveis.filter(imovel => imovel.destaque && imovel.status === 'aprovado');

  return {
    usuarios,
    imoveis,
    imoveisDestaque,
    propostas,
    planos
  };
}; 