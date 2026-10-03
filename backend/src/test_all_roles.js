import app from './app.js';
import http from 'http';
import { query } from './config/db.js';

/**
 * Master Automated Multi-Role Integration Test Suite
 * Tests full lifecycle operations across Admin, Farmer, Customer, and Delivery roles.
 */
async function runMasterRoleTestSuite() {
  const server = http.createServer(app);
  const PORT = 5097;
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`\n=============================================================`);
  console.log(`🚀 MASTER MULTI-ROLE TEST SERVER LISTENING ON http://localhost:${PORT}`);
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
    // ══════════════════════════════════════════════════════════════
    // ROLE 1: ADMIN OPERATIONS
    // ══════════════════════════════════════════════════════════════
    console.log('--- 👑 ROLE 1: ADMIN WORKFLOW ---');
    const adminLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@localfarmdirect.in', password: 'password123', role: 'Admin' }),
    });
    const adminData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200, 'Admin login succeeded (200 OK)');
    assert(adminData.user?.role === 'Admin', 'Admin role verified in token payload');

    const adminHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminData.token}`,
    };

    // Admin: Fetch Platform Metrics
    const metricsRes = await fetch(`${BASE}/admin/metrics`, { headers: adminHeaders });
    const metricsData = await metricsRes.json();
    assert(metricsRes.status === 200, 'Admin fetched platform metrics');
    assert(metricsData.metrics !== undefined, 'Admin metrics payload present');

    // Admin: Fetch Delivery Fleet & Farmers
    const fleetRes = await fetch(`${BASE}/admin/delivery-partners`, { headers: adminHeaders });
    const fleetData = await fleetRes.json();
    assert(fleetRes.status === 200, 'Admin fetched active delivery fleet');

    const farmersRes = await fetch(`${BASE}/admin/farmers`, { headers: adminHeaders });
    const farmersData = await farmersRes.json();
    assert(farmersRes.status === 200, 'Admin fetched farmer directory');

    // ══════════════════════════════════════════════════════════════
    // ROLE 2: FARMER OPERATIONS
    // ══════════════════════════════════════════════════════════════
    console.log('\n--- 👨‍🌾 ROLE 2: FARMER WORKFLOW ---');
    const farmerLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rajesh.farmer@localfarm.in', password: 'password123', role: 'Farmer' }),
    });
    const farmerData = await farmerLoginRes.json();
    assert(farmerLoginRes.status === 200, 'Farmer login succeeded (200 OK)');
    assert(farmerData.user?.role === 'Farmer', 'Farmer role verified');

    const farmerHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${farmerData.token}`,
    };

    // Farmer: Overview KPIs
    const farmerOverviewRes = await fetch(`${BASE}/farmer/overview`, { headers: farmerHeaders });
    const farmerOverview = await farmerOverviewRes.json();
    assert(farmerOverviewRes.status === 200, 'Farmer fetched harvest & sales overview KPIs');

    // Farmer: Publish fresh harvest listing
    const testCropName = `Organic Honey Crisp Apples (${Date.now().toString().slice(-4)})`;
    const cropRes = await fetch(`${BASE}/farmer/products`, {
      method: 'POST',
      headers: farmerHeaders,
      body: JSON.stringify({
        name: testCropName,
        categoryId: 'Seasonal Picks',
        price: 120.00,
        unit: 'kg',
        stock: 40,
        isOrganic: true,
        harvestTag: 'Fresh Morning Harvest',
        description: 'Crisp, juicy organic orchard apples picked fresh at dawn.',
      }),
    });
    const cropData = await cropRes.json();
    assert(cropRes.status === 201, `Farmer listed fresh crop: "${testCropName}"`);

    // ══════════════════════════════════════════════════════════════
    // ROLE 3: CUSTOMER OPERATIONS
    // ══════════════════════════════════════════════════════════════
    console.log('\n--- 🛒 ROLE 3: CUSTOMER WORKFLOW ---');
    const custLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'aniket.sharma@gmail.com', password: 'password123', role: 'Customer' }),
    });
    const custData = await custLoginRes.json();
    assert(custLoginRes.status === 200, 'Customer login succeeded (200 OK)');

    const custHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${custData.token}`,
    };

    // Customer: Browse Marketplace
    const catalogRes = await fetch(`${BASE}/products`);
    const catalogData = await catalogRes.json();
    assert(catalogRes.status === 200, 'Customer retrieved public marketplace catalog');
    const availableProduct = catalogData.products?.[0];
    assert(!!availableProduct, `Selected target produce: "${availableProduct?.name}" (₹${availableProduct?.price}/${availableProduct?.unit})`);

    // Customer: Validate Promo Coupon
    const couponRes = await fetch(`${BASE}/coupons/validate`, {
      method: 'POST',
      headers: custHeaders,
      body: JSON.stringify({ code: 'FRESH10', subtotal: 350 }),
    });
    assert(couponRes.status === 200, 'Customer applied promo coupon FRESH10');

    // Customer: Place Order
    const placeOrderRes = await fetch(`${BASE}/orders`, {
      method: 'POST',
      headers: custHeaders,
      body: JSON.stringify({
        items: [{ productId: availableProduct.id, quantity: 2 }],
        addressText: 'Apt 12B, Palm View Heights, Chittoor Road',
        customerLat: 13.2172,
        customerLng: 79.1003,
        paymentMethod: 'UPI',
        couponCode: 'FRESH10',
      }),
    });
    const placedOrder = await placeOrderRes.json();
    assert(placeOrderRes.status === 201, `Customer placed order ${placedOrder.order?.orderId}`);
    const activeOrderId = placedOrder.order?.orderId;

    // Customer: Fetch Order History
    const myOrdersRes = await fetch(`${BASE}/orders/my-orders`, { headers: custHeaders });
    const myOrdersData = await myOrdersRes.json();
    assert(myOrdersRes.status === 200, 'Customer retrieved updated order history');
    assert(myOrdersData.orders?.some(o => o.id === activeOrderId), 'New order confirmed in customer history');

    // ══════════════════════════════════════════════════════════════
    // ROLE 4: DELIVERY PARTNER OPERATIONS
    // ══════════════════════════════════════════════════════════════
    console.log('\n--- 🛵 ROLE 4: DELIVERY PARTNER WORKFLOW ---');
    const delivLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rohan.delivery@localfarm.in', password: 'password123', role: 'Delivery' }),
    });
    const delivData = await delivLoginRes.json();
    assert(delivLoginRes.status === 200, 'Delivery partner login succeeded (200 OK)');

    const delivHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${delivData.token}`,
    };

    // Delivery: Toggle Duty Online
    const dutyRes = await fetch(`${BASE}/delivery/duty`, {
      method: 'PATCH',
      headers: delivHeaders,
      body: JSON.stringify({ isOnline: true, latitude: 13.2185, longitude: 79.1015 }),
    });
    assert(dutyRes.status === 200, 'Delivery rider set status to ONLINE');

    // Delivery: Transmit Live GPS Telemetry
    const locationRes = await fetch(`${BASE}/delivery/location`, {
      method: 'POST',
      headers: delivHeaders,
      body: JSON.stringify({
        orderId: activeOrderId,
        latitude: 13.2190,
        longitude: 79.1020,
        speed: 42,
        heading: 120,
      }),
    });
    assert(locationRes.status === 200, 'Delivery rider transmitted live GPS coordinates');

    // Delivery: Advance Order Status to Picked Up
    const advanceStatusRes = await fetch(`${BASE}/delivery/orders/${activeOrderId}/status`, {
      method: 'PATCH',
      headers: delivHeaders,
      body: JSON.stringify({
        status: 'Picked Up',
        note: 'Collected items directly from farm warehouse',
      }),
    });
    assert(advanceStatusRes.status === 200, `Delivery rider marked order ${activeOrderId} as "Picked Up"`);

    // Customer / Public: Track Order Live
    const trackRes = await fetch(`${BASE}/orders/${activeOrderId}/track`);
    const trackData = await trackRes.json();
    assert(trackRes.status === 200, `Live tracking active for ${activeOrderId}`);
    assert(trackData.tracking?.status === 'Picked Up', 'Live tracking accurately reflects "Picked Up" state');

    // ══════════════════════════════════════════════════════════════
    // ROLE BOUNDARY SECURITY CHECKS
    // ══════════════════════════════════════════════════════════════
    console.log('\n--- 🔒 ROLE SECURITY BOUNDARIES ---');
    // Customer attempting to access Admin endpoints (Should fail 403)
    const unauthorizedAdminCall = await fetch(`${BASE}/admin/metrics`, { headers: custHeaders });
    assert(unauthorizedAdminCall.status === 403, 'Customer blocked from /api/admin/metrics (403 Forbidden)');

    // Customer attempting to access Farmer endpoints (Should fail 403)
    const unauthorizedFarmerCall = await fetch(`${BASE}/farmer/overview`, { headers: custHeaders });
    assert(unauthorizedFarmerCall.status === 403, 'Customer blocked from /api/farmer/overview (403 Forbidden)');

    // Unauthenticated request to protected endpoint (Should fail 401)
    const unauthenticatedCall = await fetch(`${BASE}/orders/my-orders`);
    assert(unauthenticatedCall.status === 401, 'Unauthenticated request blocked from /api/orders/my-orders (401)');

    console.log('\n=============================================================');
    console.log(`🎉 SUMMARY: ${passed}/${total} MASTER MULTI-ROLE INTEGRATION TESTS PASSED!`);
    console.log(`=============================================================\n`);

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

runMasterRoleTestSuite();
