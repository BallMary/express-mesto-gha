const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const Constants = require('../utils/constants');

const {
  getUsers,
  getUser,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

router.get('/', getUsers);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    }),
  }),
  getUser,
);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2).pattern(Constants.REGEXPHTTP),
  }),
}), updateAvatar);

module.exports = router;
