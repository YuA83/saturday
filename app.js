const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const signUpRouter = require('./routes/signup');
const signInRouter = require('./routes/signin');
const forgotRouter = require('./routes/forgot');
const headerRouter = require('./routes/header');
const logoutRouter = require('./routes/logout');
const reserveRouter = require('./routes/reserve');
const emailRouter = require('./routes/email');
const authRouter = require('./routes/auth');
const mapRouter = require('./routes/map');
const reservedRouter = require('./routes/reservedlist');
const usersRouter = require('./routes/users');
const blackRouter = require('./routes/blacklist');
const menuRouter = require('./routes/menu');
const reviewRouter = require('./routes/review');
const mypageRouter = require('./routes/mypage');
const calendarRouter = require('./routes/calendar');
const findpwRouter = require('./routes/findpw');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/signup', signUpRouter);
app.use('/signin', signInRouter);
app.use('/forgot', forgotRouter);
app.use('/header', headerRouter);
app.use('/logout', logoutRouter);
app.use('/reserve', reserveRouter);
app.use('/email', emailRouter);
app.use('/auth', authRouter);
app.use('/map', mapRouter);
app.use('/reservedlist', reservedRouter);
app.use('/users', usersRouter);
app.use('/blacklist', blackRouter);
app.use('/menu', menuRouter);
app.use('/review', reviewRouter);
app.use('/mypage', mypageRouter);
app.use('/calendar', calendarRouter);
app.use('/findpw', findpwRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
