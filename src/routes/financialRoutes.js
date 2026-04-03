const express = require('express');
const {
    createRecord,
    getRecords,
    getRecord,
    updateRecord,
    deleteRecord,
} = require('../controllers/financialController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/roleCheck');
const { validate, validateQuery } = require('../middleware/validate');
const { createRecordSchema, updateRecordSchema, filterRecordsSchema } = require('../utils/validationSchemas');

const router = express.Router();

// All financial routes require authentication
router.use(protect);

// Routes with specific permissions
router.route('/')
    .post(checkPermission('CREATE_RECORD'), validate(createRecordSchema), createRecord)
    .get(validateQuery(filterRecordsSchema), getRecords);

router.route('/:id')
    .get(getRecord)
    .patch(checkPermission('UPDATE_RECORD'), validate(updateRecordSchema), updateRecord)
    .delete(checkPermission('DELETE_RECORD'), deleteRecord);

module.exports = router;