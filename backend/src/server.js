require('dotenv').config();
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');
const { seedDatabase } = require('./seed/seedMovies');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('🚀 Iniciando API do Catálogo de Filmes...');
    
    // Conectar ao MongoDB (em memória automaticamente se não houver URI)
    await connectDB();

    // Povoar catálogo inicial se estiver vazio
    await seedDatabase();

    // Iniciar servidor HTTP
    const server = app.listen(PORT, () => {
      console.log(`🎬 Servidor rodando com sucesso em: http://localhost:${PORT}`);
      console.log(`📌 Documentação da API em: http://localhost:${PORT}/api/movies`);
      console.log(`🎨 Interface do Catálogo em: http://localhost:${PORT}/`);
    });

    // Tratamento de encerramento gracioso
    const shutdown = async (signal) => {
      console.log(`\n🛑 Recebido sinal de término (${signal}). Encerrando...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    console.error('❌ Falha fatal ao inicializar o servidor:', error);
    process.exit(1);
  }
}

startServer();
