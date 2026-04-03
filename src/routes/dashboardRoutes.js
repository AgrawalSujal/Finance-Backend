const express = require('express');
const {
    getDashboardSummary,
    getCategoryWiseTotals,
    getMonthlyTrends,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect);
router.use(checkPermission('VIEW_DASHBOARD'));

router.get('/summary', getDashboardSummary);
router.get('/category-totals', getCategoryWiseTotals);
router.get('/monthly-trends', getMonthlyTrends);

module.exports = router;