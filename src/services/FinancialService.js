const FinancialRecord = require('../models/FinancialRecord');
const AppError = require('../utils/AppError');

class FinancialService {
    async createRecord(userId, recordData) {
        const record = await FinancialRecord.create({
            ...recordData,
            userId,
        });
        return record;
    }

    async getRecords(userId, filters = {}) {
        const query = { userId };

        if (filters.type) query.type = filters.type;
        if (filters.category) query.category = filters.category;
        if (filters.startDate || filters.endDate) {
            query.date = {};
            if (filters.startDate) query.date.$gte = new Date(filters.startDate);
            if (filters.endDate) query.date.$lte = new Date(filters.endDate);
        }

        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 10;
        const skip = (page - 1) * limit;

        const records = await FinancialRecord.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await FinancialRecord.countDocuments(query);

        return {
            records,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
            },
        };
    }

    async getRecordById(userId, recordId) {
        const record = await FinancialRecord.findOne({ _id: recordId, userId });
        if (!record) {
            throw new AppError('Record not found', 404);
        }
        return record;
    }

    async updateRecord(userId, recordId, updateData) {
        const record = await FinancialRecord.findOneAndUpdate(
            { _id: recordId, userId },
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!record) {
            throw new AppError('Record not found', 404);
        }
        return record;
    }

    async deleteRecord(userId, recordId) {
        const record = await FinancialRecord.findOneAndDelete({ _id: recordId, userId });
        if (!record) {
            throw new AppError('Record not found', 404);
        }
        return record;
    }
}

module.exports = new FinancialService();