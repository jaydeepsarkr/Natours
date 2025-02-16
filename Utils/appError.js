class AppError extends Error {
  constructor(message = 'Something went wrong', statusCode = 500) {
    super(message);

    this.statusCode = Number(statusCode) || 500;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
