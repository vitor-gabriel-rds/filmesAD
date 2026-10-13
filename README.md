# 🎬 CineCatálogo - Catálogo de Filmes

Uma aplicação web Full Stack moderna, responsiva e pronta para deploy na **Vercel** e no **GitHub**, desenvolvida com **Node.js**, **Express**, **Mongoose** e **MongoDB em Memória (`mongodb-memory-server`)**.

---

## ✨ Destaques do Projeto

- 🚀 **Zero Configuração de Banco**: Utiliza `mongodb-memory-server` para subir uma instância do MongoDB em memória automaticamente ao iniciar a API. Sem necessidade de cadastrar conta no MongoDB Atlas ou configurar strings de conexão complexas!
- 🍿 **Catálogo com Dados Iniciais**: Inicializa automaticamente com filmes clássicos cadastrados para demonstração instantânea.
- 🎨 **Frontend Cinematográfico**: Interface moderna em Dark Mode, desenvolvida em HTML5, CSS3 puro e JavaScript Vanilla com Fetch API.
- 📱 **Totalmente Responsivo**: Layout otimizado para celulares, tablets e computadores.
- 🔍 **Busca e Filtros em Tempo Real**: Pesquise por título, diretor ou gênero, e ordene por ano ou título.
- ⚡ **Pronto para Vercel**: Arquivo `vercel.json` e função serverless em `/api/index.js` configurados para deploy com 1 clique.
- 📚 **Documentação Completa**: Inclui `Roadmap.md`, `Contexto.md` e `api.md`.

---

## 📁 Estrutura de Pastas

```
├── api/
│   └── index.js             # Entrada Serverless para a Vercel
├── backend/
│   ├── src/
│   │   ├── config/db.js     # Conexão automática com MongoDB em memória
│   │   ├── controllers/     # Lógica das rotas (CRUD de Filmes)
│   │   ├── models/Movie.js  # Schema Mongoose para Filmes
│   │   ├── routes/          # Rotas RESTful (/api/movies)
│   │   ├── seed/            # Filmes iniciais para popular o catálogo
│   │   ├── app.js           # Configurações do Express
│   │   └── server.js        # Inicialização do servidor local
│   └── package.json
├── frontend/
│   ├── css/styles.css       # Estilização moderna e responsiva
│   ├── js/app.js            # Interação com a API via Fetch API
│   └── index.html           # Interface do catálogo
├── .gitignore
├── api.md                   # Documentação detalhada dos endpoints REST
├── Contexto.md              # Contexto da arquitetura e tecnologias
├── Roadmap.md               # Passo a passo de execução
├── package.json             # Scripts e dependências
└── vercel.json              # Configuração de deploy da Vercel
```

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
- Node.js instalado (v18 ou superior recomendado).

### Passo a passo
1. Clone o repositório ou navegue até o diretório do projeto:
   ```bash
   cd AdGustavo
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   npm start
   ```

4. Acesse no navegador:
   - **Interface Web:** [http://localhost:3000](http://localhost:3000)
   - **API REST (JSON):** [http://localhost:3000/api/movies](http://localhost:3000/api/movies)

---

## 🌐 Deploy na Vercel

1. Suba o projeto para o seu repositório no **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: Catalogo de Filmes completo"
   git branch -M main
   git remote add origin https://github.com/<seu-usuario>/<seu-repo>.git
   git push -u origin main
   ```

2. No painel da **[Vercel](https://vercel.com)**:
   - Clique em **"Add New Project"** e selecione o repositório do GitHub.
   - O arquivo `vercel.json` na raiz configurará automaticamente a rota `/api/*` como Serverless Function Node.js e a pasta `/frontend` como site estático.
   - Clique em **Deploy**!

---

## 📖 Documentação da API

Consulte o arquivo [`api.md`](./api.md) para ver a especificação completa de todos os endpoints REST:
- `GET /api/movies` - Listar filmes com filtros
- `GET /api/movies/:id` - Detalhes de um filme
- `POST /api/movies` - Cadastrar novo filme
- `PUT /api/movies/:id` - Atualizar filme existente
- `DELETE /api/movies/:id` - Excluir filme do catálogo
