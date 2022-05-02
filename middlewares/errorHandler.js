const constMessages = require('../utils/constantsMessages');

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  res.status(status).send({
    message: status === 500 ? constMessages.ERROR_SERVER : err.message,
  });
  next();
};
module.exports = errorHandler;
