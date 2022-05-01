require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const ErrorObjectNotFound = require('./errors/ErrorObjectNotFound');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser, logOff } = require('./controllers/users');
const { loginValidation, regValidation } = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors')

const { DB_LINK, NODE_ENV, PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(requestLogger);

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DB_LINK : 'mongodb://localhost:27017/bitfilmsdb');

app.post('/api/signin', loginValidation, login);
app.post('/api/signup', regValidation, createUser);
app.post('/signout', auth, logOff);

app.use('/api/users', auth, require('./routes/users'));
app.use('/api/movies', auth, require('./routes/movies'));

app.use(auth, (req, res, next) => {
  next(new ErrorObjectNotFound('Указанный путь не существует'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен в режиме ${NODE_ENV === 'production' ? 'production' : 'development'}, на ${PORT} порт`);
});
