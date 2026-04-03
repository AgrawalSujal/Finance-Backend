// scripts/testApiWorking.js
// Working test file for your seeded database

const BASE_URL = 'http://localhost:3000/api';

// Colors for console output
const colors = {
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    cyan: (text) => `\x1b[36m${text}\x1b[0m`,
    white: (text) => `\x1b[37m${text}\x1b[0m`,
};

let tokens = {
    admin: '',
    analyst: '',
    viewer: ''
};

let testRecordId = '';
let testsPassed = 0;
let testsFailed = 0;

async function apiCall(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: { 'Content-Type': 'application/json' },
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: { ...defaultOptions.headers, ...options.headers },
    };

    try {
        const response = await fetch(url, mergedOptions);
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        }
        return { status: response.status, data, ok: response.ok };
    } catch (error) {
        return { status: 0, data: null, ok: false, error: error.message };
    }
}

function logResult(testName, passed, details = '') {
    if (passed) {
        console.log(`  ${colors.green('✓')} ${testName} - ${colors.green('PASSED')} ${details ? `(${details})` : ''}`);
        testsPassed++;
    } else {
        console.log(`  ${colors.red('✗')} ${colors.red(testName)} - ${colors.red('FAILED')} ${details ? `(${details})` : ''}`);
        testsFailed++;
    }
}

function logSection(title) {
    console.log(`\n${colors.cyan('='.repeat(70))}`);
    console.log(`${colors.yellow(title)}`);
    console.log(`${colors.cyan('='.repeat(70))}`);
}

async function testHealthCheck() {
    console.log(`\n${colors.white('▶️  Health Check')}`);
    const response = await apiCall('/health');
    const passed = response.status === 200;
    logResult('Health Check', passed, `Status: ${response.status}`);
    return passed;
}

async function testLogin() {
    console.log(`\n${colors.white('▶️  Login Tests')}`);
    let allPassed = true;

    // Admin Login
    const adminLogin = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
    });

    if (adminLogin.status === 200 && adminLogin.data?.token) {
        tokens.admin = adminLogin.data.token;
        logResult('Admin Login', true, 'admin@example.com');
    } else {
        logResult('Admin Login', false, `Status: ${adminLogin.status}`);
        allPassed = false;
    }

    // Analyst Login
    const analystLogin = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'jane@example.com', password: 'password123' })
    });

    if (analystLogin.status === 200 && analystLogin.data?.token) {
        tokens.analyst = analystLogin.data.token;
        logResult('Analyst Login', true, 'jane@example.com');
    } else {
        logResult('Analyst Login', false, `Status: ${analystLogin.status}`);
        allPassed = false;
    }

    // Viewer Login
    const viewerLogin = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'john@example.com', password: 'password123' })
    });

    if (viewerLogin.status === 200 && viewerLogin.data?.token) {
        tokens.viewer = viewerLogin.data.token;
        logResult('Viewer Login', true, 'john@example.com');
    } else {
        logResult('Viewer Login', false, `Status: ${viewerLogin.status}`);
        allPassed = false;
    }

    return allPassed;
}

async function testCreateRecord() {
    console.log(`\n${colors.white('▶️  Create Financial Records')}`);
    let allPassed = true;

    // Admin creates record
    const adminRecord = {
        amount: 5000,
        type: 'income',
        category: 'Salary',
        description: 'Test salary record'
    };

    const adminCreate = await apiCall('/records', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokens.admin}` },
        body: JSON.stringify(adminRecord)
    });

    if (adminCreate.status === 201) {
        testRecordId = adminCreate.data?.data?.record?._id;
        logResult('Admin Creates Record', true, `ID: ${testRecordId}`);
    } else {
        logResult('Admin Creates Record', false, `Status: ${adminCreate.status}`);
        allPassed = false;
    }

    // Viewer tries to create (should fail)
    const viewerRecord = { amount: 100, type: 'expense', category: 'Food' };
    const viewerCreate = await apiCall('/records', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokens.viewer}` },
        body: JSON.stringify(viewerRecord)
    });

    const viewerDenied = viewerCreate.status === 403;
    logResult('Viewer Cannot Create', viewerDenied, 'Correctly denied');
    if (!viewerDenied) allPassed = false;

    return allPassed;
}

async function testGetRecords() {
    console.log(`\n${colors.white('▶️  Get Financial Records')}`);

    const response = await apiCall('/records?page=1&limit=5', {
        headers: { Authorization: `Bearer ${tokens.admin}` }
    });

    const passed = response.status === 200;
    if (passed) {
        const count = response.data?.results || 0;
        logResult('Get Records', true, `Found ${count} records`);
    } else {
        logResult('Get Records', false, `Status: ${response.status}`);
    }
    return passed;
}

async function testUpdateRecord() {
    console.log(`\n${colors.white('▶️  Update Record (Admin Only)')}`);

    if (!testRecordId) {
        console.log(`  ${colors.yellow('⚠️')} No test record, skipping`);
        return true;
    }

    const update = await apiCall(`/records/${testRecordId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${tokens.admin}` },
        body: JSON.stringify({ amount: 5500, description: 'Updated' })
    });

    const passed = update.status === 200;
    logResult('Admin Updates Record', passed);
    return passed;
}

async function testDashboard() {
    console.log(`\n${colors.white('▶️  Dashboard Endpoints')}`);
    let allPassed = true;

    // Summary
    const summary = await apiCall('/dashboard/summary', {
        headers: { Authorization: `Bearer ${tokens.admin}` }
    });

    if (summary.status === 200) {
        const { totalIncome, totalExpenses, netBalance } = summary.data?.data?.summary || {};
        logResult('Dashboard Summary', true, `Income: $${totalIncome}, Expenses: $${totalExpenses}, Net: $${netBalance}`);
    } else {
        logResult('Dashboard Summary', false);
        allPassed = false;
    }

    // Category totals
    const categories = await apiCall('/dashboard/category-totals?type=expense', {
        headers: { Authorization: `Bearer ${tokens.admin}` }
    });

    const categoriesPassed = categories.status === 200;
    logResult('Category Totals', categoriesPassed);
    if (!categoriesPassed) allPassed = false;

    // Monthly trends
    const trends = await apiCall('/dashboard/monthly-trends', {
        headers: { Authorization: `Bearer ${tokens.admin}` }
    });

    const trendsPassed = trends.status === 200;
    logResult('Monthly Trends', trendsPassed);
    if (!trendsPassed) allPassed = false;

    return allPassed;
}

async function testDeleteRecord() {
    console.log(`\n${colors.white('▶️  Delete Record')}`);

    if (!testRecordId) {
        console.log(`  ${colors.yellow('⚠️')} No test record, skipping`);
        return true;
    }

    const deleteRecord = await apiCall(`/records/${testRecordId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tokens.admin}` }
    });

    const passed = deleteRecord.status === 204;
    logResult('Admin Deletes Record', passed);
    return passed;
}

async function testErrorHandling() {
    console.log(`\n${colors.white('▶️  Error Handling')}`);
    let allPassed = true;

    // Invalid login
    const invalidLogin = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'wrong@email.com', password: 'wrong' })
    });

    const invalidPassed = invalidLogin.status === 401;
    logResult('Invalid Login', invalidPassed, 'Returns 401');
    if (!invalidPassed) allPassed = false;

    // No token
    const noToken = await apiCall('/records');
    const noTokenPassed = noToken.status === 401;
    logResult('No Token', noTokenPassed, 'Returns 401');
    if (!noTokenPassed) allPassed = false;

    return allPassed;
}

async function runTests() {
    console.log(`\n${colors.yellow('🚀 RUNNING API TESTS')}`);
    console.log(`${colors.yellow(`📍 Target: ${BASE_URL}`)}`);
    console.log(`${colors.yellow(`⏰ Time: ${new Date().toLocaleString()}`)}`);

    // Check server
    const serverRunning = await testHealthCheck();
    if (!serverRunning) {
        console.log(`\n${colors.red('❌ Server not running! Please start with: npm run dev')}\n`);
        process.exit(1);
    }

    // Run tests
    const loginPassed = await testLogin();
    if (!loginPassed) {
        console.log(`\n${colors.red('❌ Login failed. Check if server is running correctly')}\n`);
        process.exit(1);
    }

    await testCreateRecord();
    await testGetRecords();
    await testUpdateRecord();
    await testDashboard();
    await testErrorHandling();
    await testDeleteRecord();

    // Summary
    console.log(`\n${colors.cyan('='.repeat(70))}`);
    console.log(`${colors.yellow('📊 TEST SUMMARY')}`);
    console.log(`${colors.cyan('='.repeat(70))}`);
    console.log(`${colors.green(`✅ Passed: ${testsPassed}`)}`);
    console.log(`${colors.red(`❌ Failed: ${testsFailed}`)}`);
    console.log(`${colors.cyan(`📈 Total: ${testsPassed + testsFailed}`)}`);
    console.log(`${colors.cyan(`📊 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(2)}%`)}`);
    console.log(`${colors.cyan('='.repeat(70))}\n`);

    process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(console.error);