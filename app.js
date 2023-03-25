const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ------------------------------Middlewares------------------------------ //
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      allowOrigins: ['*'],
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['*'],
        scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
      },
    },
  })
);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

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
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // parse data coming from url-encoded HTML Form
app.use(cookieParser()); // parse data from cookies

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Fix CSP Error
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com http://127.0.0.1:3000 https://js.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  );
  next();
});

// Compress text sent to client to reduce size
app.use(compression());

// ------------------------------------Routes------------------------------------ //
app.use('/', viewRouter);

// "v1" for API version, which is useful if there's a new version in the future
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
