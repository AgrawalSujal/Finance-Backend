const UserService = require('../services/userService');

// get all users, get user by ID, update user, delete user - these are admin-only operations,
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users },
        });
    } catch (error) {
        next(error);
    }
};

// get user by ID, update user, delete user - 
// these can be accessed by the user themselves or by an admin
exports.getUser = async (req, res, next) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

// update user and delete user - these can be accessed by the user themselves or by an admin
exports.updateUser = async (req, res, next) => {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

// delete user - this can be accessed by the user themselves or by an admin,
// and will remove the user from the database and return the deleted user data 
// for confirmation in admin panel or for logging purposes
exports.deleteUser = async (req, res, next) => {
    try {
        await UserService.deleteUser(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};