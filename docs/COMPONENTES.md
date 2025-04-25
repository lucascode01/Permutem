# Componentes do Projeto Permutem

Este documento detalha os principais componentes do projeto Permutem, suas funcionalidades e relações.

## Header
**Arquivo**: `app/components/Header.tsx`

**Funcionalidade**: Componente de navegação principal, fixado no topo da página.

**Elementos**:
- Logo Permutem (branca)
- Links de navegação: "Como funciona", "Ajuda"
- Botão "Anuncie seu imóvel" em destaque
- Link "Entrar"

**Implementação**:
- Posicionamento absoluto sobre o HeroSection
- Uso de Next/Image para a logo
- Responsivo, escondendo os links de navegação em telas menores

## HeroSection
**Arquivo**: `app/components/HeroSection.tsx`

**Funcionalidade**: Banner principal com carrossel de imagens e barra de busca.

**Elementos**:
- Carrossel automático de imagens
- Overlay escuro para melhorar legibilidade
- Título e subtítulo
- Barra de busca por cidade/estado

**Implementação**:
- Componente com `"use client"` para interatividade
- useState para controlar o slide atual
- useEffect para transição automática a cada 5 segundos
- Pré-carregamento de imagens para evitar falhas
- Altura responsiva (60vh em mobile, 700px em desktop)

## FeaturedProperties
**Arquivo**: `app/components/FeaturedProperties.tsx`

**Funcionalidade**: Exibe imóveis em destaque disponíveis para permuta.

**Elementos**:
- Título e subtítulo da seção
- Grid de 3 propriedades (6 no total, em carrossel)
- Botões de navegação do carrossel
- Cards de propriedade com imagem, título, localização e preço

**Implementação**:
- Componente com `"use client"` para interatividade
- Estado para controlar os imóveis visíveis
- Funcionalidade de "favoritar" (visual)
- Responsivo (3 cards em desktop, 1 em mobile)

## NewsSection
**Arquivo**: `app/components/NewsSection.tsx`

**Funcionalidade**: Exibe carrossel de cidades disponíveis no sistema.

**Elementos**:
- Título "Novidades Permutem"
- Grid de 3 cidades (5 no total, em carrossel)
- Botões de navegação do carrossel
- Cards de cidade com imagem, nome e botão "Mostrar imóveis"

**Implementação**:
- Componente com `"use client"` para interatividade
- Estado para controlar as cidades visíveis
- Efeito de zoom hover nas imagens
- Responsivo (3 cards em desktop, 1 em mobile)

## HowItWorks
**Arquivo**: `app/components/HowItWorks.tsx`

**Funcionalidade**: Explica o funcionamento da plataforma.

**Elementos**:
- Título e subtítulo da seção
- Cards explicativos sobre o processo de permuta
- Imagens ilustrativas

**Implementação**:
- Layout em grid
- Uso de componente FeatureCard para cada etapa
- Design visual consistente

## CtaSection
**Arquivo**: `app/components/CtaSection.tsx`

**Funcionalidade**: Chamada para ação para anunciar imóveis.

**Elementos**:
- Fundo com overlay de imagem
- Título "Anuncie agora seu imóvel..."
- Botão "Anuncie agora" em destaque

**Implementação**:
- Fundo com imagem e overlay
- Botão de destaque com cor contrastante (branco com texto azul)

## Footer
**Arquivo**: `app/components/Footer.tsx`

**Funcionalidade**: Rodapé com informações da empresa e newsletter.

**Elementos**:
- Três colunas: Sobre, Suporte, Newsletter
- Formulário de inscrição na newsletter
- Links de políticas
- Copyright

**Implementação**:
- Layout em grid para as três colunas principais
- Layout flexbox para os links de política
- Formulário de newsletter responsivo
- Informações de copyright atualizadas

## Componentes Auxiliares

### PropertyCard
**Localização**: Dentro de `FeaturedProperties.tsx`

**Funcionalidade**: Card individual para exibição de imóvel.

**Elementos**:
- Imagem do imóvel
- Badges (ex: "Permuta por imóvel")
- Título, localização, preço
- Botão de favorito

### CityCard
**Localização**: Dentro de `NewsSection.tsx`

**Funcionalidade**: Card individual para exibição de cidade.

**Elementos**:
- Imagem da cidade
- Nome da cidade
- Botão "Mostrar imóveis"

### FeatureCard
**Localização**: Dentro de `HowItWorks.tsx`

**Funcionalidade**: Card de funcionalidade explicativa.

**Elementos**:
- Imagem ilustrativa
- Título
- Descrição

## Relações entre Componentes

```
App
├── Header
├── HeroSection
├── FeaturedProperties
│   └── PropertyCard (múltiplos)
├── HowItWorks
│   └── FeatureCard (múltiplos)
├── CtaSection
├── NewsSection
│   └── CityCard (múltiplos)
└── Footer
```

Todos estes componentes são chamados em sequência no arquivo `app/page.tsx`, que serve como o ponto de entrada da aplicação.

## Observações de Implementação

- Todos os componentes interativos (carrosséis) usam a diretiva `'use client'`
- Componentes estáticos são renderizados no servidor
- Uso extensivo de Tailwind CSS para estilização
- Padrão de design consistente em cores, espaçamentos e tipografia
- Responsividade implementada via classes condicionais do Tailwind 

## Componentes de Apresentação

### FeaturedProperties

O componente `FeaturedProperties` exibe uma seleção de imóveis em destaque para permuta.

**Localização:** `app/components/FeaturedProperties.tsx`

**Características atualizadas:**
- Títulos no formato "Tipo de imóvel no Bairro de Cidade" (por exemplo, "Apartamento no Jardins de São Paulo")
- Badge de permuta com o texto "Estuda permuta por imóvel em [ESTADO]"
- O estado é exibido dentro de um quadrado vazado destacado em azul
- Foco exclusivo em imóveis brasileiros
- Preço em destaque abaixo do badge de permuta

**Props do PropertyCard:**
```typescript
type PropertyProps = {
  id: string;
  title: string;        // Formato: "Tipo no Bairro de Cidade"
  location: string;     // Campo não utilizado atualmente
  price: string;        // Formato: "R$ 999.999"
  priceUSD?: string;    // Opcional
  imageUrl: string;
  exchangeCountry?: string;  // Sigla do estado de interesse para permuta: "SP", "RJ", etc.
  badges?: {
    type: 'for_sale' | 'for_exchange';
    text: string;
  }[];
};
```

### CtaSection

Seção de chamada para ação que incentiva a publicação de imóveis.

**Localização:** `app/components/CtaSection.tsx`

**Características atualizadas:**
- Texto principal: "Publique seu imóvel e comece a receber e enviar ofertas imediatamente."
- Texto do botão: "Publique já"
- Fundo em azul com imagem de overlay
- Design responsivo com texto destacado

### HowItWorks

Seção que explica o funcionamento da plataforma em três passos.

**Localização:** `app/components/HowItWorks.tsx`

**Características atualizadas:**
- Novo texto no primeiro card: "Seu imóvel pode valer uma nova oportunidade. Permute com quem também quer trocar!"
- Três etapas principais: permuta, busca e publicação
- Cada cartão possui número de passo, título, descrição e botão
