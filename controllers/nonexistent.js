const Constants = require('../utils/constants');

exports.handlingPath = (req, res) => {
  res.status(Constants.NOT_FOUND).send({
    message: Constants.PAGE_NOT_FOUND,
  });
};
