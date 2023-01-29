const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const Constants = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).pattern(Constants.REGEXPHTTP),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).pattern(Constants.REGEXPHTTP),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);

app.use(auth);
app.use('/me', require('./routes/me'));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/', require('./routes/nonexistent'));
app.use('/', require('./middlewares/errors/bad-request'));
app.use('/', require('./middlewares/errors/not-found-err'));
app.use('/', require('./middlewares/errors/owner-error'));
app.use('/', require('./middlewares/errors/unauthorized-err'));

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ой! Произошла ошибка на сервере'
        : message,
    });
  next();
});

app.listen(PORT);
