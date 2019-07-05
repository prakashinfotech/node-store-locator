const express = require('express');
const debug = require('debug')('app');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(morgan('dev'));

/* Setup static files location */
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/datatables/media/css')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/css')));

app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/datatables/media/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootbox/dist')));

app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts')));

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(expressLayouts);

const appRoutes = [
  { link: '/store', title: 'Store' }
];
const storeRoute = require('./routes/routes.store.js')(appRoutes);

app.use('/store', storeRoute);

app.get('/', (req, res) => {
  res.render(
      'pages/home',
      {
      appRoutes,
      title: 'Store Locator - Home'
      }
  );
});

const port = process.env.port || 3000;
app.listen(port, () => {
  debug(`server is listening on http://localhost:${port} ...`);
});
