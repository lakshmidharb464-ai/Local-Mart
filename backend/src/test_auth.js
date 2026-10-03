import app from './app.js';
import http from 'http';
import { query } from './config/db.js';

async function runLiveAuthTests() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, resolve));
  console.log('🚀 Test server listening on http://localhost:5099');

  const BASE = 'http://localhost:5099/api';
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition, message) {
    totalCount++;
    if (condition) {
      console.log('  ✅ ' + message);
      passedCount++;
    } else {
      console.error('  ❌ FAILED: ' + message);
    }
  }

  try {
    // TEST 1: Login Admin
    console.log('\n--- 1. Testing Admin Login ---');
    const adminRes = await fetch(BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@localfarmdirect.in', password: 'password123', role: 'Admin' })
    });
    const adminData = await adminRes.json();
    assert(adminRes.status === 200, 'Admin login status 200');
    assert(adminData.user?.role === 'Admin', 'Admin user role is Admin');
    assert(!!adminData.token, 'Admin token returned');

    const [adminDb] = await query('SELECT auth_token FROM users WHERE email = ?', ['admin@localfarmdirect.in']);
    assert(adminDb.auth_token === adminData.token, 'Admin token saved in MySQL database');

    // TEST 2: Login Farmer & Call Protected Endpoint
    console.log('\n--- 2. Testing Farmer Login & Protected Route ---');
    const farmerRes = await fetch(BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rajesh.farmer@localfarm.in', password: 'password123', role: 'Farmer' })
    });
    const farmerData = await farmerRes.json();
    assert(farmerRes.status === 200, 'Farmer login status 200');
    assert(farmerData.user?.role === 'Farmer', 'Farmer user role is Farmer');

    // Call /api/farmer/overview with Farmer Token
    const farmerOverviewRes = await fetch(BASE + '/farmer/overview', {
      headers: { Authorization: 'Bearer ' + farmerData.token }
    });
    assert(farmerOverviewRes.status === 200, 'Farmer accessed /api/farmer/overview (200 OK)');

    // Call /api/farmer/overview with Customer Token (Should Fail 403)
    const custRes = await fetch(BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'aniket.sharma@gmail.com', password: 'password123', role: 'Customer' })
    });
    const custData = await custRes.json();
    assert(custRes.status === 200, 'Customer login status 200');

    const custOnFarmerRoute = await fetch(BASE + '/farmer/overview', {
      headers: { Authorization: 'Bearer ' + custData.token }
    });
    assert(custOnFarmerRoute.status === 403, 'Customer blocked from /api/farmer/overview (403 Forbidden)');

    // TEST 3: Login Delivery & Protected Route
    console.log('\n--- 3. Testing Delivery Login & Protected Route ---');
    const deliveryRes = await fetch(BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rohan.delivery@localfarm.in', password: 'password123', role: 'Delivery' })
    });
    const deliveryData = await deliveryRes.json();
    assert(deliveryRes.status === 200, 'Delivery login status 200');
    assert(deliveryData.user?.role === 'Delivery', 'Delivery user role is Delivery');

    // TEST 4: GetMe session verification
    console.log('\n--- 4. Testing /api/auth/me Profile Verification ---');
    const meRes = await fetch(BASE + '/auth/me', {
      headers: { Authorization: 'Bearer ' + deliveryData.token }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, 'GET /api/auth/me returned 200');
    assert(meData.user?.email === 'rohan.delivery@localfarm.in', 'GET /api/auth/me returned correct user');

    // TEST 5: Registration of a new user
    console.log('\n--- 5. Testing New User Registration ---');
    const newEmail = 'live.test.' + Date.now() + '@example.com';
    const regRes = await fetch(BASE + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Live Tester',
        email: newEmail,
        password: 'Password123!',
        role: 'Customer'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, 'Registration status 201 Created');
    assert(regData.user?.email === newEmail, 'Registered user email matches');

    // TEST 6: Logout & Database Token Invalidation
    console.log('\n--- 6. Testing Logout & Token Invalidation in Database ---');
    const logoutRes = await fetch(BASE + '/auth/logout', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + regData.token }
    });
    assert(logoutRes.status === 200, 'Logout status 200 OK');

    const [loggedOutDb] = await query('SELECT auth_token FROM users WHERE email = ?', [newEmail]);
    assert(loggedOutDb.auth_token === null, 'auth_token in MySQL is NULL after logout');

    // Subsequent request with invalidated token should fail with 401
    const invalidReq = await fetch(BASE + '/auth/me', {
      headers: { Authorization: 'Bearer ' + regData.token }
    });
    assert(invalidReq.status === 401, 'Subsequent request with invalidated token returns 401 Unauthorized');

    console.log('\n=============================================');
    console.log('SUMMARY: ' + passedCount + '/' + totalCount + ' Auth Flow Tests PASSED!');
    console.log('=============================================');

  } catch (e) {
    console.error('Test execution error:', e);
  } finally {
    server.close();
    process.exit(0);
  }
}

runLiveAuthTests();
