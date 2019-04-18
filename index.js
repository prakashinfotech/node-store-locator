const express = require('express');
const debug = require('debug')('app');
const path = require('path');

const app = express();
const port = process.env.port || 3000;

app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.set('views', './src/views');
app.set('view engine', 'ejs');

const routes = [
  { link: '/add-store', title: 'Add Store' },
  { link: '/list-store', title: 'List Store' }
];

app.get('/', (req, res) => {
  return res.render(
    'pages/home',
    {
      routes,
      title: 'Store Locator - Home'
    }
  );
});
app.get('/add-store', (req, res) => {
  return res.render(
    'pages/add-store',
    {
      routes,
      title: 'Add Store'
    }
  );
});
app.listen(port, () => {
  debug(`servier is listening on http://localhost:${port} ...`);
})