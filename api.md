# 🎬 Documentação da API - CineCatálogo

Esta API RESTful foi desenvolvida em **Node.js**, **Express** e **Mongoose**, utilizando **MongoDB em Memória (`mongodb-memory-server`)** para inicialização automática, sem necessidade de configuração de banco de dados externo.

---

## 🌐 Informações Gerais

- **Base URL (Local):** `http://localhost:3000/api`
- **Base URL (Vercel):** `https://<seu-projeto>.vercel.app/api`
- **Formato de Dados:** `application/json`
- **Padrão de Resposta:** Todos os endpoints retornam objetos JSON com campo booleano `success` e metadados contextuais.

---

## 📋 Sumário dos Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/health` | Status de saúde da API |
| `GET` | `/movies` | Listar todos os filmes (com filtros e busca) |
| `GET` | `/movies/:id` | Obter detalhes de um filme específico por ID |
| `POST` | `/movies` | Cadastrar um novo filme |
| `PUT` | `/movies/:id` | Atualizar dados de um filme existente |
| `DELETE` | `/movies/:id` | Remover um filme do catálogo |

---

## 🛠️ Detalhamento dos Endpoints

### 1. Healthcheck
Verifica se a API está ativa e operante.

- **Método:** `GET`
- **Endpoint:** `/health`
- **Resposta Sucesso (200 OK):**
```json
{
  "status": "ok",
  "message": "API do Catálogo de Filmes está em execução!",
  "timestamp": "2026-10-13T05:15:00.000Z"
}
```

---

### 2. Listar Filmes
Retorna a lista de filmes cadastrados. Suporta filtros e ordenação via query parameters.

- **Método:** `GET`
- **Endpoint:** `/movies`
- **Query Parameters Opcionais:**
  - `search` (string): Busca textual por título, diretor ou gênero. (Ex: `?search=nolan`)
  - `genre` (string): Filtra por gênero específico. (Ex: `?genre=Ficção`)
  - `sort` (string): Opções de ordenação:
    - `year-desc`: Mais recentes primeiro
    - `year-asc`: Mais antigos primeiro
    - `title-asc`: Título de A a Z
    - `title-desc`: Título de Z a A

#### Exemplo de Requisição
```http
GET /api/movies?genre=Ficção&sort=year-desc HTTP/1.1
Host: localhost:3000
```

#### Resposta Sucesso (200 OK)
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "670c384e5a32b1329c3798aa",
      "title": "Interestelar",
      "director": "Christopher Nolan",
      "year": 2014,
      "genre": "Ficção Científica",
      "coverUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
      "createdAt": "2026-10-13T05:00:00.000Z",
      "updatedAt": "2026-10-13T05:00:00.000Z"
    }
  ]
}
```

---

### 3. Obter Filme por ID
Busca os detalhes de um filme específico a partir do seu identificador único.

- **Método:** `GET`
- **Endpoint:** `/movies/:id`

#### Exemplo de Requisição
```http
GET /api/movies/670c384e5a32b1329c3798aa HTTP/1.1
Host: localhost:3000
```

#### Resposta Sucesso (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "670c384e5a32b1329c3798aa",
    "title": "Interestelar",
    "director": "Christopher Nolan",
    "year": 2014,
    "genre": "Ficção Científica",
    "coverUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "createdAt": "2026-10-13T05:00:00.000Z",
    "updatedAt": "2026-10-13T05:00:00.000Z"
  }
}
```

#### Resposta de Erro (404 Not Found)
```json
{
  "success": false,
  "error": "Filme não encontrado."
}
```

#### Resposta de Erro (400 Bad Request)
```json
{
  "success": false,
  "error": "Identificador (ID) do filme inválido."
}
```

---

### 4. Cadastrar Filme
Adiciona um novo filme ao catálogo. Todos os 5 campos são obrigatórios.

- **Método:** `POST`
- **Endpoint:** `/movies`
- **Headers:** `Content-Type: application/json`

#### Corpo da Requisição (Body JSON)
```json
{
  "title": "O Poderoso Chefão",
  "director": "Francis Ford Coppola",
  "year": 1972,
  "genre": "Crime / Drama",
  "coverUrl": "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80"
}
```

#### Resposta Sucesso (201 Created)
```json
{
  "success": true,
  "message": "Filme cadastrado com sucesso!",
  "data": {
    "id": "670c386a5a32b1329c3798ab",
    "title": "O Poderoso Chefão",
    "director": "Francis Ford Coppola",
    "year": 1972,
    "genre": "Crime / Drama",
    "coverUrl": "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80",
    "createdAt": "2026-10-13T05:10:00.000Z",
    "updatedAt": "2026-10-13T05:10:00.000Z"
  }
}
```

#### Resposta de Erro de Validação (400 Bad Request)
```json
{
  "success": false,
  "error": "Os seguintes campos são obrigatórios: title (Título)."
}
```

---

### 5. Atualizar Filme
Atualiza os dados de um filme previamente existente pelo seu ID. Permite atualizar um ou múltiplos campos.

- **Método:** `PUT`
- **Endpoint:** `/movies/:id`
- **Headers:** `Content-Type: application/json`

#### Corpo da Requisição (Body JSON)
```json
{
  "title": "Matrix Reloaded",
  "year": 2003
}
```

#### Resposta Sucesso (200 OK)
```json
{
  "success": true,
  "message": "Filme atualizado com sucesso!",
  "data": {
    "id": "670c384e5a32b1329c3798aa",
    "title": "Matrix Reloaded",
    "director": "Lana Wachowski, Lilly Wachowski",
    "year": 2003,
    "genre": "Ação / Ficção Científica",
    "coverUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    "createdAt": "2026-10-13T05:00:00.000Z",
    "updatedAt": "2026-10-13T05:12:00.000Z"
  }
}
```

#### Resposta de Erro (404 Not Found)
```json
{
  "success": false,
  "error": "Filme não encontrado para atualização."
}
```

---

### 6. Excluir Filme
Remove definitivamente um filme do catálogo.

- **Método:** `DELETE`
- **Endpoint:** `/movies/:id`

#### Exemplo de Requisição
```http
DELETE /api/movies/670c384e5a32b1329c3798aa HTTP/1.1
Host: localhost:3000
```

#### Resposta Sucesso (200 OK)
```json
{
  "success": true,
  "message": "Filme excluído com sucesso!",
  "data": {
    "id": "670c384e5a32b1329c3798aa",
    "title": "O Poderoso Chefão",
    "director": "Francis Ford Coppola",
    "year": 1972,
    "genre": "Crime / Drama",
    "coverUrl": "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80"
  }
}
```

#### Resposta de Erro (404 Not Found)
```json
{
  "success": false,
  "error": "Filme não encontrado para exclusão."
}
```
