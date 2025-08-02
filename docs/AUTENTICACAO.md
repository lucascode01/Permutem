# Sistema de Autenticação - Permutem

Este documento descreve a implementação completa do sistema de autenticação do Permutem.

## Visão Geral

O sistema de autenticação foi implementado usando **Supabase Auth** com as seguintes funcionalidades:

- ✅ Login com email/senha
- ✅ Login social (Google, Facebook, Apple)
- ✅ Cadastro de usuários
- ✅ Recuperação de senha
- ✅ Verificação de email
- ✅ Middleware de proteção de rotas
- ✅ Controle de acesso baseado em roles
- ✅ Gerenciamento de perfil do usuário
- ✅ Upload de foto de perfil

## Arquitetura

### 1. Contexto de Autenticação (`AuthContext.tsx`)

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: Usuario | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<Usuario>) => Promise<{error: Error | null; data: any}>;
  signIn: (email: string, password: string) => Promise<{error: Error | null; data: any}>;
  signInWithProvider: (provider: 'google' | 'facebook' | 'apple') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{error: Error | null; data: any}>;
}
```

### 2. Hook Personalizado (`useAuth.ts`)

Extensão do contexto com funcionalidades adicionais:

- Verificação de plano ativo
- Controle de permissões por role
- Login com redirecionamento
- Logout com confirmação

### 3. Middleware de Proteção (`middleware.ts`)

Protege rotas automaticamente:

```typescript
// Rotas públicas
const publicRoutes = ['/', '/login', '/cadastro', '/recuperar-senha'];

// Rotas protegidas
const protectedRoutes = ['/dashboard', '/perfil', '/anuncios'];

// Rotas administrativas
const adminRoutes = ['/admin', '/admin/dashboard'];
```

### 4. Componente de Proteção (`AuthGuard.tsx`)

Protege componentes específicos:

```typescript
<AuthGuard requiredRole="admin" requirePlanoAtivo={true}>
  <AdminPanel />
</AuthGuard>
```

## Funcionalidades Implementadas

### 1. Login e Cadastro

#### Login (`/login`)
- Formulário de login com email/senha
- Login social (Google, Facebook, Apple)
- Redirecionamento automático após login
- Tratamento de erros com toast notifications

#### Cadastro (`/cadastro`)
- Formulário completo de cadastro
- Validação de campos obrigatórios
- Seleção de tipo de usuário (proprietário/corretor)
- Criação automática de perfil no banco

### 2. Recuperação de Senha

#### Recuperação (`/recuperar-senha`)
- Formulário para enviar email de recuperação
- Integração com Supabase Auth
- Feedback visual do status

#### Redefinição (`/redefinir-senha/[token]`)
- Página para definir nova senha
- Validação de token
- Atualização segura da senha

### 3. Gerenciamento de Perfil

#### Perfil do Usuário (`UserProfile.tsx`)
- Visualização e edição de dados pessoais
- Upload de foto de perfil
- Endereço completo
- Validação de campos

#### APIs de Perfil
- `GET /api/user/profile` - Buscar perfil
- `PUT /api/user/profile` - Atualizar perfil
- `POST /api/user/upload-photo` - Upload de foto

### 4. Controle de Acesso

#### Roles Implementados
- **proprietario**: Usuário comum que anuncia imóveis
- **corretor**: Profissional do setor imobiliário
- **admin**: Administrador do sistema

#### Verificação de Permissões
```typescript
const { canAccess, isAdmin, isCorretor, isProprietario } = useAuth();

// Verificar se pode acessar funcionalidade
if (canAccess('admin')) {
  // Mostrar painel admin
}

// Verificar plano ativo
if (canAccess('plano_ativo')) {
  // Mostrar funcionalidades premium
}
```

### 5. Navegação Inteligente

#### AuthNavbar
- Navegação específica para usuários logados
- Menu dropdown com perfil do usuário
- Links rápidos para funcionalidades principais
- Indicador visual para admins

#### MainContentWrapper
- Renderiza navbar apropriada baseada no status de autenticação
- Esconde navbar em páginas de login/cadastro
- Integração transparente com o sistema

## APIs Implementadas

### 1. Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `GET /api/auth/callback` - Callback de OAuth
- `POST /api/auth/reset-password` - Reset de senha

### 2. Perfil do Usuário
- `GET /api/user/profile` - Buscar perfil
- `PUT /api/user/profile` - Atualizar perfil
- `POST /api/user/upload-photo` - Upload de foto

### 3. Assinaturas
- `GET /api/assinaturas/status` - Status da assinatura

## Segurança

### 1. Middleware de Proteção
- Verificação automática de sessão
- Redirecionamento para login quando necessário
- Proteção de rotas administrativas

### 2. Validação de Dados
- Validação de campos obrigatórios
- Sanitização de inputs
- Verificação de tipos de arquivo

### 3. Controle de Acesso
- Verificação de roles em tempo real
- Proteção de rotas sensíveis
- Logout automático em sessões expiradas

## Fluxo de Autenticação

### 1. Login
```
Usuário acessa /login
↓
Preenche credenciais
↓
Supabase Auth valida
↓
Cria sessão
↓
Redireciona para /dashboard
```

### 2. Cadastro
```
Usuário acessa /cadastro
↓
Preenche formulário
↓
API cria usuário no Supabase Auth
↓
API cria perfil na tabela usuarios
↓
Login automático
↓
Redireciona para /dashboard
```

### 3. Recuperação de Senha
```
Usuário acessa /recuperar-senha
↓
Informa email
↓
Supabase envia email
↓
Usuário clica no link
↓
Acessa /redefinir-senha/[token]
↓
Define nova senha
↓
Redireciona para /login
```

## Configuração do Supabase

### 1. Variáveis de Ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico
```

### 2. Configuração de Auth
- Email confirmation: Desabilitado (login automático)
- Social providers: Google, Facebook, Apple
- Password reset: Habilitado
- Session management: Automático

### 3. Storage
- Bucket: `user-photos`
- Políticas de acesso configuradas
- Upload de imagens de perfil

## Uso no Código

### 1. Proteger Página
```typescript
export default function MinhaPagina() {
  return (
    <AuthGuard requiredRole="admin">
      <ConteudoProtegido />
    </AuthGuard>
  );
}
```

### 2. Verificar Autenticação
```typescript
const { user, userProfile, isAdmin } = useAuth();

if (!user) {
  return <div>Faça login para continuar</div>;
}
```

### 3. Verificar Permissões
```typescript
const { canAccess } = useAuth();

if (canAccess('plano_ativo')) {
  return <FuncionalidadePremium />;
}
```

## Próximos Passos

### 1. Melhorias de Segurança
- [ ] Implementar rate limiting
- [ ] Adicionar 2FA (autenticação de dois fatores)
- [ ] Logs de auditoria
- [ ] Detecção de atividades suspeitas

### 2. Funcionalidades Adicionais
- [ ] Notificações push
- [ ] Sessões simultâneas
- [ ] Lembrar dispositivo
- [ ] Exportação de dados

### 3. Performance
- [ ] Cache de perfil do usuário
- [ ] Lazy loading de componentes
- [ ] Otimização de queries

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0.0 