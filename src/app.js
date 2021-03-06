const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const controllers = require('./controllers/index.js');
// const error = require('./controllers/error.js');
const morgan = require('morgan');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const logDirectory = path.join(__dirname, 'log');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errMiddleware = require('./middlewares/error.js');
const authRoutes = require('./middlewares/authenticateRoutes.js');
const helpers = require('./views/helpers/index');

const app = express();

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  exphbs({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    defaultLayout: 'main',
    helpers: helpers
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser('secret'));
app.use(authRoutes);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(controllers);
// app.use(error.client);
// app.use(error.server);
app.use(errMiddleware);
app.set('port', process.env.PORT || 3000);
module.exports = app;
