const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServerInstance = null;
let isConnected = false;

/**
 * Inicializa a conexão com o banco de dados.
 * Caso MONGODB_URI não esteja definida no ambiente, inicializa automaticamente
 * um servidor MongoDB em memória usando mongodb-memory-server.
 */
async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    if (!mongoMemoryServerInstance) {
      console.log('⚡ Inicializando MongoDB em memória (mongodb-memory-server)...');
      mongoMemoryServerInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'catalogo_filmes'
        }
      });
    }
    mongoUri = mongoMemoryServerInstance.getUri();
    console.log(`✅ MongoDB em memória iniciado com sucesso: ${mongoUri}`);
  } else {
    console.log('⚡ Conectando ao MongoDB externo via MONGODB_URI...');
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    isConnected = true;
    console.log('✅ Mongoose conectado com sucesso ao MongoDB!');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    throw error;
  }
}

/**
 * Encerra a conexão com o MongoDB e desliga o servidor em memória caso exista.
 */
async function disconnectDB() {
  if (isConnected || mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
  }

  if (mongoMemoryServerInstance) {
    await mongoMemoryServerInstance.stop();
    mongoMemoryServerInstance = null;
  }
  console.log('🛑 Conexão com MongoDB finalizada.');
}

module.exports = {
  connectDB,
  disconnectDB
};
