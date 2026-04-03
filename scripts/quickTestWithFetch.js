// scripts/quickTestWithFetch.js
// Quick smoke test using native fetch

const BASE_URL = 'http://localhost:3000/api';

async function quickTest() {
    console.log('\n🚀 Quick API Smoke Test\n');

    let token = '';

    try {
        // 1. Health Check
        console.log('1. Testing Health Check...');
        const healthRes = await fetch(`${BASE_URL}/health`);
        const health = await healthRes.json();
        if (health.status === 'success') {
            console.log('   ✅ Server is healthy\n');
        } else {
            throw new Error('Health check failed');
        }

        // 2. Admin Login
        console.log('2. Testing Admin Login...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });
        const login = await loginRes.json();
        token = login.token;
        console.log(`   ✅ Logged in as: ${login.data.user.name}\n`);

        // 3. Dashboard Summary
        console.log('3. Testing Dashboard Summary...');
        const dashRes = await fetch(`${BASE_URL}/dashboard/summary`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const dashboard = await dashRes.json();
        const { totalIncome, totalExpenses, netBalance } = dashboard.data.summary;
        console.log(`   ✅ Income: $${totalIncome}`);
        console.log(`   ✅ Expenses: $${totalExpenses}`);
        console.log(`   ✅ Net Balance: $${netBalance}\n`);

        // 4. Create Record
        console.log('4. Testing Record Creation...');
        const createRes = await fetch(`${BASE_URL}/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                amount: 1000,
                type: 'income',
                category: 'Test Income',
                description: 'Automated test'
            })
        });
        const record = await createRes.json();
        const recordId = record.data.record._id;
        console.log(`   ✅ Record created: ${recordId}\n`);

        // 5. Get Records
        console.log('5. Testing Get Records...');
        const recordsRes = await fetch(`${BASE_URL}/records?page=1&limit=5`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const records = await recordsRes.json();
        console.log(`   ✅ Found ${records.results} records\n`);

        // 6. Category Analysis
        console.log('6. Testing Category Analysis...');
        const catRes = await fetch(`${BASE_URL}/dashboard/category-totals?type=expense`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const categories = await catRes.json();
        console.log(`   ✅ Found ${categories.results} expense categories\n`);

        // 7. Delete Test Record
        console.log('7. Cleaning up test record...');
        const deleteRes = await fetch(`${BASE_URL}/records/${recordId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (deleteRes.status === 204) {
            console.log('   ✅ Test record deleted\n');
        }

        console.log('✅ All quick tests passed!\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

quickTest();