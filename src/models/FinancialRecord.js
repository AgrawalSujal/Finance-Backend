const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Type is required (income/expense)'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Add indexes for efficient querying by userId, date, type, and category 
// This will improve performance when filtering records by user and other criteria
financialRecordSchema.index({ userId: 1, date: -1 });
financialRecordSchema.index({ userId: 1, type: 1 });
financialRecordSchema.index({ userId: 1, category: 1 });

// Update timestamp on save to keep track of when records are modified
financialRecordSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);