# Guia de Estilo Permutem

Este documento serve como referência para o estilo visual e padrões de design utilizados no projeto Permutem.

## Cores

### Cores Primárias
- **Azul Principal**: `#0071ce` - Usado em botões principais, links e elementos de destaque
- **Azul Secundário**: `#005fad` - Usado em gradientes e elementos secundários

### Cores Neutras
- **Preto**: `#000000` - Usado em overlays e sombras
- **Branco**: `#ffffff` - Texto sobre fundos escuros, cards e elementos de contraste
- **Cinza Claro**: `#f9fafb` (gray-50) - Fundo de seções alternadas
- **Cinza Médio**: `#e5e7eb` (gray-200) - Bordas e separadores
- **Cinza Escuro**: `#4b5563` (gray-600) - Texto secundário e ícones

### Cores de Estado
- **Sucesso**: Verde (classes do Tailwind: `text-green-800`, `bg-green-100`)
- **Informação**: Azul (classes do Tailwind: `text-blue-800`, `bg-blue-100`)
- **Alerta**: Amarelo (classes do Tailwind: `text-yellow-800`, `bg-yellow-100`)
- **Erro**: Vermelho (classes do Tailwind: `text-red-800`, `bg-red-100`)

## Tipografia

### Famílias de Fonte
- **Principal**: Sistema sans-serif padrão do Tailwind (sans)

### Tamanhos
- **Título Principal**: 3xl-5xl (36px-48px)
- **Subtítulos**: xl-2xl (20px-24px)
- **Corpo de Texto**: base (16px)
- **Texto Pequeno**: sm (14px)
- **Texto Muito Pequeno**: xs (12px)

### Pesos
- **Negrito**: 700 (bold)
- **Semi-negrito**: 600 (semibold)
- **Normal**: 400 (normal)

## Espaçamento

### Sistema de Grid
- Container principal: max-w-6xl (72rem/1152px)
- Gap padrão: 6 (1.5rem/24px)

### Margens e Padding
- Seções: py-16 (4rem/64px vertical)
- Cards: p-4 (1rem/16px)
- Botões: px-4 py-2 (horizontal: 1rem/16px, vertical: 0.5rem/8px)

## Componentes

### Botões

#### Botão Primário
```html
<button class="bg-[#0071ce] hover:bg-opacity-90 text-white py-2 px-4 rounded text-sm font-medium">
  Texto do Botão
</button>
```

#### Botão Secundário
```html
<button class="bg-white text-[#0071ce] py-2 px-4 rounded-md font-medium text-sm hover:bg-gray-100 transition-colors">
  Texto do Botão
</button>
```

#### Botão de Ícone
```html
<button class="border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors">
  <!-- Ícone SVG aqui -->
</button>
```

### Cards

#### Card de Propriedade
```html
<div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
  <!-- Conteúdo do card -->
</div>
```

#### Card de Cidade
```html
<div class="relative h-48 md:h-56 lg:h-64 rounded-lg overflow-hidden group">
  <!-- Conteúdo do card -->
</div>
```

### Formulários

#### Input de Texto
```html
<input 
  type="text" 
  placeholder="Placeholder" 
  class="w-full p-3 bg-white border border-gray-200 rounded text-gray-700 text-sm focus:outline-none focus:border-[#0071ce]"
/>
```

#### Select
```html
<select class="w-full p-3 bg-white border border-gray-200 rounded text-gray-700 text-sm font-medium focus:outline-none focus:border-[#0071ce]">
  <option value="">Opção</option>
</select>
```

## Breakpoints Responsivos

- **sm**: 640px (Mobile landscape)
- **md**: 768px (Tablets)
- **lg**: 1024px (Desktops pequenos)
- **xl**: 1280px (Desktops médios)
- **2xl**: 1536px (Desktops grandes)

## Animações e Transições

### Transições Padrão
- Hover em botões: `transition-colors`
- Hover em cards: `transition-shadow duration-300`
- Carrossel: `transition-opacity duration-1000`

### Efeitos Hover
- Zoom em imagens: `group-hover:scale-105 transition-transform duration-300`
- Mudança de cor em textos: `hover:text-gray-200`

## Sombras

- Cards: `shadow-md hover:shadow-lg`
- Elementos flutuantes: `shadow-lg`
- Botões de ícone: `shadow-md`

## Padrões de Layout

### Container Centralizado
```html
<div class="container mx-auto max-w-6xl px-4">
  <!-- Conteúdo -->
</div>
```

### Grid Responsivo
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Itens do grid -->
</div>
```

### Flex Responsivo
```html
<div class="flex flex-col md:flex-row justify-between items-center">
  <!-- Itens flex -->
</div>
```

## Camadas de Sobreposição (Z-index)

- Header: z-50
- Conteúdo principal: z-10
- Overlay de fundo: z-0

## Mídia

### Proporções de Imagem
- Cards de propriedade: 16:9 (h-48)
- Cards de cidade: aproximadamente 4:3 (h-48 md:h-56 lg:h-64)
- Imagens de background: cobertura total (inset-0)

### Tratamento de Imagens
- Overlay escuro: `bg-black opacity-50`
- Estilo de ajuste: `object-cover` ou `bg-cover bg-center`

---

**Observação**: Este guia de estilo é baseado principalmente no Tailwind CSS. As classes mencionadas são específicas dessa biblioteca e podem ser consultadas na [documentação oficial do Tailwind](https://tailwindcss.com/docs). 