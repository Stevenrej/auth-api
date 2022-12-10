'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const notFoundHandler = require('./middleware/404');
const errorHandler = require('./middleware/500');
const logger = require('./middleware/logger');
const authRoutes = require('./routes/routes');
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use(authRoutes);
app.use('/api/v1', v1Routes); // http://localhost:3000/api/v1/clothes
app.use('/api/v2', v2Routes);
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
