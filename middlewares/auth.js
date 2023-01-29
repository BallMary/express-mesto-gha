const jwt = require('jsonwebtoken');
const UnauthorizedError = require('./errors/unauthorized-err');
const Constants = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(Constants.AUTHORIZATION_REQUIRED));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return next(new UnauthorizedError(Constants.AUTHORIZATION_REQUIRED));
  }

  req.user = payload;

  next();
  return null;
};