const express = require('express');
const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/roleCheck');
const { validate } = require('../middleware/validate');
const { updateUserSchema } = require('../utils/validationSchemas');

const router = express.Router();

// All user routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

router.route('/')
    .get(getAllUsers);

router.route('/:id')
    .get(getUser)
    .patch(validate(updateUserSchema), updateUser)
    .delete(deleteUser);

module.exports = router;