const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration allowing requests from the frontend URL in production and all origins in development
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
    credentials: true,
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again later',
});
app.use('/api', limiter);

// Body parsing middleware with increased limits to handle large payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes middleware
app.use('/api', routes);

// Handle undefined routes with a 404 error
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler to catch all errors and send a consistent response
app.use(errorHandler);

module.exports = app;