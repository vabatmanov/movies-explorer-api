const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/ErrorUnauthorized');

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  if (!req.cookies.jwt) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }
  req.user = payload;

  next();
};
