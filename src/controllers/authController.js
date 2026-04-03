const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const AppError = require('../utils/AppError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.register = async (req, res, next) => {
    try {
        const user = await UserService.createUser(req.body);
        createSendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UserService.getUserByEmail(email);

        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError('Invalid email or password', 401));
        }

        if (user.status === 'inactive') {
            return next(new AppError('Your account is inactive. Please contact admin', 401));
        }

        user.password = undefined;
        createSendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await UserService.getUserById(req.user.id);
        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};