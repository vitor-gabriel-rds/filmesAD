const express = require('express');
const cors = require('cors');
const path = require('path');
const movieRoutes = require('./routes/movieRoutes');

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Servir frontend estático para execução local simplificada
const frontendPath = path.resolve(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// Healthcheck e metadados da API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API do Catálogo de Filmes está em execução!',
    timestamp: new Date().toISOString()
  });
});

// Rotas principais
app.use('/api/movies', movieRoutes);

// Fallback para rota raiz caso não carregue estático diretamente
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Middleware para rotas de API não encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Rota não encontrada: ${req.originalUrl}`
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('🚨 Erro interno no servidor:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno no servidor.'
  });
});

module.exports = app;
