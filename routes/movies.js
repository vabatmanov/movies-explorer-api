const router = require('express').Router();
const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');
const { createMovieValidation } = require('../middlewares/validations');

router.get('/', getMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
