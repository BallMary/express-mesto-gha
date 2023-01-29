const router = require('express').Router();

const {
  getMe,

} = require('../controllers/me');

router.get('/', getMe);

module.exports = router;
