// scripts/seedAtlas.js
// This script seeds MongoDB Atlas with comprehensive financial data

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('../src/models/User');
const FinancialRecord = require('../src/models/FinancialRecord');

// Configuration
const MONGODB_ATLAS_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster.mongodb.net/finance-dashboard';

// Sample users based on README roles
const usersData = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        description: 'Full system access - can manage users and all records'
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'viewer',
        status: 'active',
        description: 'Read-only access - can only view dashboard and records'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'analyst',
        status: 'active',
        description: 'Can view records and create new ones, but cannot modify existing'
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        password: 'Sarah123!',
        role: 'analyst',
        status: 'active',
        description: 'Senior analyst with advanced insights access'
    },
    {
        name: 'Mike Chen',
        email: 'mike@company.com',
        password: 'Mike123!',
        role: 'viewer',
        status: 'active',
        description: 'Department viewer'
    },
    {
        name: 'Emma Wilson',
        email: 'emma@company.com',
        password: 'Emma123!',
        role: 'analyst',
        status: 'active',
        description: 'Financial analyst'
    },
    {
        name: 'James Brown',
        email: 'james@company.com',
        password: 'James123!',
        role: 'viewer',
        status: 'inactive',
        description: 'Inactive user - cannot login'
    }
];

// Categories based on README structure
const CATEGORIES = {
    income: [
        'Salary', 'Freelance', 'Investment', 'Gift', 'Bonus',
        'Dividend', 'Refund', 'Rental Income', 'Interest', 'Commission'
    ],
    expense: [
        'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping',
        'Healthcare', 'Education', 'Rent', 'Insurance', 'Subscriptions',
        'Travel', 'Gifts', 'Charity', 'Maintenance', 'Taxes'
    ]
};

// Generate realistic descriptions
const generateDescription = (type, category, amount, date) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const descriptions = {
        income: {
            'Salary': `${month} ${year} salary payment of $${amount}`,
            'Freelance': `Freelance project completed in ${month} - $${amount}`,
            'Investment': `Investment returns for ${month} - $${amount}`,
            'Gift': `Birthday/Holiday gift received - $${amount}`,
            'Bonus': `Performance bonus for Q${Math.floor(date.getMonth() / 3) + 1} - $${amount}`,
            'Dividend': `Stock dividend payment - $${amount}`,
            'Refund': `Tax/Customer refund - $${amount}`,
            'Rental Income': `Property rental income for ${month} - $${amount}`,
            'Interest': `Bank interest earned - $${amount}`,
            'Commission': `Sales commission - $${amount}`
        },
        expense: {
            'Food': `${month} grocery and dining expenses - $${amount}`,
            'Transport': `Transportation costs (fuel/public transit) - $${amount}`,
            'Utilities': `Utility bills (electricity, water, internet) - $${amount}`,
            'Entertainment': `Movies, events, and entertainment - $${amount}`,
            'Shopping': `Shopping and retail purchases - $${amount}`,
            'Healthcare': `Medical expenses and insurance - $${amount}`,
            'Education': `Courses, books, and education fees - $${amount}`,
            'Rent': `Monthly rent payment - $${amount}`,
            'Insurance': `Insurance premium - $${amount}`,
            'Subscriptions': `Monthly subscriptions (Netflix, Spotify, etc.) - $${amount}`,
            'Travel': `Travel and vacation expenses - $${amount}`,
            'Gifts': `Gifts for occasions - $${amount}`,
            'Charity': `Charitable donations - $${amount}`,
            'Maintenance': `Home/vehicle maintenance - $${amount}`,
            'Taxes': `Tax payments - $${amount}`
        }
    };

    const defaultDesc = `${type === 'income' ? 'Income' : 'Expense'} of $${amount} for ${category} on ${date.toLocaleDateString()}`;

    return descriptions[type][category] || defaultDesc;
};

// Generate realistic financial records for a user
const generateUserRecords = (userId, startDate, endDate) => {
    const records = [];
    const currentDate = new Date(startDate);

    // Track monthly income patterns
    const monthlyIncome = {
        'Salary': [3000, 3500, 4000, 4500, 5000],
        'Freelance': [500, 800, 1000, 1200, 1500],
        'Investment': [100, 150, 200, 250, 300],
        'Bonus': [0, 0, 1000, 0, 2000, 0, 500, 0, 1500, 0, 0, 3000]
    };

    // Track expense patterns by category
    const expensePatterns = {
        'Rent': [800, 1000, 1200, 1500, 2000],
        'Utilities': [100, 120, 150, 180, 200],
        'Food': [200, 300, 400, 500, 600],
        'Transport': [50, 80, 100, 120, 150],
        'Entertainment': [30, 50, 80, 100, 150],
        'Shopping': [50, 100, 150, 200, 300],
        'Healthcare': [50, 100, 150, 200, 250],
        'Subscriptions': [20, 30, 40, 50, 60]
    };

    while (currentDate <= endDate) {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        // Generate 1-2 income records per month (excluding salary which is always present)
        // Salary is mandatory for active users
        const salaryAmount = 4500; // Base salary
        records.push({
            userId: userId,
            amount: salaryAmount,
            type: 'income',
            category: 'Salary',
            date: new Date(year, month, 25), // Salary on 25th of each month
            description: `${currentDate.toLocaleString('default', { month: 'long' })} ${year} Salary - $${salaryAmount}`,
            notes: 'Monthly salary deposit - Auto-generated'
        });

        // Add additional income records (40% chance per month)
        if (Math.random() < 0.4) {
            const incomeCategories = CATEGORIES.income.filter(c => c !== 'Salary');
            const category = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
            let amount;

            if (category === 'Freelance') amount = Math.floor(Math.random() * 1500) + 300;
            else if (category === 'Investment') amount = Math.floor(Math.random() * 300) + 50;
            else if (category === 'Bonus') amount = Math.floor(Math.random() * 2000) + 500;
            else amount = Math.floor(Math.random() * 500) + 50;

            const day = Math.floor(Math.random() * 28) + 1;
            records.push({
                userId: userId,
                amount: amount,
                type: 'income',
                category: category,
                date: new Date(year, month, day),
                description: generateDescription('income', category, amount, new Date(year, month, day)),
                notes: `Additional ${category.toLowerCase()} income - Auto-generated`
            });
        }

        // Generate 3-8 expense records per month
        const expenseCount = Math.floor(Math.random() * 6) + 3;
        for (let i = 0; i < expenseCount; i++) {
            const category = CATEGORIES.expense[Math.floor(Math.random() * CATEGORIES.expense.length)];
            let amount;

            // Set realistic amounts based on category
            if (category === 'Rent') amount = expensePatterns.Rent[Math.floor(Math.random() * expensePatterns.Rent.length)];
            else if (category === 'Utilities') amount = expensePatterns.Utilities[Math.floor(Math.random() * expensePatterns.Utilities.length)];
            else if (category === 'Food') amount = expensePatterns.Food[Math.floor(Math.random() * expensePatterns.Food.length)];
            else if (category === 'Transport') amount = expensePatterns.Transport[Math.floor(Math.random() * expensePatterns.Transport.length)];
            else if (category === 'Entertainment') amount = expensePatterns.Entertainment[Math.floor(Math.random() * expensePatterns.Entertainment.length)];
            else if (category === 'Shopping') amount = expensePatterns.Shopping[Math.floor(Math.random() * expensePatterns.Shopping.length)];
            else if (category === 'Healthcare') amount = expensePatterns.Healthcare[Math.floor(Math.random() * expensePatterns.Healthcare.length)];
            else if (category === 'Subscriptions') amount = expensePatterns.Subscriptions[Math.floor(Math.random() * expensePatterns.Subscriptions.length)];
            else amount = Math.floor(Math.random() * 200) + 20;

            const day = Math.floor(Math.random() * 28) + 1;
            const expenseDate = new Date(year, month, day);

            records.push({
                userId: userId,
                amount: amount,
                type: 'expense',
                category: category,
                date: expenseDate,
                description: generateDescription('expense', category, amount, expenseDate),
                notes: `${category} expense for ${expenseDate.toLocaleString('default', { month: 'long' })} - Auto-generated`
            });
        }

        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return records;
};

// Main seed function
const seedAtlasDatabase = async () => {
    console.log('\n🚀 Starting MongoDB Atlas Data Seeding...\n');
    console.log('='.repeat(60));

    try {
        // Check for MongoDB URI
        if (!process.env.MONGODB_URI) {
            console.error('❌ Error: MONGODB_URI not found in .env file');
            console.log('\n📝 Please add to your .env file:');
            console.log('MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/finance-dashboard');
            process.exit(1);
        }

        console.log('📡 Connecting to MongoDB Atlas...');
        console.log(`📍 Cluster: ${process.env.MONGODB_URI.split('@')[1].split('/')[0]}`);

        // Connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        console.log('✅ Successfully connected to MongoDB Atlas\n');

        // Clear existing data
        console.log('🧹 Clearing existing data from collections...');
        await User.deleteMany({});
        await FinancialRecord.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create users
        console.log('👥 Creating users with different roles...');
        console.log('-'.repeat(50));

        const createdUsers = [];
        for (const userData of usersData) {
            // Create user
            const user = await User.create({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role,
                status: userData.status
            });

            createdUsers.push({
                ...user.toObject(),
                originalPassword: userData.password
            });

            console.log(`✓ Created ${user.role.toUpperCase()}: ${user.name}`);
            console.log(`  📧 Email: ${user.email}`);
            console.log(`  🔑 Password: ${userData.password}`);
            console.log(`  📊 Status: ${user.status}`);
            console.log(`  💡 ${userData.description}`);
            console.log('-'.repeat(50));
        }

        // Generate financial records for each user (last 12 months)
        console.log('\n💰 Generating financial records...');
        console.log('-'.repeat(50));

        const endDate = new Date(); // Current date
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1); // 1 year of data

        let totalRecords = 0;

        for (const user of createdUsers) {
            const records = generateUserRecords(user._id, startDate, endDate);
            await FinancialRecord.insertMany(records);
            totalRecords += records.length;

            // Calculate summary for this user
            const incomeRecords = records.filter(r => r.type === 'income');
            const expenseRecords = records.filter(r => r.type === 'expense');
            const totalIncome = incomeRecords.reduce((sum, r) => sum + r.amount, 0);
            const totalExpense = expenseRecords.reduce((sum, r) => sum + r.amount, 0);

            console.log(`✓ ${user.name} (${user.role}):`);
            console.log(`  📈 Total Records: ${records.length}`);
            console.log(`  💵 Total Income: $${totalIncome.toFixed(2)}`);
            console.log(`  💸 Total Expenses: $${totalExpense.toFixed(2)}`);
            console.log(`  💎 Net Balance: $${(totalIncome - totalExpense).toFixed(2)}`);
            console.log('-'.repeat(50));
        }

        // Generate comprehensive statistics
        console.log('\n📊 Database Statistics:');
        console.log('='.repeat(60));

        const allIncome = await FinancialRecord.aggregate([
            { $match: { type: 'income' } },
            { $group: { _id: null, total: { $sum: '$amount' }, avg: { $avg: '$amount' }, count: { $sum: 1 } } }
        ]);

        const allExpense = await FinancialRecord.aggregate([
            { $match: { type: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' }, avg: { $avg: '$amount' }, count: { $sum: 1 } } }
        ]);

        const categoryBreakdown = await FinancialRecord.aggregate([
            {
                $group: {
                    _id: { type: '$type', category: '$category' },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        console.log(`📊 Total Users: ${createdUsers.length}`);
        console.log(`💰 Total Financial Records: ${totalRecords}`);
        console.log(`💵 Total Income: $${allIncome[0]?.total.toFixed(2) || 0} (${allIncome[0]?.count || 0} transactions)`);
        console.log(`💸 Total Expenses: $${allExpense[0]?.total.toFixed(2) || 0} (${allExpense[0]?.count || 0} transactions)`);
        console.log(`💎 Overall Net Balance: $${((allIncome[0]?.total || 0) - (allExpense[0]?.total || 0)).toFixed(2)}`);
        console.log(`📈 Average Income: $${allIncome[0]?.avg.toFixed(2) || 0}`);
        console.log(`📉 Average Expense: $${allExpense[0]?.avg.toFixed(2) || 0}`);

        console.log('\n📂 Top Categories by Spending:');
        console.log('-'.repeat(40));
        const topExpenseCategories = categoryBreakdown
            .filter(c => c._id.type === 'expense')
            .slice(0, 5);

        topExpenseCategories.forEach(cat => {
            console.log(`  ${cat._id.category}: $${cat.total.toFixed(2)} (${cat.count} transactions)`);
        });

        console.log('\n💰 Top Income Sources:');
        console.log('-'.repeat(40));
        const topIncomeCategories = categoryBreakdown
            .filter(c => c._id.type === 'income')
            .slice(0, 5);

        topIncomeCategories.forEach(cat => {
            console.log(`  ${cat._id.category}: $${cat.total.toFixed(2)} (${cat.count} transactions)`);
        });

        // Display login credentials summary
        console.log('\n🔐 LOGIN CREDENTIALS SUMMARY:');
        console.log('='.repeat(60));
        console.log('Role    | Email                    | Password');
        console.log('-'.repeat(60));
        createdUsers.forEach(user => {
            const rolePad = user.role.padEnd(7);
            const emailPad = user.email.padEnd(23);
            console.log(`${rolePad} | ${emailPad} | ${user.originalPassword}`);
        });

        // Test API endpoints instructions
        console.log('\n🧪 TEST YOUR API ENDPOINTS:');
        console.log('='.repeat(60));
        console.log('\n1. Test Login (Admin):');
        console.log('   curl -X POST http://localhost:3000/api/auth/login \\');
        console.log('     -H "Content-Type: application/json" \\');
        console.log('     -d \'{"email":"admin@example.com","password":"admin123"}\'');

        console.log('\n2. Get Dashboard Summary:');
        console.log('   curl -X GET http://localhost:3000/api/dashboard/summary \\');
        console.log('     -H "Authorization: Bearer YOUR_TOKEN"');

        console.log('\n3. Get Financial Records:');
        console.log('   curl -X GET "http://localhost:3000/api/records?page=1&limit=10" \\');
        console.log('     -H "Authorization: Bearer YOUR_TOKEN"');

        console.log('\n4. Create New Record:');
        console.log('   curl -X POST http://localhost:3000/api/records \\');
        console.log('     -H "Authorization: Bearer YOUR_TOKEN" \\');
        console.log('     -H "Content-Type: application/json" \\');
        console.log('     -d \'{"amount":500,"type":"expense","category":"Food"}\'');

        console.log('\n✨ SEEDING COMPLETED SUCCESSFULLY! ✨');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Error seeding database:', error.message);
        if (error.name === 'MongoServerError' && error.code === 8000) {
            console.log('\n⚠️  Authentication failed. Please check your MongoDB Atlas credentials in .env file');
        } else if (error.name === 'MongooseServerSelectionError') {
            console.log('\n⚠️  Cannot connect to MongoDB Atlas. Please check:');
            console.log('   1. Your internet connection');
            console.log('   2. MongoDB Atlas cluster is active');
            console.log('   3. IP address is whitelisted in Atlas');
            console.log('   4. Username and password are correct');
        }
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB Atlas');
    }
};

// Run the seeder
seedAtlasDatabase();