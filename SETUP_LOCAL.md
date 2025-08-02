# Configuração do Ambiente Local - Permutem

Este guia explica como configurar o ambiente de desenvolvimento local do Permutem.

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

#### Opção A: Usar Configuração de Desenvolvimento (Recomendado para testes)
O projeto já está configurado com dados de desenvolvimento. Apenas execute:

```bash
npm run dev
```

#### Opção B: Configurar Supabase Real
1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie as credenciais do projeto
3. Configure o arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico
```

### 3. Executar o Projeto
```bash
npm run dev
```

## 🔧 Configuração Detalhada

### Variáveis de Ambiente

#### Para Desenvolvimento (Sem Supabase)
```env
# Aplicativo
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
NEXT_SUPPRESS_HYDRATION_WARNING=1
```

#### Para Produção (Com Supabase)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu_projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_supabase

# Aplicativo
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
NEXT_SUPPRESS_HYDRATION_WARNING=1
```

### Dados de Teste

Quando usar a configuração de desenvolvimento, você pode fazer login com:

- **Email**: `dev@permutem.com`
- **Senha**: `123456`

## 🛠️ Funcionalidades Disponíveis

### Com Configuração de Desenvolvimento
- ✅ Login/Cadastro (mock)
- ✅ Navegação entre páginas
- ✅ Interface de usuário
- ✅ Componentes de autenticação
- ✅ Proteção de rotas
- ✅ Dashboard funcional

### Com Supabase Real
- ✅ Todas as funcionalidades acima
- ✅ Autenticação real
- ✅ Banco de dados persistente
- ✅ Upload de arquivos
- ✅ Sistema de assinaturas

## 🐛 Solução de Problemas

### Erro: "either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables are required"

**Solução**: O projeto está configurado para usar dados de desenvolvimento automaticamente. Se você quiser usar um Supabase real:

1. Crie um projeto no Supabase
2. Configure as variáveis de ambiente
3. Execute as migrações do banco de dados

### Erro de Hidratação

**Solução**: O projeto já está configurado com `NEXT_SUPPRESS_HYDRATION_WARNING=1` para suprimir avisos de hidratação.

### Erro de CORS

**Solução**: Configure as URLs permitidas no seu projeto Supabase:
- `http://localhost:3000`
- `http://localhost:3001` (se usar porta diferente)

## 📁 Estrutura de Arquivos

```
permutem/
├── app/
│   ├── components/          # Componentes React
│   ├── contexts/           # Contextos de estado
│   ├── hooks/              # Hooks personalizados
│   ├── lib/                # Utilitários e configurações
│   └── api/                # APIs do Next.js
├── docs/                   # Documentação
├── .env                    # Variáveis de ambiente
└── middleware.ts           # Middleware de proteção
```

## 🔐 Autenticação

### Sistema Implementado
- Login com email/senha
- Login social (Google, Facebook, Apple)
- Cadastro de usuários
- Recuperação de senha
- Proteção de rotas
- Controle de acesso por roles

### Roles Disponíveis
- **proprietario**: Usuário comum
- **corretor**: Profissional do setor
- **admin**: Administrador do sistema

## 🎨 Interface

### Páginas Principais
- `/` - Página inicial
- `/login` - Login
- `/cadastro` - Cadastro
- `/dashboard` - Dashboard do usuário
- `/perfil` - Perfil do usuário
- `/admin` - Painel administrativo

### Componentes Principais
- `AuthGuard` - Proteção de rotas
- `AuthNavbar` - Navegação autenticada
- `UserProfile` - Gerenciamento de perfil
- `LoginForm` - Formulário de login

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outros Provedores
- Configure as variáveis de ambiente
- Execute `npm run build`
- Deploy dos arquivos gerados

## 📞 Suporte

Se encontrar problemas:

1. Verifique se todas as dependências estão instaladas
2. Confirme se as variáveis de ambiente estão corretas
3. Verifique o console do navegador para erros
4. Consulte a documentação em `docs/`

---

**Última atualização**: Janeiro 2025 