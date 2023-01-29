const User = require('../models/user');
const Constants = require('../utils/constants');
const NotFoundError = require('../middlewares/errors/not-found-err');

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError(Constants.NOT_FOUND_USER_WITH_ID);
      }
    })
    .catch(next);
};
