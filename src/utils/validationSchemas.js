const { z } = require('zod');

// User validation schemas
const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['viewer', 'analyst', 'admin']).optional(),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

const updateUserSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    role: z.enum(['viewer', 'analyst', 'admin']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
});

// Financial record validation schemas
const createRecordSchema = z.object({
    amount: z.number().positive('Amount must be positive').min(0.01),
    type: z.enum(['income', 'expense'], {
        errorMap: () => ({ message: 'Type must be either income or expense' }),
    }),
    category: z.string().min(1, 'Category is required'),
    date: z.string().datetime().optional(),
    description: z.string().max(500).optional(),
    notes: z.string().max(1000).optional(),
});

const updateRecordSchema = z.object({
    amount: z.number().positive().min(0.01).optional(),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().min(1).optional(),
    date: z.string().datetime().optional(),
    description: z.string().max(500).optional(),
    notes: z.string().max(1000).optional(),
});

const filterRecordsSchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
});

module.exports = {
    registerSchema,
    loginSchema,
    updateUserSchema,
    createRecordSchema,
    updateRecordSchema,
    filterRecordsSchema,
};