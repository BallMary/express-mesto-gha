const router = require('express').Router();

const {
  getMe,

} = require('../controllers/me');

router.get('/users', getMe);

module.exports = router;
