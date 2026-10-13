const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// GET /api/movies - Listar filmes (com filtros)
router.get('/', movieController.getAllMovies);

// GET /api/movies/:id - Obter um filme por ID
router.get('/:id', movieController.getMovieById);

// POST /api/movies - Cadastrar novo filme
router.post('/', movieController.createMovie);

// PUT /api/movies/:id - Atualizar filme por ID
router.put('/:id', movieController.updateMovie);

// DELETE /api/movies/:id - Remover filme por ID
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
