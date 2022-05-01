const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const constants = require('../utils/constants');
const ErrorObjectNotFound = require('../errors/ErrorObjectNotFound');
const ErrorConflict = require('../errors/ErrorConflict');
const ErrorValidation = require('../errors/ErrorValidation');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Access token received' });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(() => {
      throw new ErrorObjectNotFound(`Пользователь по указанному _id='${req.user._id}' не найден`);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorValidation(`Пользователь по указанному _id='${req.user._id}' не найден`));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict('Пользователь с таким email уже существует');
      }
      return bcrypt.hash(password, constants.SALT_ROUNDS);
    })
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.send({
      data: {
        email: user.email,
        name: user.name,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ErrorObjectNotFound(`Пользователь с указанным _id='${req.params.userId}' не найден`);
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.logOff = (req, res) => {
  res.clearCookie('jwt').send({ message: 'logoff' });
};
