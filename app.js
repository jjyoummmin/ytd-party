var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var app = express();

//db (세션저장소로 사용할)
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const sessionadapter = new FileSync('db/session.json', { defaultValue: { sessions: [] } });
const sessiondb = lowdb(sessionadapter);
const adapter = new FileSync('db/operation.json');
const db = lowdb(adapter);
db.defaults({ members:[], rooms:[] }).write()

//session
const session = require('express-session')
const LowdbStore = require('lowdb-session-store')(session);
//passport
const passport = require('passport');
const passportConfig = require('./passportConfig');

var indexRouter = require('./routes/index')(db);
var apiRouter = require('./routes/api')(db);
var loginRouter = require('./routes/login');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new LowdbStore(sessiondb.get('sessions'), {
    ttl: 86400
  }),
}))
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport,db);         

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/login', loginRouter);

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
