# 🗺️ Roadmap de Execução - CineCatálogo

Este documento registra detalhadamente todas as etapas concebidas e executadas pelo agente para construir e disponibilizar a aplicação completa do **CineCatálogo**.

---

## 📌 Linha do Tempo e Etapas Executadas

### Etapa 1: Análise de Requisitos e Checagem de Ambiente
- **Ações:**
  - Inspeção do diretório de trabalho (`c:\Users\viarv\OneDrive\Desktop\AdGustavo`).
  - Verificação de runtime local: **Node.js (v24.13.1)** e **npm (v11.8.0)** disponíveis.
  - Definição do escopo dos campos de Filme: Título (`title`), Diretor (`director`), Ano (`year`), Gênero (`genre`) e URL da Capa (`coverUrl`).
  - Definição da estratégia de zero configuração de banco externo utilizando `mongodb-memory-server` integrado ao `mongoose`.

### Etapa 2: Planejamento da Arquitetura
- **Ações:**
  - Separação clara entre backend em `/backend` e frontend estático em `/frontend`.
  - Configuração do ponto de entrada serverless da Vercel em `/api/index.js`.
  - Definição do arquivo de roteamento de builds e rewrites da Vercel (`vercel.json`).
  - Estruturação de dados iniciais (*seed*) para catálogo não inicializar vazio em memória.

### Etapa 3: Criação da Estrutura de Pastas e Arquivos de Configuração
- **Ações:**
  - Criação dos diretórios:
    - `/backend/src/config`
    - `/backend/src/controllers`
    - `/backend/src/models`
    - `/backend/src/routes`
    - `/backend/src/seed`
    - `/frontend/css`
    - `/frontend/js`
    - `/api`
  - Criação do arquivo `.gitignore` para omitir `node_modules`, arquivos `.env` e temporários.
  - Criação dos arquivos `package.json` na raiz e no subdiretório `/backend`.

### Etapa 4: Implementação do Backend (Node.js + Express + Mongoose)
- **Ações:**
  - **Model (`backend/src/models/Movie.js`):**
    - Criação do `movieSchema` com validações rigorosas (título obrigatório até 200 caracteres, ano de 1888 em diante, gênero, diretor e validação de URL de capa iniciando com `http://` ou `https://`).
    - Serialização com chave `id` simplificada.
  - **Conexão com Banco (`backend/src/config/db.js`):**
    - Integração de `MongoMemoryServer.create()` para disparar o servidor MongoDB em memória automaticamente.
    - Suporte opcional a `MONGODB_URI` para caso o usuário queira conectar futuramente a um banco persistente externo.
  - **Seed Inicial (`backend/src/seed/seedMovies.js`):**
    - Cadastro automático de clássicos do cinema (Interestelar, O Poderoso Chefão, Pulp Fiction, Matrix, O Senhor dos Anéis, A Viagem de Chihiro) para preenchimento imediato.
  - **Controllers (`backend/src/controllers/movieController.js`):**
    - `getAllMovies`: Listagem com filtros por texto (`?search=`), gênero (`?genre=`) e ordenação (`?sort=`).
    - `getMovieById`: Busca por ID com validação de ObjectId do Mongoose.
    - `createMovie`: Criação com validação de campos obrigatórios (status 201).
    - `updateMovie`: Atualização de campos (status 200).
    - `deleteMovie`: Exclusão de registro (status 200).
  - **Rotas (`backend/src/routes/movieRoutes.js`):**
    - Mapeamento RESTful dos métodos `GET`, `POST`, `PUT`, `DELETE`.
  - **Express Server (`backend/src/app.js` e `backend/src/server.js`):**
    - Configuração de middlewares de CORS, JSON parser, arquivos estáticos para o frontend e healthcheck em `/api/health`.

### Etapa 5: Implementação do Frontend (HTML5, CSS3 e JS Puro)
- **Ações:**
  - **HTML (`frontend/index.html`):**
    - Estrutura semântica e acessível.
    - Barra de controles com campo de busca com debounce, filtros de gênero e ordenação.
    - Grid responsivo de cards.
    - Modal interativo para criação e edição de filmes com pré-visualização de capa.
    - Modal de confirmação de exclusão para prevenir deleções acidentais.
    - Contêiner para notificações do tipo Toast.
  - **CSS (`frontend/css/styles.css`):**
    - Paleta de cores dark cinematográfica (fundo escuro, toques em vermelho carmesim e dourado).
    - Grid CSS fluido (`repeat(auto-fill, minmax(260px, 1fr))`).
    - Aspect ratio padrão de pôster (2:3), efeito zoom no hover e tratamento de imagens quebradas.
    - Efeitos de transparência (*backdrop-filter: blur*), transições suaves e responsividade completa para celular e desktop.
  - **JavaScript Vanilla (`frontend/js/app.js`):**
    - Comunicação completa com os endpoints da API através da `Fetch API`.
    - Renderização dinâmica do catálogo, geração de opções de filtro por gênero e contador de filmes.
    - Validação de formulários no cliente com feedback visual imediato.
    - Tratamento de erro `onerror` nas imagens com exibição de placeholder estético.
    - Gerenciador de notificações Toast animadas.

### Etapa 6: Configuração de Deploy para Vercel e GitHub
- **Ações:**
  - Criação do arquivo `vercel.json` na raiz configurando o roteamento da API em `/api/index.js` e do frontend estático em `/frontend/$1`.
  - Criação do handler serverless em `/api/index.js` que reaproveita a inicialização em memória e serve a aplicação Express.

### Etapa 7: Testes Automatizados e Validação
- **Ações:**
  - Instalação das dependências via `npm install`.
  - Execução de script de testes para verificar a integridade dos endpoints (GET, POST, PUT, DELETE).
  - Verificação da interface estática e arquivos gerados.

### Etapa 8: Documentação Completa do Projeto
- **Ações:**
  - Elaboração do `api.md`: Documentação técnica das rotas, payloads e respostas.
  - Elaboração do `Contexto.md`: Arquitetura geral, tecnologias e estado do projeto.
  - Elaboração do `Roadmap.md`: Registro de todas as fases executadas.
  - Elaboração do `README.md`: Instruções de inicialização rápida, deploy na Vercel e publicação no GitHub.

---

## 🚀 Como Executar Localmente
```bash
# 1. Instalar as dependências (na raiz do projeto)
npm install

# 2. Iniciar a aplicação
npm start

# 3. Acessar no navegador:
# Interface Web: http://localhost:3000
# API REST:      http://localhost:3000/api/movies
```

---

## ☁️ Como Publicar no GitHub e na Vercel

### No GitHub:
```bash
git init
git add .
git commit -m "feat: Catalogo de Filmes completo com Node.js e MongoDB em memoria"
git branch -M main
git remote add origin https://github.com/<seu-usuario>/<nome-do-repositorio>.git
git push -u origin main
```

### Na Vercel:
1. Acesse o painel da [Vercel](https://vercel.com).
2. Clique em **Add New** > **Project**.
3. Importe o repositório criado no GitHub.
4. Mantenha as configurações padrão (o `vercel.json` na raiz gerencia todo o build e roteamento automaticamente).
5. Clique em **Deploy**!
