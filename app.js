var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
const prodata = require('./data/product-data');
const loginData = require('./data/login-data');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res, next) {
  res.render('index',prodata);
})
app.get('/login', function (req, res, next) {
  res.render('login');
})
app.post('/login', async function (req, res, next) {
  let userEmail= req.body.user_email;
  let userPass= req.body.user_password;
  let userData = await loginData(userEmail,userPass);
  if(typeof userData !== 'undefined') {
    res
    .cookie('userData', JSON.stringify(userData), { path: '/' })
    .redirect('/');
  }
  else {
    res.render('login')
  }
})
app.get('/about', function (req, res, next) {
  res.render('about');
})
app.get('/contact', function (req, res, next) {
  res.render('contact');
})
app.get('/product', function (req, res, next) {
  res.render('product',prodata);
})
app.get('/singup', function (req, res, next) {
  res.render('singup');
})

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
