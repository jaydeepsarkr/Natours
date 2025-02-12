
const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(morgan('dev'));



  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);

module.exports = app;
