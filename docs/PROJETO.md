# Documentação do Projeto Permutem

## Visão Geral
Permutem é uma plataforma online dedicada à permuta de imóveis no Brasil. Permite que usuários anunciem seus imóveis e encontrem trocas compatíveis em qualquer região do país.

## Tecnologias Utilizadas
- **Frontend**: Next.js (React)
- **Estilização**: Tailwind CSS
- **Ícones**: React Icons (FaSearch, FaHeart)
- **Imagens**: Formato PNG e JPG
- **Gerenciamento de Estado**: React Hooks (useState, useEffect)
- **Renderização**: Client-side + SSR (Server-Side Rendering)

## Estrutura do Projeto

### Componentes Principais
- **Header**: Navegação principal e logo
- **HeroSection**: Banner principal com carrossel e barra de busca
- **FeaturedProperties**: Carrossel de imóveis em destaque
- **NewsSection**: Carrossel de cidades disponíveis
- **HowItWorks**: Explicação do funcionamento da plataforma
- **CtaSection**: Seção de chamada para ação
- **Footer**: Rodapé com informações e newsletter

### Arquivos e Diretórios Importantes
- `/app/components/`: Todos os componentes React
- `/public/images/`: Imagens estáticas
  - `/public/images/carousel*.png`: Imagens do carrossel do banner
  - `/public/images/cities/`: Imagens das cidades no carrossel de cidades
  - `/public/images/permutem-logo-white.png`: Logo branca no header

## Ajustes Realizados

### Ajustes de Carrossel
1. **Carrossel do Hero Banner**:
   - Implementado carrossel automático com imagens locais
   - Adicionado overlay com 50% de opacidade para legibilidade dos textos
   - Tempo de transição: 5 segundos
   - Altura responsiva (60vh em mobile, 700px em desktop)

2. **Carrossel de Propriedades**:
   - Carrossel com 6 propriedades (3 por vez)
   - Removidos preços em dólar para padronização
   - Navegação por botões nas laterais

3. **Carrossel de Cidades**:
   - Implementado com 5 cidades: Manhuaçu-MG, Muriaé-MG, Ipatinga-MG, Manhumirim-MG, Caratinga-MG
   - Navegação por botões, mostrando 3 cidades por vez

### Ajustes de Layout
1. **Header**:
   - Logo branca aumentada (180x48px)
   - Botão "Anuncie seu imóvel" com cor de fundo azul (#0071ce)
   - Posicionamento absoluto para sobrepor o banner

2. **Simplificações**:
   - Removida a seção FeaturedLocations
   - Removido o campo "Selecione um país" da barra de busca
   - Reorganização das seções (FeaturedProperties acima de HowItWorks)

3. **Responsividade**:
   - Layout adaptável para dispositivos móveis e desktop
   - Newsletter no footer responsivo

### Ajustes de Conteúdo
1. **Textos**:
   - Atualizado texto de descrição no Footer
   - Atualizado copyright para: "© 2025 Imobiliária Soares e Oliveira Ltda CNPJ: 14.576.916/0001-07"

2. **Botões e Links**:
   - Botão "Anuncie agora" com contraste melhorado
   - Botões "Mostrar imóveis" com texto em azul da Permutem

## Desafios Resolvidos
1. **Carregamento de Imagens**:
   - Implementado pré-carregamento de imagens no carrossel principal
   - Simplificação de nomes de arquivos para evitar problemas com espaços
   - Ajuste do tamanho e posicionamento das imagens

2. **Erros de Renderização**:
   - Corrigido o erro "Cannot read properties of undefined (reading 'call')"
   - Simplificação da estrutura de divs e renderização de componentes

## Próximos Passos Sugeridos
1. **Autenticação**: Implementar sistema de login e cadastro
2. **Detalhes de Imóveis**: Criar página individual para cada propriedade
3. **Filtros de Busca**: Implementar filtros mais avançados na busca
4. **Favoritos**: Sistema para salvar imóveis favoritos
5. **Mensagens**: Sistema de comunicação entre usuários interessados em permutas

## Informações Técnicas

### Instalação
```bash
# Instalação de dependências
npm install

# Iniciar projeto em modo de desenvolvimento
npm run dev

# Construir projeto para produção
npm run build

# Iniciar projeto em modo de produção
npm start
```

### Arquivos de Configuração
- `next.config.js`: Configurações do Next.js
- `tailwind.config.js`: Configurações do Tailwind CSS

### Variáveis de Ambiente
Arquivo `.env.development.local` para configurações locais

## Contato e Suporte
- **Empresa**: Imobiliária Soares e Oliveira Ltda
- **CNPJ**: 14.576.916/0001-07
- **Website**: [permutem.com.br](https://permutem.com.br) 