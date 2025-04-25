# Configuração do GitHub e Deploy na Vercel

Este documento contém instruções para configurar o repositório no GitHub e fazer o deploy do projeto na Vercel.

## Preparação

Verifique se você tem os seguintes pré-requisitos:

1. [Git](https://git-scm.com/) instalado em sua máquina
2. Uma conta no [GitHub](https://github.com/)
3. Uma conta na [Vercel](https://vercel.com/)

## Configurando o Repositório no GitHub

### 1. Inicialize o Git (se ainda não estiver inicializado)

```bash
git init
```

### 2. Adicione todos os arquivos ao Git

```bash
git add .
```

### 3. Faça o commit inicial

```bash
git commit -m "Versão inicial do Permutem"
```

### 4. Crie um repositório no GitHub

1. Acesse [GitHub](https://github.com/) e faça login
2. Clique no ícone "+" no canto superior direito
3. Selecione "New repository"
4. Nome do repositório: `permutem`
5. Descrição (opcional): "Plataforma de permuta de imóveis"
6. Selecione "Public" ou "Private" conforme sua preferência
7. Clique em "Create repository"

### 5. Conecte seu repositório local ao GitHub

```bash
git remote add origin https://github.com/GouveiaZx/permutem.git
git branch -M main
git push -u origin main
```

## Deploy na Vercel

### 1. Conecte sua conta do GitHub à Vercel

1. Acesse [Vercel](https://vercel.com/) e faça login (ou crie uma conta)
2. Vá para "Settings" > "Git"
3. Conecte sua conta do GitHub se ainda não estiver conectada

### 2. Importe o Projeto

1. Na dashboard da Vercel, clique em "Add New..." > "Project"
2. Selecione o repositório `GouveiaZx/permutem` da lista
3. Configure o projeto (a maioria das configurações já deve estar correta para o Next.js)
4. (Opcional) Adicione variáveis de ambiente se necessário
5. Clique em "Deploy"

### 3. Verifique o Deploy

1. Após a conclusão do deploy, a Vercel fornecerá um URL para seu projeto
2. Verifique se tudo está funcionando corretamente acessando o URL fornecido
3. (Opcional) Configure um domínio personalizado em "Settings" > "Domains"

## Atualizações Futuras

Para fazer atualizações no projeto e publicá-las:

```bash
# Faça suas alterações no código

# Adicione as alterações ao Git
git add .

# Faça o commit das alterações
git commit -m "Descrição das alterações"

# Envie para o GitHub
git push

# A Vercel detectará as alterações automaticamente e fará o deploy
```

## Solução de Problemas

- **Erro no build**: Verifique os logs de build na Vercel para identificar o problema
- **Problemas com variáveis de ambiente**: Certifique-se de que todas as variáveis necessárias estão configuradas na Vercel
- **Problemas de rotas**: Verifique se todas as rotas da sua aplicação estão funcionando corretamente

---

Para mais informações, consulte a [documentação da Vercel](https://vercel.com/docs) e a [documentação do GitHub](https://docs.github.com/). 