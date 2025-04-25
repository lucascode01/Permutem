# Permutem - Plataforma de Permuta de Imóveis

## Sobre o Projeto

Permutem é uma plataforma de permuta de imóveis, onde proprietários e corretores podem anunciar seus imóveis e encontrar oportunidades de troca.

## Configuração do Ambiente

### Requisitos
- Node.js (v16 ou superior)
- npm (v8 ou superior)

### Instalação

```bash
# Clone o repositório
git clone [URL do repositório]

# Entre na pasta do projeto
cd permutem

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O site estará disponível em `http://localhost:3000`

## Situação Atual

### Modo de Demonstração

Atualmente, a aplicação está configurada para funcionar com **dados mockados** para desenvolvimento, enquanto o backend com Supabase não estiver totalmente configurado.

Os erros 404 relacionados ao Supabase são esperados neste momento, já que a aplicação está configurada para usar os dados de demonstração locais.

### Corrigindo Erros Comuns

#### Erros do Supabase

Para remover os erros 404 relacionados ao Supabase, atualizamos o arquivo `app/contexts/SupabaseContext.tsx` para usar exclusivamente os dados mockados. Quando o backend estiver pronto, basta:

1. Modificar a linha `const [isUsingMockData, setIsUsingMockData] = useState<boolean>(true);` para `useState<boolean>(false);`
2. Descomentar as seções de código comentadas no `useEffect` para permitir a conexão com o Supabase real

#### Avisos de Imagem

Correção dos avisos de imagem:
- Implementado o uso correto de proporção para as logos na Navbar, definindo width e height adequadamente
- Adicionado o atributo `priority` para carregamento prioritário das imagens

## Tecnologias Utilizadas

- **Frontend**: Next.js (React)
- **Estilização**: Tailwind CSS
- **Backend** (futuramente): Supabase
- **Gerenciamento de Estado**: React Context API

## Estrutura do Projeto

- `app/`: Código principal (Next.js App Router)
- `app/components/`: Componentes React
- `app/contexts/`: Contextos para gerenciamento de estado
- `app/lib/`: Utilitários e funções de API
- `public/images/`: Recursos estáticos

## Componentes Principais

- **Navbar**: Navegação principal do site
- **HeroSection**: Banner principal com carrossel e busca
- **FeaturedProperties**: Imóveis em destaque
- **HowItWorks**: Explicação do funcionamento
- **NewsSection**: Carrossel de cidades
- **CtaSection**: Chamada para ação
- **Footer**: Rodapé com informações

## Próximos Passos

1. Configuração completa do Supabase
2. Implementação de autenticação de usuários
3. Desenvolvimento de páginas de detalhes do imóvel
4. Sistema de propostas de permuta
5. Dashboard do usuário

## Contato

Empresa: Imobiliária Soares e Oliveira Ltda  
CNPJ: 14.576.916/0001-07

---

**Última atualização**: [Data Atual] 