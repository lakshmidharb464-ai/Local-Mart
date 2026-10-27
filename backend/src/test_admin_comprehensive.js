import app from './app.js';
import http from 'http';

async function runAdminComprehensiveCheck() {
  const server = http.createServer(app);
  const PORT = 5098;
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`\n=============================================================`);
  console.log(`🔎 ADMIN PIN-TO-PIN DATAFLOW TEST ON http://localhost:${PORT}`);
  console.log(`=============================================================\n`);

  const BASE = `http://localhost:${PORT}/api`;
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${message}`);
    }
  }

  try {
    // 1. Admin Login
    console.log('[1] Logging in as Admin...');
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@localfarmdirect.in', password: 'password123', role: 'Admin' }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Admin login succeeded (200 OK)');
    assert(loginData.user?.role === 'Admin', 'Admin role verified in token payload');
    const token = loginData.token;
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    // 2. Metrics & Reports
    console.log('\n[2] Checking Platform Metrics & BI Reports...');
    const metricsRes = await fetch(`${BASE}/admin/metrics`, { headers });
    const metricsData = await metricsRes.json();
    assert(metricsRes.status === 200 && metricsData.metrics, 'GET /admin/metrics returns metrics payload');

    const reportsRes = await fetch(`${BASE}/admin/reports`, { headers });
    const reportsData = await reportsRes.json();
    assert(reportsRes.status === 200 && reportsData.reports?.monthlySales?.length > 0, 'GET /admin/reports returns monthlySales');
    assert(reportsData.reports?.topProducts !== undefined, 'Reports include topProducts dataflow');
    assert(reportsData.reports?.farmerPerformers !== undefined, 'Reports include farmerPerformers leaderboard');

    // 3. Products Endpoints
    console.log('\n[3] Checking Products Catalog & Moderation Pin-to-Pin...');
    const getProdsRes = await fetch(`${BASE}/admin/products`, { headers });
    const prodsData = await getProdsRes.json();
    assert(getProdsRes.status === 200 && Array.isArray(prodsData.products), 'GET /admin/products returns product array');

    const newProdRes = await fetch(`${BASE}/admin/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Test Golden Papaya',
        price: 45,
        unit: '1 kg',
        stock: 80,
        category: 'fruits',
        isOrganic: true,
      }),
    });
    const newProdData = await newProdRes.json();
    assert(newProdRes.status === 201 && newProdData.product?.id, 'POST /admin/products creates product successfully');
    const testProdId = newProdData.product?.id;

    const modProdRes = await fetch(`${BASE}/admin/products/${testProdId}/moderate`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'Approved', remark: 'Verified fresh stock' }),
    });
    const modProdData = await modProdRes.json();
    assert(modProdRes.status === 200 && modProdData.success, 'PATCH /admin/products/:id/moderate approves product');

    const delProdRes = await fetch(`${BASE}/admin/products/${testProdId}`, {
      method: 'DELETE',
      headers,
    });
    assert(delProdRes.status === 200, 'DELETE /admin/products/:id cleans up product successfully');

    // 4. Orders Endpoints
    console.log('\n[4] Checking Orders Fulfillment & Dispatch Pin-to-Pin...');
    const ordersRes = await fetch(`${BASE}/admin/orders`, { headers });
    const ordersData = await ordersRes.json();
    assert(ordersRes.status === 200 && Array.isArray(ordersData.orders), 'GET /admin/orders returns orders array');

    if (ordersData.orders.length > 0) {
      const orderId = ordersData.orders[0].id;
      const statusRes = await fetch(`${BASE}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: 'Packed' }),
      });
      assert(statusRes.status === 200, `PATCH /admin/orders/:id/status updates status for ${orderId}`);
    }

    // 5. Farmers Management
    console.log('\n[5] Checking Farmer Management Pin-to-Pin...');
    const farmersRes = await fetch(`${BASE}/admin/farmers`, { headers });
    const farmersData = await farmersRes.json();
    assert(farmersRes.status === 200 && Array.isArray(farmersData.farmers), 'GET /admin/farmers returns farmer list');

    const testFarmerEmail = `temp.farmer.${Date.now()}@localfarm.in`;
    const createFarmerRes = await fetch(`${BASE}/admin/farmers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Ramesh Patel',
        email: testFarmerEmail,
        phone: '+91 97777 66666',
        password: 'password123',
        farmName: 'Patel Bio Farm',
        location: 'Pune Rural Hub',
        experience: '8 Years',
        specialty: 'Seasonal Organic Veggies',
        badge: 'Certified Producer',
        approvalStatus: 'Approved',
        accountStatus: 'Active',
      }),
    });
    const createFarmerData = await createFarmerRes.json();
    assert(createFarmerRes.status === 201 && createFarmerData.farmer?.id, 'POST /admin/farmers onboards farmer');
    const createdFarmerId = createFarmerData.farmer?.id;

    const verifyFarmerRes = await fetch(`${BASE}/admin/farmers/${createdFarmerId}/verify`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ accountStatus: 'Inactive', isActive: false }),
    });
    assert(verifyFarmerRes.status === 200, 'PATCH /admin/farmers/:id/verify toggles farmer active state');

    const delFarmerRes = await fetch(`${BASE}/admin/farmers/${createdFarmerId}`, {
      method: 'DELETE',
      headers,
    });
    assert(delFarmerRes.status === 200, 'DELETE /admin/farmers/:id removes farmer cleanly without FK error');

    // 6. Customers Management
    console.log('\n[6] Checking Customer Management Pin-to-Pin...');
    const custRes = await fetch(`${BASE}/admin/customers`, { headers });
    const custData = await custRes.json();
    assert(custRes.status === 200 && Array.isArray(custData.customers), 'GET /admin/customers returns customers list');

    const testCustEmail = `temp.cust.${Date.now()}@gmail.com`;
    const createCustRes = await fetch(`${BASE}/admin/customers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Nidhi Gupta',
        email: testCustEmail,
        phone: '+91 91111 22222',
        address: 'Kothrud, Pune',
        status: 'Active',
      }),
    });
    const createCustData = await createCustRes.json();
    assert(createCustRes.status === 201 && createCustData.customer?.id, 'POST /admin/customers registers customer');
    const createdCustId = createCustData.customer?.id;

    const setCustStatusRes = await fetch(`${BASE}/admin/customers/${createdCustId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'Inactive', isActive: false }),
    });
    assert(setCustStatusRes.status === 200, 'PATCH /admin/customers/:id/status toggles status');

    const delCustRes = await fetch(`${BASE}/admin/customers/${createdCustId}`, {
      method: 'DELETE',
      headers,
    });
    assert(delCustRes.status === 200, 'DELETE /admin/customers/:id removes customer cleanly without FK error');

    // 7. Delivery Partners Management
    console.log('\n[7] Checking Delivery Partners Fleet Management Pin-to-Pin...');
    const fleetRes = await fetch(`${BASE}/admin/delivery-partners`, { headers });
    const fleetData = await fleetRes.json();
    assert(fleetRes.status === 200 && Array.isArray(fleetData.fleet), 'GET /admin/delivery-partners returns fleet list');

    const testRiderEmail = `temp.rider.${Date.now()}@localfarm.in`;
    const createRiderRes = await fetch(`${BASE}/admin/delivery-partners`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Manoj Kumar',
        email: testRiderEmail,
        phone: '+91 93333 44444',
        vehicleType: 'EV Scooter (Ather 450X)',
        vehicleNumber: 'MH-12-EV-4422',
        licenseNumber: 'DL-MH12-20240011',
        approvalStatus: 'Approved',
        accountStatus: 'Active',
      }),
    });
    const createRiderData = await createRiderRes.json();
    assert(createRiderRes.status === 201 && (createRiderData.rider || createRiderData.partner)?.id, 'POST /admin/delivery-partners onboards rider');
    const createdRiderId = (createRiderData.rider || createRiderData.partner)?.id;

    const setRiderStatusRes = await fetch(`${BASE}/admin/delivery-partners/${createdRiderId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ approvalStatus: 'Inactive', isActive: false }),
    });
    assert(setRiderStatusRes.status === 200, 'PATCH /admin/delivery-partners/:id/status toggles status');

    const delRiderRes = await fetch(`${BASE}/admin/delivery-partners/${createdRiderId}`, {
      method: 'DELETE',
      headers,
    });
    assert(delRiderRes.status === 200, 'DELETE /admin/delivery-partners/:id removes rider cleanly without FK error');

    // 8. Settings & KYC & Audit Logs
    console.log('\n[8] Checking System Settings, KYC Queue & Audit Logs...');
    const settingsRes = await fetch(`${BASE}/admin/settings`, { headers });
    const settingsData = await settingsRes.json();
    assert(settingsRes.status === 200 && settingsData.settings?.storeName !== undefined, 'GET /admin/settings returns storeName');

    const updateSettingsRes = await fetch(`${BASE}/admin/settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        marketplace: { storeName: 'Local Farm Direct', deliveryFee: 30, minOrderAmount: 100 },
      }),
    });
    assert(updateSettingsRes.status === 200, 'PUT /admin/settings saves settings');

    const kycRes = await fetch(`${BASE}/admin/kyc-queue`, { headers });
    const kycData = await kycRes.json();
    assert(kycRes.status === 200 && Array.isArray(kycData.queue), 'GET /admin/kyc-queue returns queue array');
    if (kycData.queue.length > 0) {
      assert(kycData.queue[0].docType !== undefined, 'KYC item has camelCase docType mapped');
      assert(kycData.queue[0].farmer !== undefined, 'KYC item has camelCase farmer mapped');
      assert(kycData.queue[0].fileName !== undefined, 'KYC item has camelCase fileName mapped');
    }

    const auditRes = await fetch(`${BASE}/admin/audit-logs`, { headers });
    const auditData = await auditRes.json();
    assert(auditRes.status === 200 && Array.isArray(auditData.logs), 'GET /admin/audit-logs returns audit logs array');
    if (auditData.logs.length > 0) {
      assert(auditData.logs[0].timestamp !== undefined, 'Audit item has formatted timestamp mapped');
      assert(auditData.logs[0].admin !== undefined, 'Audit item has admin name mapped');
    }

    console.log(`\n=============================================================`);
    console.log(`🎉 COMPREHENSIVE ADMIN DATAFLOW CHECK: ${passed}/${total} TESTS PASSED!`);
    console.log(`=============================================================\n`);
  } catch (err) {
    console.error('Fatal error during admin check:', err);
  } finally {
    server.close();
    process.exit(passed === total ? 0 : 1);
  }
}

runAdminComprehensiveCheck();
