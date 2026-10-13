const app = require('../backend/src/app');
const { connectDB } = require('../backend/src/config/db');
const { seedDatabase } = require('../backend/src/seed/seedMovies');

let isInitialized = false;

async function initServerless() {
  if (!isInitialized) {
    await connectDB();
    await seedDatabase();
    isInitialized = true;
  }
}

module.exports = async (req, res) => {
  try {
    await initServerless();
    return app(req, res);
  } catch (error) {
    console.error('Erro na execução serverless da Vercel:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao inicializar banco de dados serverless.'
    });
  }
};
