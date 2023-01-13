const mongoose = require("mongoose");
const User = require("../models/user");
const Constants = require("../utils/constants");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      res.status(Constants.INTERNAL_SERVER_ERROR).send({
        message: Constants.SERVER_ERROR,
      })
    );
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(Constants.BAD_REQUEST).send({
          message: Constants.NOT_FOUND_USER_ID,
        });
      } else {
        return res.status(Constants.INTERNAL_SERVER_ERROR).send({
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
        return res.status(Constants.BAD_REQUEST).send({
          message: Constants.CREATE_USER_INCORRECT_DATA,
        });
      } else {
        return res.status(Constants.INTERNAL_SERVER_ERROR).send({
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
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(Constants.BAD_REQUEST).send({
          message: Constants.UPDATE_PROFILE_INCORRECT_DATA,
        });
      } else if (err instanceof mongoose.Error.ValidationError) {
        return res.status(Constants.NOT_FOUND).send({
          message: Constants.NOT_FOUND_USER_WITH_ID,
        });
      } else {
        return res.status(Constants.INTERNAL_SERVER_ERROR).send({
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
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(Constants.BAD_REQUEST).send({
          message: Constants.UPDATE_AVATAR_INCORRECT_DATA,
        });
      } else if (err instanceof mongoose.Error.ValidationError) {
        return res.status(Constants.NOT_FOUND).send({
          message: Constants.NOT_FOUND_USER_WITH_ID,
        });
      } else {
        return res.status(Constants.INTERNAL_SERVER_ERROR).send({
          message: Constants.SERVER_ERROR,
        });
      }
    });
};
