const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const fs = require('fs');
const http = require('http');
const passport = require('passport');
const flash = require('connect-flash');
const credentials = require('./credentials.js');
const routes = require('./routes/')(passport);
const initPassport = require('./passport/init');

const app = express();

const mongooseOpt = {
  keepAlive: 1,
  useNewUrlParser: true,
};
mongoose.connect(credentials.mongo.development.connectionString, mongooseOpt);

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
  secret: credentials.cookieSecret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection, stringify: true }),
}));
app.use((req, res, next) => {
  console.log(`Обработка запроса для ${req.url} ...`);
  next();
});

// Configuring Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Initialize Passport
initPassport(passport);

app.use('/', routes);

// автоподстановка шаблонов
const autoViews = {};
app.use((req, res, next) => {
  const path = req.path.toLowerCase();
  if (autoViews[path]) return res.render(autoViews[path]);
  if (fs.existsSync(`${__dirname}/views${path}.handlebars`)) {
    autoViews[path] = path.replace(/^\//, '');
    return res.render(autoViews[path]);
  }
  return next();
});

// страница 404
app.use((req, res) => {
  res.status(404);
  res.render('404');
});
// страница 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

function startServer() {
  http.createServer(app).listen(3000, () => {
    console.log('Express запущен на http://localhost:3000');
  });
}

if (require.main === module) startServer()
else module.eports = startServer;
