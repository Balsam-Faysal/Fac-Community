const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const controllers = require('./controllers/index.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errMiddleware = require('./middlewares/error.js');
const authRoutes = require('./middlewares/authenticateRoutes.js');
console.log(authRoutes);
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  exphbs({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    defaultLayout: 'main'
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser('secret'));
app.use(errMiddleware);
app.use(authRoutes);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(controllers);
app.set('port', process.env.PORT || 3000);
module.exports = app;
