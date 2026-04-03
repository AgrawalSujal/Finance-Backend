const User = require('../models/User');
const AppError = require('../utils/AppError');

class UserService {
    async createUser(userData) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new AppError('User with this email already exists', 400);
        }

        const user = await User.create(userData);
        user.password = undefined;
        return user;
    }

    async getAllUsers() {
        const users = await User.find().select('-password');
        return users;
    }

    async getUserById(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async updateUser(userId, updateData) {
        const user = await User.findByIdAndUpdate(
            userId,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async getUserByEmail(email) {
        const user = await User.findOne({ email }).select('+password');
        return user;
    }
}

module.exports = new UserService();