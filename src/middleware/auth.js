const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in. Please login to access this resource', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new AppError('User no longer exists', 401));
        }

        if (user.status === 'inactive') {
            return next(new AppError('Your account has been deactivated', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token. Please login again', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token expired. Please login again', 401));
        }
        next(error);
    }
};

module.exports = { protect };