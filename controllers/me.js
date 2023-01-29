const mongoose = require('mongoose');
const User = require('../models/user');
const Constants = require('../utils/constants');
const NotFoundError = require('../middlewares/errors/not-found-err');
const BadRequestError = require('../middlewares/errors/bad-request');

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError(Constants.NOT_FOUND_USER_WITH_ID));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(Constants.INVALID_USER_ID));
      } else {
        next(err);
      }
    });
};
