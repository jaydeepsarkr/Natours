const AppError = require('../Utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : 'Unknown';
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = err.errors
    ? Object.values(err.errors).map((el) => el.message)
    : [];

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.error('ERROR 💥', err.name);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log(err.message);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line prefer-object-spread
    let error = Object.assign({}, err); // clone the error object
    error.message = err.message;
    console.log(error.message);

    if (err.name === 'CastError') {
      console.log(err.name);
      error = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      console.log(err.name);
      error = handleDuplicateFieldsDB(err);
    }
    if (err.name === 'ValidationError') {
      console.log(err.name);
      error = handleValidationErrorDB(err);
    }

    sendErrorProd(error, res);
  }
};
