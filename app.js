const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// ------------------------------Middlewares------------------------------ //
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // enable logging middleware only in dev mode
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // 100 requests per 1hr from the same IP
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter); // Only limit access to the "/api" route

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // to have access to "body" of req

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Routes
// "v1" for API version, which is useful if there's a new version in the future
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
