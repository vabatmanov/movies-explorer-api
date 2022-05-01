require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
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

app.use('/', require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен в режиме ${NODE_ENV === 'production' ? 'production' : 'development'}, на ${PORT} порт`);
});
