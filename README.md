# Permutem - Plataforma de Permuta de Imóveis

## Sobre o Projeto

Permutem é uma plataforma de permuta de imóveis, onde proprietários e corretores podem anunciar seus imóveis e encontrar oportunidades de troca. O projeto utiliza tecnologias modernas como Next.js e Tailwind CSS para oferecer uma experiência de usuário fluida e responsiva.

## Configuração do Ambiente

### Requisitos
- Node.js (v16 ou superior)
- npm (v8 ou superior)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/GouveiaZx/permutem.git

# Entre na pasta do projeto
cd permutem

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O site estará disponível em `http://localhost:3000`

## Deploy na Vercel

O projeto está preparado para ser implantado na Vercel:

```bash
# Preparar o projeto para deploy (opcional)
node prepare-vercel.js

# Ou fazer deploy diretamente do GitHub
# 1. Conecte sua conta GitHub à Vercel
# 2. Selecione o repositório "permutem"
# 3. Configure as variáveis de ambiente (se necessário)
# 4. Clique em "Deploy"
```

## Situação Atual

### Modo de Demonstração

Atualmente, a aplicação está configurada para funcionar com **dados mockados** para desenvolvimento, enquanto o backend com Supabase não estiver totalmente configurado.

### Funcionalidades Implementadas

- ✅ Landing page completa
- ✅ Sistema de login e cadastro
- ✅ Recuperação de senha
- ✅ Dashboard do usuário
- ✅ Busca de imóveis
- ✅ Favoritos e sugestões
- ✅ Página de anúncios do usuário
- ✅ Perfil do usuário

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

- **Frontend**: Next.js 13.5 (React 18)
- **Estilização**: Tailwind CSS
- **Ícones**: React Icons, Heroicons, Lucide
- **Backend** (futuramente): Supabase
- **Gerenciamento de Estado**: React Context API
- **Deploy**: Vercel

## Estrutura do Projeto

- `app/`: Código principal (Next.js App Router)
- `app/components/`: Componentes React
- `app/contexts/`: Contextos para gerenciamento de estado
- `app/lib/`: Utilitários e funções de API
- `public/images/`: Recursos estáticos

## Fluxos Principais

### Autenticação
1. Usuário se registra ou faz login
2. Em caso de senha esquecida, utiliza o fluxo de recuperação
3. Após autenticação, é redirecionado para o dashboard

### Permuta de Imóveis
1. Usuário cadastra seu imóvel
2. Visualiza sugestões compatíveis
3. Envia propostas de permuta para imóveis de interesse
4. Gerencia propostas recebidas e enviadas

## Documentação

Para documentação mais detalhada, consulte:
- [documentacao.md](./documentacao.md) - Documentação técnica e de arquitetura
- Comentários no código-fonte em componentes principais

## Próximos Passos

1. Configuração completa do Supabase
2. Implementação de pagamentos para assinaturas
3. Melhorias no algoritmo de sugestões
4. Dashboard administrativo
5. Aplicativo móvel (React Native)

## Contato

Desenvolvido por: [Seu Nome]
GitHub: [GouveiaZx](https://github.com/GouveiaZx)

---

**Última atualização**: Maio de 2024 