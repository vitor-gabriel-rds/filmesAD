// Array em memória para funcionar perfeitamente na Vercel sem banco de dados
let movies = [
  {
    _id: "1",
    title: "Corra!",
    director: "Jordan Peele",
    year: 2017,
    genre: "Terror",
    coverUrl: "https://br.web.img3.acsta.net/pictures/17/04/19/21/08/577190.jpg"
  }
];

async function getAllMovies(req, res, next) {
  try {
    const { search, genre, sort } = req.query;
    let result = [...movies];

    if (genre && genre.trim() !== '' && genre.toLowerCase() !== 'todos') {
      result = result.filter(m => m.genre.toLowerCase().includes(genre.toLowerCase().trim()));
    }

    if (search && search.trim() !== '') {
      const s = search.toLowerCase().trim();
      result = result.filter(m => m.title.toLowerCase().includes(s) || m.director.toLowerCase().includes(s) || m.genre.toLowerCase().includes(s));
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function getMovieById(req, res, next) {
  try {
    const movie = movies.find(m => m._id === req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, error: 'Filme não encontrado.' });
    }
    return res.status(200).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
}

async function createMovie(req, res, next) {
  try {
    const { title, director, year, genre, coverUrl } = req.body;

    if (!title || !director || year === undefined || !genre || !coverUrl) {
      return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios.' });
    }

    const newMovie = {
      _id: Date.now().toString(),
      title: title.trim(),
      director: director.trim(),
      year: Number(year),
      genre: genre.trim(),
      coverUrl: coverUrl.trim()
    };

    movies.unshift(newMovie);

    return res.status(201).json({
      success: true,
      message: 'Filme cadastrado com sucesso!',
      data: newMovie
    });
  } catch (error) {
    next(error);
  }
}

async function updateMovie(req, res, next) {
  try {
    const index = movies.findIndex(m => m._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Filme não encontrado para atualização.' });
    }

    const { title, director, year, genre, coverUrl } = req.body;
    if (title !== undefined) movies[index].title = title.trim();
    if (director !== undefined) movies[index].director = director.trim();
    if (year !== undefined) movies[index].year = Number(year);
    if (genre !== undefined) movies[index].genre = genre.trim();
    if (coverUrl !== undefined) movies[index].coverUrl = coverUrl.trim();

    return res.status(200).json({
      success: true,
      message: 'Filme atualizado com sucesso!',
      data: movies[index]
    });
  } catch (error) {
    next(error);
  }
}

async function deleteMovie(req, res, next) {
  try {
    const index = movies.findIndex(m => m._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Filme não encontrado para exclusão.' });
    }

    const deletedMovie = movies.splice(index, 1)[0];

    return res.status(200).json({
      success: true,
      message: 'Filme excluído com sucesso!',
      data: deletedMovie
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};