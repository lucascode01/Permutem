# Configuração de Variáveis de Ambiente

Este documento explica como configurar as variáveis de ambiente necessárias para o projeto Permutem.

## Arquivos de Configuração

- `.env` - Arquivo principal com as variáveis de ambiente (NÃO commitar)
- `.env.development.local` - Configurações específicas de desenvolvimento

## Variáveis Necessárias

### 🔹 Supabase (Banco de Dados)

```env
# URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu_projeto.supabase.co

# Chave pública/anônima do Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_supabase

# Chave de serviço do Supabase (SECRETA)
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_supabase

# Segredo para inicialização do Supabase
SUPABASE_INIT_SECRET=permutem-init-secret-2025
```

### 💳 Asaas (Pagamentos)

```env
# URL da API do Asaas
ASAAS_API_URL=https://www.asaas.com/api/v3

# Chave da API do Asaas
ASAAS_API_KEY=sua_chave_api_asaas

# Chave para validação de webhooks
ASAAS_WEBHOOK_KEY=sua_chave_webhook_asaas

# ID da conta no Asaas (opcional)
ASAAS_ACCOUNT_ID=sua_conta_id_asaas
```

### ⚙️ Aplicativo

```env
# URL do site (para redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Chave para APIs administrativas
ADMIN_API_KEY=sua_chave_admin_super_secreta

# Ambiente de execução
NODE_ENV=development
```

## Como Configurar

### 1. Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login e vá para o seu projeto
3. Vá em **Settings > API**
4. Copie:
   - **URL**: Coloque em `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: Coloque em `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: Coloque em `SUPABASE_SERVICE_ROLE_KEY`

### 2. Asaas

1. Acesse [https://www.asaas.com](https://www.asaas.com)
2. Faça login na sua conta
3. Vá em **Integrações > API**
4. Gere uma nova chave de API
5. Configure webhooks em **Integrações > Webhooks**:
   - **URL**: `https://seudominio.com/api/webhooks/asaas`
   - **Eventos**: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `SUBSCRIPTION_CYCLE_STARTED`, `SUBSCRIPTION_CYCLE_ENDED`

### 3. Webhooks do Asaas

Configure os seguintes eventos no painel do Asaas:

- ✅ `PAYMENT_CONFIRMED` - Pagamento confirmado
- ✅ `PAYMENT_RECEIVED` - Pagamento recebido  
- ✅ `SUBSCRIPTION_CYCLE_STARTED` - Ciclo de assinatura iniciado
- ✅ `SUBSCRIPTION_CYCLE_ENDED` - Ciclo de assinatura finalizado

## Segurança

⚠️ **IMPORTANTE**:

- Nunca commite o arquivo `.env` com valores reais
- Use chaves diferentes para desenvolvimento e produção
- No Asaas, use a chave de sandbox para desenvolvimento
- Gere uma `ADMIN_API_KEY` forte e única
- Em produção, configure as variáveis no seu provedor de hospedagem

## Verificação

Para verificar se as variáveis estão configuradas corretamente:

1. Execute o projeto: `npm run dev`
2. Acesse: `http://localhost:3000`
3. Verifique o console do navegador para erros de conexão
4. Teste a funcionalidade de login/cadastro
5. Teste um pagamento (modo sandbox)

## Ambiente de Produção

Para produção, certifique-se de:

1. Usar URLs de produção para Supabase e site
2. Usar chave de produção do Asaas
3. Configurar SSL/HTTPS
4. Configurar webhooks com URL de produção
5. Usar segredos seguros e únicos 