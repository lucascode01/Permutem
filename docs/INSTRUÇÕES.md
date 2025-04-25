# Instruções de Instalação e Configuração - Permutem

Este documento fornece instruções detalhadas para configurar e executar o projeto Permutem em ambientes de desenvolvimento e produção.

## Requisitos de Sistema

- **Node.js**: versão 16.x ou superior
- **npm**: versão 8.x ou superior (incluído com Node.js)
- **Git**: para controle de versão
- **Espaço em disco**: mínimo de 500MB disponíveis
- **Memória RAM**: mínimo de 4GB recomendado

## Instalação do Ambiente de Desenvolvimento

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/permutem.git
cd permutem
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

O site estará disponível em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
permutem/
├── app/             # Código principal da aplicação
│   ├── components/  # Componentes React reutilizáveis
│   ├── page.tsx     # Página principal
│   └── layout.tsx   # Layout global da aplicação
├── public/          # Arquivos estáticos
│   └── images/      # Imagens do site
├── styles/          # Arquivos de estilo globais
├── docs/            # Documentação
└── next.config.js   # Configuração do Next.js
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Constrói a versão de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa verificação de código |

## Configuração para Produção

### 1. Construa a Aplicação

```bash
npm run build
```

### 2. Inicie o Servidor de Produção

```bash
npm run start
```

### 3. Ou utilize Docker (recomendado)

```bash
# Construa a imagem
docker build -t permutem:latest .

# Execute o contêiner
docker run -p 3000:3000 permutem:latest
```

## Solução de Problemas Comuns

### Erro: "Module not found"

Verifique se todas as dependências foram instaladas corretamente:

```bash
npm install
```

### Erro ao iniciar o servidor de desenvolvimento

Verifique se a porta 3000 não está sendo usada por outro processo:

```bash
# No Windows
netstat -ano | findstr :3000
taskkill /PID [PID_ENCONTRADO] /F

# No Linux/Mac
lsof -i :3000
kill -9 [PID_ENCONTRADO]
```

### Problemas com o Node.js

Certifique-se de estar usando uma versão compatível do Node.js:

```bash
node -v
# Se necessário, instale a versão correta usando NVM ou similar
```

## Otimização de Performance

- Use `next/image` para imagens para otimização automática
- Mantenha componentes pequenos e reutilizáveis
- Utilize memoização para componentes que renderizam frequentemente
- Não carregue dados desnecessários no lado do cliente

## Contato para Suporte

Se encontrar problemas que não estão cobertos neste documento:

- **Email de Suporte**: suporte@permutem.com.br
- **Canal no Discord**: discord.gg/permutem
- **GitHub Issues**: github.com/seu-usuario/permutem/issues

---

**Última atualização**: 22/04/2025 