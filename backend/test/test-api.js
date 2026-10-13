const assert = require('assert');
const http = require('http');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const { seedDatabase } = require('../src/seed/seedMovies');
const Movie = require('../src/models/Movie');

async function runTests() {
  console.log('\n🧪 ===============================================');
  console.log('🧪 Iniciando Bateria de Testes Automatizados da API');
  console.log('🧪 ===============================================\n');

  let server;
  let baseUrl;

  try {
    // 1. Inicializar banco em memória
    console.log('1️⃣ Conectando ao MongoDB em memória...');
    await connectDB();
    await seedDatabase();
    console.log('   ✅ Banco conectado e dados semeados com sucesso!');

    // 2. Subir servidor HTTP em porta dinâmica para teste
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        console.log(`   ✅ Servidor de teste ativo na porta ${port}`);
        resolve();
      });
    });

    // Helper para requisições HTTP
    const request = (path, method = 'GET', body = null) => {
      return new Promise((resolve, reject) => {
        const url = new URL(path, baseUrl);
        const options = {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname + url.search,
          method,
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              resolve({ status: res.statusCode, body: parsed });
            } catch (e) {
              resolve({ status: res.statusCode, raw: data });
            }
          });
        });

        req.on('error', reject);
        if (body) {
          req.write(JSON.stringify(body));
        }
        req.end();
      });
    };

    // 3. Teste Healthcheck
    console.log('\n2️⃣ Testando GET /api/health...');
    const healthRes = await request('/api/health');
    assert.strictEqual(healthRes.status, 200, 'Healthcheck deve retornar status 200');
    assert.strictEqual(healthRes.body.status, 'ok');
    console.log('   ✅ Healthcheck respondeu com 200 OK');

    // 4. Teste Listagem de Filmes (GET /api/movies)
    console.log('\n3️⃣ Testando GET /api/movies (Listagem de Filmes)...');
    const listRes = await request('/api/movies');
    assert.strictEqual(listRes.status, 200);
    assert.strictEqual(listRes.body.success, true);
    assert.ok(listRes.body.count >= 6, 'Deve conter ao menos os 6 filmes semeados');
    console.log(`   ✅ Listagem retornou ${listRes.body.count} filmes com sucesso!`);

    // 5. Teste Filtro por Busca (GET /api/movies?search=Nolan)
    console.log('\n4️⃣ Testando Filtro por Busca (GET /api/movies?search=Nolan)...');
    const searchRes = await request('/api/movies?search=Nolan');
    assert.strictEqual(searchRes.status, 200);
    assert.ok(searchRes.body.count >= 1, 'Deve encontrar ao menos o filme de Nolan');
    assert.strictEqual(searchRes.body.data[0].title, 'Interestelar');
    console.log('   ✅ Filtro por busca funcionou corretamente!');

    // 6. Teste Cadastro de Filme (POST /api/movies)
    console.log('\n5️⃣ Testando POST /api/movies (Cadastro de Novo Filme)...');
    const newMovieData = {
      title: 'Clube da Luta',
      director: 'David Fincher',
      year: 1999,
      genre: 'Drama',
      coverUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
    };

    const createRes = await request('/api/movies', 'POST', newMovieData);
    assert.strictEqual(createRes.status, 201, 'Cadastro deve retornar 201 Created');
    assert.strictEqual(createRes.body.success, true);
    assert.strictEqual(createRes.body.data.title, 'Clube da Luta');
    const createdId = createRes.body.data.id;
    assert.ok(createdId, 'Filme criado deve possuir ID');
    console.log(`   ✅ Filme "${createRes.body.data.title}" cadastrado com ID: ${createdId}`);

    // 7. Teste Obter Filme por ID (GET /api/movies/:id)
    console.log('\n6️⃣ Testando GET /api/movies/:id (Buscar Filme por ID)...');
    const getByIdRes = await request(`/api/movies/${createdId}`);
    assert.strictEqual(getByIdRes.status, 200);
    assert.strictEqual(getByIdRes.body.data.title, 'Clube da Luta');
    console.log('   ✅ Busca por ID retornou o filme correto!');

    // 8. Teste Atualização de Filme (PUT /api/movies/:id)
    console.log('\n7️⃣ Testando PUT /api/movies/:id (Atualizar Filme)...');
    const updateRes = await request(`/api/movies/${createdId}`, 'PUT', {
      title: 'Clube da Luta (Edição Especial)',
      year: 2000
    });
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateRes.body.data.title, 'Clube da Luta (Edição Especial)');
    assert.strictEqual(updateRes.body.data.year, 2000);
    console.log('   ✅ Filme atualizado com sucesso!');

    // 9. Teste Validação de Erro ao Criar (POST inválido)
    console.log('\n8️⃣ Testando Validação de Erro (POST sem campos obrigatórios)...');
    const invalidCreateRes = await request('/api/movies', 'POST', {
      title: 'Filme Incompleto'
    });
    assert.strictEqual(invalidCreateRes.status, 400, 'Deve retornar erro 400 para campos ausentes');
    assert.strictEqual(invalidCreateRes.body.success, false);
    console.log('   ✅ Validação de campos obrigatórios funcionou perfeitamente (400 Bad Request)!');

    // 10. Teste Exclusão de Filme (DELETE /api/movies/:id)
    console.log('\n9️⃣ Testando DELETE /api/movies/:id (Excluir Filme)...');
    const deleteRes = await request(`/api/movies/${createdId}`, 'DELETE');
    assert.strictEqual(deleteRes.status, 200);
    assert.strictEqual(deleteRes.body.success, true);
    console.log('   ✅ Filme excluído com sucesso!');

    // Verificar se o filme realmente sumiu
    const verifyDeleteRes = await request(`/api/movies/${createdId}`);
    assert.strictEqual(verifyDeleteRes.status, 404, 'Filme excluído deve retornar 404');
    console.log('   ✅ Confirmação de exclusão: 404 Not Found verificado!');

    console.log('\n🎉 ===============================================');
    console.log('🎉 TODOS OS TESTES PASSARAM COM 100% DE SUCESSO!');
    console.log('🎉 ===============================================\n');

  } catch (error) {
    console.error('\n❌ Falha no teste:', error);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await disconnectDB();
  }
}

runTests();
