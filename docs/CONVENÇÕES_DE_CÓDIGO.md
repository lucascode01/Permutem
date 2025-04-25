# Convenções de Código - Projeto Permutem

Este documento estabelece as convenções de código a serem seguidas no desenvolvimento do projeto Permutem, garantindo consistência, legibilidade e manutenibilidade.

## Princípios Gerais

1. **Legibilidade**: O código deve ser facilmente compreensível por outros desenvolvedores.
2. **Simplicidade**: Priorize soluções simples e diretas quando possível.
3. **Manutenibilidade**: Escreva código pensando em quem irá mantê-lo no futuro.
4. **Consistência**: Siga os padrões estabelecidos em todo o projeto.

## Formatação e Estilo

### Indentação e Espaçamento

- Use **2 espaços** para indentação (não tabs)
- Linhas em branco:
  - Entre blocos lógicos de código
  - Após declarações de imports
  - Antes de return em funções longas

### Comprimento de Linha

- Limite de 100 caracteres por linha
- Quebras de linha para parâmetros e props quando excederem o limite

### Nomeação

- **Arquivos de componentes**: PascalCase (`ButtonPrimary.tsx`)
- **Arquivos de utilitários/hooks**: camelCase (`formatCurrency.ts`, `useWindowSize.ts`)
- **Variáveis e funções**: camelCase (`getUserData`, `propertyList`)
- **Componentes**: PascalCase (`PropertyCard`, `NavMenu`)
- **Interfaces e Types**: PascalCase com prefixo `I` ou sufixo `Type` (`IProperty`, `UserType`)
- **Constantes**: SNAKE_CASE_MAIÚSCULO (`MAX_RESULTS`, `API_URL`)

## React e TypeScript

### Componentes React

- Utilize componentes funcionais com hooks
- Prefira componentes pequenos e focados (< 250 linhas)
- Organize imports na seguinte ordem:
  1. Bibliotecas externas
  2. Componentes internos
  3. Hooks
  4. Utilitários
  5. Tipos
  6. Estilos

```tsx
// Exemplo de ordem de imports
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Button } from '../ui/Button';
import { PropertyCard } from './PropertyCard';

import { useProperties } from '@/hooks/useProperties';

import { formatCurrency } from '@/utils/formatters';

import type { Property } from '@/types/property';

import './styles.css';
```

### Props e Types

- Declare props com interfaces dedicadas
- Use tipos específicos em vez de `any`
- Declare props obrigatórias sem `?` e opcionais com `?`

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant,
  size = 'md',
  label,
  onClick,
  disabled = false
}) => {
  // ...
}
```

### JSX

- Uma prop por linha quando tiver mais de 3 props
- Espaçamento consistente entre props
- Use fragmentos `<>...</>` em vez de `<div>` desnecessários

```tsx
// Formatação de JSX com múltiplas props
<Button 
  variant="primary"
  size="lg"
  onClick={handleClick}
  disabled={isLoading}
>
  {buttonText}
</Button>
```

## Estilização

### TailwindCSS

- Agrupe classes relacionadas:
  - Layout (flex, grid)
  - Espaçamento (padding, margin)
  - Dimensões (width, height)
  - Tipografia (font, text)
  - Cores (bg, text, border)
  - Estados (hover, focus)

```tsx
// Exemplo de agrupamento de classes Tailwind
<div 
  className="
    flex justify-between items-center 
    px-4 py-2 mb-4 
    w-full h-16 
    text-sm font-medium 
    bg-white text-gray-800 border border-gray-200 
    hover:bg-gray-50 focus:ring-2
  "
>
  Conteúdo
</div>
```

- Para classes muito extensas, crie componentes estilizados ou extraia para variáveis

## Estado e Efeitos Colaterais

### Hooks

- Mantenha hooks no topo do componente
- Use nomes descritivos para estados (`isLoading` em vez de `loading`)
- Evite efeitos colaterais desnecessários

```tsx
// Organização de hooks
const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const data = await getProperties();
        setProperties(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  // restante do componente...
}
```

## Comentários

- Comentários apenas quando necessários para explicar "por quê", não "o quê"
- Para documentação de API ou funções complexas, use JSDoc

```tsx
/**
 * Calcula o valor estimado de um imóvel baseado em parâmetros de mercado
 * @param property - Objeto com dados do imóvel
 * @param marketFactors - Fatores de mercado que influenciam o cálculo
 * @returns Valor estimado em reais
 */
function calculatePropertyValue(property: Property, marketFactors: MarketFactors): number {
  // ... lógica de cálculo complexa
}
```

## Tratamento de Erros

- Use try/catch para operações que podem falhar
- Evite suprimir erros silenciosamente
- Forneça feedback visual ao usuário em caso de erro

## Versionamento e Commits

- Mensagens de commit descritivas no formato:
  `tipo(escopo): mensagem concisa`
  
  Tipos: feat, fix, docs, style, refactor, test, chore
  
  Exemplo: `feat(auth): adiciona sistema de login com Google`
  
- Pull requests com descrições claras do que foi alterado

## Testes

- Teste componentes críticos
- Nomeie testes de forma descritiva
- Siga o padrão AAA (Arrange, Act, Assert)

```tsx
test('deve renderizar botão desabilitado quando isLoading é true', () => {
  // Arrange
  const handleClick = jest.fn();
  
  // Act
  render(<Button isLoading={true} onClick={handleClick} label="Carregar" />);
  const button = screen.getByRole('button', { name: /carregar/i });
  
  // Assert
  expect(button).toBeDisabled();
});
```

## Performance

- Use React.memo para componentes que renderizam frequentemente
- Otimize listas com `key` apropriadas
- Lazy load componentes grandes com React.lazy e Suspense

---

**Última atualização**: 22/04/2025 