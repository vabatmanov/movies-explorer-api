const { celebrate, Joi, Segments } = require('celebrate');

const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const regValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const updateProfileValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
});
/*
const validateURL = (value) => {
  if (!/((https?:\/{2})|(w{3}\.))[A-z0-9-]+\.[/\w-.#~:?[\]@!$&'()*+,;=]+/g.test(value)) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const userIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});



const updateAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
});

const cardIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const cardCreateValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validateURL),
  }),
});*/

module.exports = {
  loginValidation,
  regValidation,
  updateProfileValidation,
/*  userIdValidation,
  updateAvatarValidation,
  cardIdValidation,
  cardCreateValidation,*/
};
