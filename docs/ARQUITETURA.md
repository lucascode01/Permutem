# Arquitetura do Projeto Permutem

Este documento descreve a arquitetura técnica do projeto Permutem, incluindo padrões de design, estrutura de componentes e fluxo de dados.

## Visão Geral da Arquitetura

O Permutem é desenvolvido como uma aplicação web moderna utilizando Next.js, um framework React que oferece renderização do lado do servidor (SSR), geração estática (SSG) e recursos de API integrados.

### Stack Tecnológica

- **Frontend**: React.js, Next.js, TailwindCSS
- **Estilização**: TailwindCSS para estilos utilitários e responsivos
- **Gerenciamento de Estado**: React Context API / Hooks
- **Roteamento**: Next.js Router
- **Otimização de Imagens**: next/image

## Estrutura de Diretórios

```
permutem/
├── app/                     # Código principal da aplicação (Next.js App Router)
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── ui/              # Componentes de UI básicos
│   │   ├── layout/          # Componentes de layout (Header, Footer)
│   │   └── sections/        # Seções da página (Hero, Features)
│   ├── lib/                 # Utilitários e funções auxiliares
│   ├── hooks/               # React Hooks personalizados
│   ├── styles/              # Estilos globais e configurações de Tailwind
│   ├── types/               # Tipos TypeScript
│   ├── api/                 # Rotas de API
│   └── contexts/            # Contexts de estado
├── public/                  # Arquivos estáticos
├── docs/                    # Documentação
└── config/                  # Arquivos de configuração
```

## Padrões de Design de Componentes

### Atomic Design

Os componentes seguem uma abordagem inspirada no Atomic Design:

1. **Átomos**: Botões, inputs, ícones (componentes básicos)
2. **Moléculas**: Cards, formulários simples (combinações de átomos)
3. **Organismos**: Seções completas (combinações de moléculas)
4. **Templates**: Layouts de página
5. **Páginas**: Implementações específicas dos templates

### Convenções de Nomenclatura

- **Componentes**: PascalCase (ex: `PropertyCard.tsx`)
- **Funções utilitárias**: camelCase (ex: `formatCurrency.ts`)
- **Constantes**: UPPER_SNAKE_CASE
- **Hooks personalizados**: Prefixo `use` (ex: `useProperties.ts`)

## Gerenciamento de Estado

### Hierarquia de Estado

O estado é gerenciado em níveis:

1. **Estado Local**: `useState` para estado específico de componente
2. **Estado Compartilhado**: Context API para estado compartilhado entre componentes
3. **Estado Global**: Context específicos para domínios de negócio (ex: `PropertiesContext`)

### Fluxo de Dados

1. O fluxo de dados segue um padrão unidirecional
2. Os dados fluem de componentes pais para filhos via props
3. As atualizações de estado são propagadas através de callbacks ou context

## Estilização

### Abordagem com TailwindCSS

- Classes utilitárias para maioria dos estilos
- Componentes estilizados com composição de classes
- Variantes responsivas definidas para diversos tamanhos de tela
- Temas e variáveis de cores definidos no arquivo `tailwind.config.js`

### Design System

Cores primárias:
- Primária: `#0071ce` (Azul)
- Secundária: `#f2f2f2` (Cinza claro)
- Destaque: `#ff6b00` (Laranja)
- Texto: `#333333` (Cinza escuro)

## Renderização e Performance

### Estratégias de Renderização

- **Páginas Estáticas**: SSG para páginas que não mudam frequentemente
- **Renderização Incremental**: ISR para conteúdo que muda ocasionalmente
- **Renderização do Lado do Servidor**: SSR para conteúdo personalizado

### Otimização de Performance

- Lazy loading de componentes pesados
- Otimização de imagens com `next/image`
- Code splitting automático do Next.js
- Memoização de componentes que renderizam frequentemente

## Padrões de Código

### TypeScript

- Tipagem estrita para todos os componentes e funções
- Interfaces bem definidas para props de componentes
- Types para modelos de dados compartilhados

### Componentes

- Componentes funcionais com hooks
- Props bem definidas com interfaces TypeScript
- Componentes puros sempre que possível

## Considerações de Segurança

- Validação de dados de entrada em forms
- Sanitização de conteúdo dinâmico
- Proteção contra XSS através de práticas seguras do React

## Fluxo de Desenvolvimento

1. Desenvolvimento local com hot reloading
2. Testes unitários para componentes críticos
3. Build de produção com otimizações
4. Deploy em ambiente de staging para testes
5. Deploy em produção

## Possíveis Evoluções Futuras

- Implementação de testes automatizados
- Implementação de sistema de autenticação
- Integração com APIs externas de imóveis
- Dashboard para usuários gerenciarem seus imóveis

---

**Última atualização**: 22/04/2025 