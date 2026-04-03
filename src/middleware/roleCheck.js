const AppError = require('../utils/AppError');
const { PERMISSIONS } = require('../config/constants');

const checkPermission = (permission) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        const hasPermission = PERMISSIONS[permission]?.[userRole];

        if (!hasPermission) {
            return next(new AppError(`Access denied. ${userRole} cannot perform this action`, 403));
        }

        next();
    };
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(`Role '${req.user.role}' is not authorized for this action`, 403));
        }
        next();
    };
};

module.exports = {
    checkPermission,
    restrictTo,
};