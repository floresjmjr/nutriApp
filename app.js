var createError = require('http-errors');
var express = require('express');
require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const DB = require('./config/database');

//Database
DB.connect();

//Router
var searchRouter = require('./routes/search');
var nutrientRouter = require('./routes/nutrient');
var logRouter = require('./routes/log');
var itemRouter = require('./routes/item');
var analysisRouter = require('./routes/analysis');
const userTotals = require('./routes/userTotals');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals.basedir = path.join(__dirname, 'views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', searchRouter);
app.use('/', nutrientRouter);
app.use('/', logRouter);
app.use('/', itemRouter);
app.use('/', analysisRouter);
app.use('/', userTotals);

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
