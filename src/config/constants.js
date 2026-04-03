// Role definitions and permissions
const ROLES = {
    VIEWER: 'viewer',
    ANALYST: 'analyst',
    ADMIN: 'admin',
};

const PERMISSIONS = {
    // Financial Records Permissions
    CREATE_RECORD: {
        viewer: false,
        analyst: true,
        admin: true,
    },
    VIEW_RECORDS: {
        viewer: true,
        analyst: true,
        admin: true,
    },
    UPDATE_RECORD: {
        viewer: false,
        analyst: false,
        admin: true,
    },
    DELETE_RECORD: {
        viewer: false,
        analyst: false,
        admin: true,
    },

    // User Management Permissions
    CREATE_USER: {
        viewer: false,
        analyst: false,
        admin: true,
    },
    VIEW_USERS: {
        viewer: false,
        analyst: false,
        admin: true,
    },
    UPDATE_USER: {
        viewer: false,
        analyst: false,
        admin: true,
    },
    DELETE_USER: {
        viewer: false,
        analyst: false,
        admin: true,
    },

    // Dashboard Permissions
    VIEW_DASHBOARD: {
        viewer: true,
        analyst: true,
        admin: true,
    },
    VIEW_INSIGHTS: {
        viewer: false,
        analyst: true,
        admin: true,
    },
};

// Financial record types
const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
};

// Common categories
const CATEGORIES = {
    INCOME: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
    EXPENSE: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Other Expense'],
};

module.exports = {
    ROLES,
    PERMISSIONS,
    TRANSACTION_TYPES,
    CATEGORIES,
};