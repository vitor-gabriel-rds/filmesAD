const Movie = require('../models/Movie');

const initialMovies = [
  {
    title: 'Interestelar',
    director: 'Christopher Nolan',
    year: 2014,
    genre: 'Ficção Científica',
    coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'O Poderoso Chefão',
    director: 'Francis Ford Coppola',
    year: 1972,
    genre: 'Crime / Drama',
    coverUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Pulp Fiction: Tempo de Violência',
    director: 'Quentin Tarantino',
    year: 1994,
    genre: 'Crime / Drama',
    coverUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Matrix',
    director: 'Lana Wachowski, Lilly Wachowski',
    year: 1999,
    genre: 'Ação / Ficção Científica',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'O Senhor dos Anéis: O Retorno do Rei',
    director: 'Peter Jackson',
    year: 2003,
    genre: 'Fantasia / Aventura',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'A Viagem de Chihiro',
    director: 'Hayao Miyazaki',
    year: 2001,
    genre: 'Animação / Fantasia',
    coverUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
  }
];

/**
 * Povoa o banco de dados em memória caso esteja vazio.
 */
async function seedDatabase() {
  try {
    const count = await Movie.countDocuments();
    if (count === 0) {
      console.log('🌱 Povoando banco em memória com filmes iniciais...');
      await Movie.insertMany(initialMovies);
      console.log(`✅ ${initialMovies.length} filmes inseridos com sucesso!`);
    }
  } catch (error) {
    console.warn('⚠️ Aviso ao semear dados iniciais:', error.message);
  }
}

module.exports = {
  seedDatabase,
  initialMovies
};
