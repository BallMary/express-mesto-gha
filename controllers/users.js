const mongoose = require('mongoose');
const User = require('../models/user');
const Constants = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(Constants.INTERNAL_SERVER_ERROR).send({
      message: Constants.SERVER_ERROR,
    }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(Constants.NOT_FOUND).send({
          message: Constants.NOT_FOUND_USER_WITH_ID,
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(Constants.BAD_REQUEST).send({
          message: Constants.INVALID_USER_ID,
        });
      } else {
        res.status(Constants.INTERNAL_SERVER_ERROR).send({
          message: Constants.SERVER_ERROR,
        });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(Constants.BAD_REQUEST).send({
          message: Constants.CREATE_USER_INCORRECT_DATA,
        });
      } else {
        res.status(Constants.INTERNAL_SERVER_ERROR).send({
          message: Constants.SERVER_ERROR,
        });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(Constants.NOT_FOUND).send({
          message: Constants.NOT_FOUND_USER_ID,
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(Constants.BAD_REQUEST).send({
          message: Constants.INVALID_USER_ID,
        });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(Constants.BAD_REQUEST).send({
          message: Constants.UPDATE_PROFILE_INCORRECT_DATA,
        });
      } else {
        res.status(Constants.INTERNAL_SERVER_ERROR).send({
          message: Constants.SERVER_ERROR,
        });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(Constants.NOT_FOUND).send({
          message: Constants.NOT_FOUND_USER_ID,
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(Constants.BAD_REQUEST).send({
          message: Constants.INVALID_USER_ID,
        });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(Constants.BAD_REQUEST).send({
          message: Constants.UPDATE_AVATAR_INCORRECT_DATA,
        });
      } else {
        res.status(Constants.INTERNAL_SERVER_ERROR).send({
          message: Constants.SERVER_ERROR,
        });
      }
    });
};
