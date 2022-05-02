const Movie = require('../models/movie');
const ErrorObjectNotFound = require('../errors/ErrorObjectNotFound');
const ErrorAccessDenied = require('../errors/ErrorAccessDenied');
const ErrorValidation = require('../errors/ErrorValidation');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate(['owner'])
    .then((movie) => res.send(movie))
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new ErrorObjectNotFound(`Фильм с указанным _id='${req.params._id}' не найден`);
    })
    .then((movie) => {
      if (!(movie.owner.toString() === req.user._id)) {
        throw new ErrorAccessDenied('Попытка удалить чужой фильм');
      }
      return Movie.findByIdAndRemove(req.params._id);
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorObjectNotFound(`Фильм с указанным _id='${req.params._id}' не найден`));
      } else {
        next(err);
      }
    });
};
