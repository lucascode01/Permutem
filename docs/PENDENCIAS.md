# Pendências e Próximos Passos

Este documento registra as tarefas pendentes e os próximos passos do desenvolvimento da plataforma Permutem.

## Pendências Técnicas

### Carregamento de Imagens
- [ ] Implementar sistema de tratamento de erros para imagens não carregadas
- [ ] Adicionar imagens em WebP para melhor performance
- [ ] Implementar lazy loading integrado com o Next.js

### Performance
- [ ] Otimizar First Contentful Paint (FCP)
- [ ] Reduzir o Largest Contentful Paint (LCP)
- [ ] Implementar caching de imagens e recursos estáticos

### SEO
- [ ] Adicionar meta tags para compartilhamento (Open Graph, Twitter Cards)
- [ ] Melhorar a estrutura de cabeçalhos (h1, h2, h3)
- [ ] Adicionar sitemap.xml e robots.txt

## Próximos Desenvolvimentos

### Funcionalidades Prioritárias
- [ ] Sistema de autenticação de usuários
- [ ] Página de detalhes de imóvel
- [ ] Formulário de contato para interessados
- [ ] Sistema de busca avançada com filtros
- [ ] Dashboard para usuários cadastrados

### Melhorias de UX/UI
- [ ] Implementar tema escuro (dark mode)
- [ ] Adicionar animações suaves entre transições
- [ ] Melhorar a experiência mobile (touch gestures)
- [ ] Implementar sistema de notificações

### Integração de Dados
- [ ] Conectar com API backend
- [ ] Implementar sistema de cache para requisições
- [ ] Gerenciamento de estado com context ou biblioteca externa

## Bugs Conhecidos

| ID | Descrição | Gravidade | Status |
|----|-----------|-----------|--------|
| 01 | Ocasionalmente as imagens do carrossel não carregam corretamente | Média | Aberto |
| 02 | Problemas de renderização em navegadores Safari antigos | Baixa | Aberto |

## Melhorias de Código

- [ ] Implementar testes unitários
- [ ] Refatorar componentes para melhorar reusabilidade
- [ ] Migrar tipos para arquivos separados
- [ ] Organizar constantes em arquivos centralizados
- [ ] Adicionar documentação JSDoc

## Recursos e Referências

### Biblioteca de Componentes
- Considerar implementação de uma biblioteca de componentes como Material UI, Chakra UI ou criação de sistema de design próprio

### APIs a Integrar
- API de busca de CEP
- API de cálculo de distância entre localidades
- Sistema de imagens otimizadas para imobiliárias

### Cronograma Tentativo

| Fase | Descrição | Data Estimada |
|------|-----------|---------------|
| 1 | Autenticação e Perfis de Usuário | A definir |
| 2 | Páginas de Detalhes e Listagem | A definir |
| 3 | Sistema de Busca Avançada | A definir |
| 4 | Chat e Interações entre Usuários | A definir |
| 5 | Recursos administrativos | A definir |

## Alterações Realizadas - [DATA ATUAL]

### Design e UI/UX
- ✅ Padronizado o formato dos títulos dos imóveis para "Tipo de imóvel no Bairro de Cidade"
- ✅ Alterado texto dos badges de permuta para "Estuda permuta por imóvel em [ESTADO]"
- ✅ Substituído a palavra "Anuncie" por "Publique" no CTA e botões
- ✅ Atualizado o texto do CTA principal para "Publique seu imóvel e comece a receber e enviar ofertas imediatamente"
- ✅ Removido o CNPJ do rodapé para maior limpeza visual
- ✅ Alterado o texto informativo na seção "Como funciona" para "Seu imóvel pode valer uma nova oportunidade. Permute com quem também quer trocar!"
- ✅ Padronizados os cards de imóveis para mostrar apenas propriedades brasileiras
- ✅ Substituído o uso de "em" por "no/na" e "de" para melhor gramática nos títulos de imóveis

### Melhorias de Texto e Conteúdo
- ✅ Adaptado os textos para melhor comunicar o conceito de permuta
- ✅ Ajustada a linguagem para ser mais convidativa e clara
- ✅ Enfatizado o conceito de troca em vez de venda nos textos principais

---

**Última atualização:** 22/04/2025 