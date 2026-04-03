const FinancialService = require('../services/financialService');

exports.createRecord = async (req, res, next) => {
    try {
        const record = await FinancialService.createRecord(req.user.id, req.body);
        res.status(201).json({
            status: 'success',
            data: { record },
        });
    } catch (error) {
        next(error);
    }
};

exports.getRecords = async (req, res, next) => {
    try {
        const result = await FinancialService.getRecords(req.user.id, req.query);
        res.status(200).json({
            status: 'success',
            results: result.records.length,
            data: { records: result.records },
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

exports.getRecord = async (req, res, next) => {
    try {
        const record = await FinancialService.getRecordById(req.user.id, req.params.id);
        res.status(200).json({
            status: 'success',
            data: { record },
        });
    } catch (error) {
        next(error);
    }
};

exports.updateRecord = async (req, res, next) => {
    try {
        const record = await FinancialService.updateRecord(req.user.id, req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: { record },
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteRecord = async (req, res, next) => {
    try {
        await FinancialService.deleteRecord(req.user.id, req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};