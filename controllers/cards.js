const mongoose = require('mongoose');
const Card = require('../models/card');
const Constants = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(Constants.INTERNAL_SERVER_ERROR).send({
      message: Constants.SERVER_ERROR,
    }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(Constants.BAD_REQUEST).send({
          message: Constants.CREATE_CARD_INCORRECT_DATA,
        });
      } else {
        res.status(Constants.INTERNAL_SERVER_ERROR).send({
          message: Constants.SERVER_ERROR,
        });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(Constants.NOT_FOUND).send({
          message: Constants.PASSED_NON_EXISTENT_CARD_ID,
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(Constants.BAD_REQUEST).send({
          message: Constants.INVALID_CARD_ID,
        });
      } else {
        res.status(Constants.INTERNAL_SERVER_ERROR).send({
          message: Constants.SERVER_ERROR,
        });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      res.send({ data: card });
    } else {
      res.status(Constants.NOT_FOUND).send({
        message: Constants.NOT_FOUND_CARD_WITH_ID,
      });
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      res.status(Constants.BAD_REQUEST).send({
        message: Constants.LIKE_OR_DISLIKE_INCORRECT_DATA,
      });
    } else {
      res.status(Constants.INTERNAL_SERVER_ERROR).send({
        message: Constants.SERVER_ERROR,
      });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      res.send({ data: card });
    } else {
      res.status(Constants.NOT_FOUND).send({
        message: Constants.NOT_FOUND_CARD_WITH_ID,
      });
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(Constants.BAD_REQUEST).send({
        message: Constants.LIKE_OR_DISLIKE_INCORRECT_DATA,
      });
    }
    return res.status(Constants.INTERNAL_SERVER_ERROR).send({
      message: Constants.SERVER_ERROR,
    });
  });
