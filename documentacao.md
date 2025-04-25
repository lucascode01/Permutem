# Documentação do Projeto Permutem

## Visão Geral
Permutem é uma plataforma de permuta de imóveis que permite aos usuários anunciar seus imóveis e encontrar opções de permuta de forma rápida e eficiente. A plataforma está construída com Next.js, utilizando o conceito de App Router e oferece uma interface responsiva e moderna para seus usuários.

## Estrutura do Projeto

### Tecnologias Principais
- **Next.js 13.5** - Framework React com App Router
- **Tailwind CSS** - Framework de estilo
- **React Icons** - Biblioteca de ícones
- **Autenticação** - Simulada via Context API (preparada para integração com Supabase)
- **Heroicons/Lucide** - Biblioteca de ícones para a interface

### Estrutura de Diretórios

```
app/
├── components/            # Componentes reutilizáveis
├── contexts/              # Contextos da aplicação (Auth, etc)
├── anuncios/              # Páginas de criação e gestão de anúncios
├── buscar-imoveis/        # Página de busca de imóveis
├── favoritos/             # Página de imóveis favoritos
├── sugestoes/             # Página de sugestões de permuta
├── propostas/             # Gestão de propostas de permuta
├── imovel/                # Visualização detalhada de imóveis
├── dashboard/             # Dashboard do usuário
├── login/                 # Página de login
├── cadastro/              # Página de cadastro
├── recuperar-senha/       # Recuperação de senha
├── redefinir-senha/       # Redefinição de senha com token
└── page.tsx               # Página inicial (Homepage)
```

## Páginas Principais e Suas Funcionalidades

### 1. Página Inicial (`app/page.tsx`)
- Landing page principal do site
- Apresenta as principais funcionalidades do sistema
- Seções: Hero, Como Funciona, Imóveis em Destaque, Localidades, Depoimentos

### 2. Dashboard (`app/dashboard`)
- Centro de controle do usuário logado
- Resumo de anúncios, propostas e métricas
- Navegação rápida para outras seções

### 3. Busca de Imóveis (`app/buscar-imoveis/page.tsx`)
- Interface de busca com filtros avançados
- Visualização em lista ou grade
- Opções de ordenação e filtragem por tipo, preço, etc.
- Design atualizado com padronização de espaçamento (pt-6 pb-4)

### 4. Gerenciamento de Anúncios (`app/anuncios`)
- **Lista de Anúncios** (`app/anuncios/page.tsx`):
  - Exibição de anúncios do usuário
  - Filtragem por status (ativos/inativos)
  - Menu de opções para cada anúncio (editar, desativar, excluir)
  - Exibição de estatísticas básicas (visualizações, propostas)

- **Detalhes de Anúncio** (`app/anuncios/[id]/page.tsx`):
  - Visualização detalhada de um anúncio específico
  - Estatísticas de visualização e interação
  - Controles para editar, desativar ou excluir o anúncio
  - Exibição de propostas recebidas
  - Layout padronizado com espaçamento adequado

- **Criação de Anúncios** (`app/anuncios/criar/page.tsx`):
  - Formulário em múltiplas etapas (wizard)
  - Upload de fotos e informações do imóvel
  - Opções de permuta

### 5. Favoritos (`app/favoritos/page.tsx`)
- Lista de imóveis salvos pelo usuário
- Opções para remover dos favoritos
- Filtragem por tipo de imóvel
- Layout consistente com o resto da aplicação
- Espaçamento adequado com cabeçalho (mt-4) e rodapé (mb-8)

### 6. Sugestões de Permuta (`app/sugestoes/page.tsx`)
- Sugestões de imóveis compatíveis para permuta
- Seleção do imóvel do usuário para ver sugestões
- Indicador de porcentagem de compatibilidade
- Opção para propor permuta diretamente
- Layout padronizado com espaçamento no topo e rodapé

### 7. Propostas (`app/propostas`)
- Gestão de propostas recebidas e enviadas
- Opções para aceitar, recusar ou negociar
- Histórico de negociações

### 8. Sistema de Autenticação e Recuperação de Senha
- **Login** (`app/login/page.tsx`):
  - Formulário de login responsivo
  - Opção "Lembrar-me" para persistência
  - Link para recuperação de senha

- **Cadastro** (`app/cadastro/page.tsx`):
  - Formulário responsivo com validação
  - Seleção de tipo de usuário (Proprietário/Corretor)
  - Layout moderno com ícones e feedback visual

- **Recuperação de Senha** (`app/recuperar-senha/page.tsx`):
  - Formulário para solicitar link de recuperação
  - Envio de email simulado com token
  - Feedback visual de sucesso

- **Redefinição de Senha** (`app/redefinir-senha/[token]/page.tsx`):
  - Validação do token recebido por email
  - Formulário para definir nova senha
  - Validação de força de senha
  - Confirmação visual após conclusão

## Componentes Principais

### Cabeçalhos e Navegação
- **DynamicHeader** (`app/components/DynamicHeader.tsx`) - Cabeçalho dinâmico baseado na rota
- **Navbar** (`app/components/Navbar.tsx`) - Barra de navegação principal
- **PageHeader** (`app/components/PageHeader.tsx`) - Cabeçalho padrão de páginas internas

### Dashboard
- **Sidebar** (`app/components/dashboard/Sidebar.tsx`) - Menu lateral do dashboard
- **DashboardSidebar** (`app/components/DashboardSidebar.tsx`) - Versão alternativa do menu lateral

### Componentes da Home
- **HeroSection** - Seção principal da home
- **HowItWorks** - Explicação do funcionamento da plataforma
- **FeaturedProperties** - Imóveis em destaque
- **FeaturedLocations** - Localizações populares
- **Testimonials** - Depoimentos de usuários

### Utilidades
- **HydrationFix** - Componente para evitar problemas de hidratação do React
- **ImageUpload** - Componente para upload de imagens

## Contextos

### AuthContext (`app/contexts/AuthContext.tsx`)
- Gerencia autenticação do usuário
- Fornece métodos para login, registro e logout
- Armazena estado do usuário (localStorage/sessionStorage)
- Simulação de autenticação para demonstração

### SupabaseContext (`app/contexts/SupabaseContext.tsx`)
- Preparação para integração com Supabase
- Fornece cliente Supabase para componentes

## Padronização Visual

### Layout de Cabeçalhos
- Fundo branco (`bg-white`)
- Borda inferior leve (`border-b border-gray-100`)
- Padding vertical assimétrico (`pt-6 pb-4`) para melhor espaçamento
- Texto em cor escura (`text-gray-800`) 
- Margem entre título e conteúdo (`mt-4`)
- Espaçamento adequado entre o cabeçalho fixo e o conteúdo (`pt-28`)

### Layout de Formulários
- Inputs com ícones (`pl-10`)
- Feedback visual para validação (bordas vermelhas, mensagens de erro)
- Botões com estados de hover e loading
- Agrupamento lógico de campos relacionados

### Layout de Rodapés
- Espaçamento inferior consistente (`mb-8` nos containers principais)
- Rodapé padronizado com informações de copyright
- Padding vertical adequado (`py-6`)

## Estados de Interface
1. **Loading** - Exibido durante carregamentos assíncronos
2. **Empty State** - Exibido quando não há dados para mostrar
3. **Error State** - Tratamento visual para erros
4. **Success State** - Feedback visual para ações bem-sucedidas

## Fluxos Principais

### Fluxo de Permuta
1. Usuário cadastra seu imóvel
2. Visualiza sugestões compatíveis
3. Envia proposta de permuta
4. Negocia com o outro proprietário
5. Finaliza a transação

### Fluxo de Anúncio
1. Usuário cria anúncio com informações e fotos
2. Anúncio fica disponível para busca e sugestões
3. Usuário gerencia anúncio (ativar/desativar/editar)
4. Recebe propostas de interessados

### Fluxo de Recuperação de Senha
1. Usuário solicita recuperação de senha informando email
2. Sistema envia email com token único (simulado)
3. Usuário acessa link com token
4. Token é validado e usuário define nova senha
5. Usuário é redirecionado para login

## Melhorias e Padronizações Recentes

- Padronização de espaçamento entre o cabeçalho fixo e o conteúdo principal (`pt-28`)
- Aprimoramento da página de cadastro com validação de formulário
- Implementação completa do fluxo de recuperação/redefinição de senha
- Remoção da opção de "Configurações" das sidebars do proprietário
- Melhoria no contraste e legibilidade da UI
- Adição de ícones nos campos de formulário
- Feedback visual mais claro para validação e estados de loading

## Preparação para Deploy na Vercel

O projeto foi otimizado para deploy na Vercel:
- Configuração do `next.config.js` para otimização de imagens
- Arquivo `.vercelignore` para ignorar arquivos desnecessários
- Script `prepare-vercel.js` para criar um arquivo ZIP pronto para upload
- Arquivos duplicados ou não utilizados foram removidos
- Todas as páginas foram testadas para garantir funcionamento correto

## Importante

Esta documentação é para a versão em desenvolvimento. O sistema utiliza dados simulados para demonstração. A integração com backend real deve ser implementada antes da versão de produção.

---

*Última atualização: Maio de 2024* 