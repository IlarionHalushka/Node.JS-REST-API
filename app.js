import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';

import swaggerDocument from './swagger.json';
import authRouter from './routes/auth';
import categoriesRouter from './routes/categories';
import suppliersRouter from './routes/suppliers';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// set up logger
app.use(
  logger(
    //  ':date[web] :method :url :status :res[content-length] - :response-time ms',
    'dev',
  ),
);

// parse request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
    return res.status(200).json({});
  }

  return next();
});

// main routers
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/v1/auth', limiter, authRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/suppliers', suppliersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
