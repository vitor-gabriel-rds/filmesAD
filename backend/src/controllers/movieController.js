const mongoose = require('mongoose');
const Movie = require('../models/Movie');

/**
 * GET /api/movies
 * Retorna todos os filmes, com suporte a busca e filtros por query string.
 */
async function getAllMovies(req, res, next) {
  try {
    const { search, genre, sort } = req.query;
    const filter = {};

    if (genre && genre.trim() !== '' && genre.toLowerCase() !== 'todos') {
      filter.genre = { $regex: genre.trim(), $options: 'i' };
    }

    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { title: searchRegex },
        { director: searchRegex },
        { genre: searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'year-desc') sortOption = { year: -1 };
    if (sort === 'year-asc') sortOption = { year: 1 };
    if (sort === 'title-asc') sortOption = { title: 1 };
    if (sort === 'title-desc') sortOption = { title: -1 };

    const movies = await Movie.find(filter).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/movies/:id
 * Retorna um filme específico por ID.
 */
async function getMovieById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Identificador (ID) do filme inválido.'
      });
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Filme não encontrado.'
      });
    }

    return res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/movies
 * Cadastra um novo filme.
 */
async function createMovie(req, res, next) {
  try {
    const { title, director, year, genre, coverUrl } = req.body;

    // Validação preliminar de campos vazios
    const missingFields = [];
    if (!title || !title.trim()) missingFields.push('title (Título)');
    if (!director || !director.trim()) missingFields.push('director (Diretor)');
    if (year === undefined || year === null || year === '') missingFields.push('year (Ano)');
    if (!genre || !genre.trim()) missingFields.push('genre (Gênero)');
    if (!coverUrl || !coverUrl.trim()) missingFields.push('coverUrl (URL da Capa)');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Os seguintes campos são obrigatórios: ${missingFields.join(', ')}.`
      });
    }

    const movie = await Movie.create({
      title: title.trim(),
      director: director.trim(),
      year: Number(year),
      genre: genre.trim(),
      coverUrl: coverUrl.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Filme cadastrado com sucesso!',
      data: movie
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(' ')
      });
    }
    next(error);
  }
}

/**
 * PUT /api/movies/:id
 * Atualiza os dados de um filme existente.
 */
async function updateMovie(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Identificador (ID) do filme inválido.'
      });
    }

    const { title, director, year, genre, coverUrl } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title.trim();
    if (director !== undefined) updateData.director = director.trim();
    if (year !== undefined) updateData.year = Number(year);
    if (genre !== undefined) updateData.genre = genre.trim();
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl.trim();

    const movie = await Movie.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Filme não encontrado para atualização.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Filme atualizado com sucesso!',
      data: movie
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(' ')
      });
    }
    next(error);
  }
}

/**
 * DELETE /api/movies/:id
 * Exclui um filme pelo ID.
 */
async function deleteMovie(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Identificador (ID) do filme inválido.'
      });
    }

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Filme não encontrado para exclusão.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Filme excluído com sucesso!',
      data: movie
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
