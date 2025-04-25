# Padrões Arquiteturais - Projeto Permutem

Este documento descreve os principais padrões arquiteturais adotados no projeto Permutem, definindo a estrutura de organização e as práticas de desenvolvimento.

## Arquitetura de Camadas

O projeto segue uma arquitetura de camadas adaptada para o desenvolvimento moderno com Next.js:

```
📂 Permutem
├── 📂 app                    # Aplicação Next.js com App Router
│   ├── 📂 (auth)             # Rotas relacionadas à autenticação
│   ├── 📂 (dashboard)        # Rotas do painel do usuário
│   ├── 📂 (public)           # Rotas públicas
│   ├── 📂 api                # Rotas de API
│   └── 📂 components         # Componentes compartilhados
├── 📂 lib                    # Bibliotecas e utilitários
├── 📂 hooks                  # Custom hooks React
├── 📂 context                # Contextos React
├── 📂 types                  # Definições de tipos TypeScript
├── 📂 styles                 # Estilos globais
└── 📂 public                 # Ativos estáticos
```

### Principais Características

1. **Separação de Responsabilidades**: Cada componente deve ter uma única responsabilidade bem definida
2. **Componentização**: Estrutura baseada em componentes reutilizáveis
3. **Isolamento de Estado**: Estado gerenciado hierarquicamente ou via Context API

## Padrões de Design

### Atomic Design

Organizamos componentes seguindo os princípios do Atomic Design:

```
📂 components
├── 📂 atoms                # Componentes primitivos (Button, Input, etc.)
├── 📂 molecules            # Combinações de átomos (SearchBar, Card, etc.)
├── 📂 organisms            # Conjuntos funcionais (Header, PropertyList, etc.)
├── 📂 templates            # Estruturas de página sem dados concretos
└── 📂 pages                # Páginas completas
```

### Composição vs. Herança

Priorizamos a composição sobre herança, seguindo as recomendações do React:

```tsx
// Preferido: Composição via props
function Button({ icon, children, ...props }) {
  return (
    <button {...props}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

// Ao invés de subclasses ou herança
```

### Higher-Order Components (HOC)

Para funcionalidades transversais:

```tsx
// Exemplo de HOC para autenticação
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    
    if (loading) return <Loading />;
    if (!user) return <Redirect to="/login" />;
    
    return <Component {...props} user={user} />;
  };
}

export const ProtectedDashboard = withAuth(Dashboard);
```

## Padrões de Estado

### Container/Presentational Pattern

Separamos componentes que gerenciam estado (containers) dos que apenas apresentam UI (presentational):

```tsx
// Container Component
function PropertyListContainer() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await api.getProperties();
      setProperties(data);
      setLoading(false);
    }
    fetchData();
  }, []);
  
  return (
    <PropertyList 
      properties={properties} 
      loading={loading} 
    />
  );
}

// Presentational Component
function PropertyList({ properties, loading }) {
  if (loading) return <Skeleton />;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### Custom Hooks

Extraímos lógicas de estado reutilizáveis em custom hooks:

```tsx
// Custom hook para gerenciar propriedades
function useProperties(filters = {}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchProperties() {
      try {
        setLoading(true);
        const data = await api.getProperties(filters);
        if (isMounted) {
          setProperties(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchProperties();
    
    return () => { isMounted = false; };
  }, [JSON.stringify(filters)]);
  
  return { properties, loading, error };
}
```

## Padrões de Comunicação

### API Service

Centralizamos chamadas de API em serviços dedicados:

```tsx
// api/propertyService.ts
const BASE_URL = '/api/properties';

export const propertyService = {
  async getAll(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${BASE_URL}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    
    return response.json();
  },
  
  async getById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch property ${id}`);
    }
    
    return response.json();
  },
  
  // Outros métodos (create, update, delete)
};
```

### Server Actions (Next.js)

Para operações que exigem validação do lado do servidor:

```tsx
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const PropertyFormSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20),
  price: z.number().positive(),
  // outros campos
});

export async function createProperty(formData) {
  const validated = PropertyFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  
  if (!validated.success) {
    return { error: validated.error.format() };
  }
  
  try {
    const property = await db.properties.create({
      data: validated.data
    });
    
    revalidatePath('/properties');
    return { success: true, property };
  } catch (error) {
    return { error: 'Failed to create property' };
  }
}
```

## Padrões de Renderização

### Otimização de Renderização

1. **Memoização**: Uso de `React.memo`, `useMemo` e `useCallback` para evitar renderizações desnecessárias

```tsx
// Componente memoizado
const PropertyCard = React.memo(function PropertyCard({ property }) {
  return (
    <div className="card">
      <h3>{property.title}</h3>
      {/* resto do componente */}
    </div>
  );
});

// Uso de useMemo para cálculos caros
function PropertyStats({ properties }) {
  const stats = useMemo(() => {
    return {
      averagePrice: properties.reduce((acc, p) => acc + p.price, 0) / properties.length,
      totalProperties: properties.length,
      // outros cálculos
    };
  }, [properties]);
  
  return <StatsDisplay stats={stats} />;
}
```

2. **Virtualização**: Para listas longas, utilizamos virtualização com `react-virtualized` ou `react-window`

## Padrões de Autenticação

### Autenticação JWT com NextAuth.js

```tsx
// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Lógica de autenticação
        // ...
      }
    }),
    // Outros provedores (Google, Facebook, etc.)
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async jwt({ token, user }) {
      // Adicionar dados personalizados ao token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicionar dados do token à sessão
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST };
```

## Padrões para Testes

### Abordagem de Testes

1. **Testes Unitários**: Para funções e componentes isolados
2. **Testes de Integração**: Para fluxos completos
3. **Testes E2E**: Para jornadas críticas do usuário

```tsx
// Exemplo de teste unitário com Jest e React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyFilter } from './PropertyFilter';

describe('PropertyFilter', () => {
  const mockOnFilter = jest.fn();
  
  beforeEach(() => {
    mockOnFilter.mockClear();
  });
  
  it('deve chamar onFilter quando o formulário for enviado', () => {
    render(<PropertyFilter onFilter={mockOnFilter} />);
    
    // Preencher campos
    fireEvent.change(screen.getByLabelText(/preço mínimo/i), {
      target: { value: '100000' }
    });
    
    // Enviar formulário
    fireEvent.click(screen.getByRole('button', { name: /aplicar filtros/i }));
    
    // Verificar se onFilter foi chamado com os valores corretos
    expect(mockOnFilter).toHaveBeenCalledWith(
      expect.objectContaining({ 
        minPrice: '100000' 
      })
    );
  });
});
```

## Padrões de Implantação

### Ambientes de Implantação

1. **Desenvolvimento**: Para trabalho em progresso
2. **Staging**: Para testes antes da produção
3. **Produção**: Ambiente de usuários finais

### CI/CD

Utilizamos GitHub Actions para automação de:

1. **Testes**: Em cada pull request
2. **Build**: Verificação de erro na construção
3. **Deploy**: Implantação automática em staging e produção

---

**Última atualização**: 22/04/2025 