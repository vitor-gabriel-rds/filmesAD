const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Aceita tanto MONGODB_URI quanto MONGO_URI
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('❌ ERRO: Nenhuma string de conexão do MongoDB foi encontrada nas Variáveis de Ambiente!');
  }

  try {
    console.log('⚡ Conectando ao MongoDB Atlas...');
    const conn = await mongoose.connect(mongoUri, {
      bufferCommands: false, // ESSENCIAL para a Vercel não dar timeout
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = conn.connection.readyState === 1;
    console.log('✅ Mongoose conectado com sucesso ao MongoDB!');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    throw error;
  }
}

async function disconnectDB() {
  if (isConnected || mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('🛑 Conexão com MongoDB finalizada.');
  }
}

module.exports = {
  connectDB,
  disconnectDB
};