const FinancialRecord = require('../models/FinancialRecord');

class DashboardService {
    async getDashboardSummary(userId, timeframe = 'month') {
        const now = new Date();
        let startDate;

        switch (timeframe) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(now.setMonth(now.getMonth() - 1));
        }

        const pipeline = [
            {
                $match: {
                    userId: userId,
                    date: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ];

        const totals = await FinancialRecord.aggregate(pipeline);

        const income = totals.find(t => t._id === 'income') || { totalAmount: 0, count: 0 };
        const expenses = totals.find(t => t._id === 'expense') || { totalAmount: 0, count: 0 };

        const recentTransactions = await FinancialRecord.find({ userId })
            .sort({ date: -1 })
            .limit(10);

        return {
            summary: {
                totalIncome: income.totalAmount,
                totalExpenses: expenses.totalAmount,
                netBalance: income.totalAmount - expenses.totalAmount,
                totalTransactions: income.count + expenses.count,
            },
            recentTransactions,
        };
    }

    async getCategoryWiseTotals(userId, type, startDate, endDate) {
        const matchStage = { userId };
        if (type) matchStage.type = type;
        if (startDate || endDate) {
            matchStage.date = {};
            if (startDate) matchStage.date.$gte = new Date(startDate);
            if (endDate) matchStage.date.$lte = new Date(endDate);
        }

        const pipeline = [
            { $match: matchStage },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    averageAmount: { $avg: '$amount' }
                }
            },
            { $sort: { totalAmount: -1 } }
        ];

        const categoryTotals = await FinancialRecord.aggregate(pipeline);

        return categoryTotals;
    }

    async getMonthlyTrends(userId, year) {
        const targetYear = year || new Date().getFullYear();

        const pipeline = [
            {
                $match: {
                    userId: userId,
                    date: {
                        $gte: new Date(`${targetYear}-01-01`),
                        $lte: new Date(`${targetYear}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
                        type: '$type'
                    },
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    month: '$_id.month',
                    type: '$_id.type',
                    totalAmount: 1,
                    _id: 0
                }
            },
            { $sort: { month: 1 } }
        ];

        const trends = await FinancialRecord.aggregate(pipeline);

        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            income: 0,
            expense: 0,
        }));

        trends.forEach(trend => {
            const monthData = monthlyData[trend.month - 1];
            if (trend.type === 'income') {
                monthData.income = trend.totalAmount;
            } else {
                monthData.expense = trend.totalAmount;
            }
        });

        return monthlyData;
    }
}

module.exports = new DashboardService();