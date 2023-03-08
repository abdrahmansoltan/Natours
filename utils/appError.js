class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // ex: '404'
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // Show where the error happened
  }
}

module.exports = AppError;
