const router = require('express').Router();
const ErrorObjectNotFound = require('../errors/ErrorObjectNotFound');
const { login, createUser, logOff } = require('../controllers/users');
const { loginValidation, regValidation } = require('../middlewares/validations');
const auth = require('../middlewares/auth');

router.post('/signin', loginValidation, login);
router.post('/signup', regValidation, createUser);
router.post('/signout', auth, logOff);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use(auth, (req, res, next) => {
  next(new ErrorObjectNotFound('Указанный путь не существует'));
});

module.exports = router;
