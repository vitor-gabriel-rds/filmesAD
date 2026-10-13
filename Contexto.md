# 📖 Contexto do Projeto - CineCatálogo

## 1. Visão Geral
O **CineCatálogo** é uma aplicação Full Stack completa desenvolvida para gerenciar um catálogo de filmes com as informações essenciais: **Título**, **Diretor**, **Ano de Lançamento**, **Gênero** e **URL da Imagem da Capa**.

O objetivo principal da arquitetura foi garantir **zero atrito de configuração de infraestrutura**, eliminando a necessidade de contas externas em serviços de banco de dados (como MongoDB Atlas) para testes, avaliações, deploy na Vercel ou clonagem no GitHub.

---

## 2. Tecnologias Utilizadas

### Backend
- **Node.js (v24+)**: Ambiente de execução JavaScript do lado do servidor.
- **Express.js**: Framework web minimalista para criação da API RESTful.
- **Mongoose**: ODM (Object Data Modeling) para modelagem, validação de tipos e manipulação dos documentos de filmes.
- **mongodb-memory-server**: Servidor de MongoDB em memória que inicializa automaticamente em tempo de execução junto com a aplicação Node.js.
- **CORS**: Middleware para habilitar compartilhamento de recursos entre diferentes origens.
- **Dotenv**: Gerenciamento de variáveis de ambiente.

### Frontend
- **HTML5 Semântico**: Estruturação acessível com tags como `<header>`, `<main>`, `<section>`, `<article>`, `<dialog>`/`<div role="dialog">` e `<footer>`.
- **CSS3 Moderno**: 
  - Design cinematográfico em modo escuro (Dark Mode).
  - CSS Grid e Flexbox com total responsividade para dispositivos móveis, tablets e desktops.
  - Variáveis CSS nativas (`:root`), efeitos de vidro (*glassmorphism*), animações suaves e microinterações nos cards.
- **JavaScript Puro (ES6+)**:
  - Manipulação nativa do DOM.
  - Comunicação assíncrona com o backend via **Fetch API**.
  - Validações em tempo real de formulário.
  - Sistema de notificações Toast dinâmico.
  - Filtros instantâneos por termo de busca, gênero e ordenação.

### Deploy & Infraestrutura
- **Vercel**: Configuração serverless pronta via `vercel.json` e `/api/index.js`, servindo o frontend estático e as rotas de API.
- **GitHub**: Estrutura de pastas limpa, documentada e com `.gitignore` adequado para versionamento.

---

## 3. Arquitetura da Solução

```
AdGustavo/
├── api/
│   └── index.js             # Entrada Serverless da Vercel (invoca Express + DB)
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js        # Inicialização do mongodb-memory-server e Mongoose
│   │   ├── controllers/
│   │   │   └── movieController.js # Lógica de negócio e CRUD
│   │   ├── models/
│   │   │   └── Movie.js     # Schema Mongoose com validações de dados
│   │   ├── routes/
│   │   │   └── movieRoutes.js # Rotas REST (/api/movies)
│   │   ├── seed/
│   │   │   └── seedMovies.js # População inicial do catálogo
│   │   ├── app.js           # Express, middlewares e arquivos estáticos
│   │   └── server.js        # Ponto de partida do servidor local
│   └── package.json         # Configuração isolada do backend
├── frontend/
│   ├── css/
│   │   └── styles.css       # Estilos visuais e responsividade
│   ├── js/
│   │   └── app.js           # Lógica do frontend e consumo da API via Fetch
│   └── index.html           # Interface principal do catálogo
├── .gitignore               # Ignora node_modules e arquivos temporários
├── api.md                   # Documentação detalhada dos endpoints REST
├── Contexto.md              # Este documento de arquitetura e contexto
├── Roadmap.md               # Passo a passo de execução do projeto
├── package.json             # Scripts de inicialização na raiz
└── vercel.json              # Configurações de rotas e build para a Vercel
```

---

## 4. Estado Atual do Projeto

- [x] **Backend RESTful Completo**: Endpoints `GET /api/movies`, `GET /api/movies/:id`, `POST /api/movies`, `PUT /api/movies/:id`, `DELETE /api/movies/:id` e `GET /api/health`.
- [x] **MongoDB em Memória Automático**: Inicializado via `mongodb-memory-server` sem dependências externas.
- [x] **Seed de Filmes Inicial**: Catálogo já inicializa com clássicos do cinema para demonstração imediata.
- [x] **Frontend Responsivo**: Grid de cards, preview dinâmico de capas, tratamento de fallback para imagens quebradas.
- [x] **CRUD Completo na Interface**: Modais interativos para criação, edição e confirmação de exclusão.
- [x] **Busca e Filtros**: Filtragem por nome/diretor/gênero e ordenação por ano ou título em tempo real.
- [x] **Compatibilidade com Vercel**: `vercel.json` e `api/index.js` configurados para deploy direto com 1 clique ou via GitHub.
- [x] **Documentação Abrangente**: `Roadmap.md`, `Contexto.md` e `api.md` criados na raiz.
