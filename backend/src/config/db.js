async function connectDB() {
  console.log('⚡ Modo em memória ativo (sem dependência de banco externo).');
  return true;
}

async function disconnectDB() {
  return true;
}

module.exports = { connectDB, disconnectDB };