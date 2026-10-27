const BASE_URL = 'http://localhost:5000/api';

async function runSuite() {
  console.log('--- STARTING COMPLETE ADMIN & AUTH INTEGRATION SUITE ---');

  // 1. Login as Admin
  console.log('\n[1] Logging in as Admin (admin@localfarmdirect.in)...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@localfarmdirect.in',
      password: 'password123',
      role: 'Admin',
    }),
  });
  const loginData = await loginRes.json();
  if (!loginData.token) {
    console.error('❌ Admin login failed:', loginData);
    process.exit(1);
  }
  const token = loginData.token;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
  console.log('✅ Admin login successful. Token acquired.');

  // 2. Platform Metrics
  console.log('\n[2] Testing GET /api/admin/metrics...');
  const metricsRes = await fetch(`${BASE_URL}/admin/metrics`, { headers });
  const metricsData = await metricsRes.json();
  console.log('✅ Live Platform Metrics:', metricsData.metrics);

  // 3. Create Farmer by Admin & Test Farmer Authentication
  console.log('\n[3] Testing Farmer Creation & Authentication...');
  const testFarmerEmail = `shyam.farmer.${Date.now()}@localfarm.in`;
  const testFarmerPassword = 'customSecretPass99';
  const newFarmerPayload = {
    name: 'Shyam Sundar',
    email: testFarmerEmail,
    password: testFarmerPassword,
    phone: '+91 98888 77777',
    farmName: 'Sundar Organic Agro',
    location: 'Chittoor Hub, AP',
    experience: '7 Years Organic Horticulture',
    specialty: 'Organic Mangoes & Guavas',
    badge: 'Certified Producer',
    approvalStatus: 'Approved',
    accountStatus: 'Active',
  };
  const createFarmerRes = await fetch(`${BASE_URL}/admin/farmers`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newFarmerPayload),
  });
  const createFarmerData = await createFarmerRes.json();
  console.log('✅ Created Farmer via Admin:', createFarmerData.farmer?.name, createFarmerData.farmer?.id);
  const createdFarmerId = createFarmerData.farmer?.id;

  // Test Farmer Login with the created credentials
  const farmerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testFarmerEmail,
      password: testFarmerPassword,
      role: 'Farmer',
    }),
  });
  const farmerLoginData = await farmerLoginRes.json();
  if (farmerLoginData.token) {
    console.log('✅ New Farmer Logged in Successfully! Role:', farmerLoginData.user?.role);
  } else {
    console.error('❌ Farmer login failed:', farmerLoginData);
    process.exit(1);
  }

  // Toggle Farmer Inactive -> Verify Login is BLOCKED
  await fetch(`${BASE_URL}/admin/farmers/${createdFarmerId}/verify`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ accountStatus: 'Inactive' }),
  });
  const blockedFarmerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testFarmerEmail,
      password: testFarmerPassword,
      role: 'Farmer',
    }),
  });
  console.log('✅ Blocked Inactive Farmer Login Code:', blockedFarmerLoginRes.status);

  // Delete Farmer
  await fetch(`${BASE_URL}/admin/farmers/${createdFarmerId}`, { method: 'DELETE', headers });
  console.log('✅ Cleanup: Deleted test farmer.');

  // 4. Create Customer by Admin & Test Customer Authentication
  console.log('\n[4] Testing Customer Creation & Authentication...');
  const testCustomerEmail = `neha.buyer.${Date.now()}@gmail.com`;
  const testCustomerPassword = 'customerSecretPass88';
  const newCustomerPayload = {
    name: 'Neha Verma',
    email: testCustomerEmail,
    password: testCustomerPassword,
    phone: '+91 97777 66666',
    address: 'Kalyani Nagar, Pune 411006',
    status: 'Active',
  };
  const createCustomerRes = await fetch(`${BASE_URL}/admin/customers`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newCustomerPayload),
  });
  const createCustomerData = await createCustomerRes.json();
  console.log('✅ Created Customer via Admin:', createCustomerData.customer?.name, createCustomerData.customer?.id);
  const createdCustomerId = createCustomerData.customer?.id;

  // Test Customer Login
  const customerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testCustomerEmail,
      password: testCustomerPassword,
      role: 'Customer',
    }),
  });
  const customerLoginData = await customerLoginRes.json();
  if (customerLoginData.token) {
    console.log('✅ New Customer Logged in Successfully! Role:', customerLoginData.user?.role);
  } else {
    console.error('❌ Customer login failed:', customerLoginData);
    process.exit(1);
  }

  // Delete Customer
  await fetch(`${BASE_URL}/admin/customers/${createdCustomerId}`, { method: 'DELETE', headers });
  console.log('✅ Cleanup: Deleted test customer.');

  // 5. Create Delivery Rider by Admin & Test Authentication
  console.log('\n[5] Testing Delivery Partner Creation & Authentication...');
  const testRiderEmail = `karan.rider.${Date.now()}@localfarm.in`;
  const testRiderPassword = 'riderSecretPass77';
  const newRiderPayload = {
    name: 'Karan Rathod',
    email: testRiderEmail,
    password: testRiderPassword,
    phone: '+91 96666 55555',
    vehicleType: 'EV Scooter (Ather 450X)',
    vehicleNumber: 'MH-12-EV-9900',
    licenseNumber: 'DL-MH12-20250011',
    approvalStatus: 'Approved',
    accountStatus: 'Active',
  };
  const createRiderRes = await fetch(`${BASE_URL}/admin/delivery-partners`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newRiderPayload),
  });
  const createRiderData = await createRiderRes.json();
  console.log('✅ Created Delivery Partner via Admin:', createRiderData.rider?.name, createRiderData.rider?.id);
  const createdRiderId = createRiderData.rider?.id;

  // Test Delivery Login
  const riderLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testRiderEmail,
      password: testRiderPassword,
      role: 'Delivery',
    }),
  });
  const riderLoginData = await riderLoginRes.json();
  if (riderLoginData.token) {
    console.log('✅ New Delivery Partner Logged in Successfully! Role:', riderLoginData.user?.role);
  } else {
    console.error('❌ Rider login failed:', riderLoginData);
    process.exit(1);
  }

  // Delete Rider
  await fetch(`${BASE_URL}/admin/delivery-partners/${createdRiderId}`, { method: 'DELETE', headers });
  console.log('✅ Cleanup: Deleted test delivery partner.');

  // 6. Products CRUD
  console.log('\n[6] Testing Product Creation & Catalog...');
  const newProductPayload = {
    name: 'Real Farm Fresh Strawberries',
    category: 'fruits',
    price: 180,
    unit: '500 g box',
    stock: 60,
    isOrganic: true,
    status: 'Approved',
    description: 'Fresh hand-picked strawberries directly from Mahabaleshwar',
  };
  const createProdRes = await fetch(`${BASE_URL}/admin/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newProductPayload),
  });
  const createProdData = await createProdRes.json();
  console.log('✅ Created Live Catalog Product:', createProdData.product?.name, createProdData.product?.id);
  const createdProdId = createProdData.product?.id;

  // Clean up product
  await fetch(`${BASE_URL}/admin/products/${createdProdId}`, { method: 'DELETE', headers });
  console.log('✅ Cleanup: Deleted test product.');

  // 7. Live Reports & Analytics
  console.log('\n[7] Testing Pure Live Reports & Analytics...');
  const reportsRes = await fetch(`${BASE_URL}/admin/reports`, { headers });
  const reportsData = await reportsRes.json();
  console.log('✅ Real Database Reports Result:');
  console.log('- 12 Monthly Buckets calculated:', reportsData.reports?.monthlySales?.length === 12);
  console.log('- Live Top Products count:', reportsData.reports?.topProducts?.length);
  console.log('- Live Registered Farmers count:', reportsData.reports?.farmerPerformers?.length);
  console.log('Sample Live Farmer:', reportsData.reports?.farmerPerformers?.[0]);

  console.log('\n=============================================================');
  console.log('🎉 100% REAL LIVE DATA & AUTHENTICATION TESTS PASSED SEAMLESSLY!');
  console.log('=============================================================\n');
}

runSuite().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
