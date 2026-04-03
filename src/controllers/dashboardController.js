const DashboardService = require('../services/DashBoardService');

exports.getDashboardSummary = async (req, res, next) => {
    try {
        const { timeframe = 'month' } = req.query;
        const summary = await DashboardService.getDashboardSummary(req.user.id, timeframe);
        res.status(200).json({
            status: 'success',
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};

exports.getCategoryWiseTotals = async (req, res, next) => {
    try {
        const { type, startDate, endDate } = req.query;
        const categoryTotals = await DashboardService.getCategoryWiseTotals(
            req.user.id,
            type,
            startDate,
            endDate
        );
        res.status(200).json({
            status: 'success',
            results: categoryTotals.length,
            data: { categoryTotals },
        });
    } catch (error) {
        next(error);
    }
};

exports.getMonthlyTrends = async (req, res, next) => {
    try {
        const { year } = req.query;
        const trends = await DashboardService.getMonthlyTrends(req.user.id, year);
        res.status(200).json({
            status: 'success',
            data: { trends },
        });
    } catch (error) {
        next(error);
    }
};