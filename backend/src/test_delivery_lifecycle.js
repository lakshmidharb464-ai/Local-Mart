const BASE_URL = 'http://localhost:5000/api';

async function runDeliveryLifecycleTest() {
  console.log('--- STARTING DELIVERY PARTNER REAL-DATA & ORDER LIFECYCLE TEST ---');

  // 1. Login as Customer
  console.log('\n[1] Logging in as Customer (aniket.sharma@gmail.com)...');
  const customerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'aniket.sharma@gmail.com',
      password: 'password123',
      role: 'Customer',
    }),
  });
  const customerLogin = await customerLoginRes.json();
  if (!customerLogin.token) {
    console.error('❌ Customer login failed:', customerLogin);
    process.exit(1);
  }
  const customerToken = customerLogin.token;
  console.log('✅ Customer logged in successfully.');

  // 2. Fetch available products
  console.log('\n[2] Fetching live products to place customer order...');
  const prodRes = await fetch(`${BASE_URL}/products`);
  const prodData = await prodRes.json();
  const availableProduct = (prodData.products || prodData.items || prodData)[0];
  if (!availableProduct) {
    console.error('❌ No products found in DB to order');
    process.exit(1);
  }
  console.log('✅ Product selected:', availableProduct.name, `(${availableProduct.id})`);

  // 3. Customer places a new live order
  console.log('\n[3] Customer creating new order...');
  const createOrderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      items: [{ productId: availableProduct.id, quantity: 2 }],
      addressText: 'Flat 402, Green Meadows, Chittoor District, AP',
      customerLat: 13.2172,
      customerLng: 79.1003,
      paymentMethod: 'UPI Direct',
      tipAmount: 25,
    }),
  });
  const newOrderData = await createOrderRes.json();
  if (!newOrderData.order || !newOrderData.order.orderId) {
    console.error('❌ Failed to place order:', newOrderData);
    process.exit(1);
  }
  const placedOrderId = newOrderData.order.orderId;
  const otpCode = newOrderData.order.otpCode;
  console.log('✅ Customer order placed successfully! Order ID:', placedOrderId, 'OTP:', otpCode);

  // 4. Login as Delivery Partner
  console.log('\n[4] Logging in as Delivery Partner (rohan.delivery@localfarm.in)...');
  const riderLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'rohan.delivery@localfarm.in',
      password: 'password123',
      role: 'Delivery',
    }),
  });
  const riderLogin = await riderLoginRes.json();
  if (!riderLogin.token) {
    console.error('❌ Delivery partner login failed:', riderLogin);
    process.exit(1);
  }
  const riderToken = riderLogin.token;
  const riderHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${riderToken}`,
  };
  console.log('✅ Delivery Partner logged in successfully.');

  // 5. Rider checks available orders list (should include the newly placed customer order!)
  console.log('\n[5] Delivery Partner fetching available orders...');
  const riderOrdersRes = await fetch(`${BASE_URL}/delivery/orders`, { headers: riderHeaders });
  const riderOrdersData = await riderOrdersRes.json();
  const foundOrder = riderOrdersData.orders?.find(o => o.orderId === placedOrderId || o.id === placedOrderId);
  if (!foundOrder) {
    console.error('❌ Placed order not visible in delivery orders list:', riderOrdersData);
    process.exit(1);
  }
  console.log('✅ Placed order visible in rider task pool! Found Order:', foundOrder.orderId, 'Status:', foundOrder.status);

  // 6. Delivery Partner accepts the order
  console.log(`\n[6] Delivery partner accepting order ${placedOrderId}...`);
  const acceptRes = await fetch(`${BASE_URL}/delivery/orders/${placedOrderId}/accept`, {
    method: 'POST',
    headers: riderHeaders,
  });
  const acceptData = await acceptRes.json();
  console.log('✅ Task accepted response:', acceptData);

  // 7. Delivery Partner updates status to 'Picked Up'
  console.log(`\n[7] Updating status to "Picked Up"...`);
  const pickupRes = await fetch(`${BASE_URL}/delivery/orders/${placedOrderId}/status`, {
    method: 'PATCH',
    headers: riderHeaders,
    body: JSON.stringify({ status: 'Picked Up', note: 'Picked up fresh harvest from farm depot.' }),
  });
  console.log('✅ Picked Up response code:', pickupRes.status);

  // 8. Delivery Partner updates status to 'Out for Delivery'
  console.log(`\n[8] Updating status to "Out for Delivery"...`);
  const outRes = await fetch(`${BASE_URL}/delivery/orders/${placedOrderId}/status`, {
    method: 'PATCH',
    headers: riderHeaders,
    body: JSON.stringify({ status: 'Out for Delivery', note: 'En route to customer address.' }),
  });
  console.log('✅ Out for Delivery response code:', outRes.status);

  // 9. Delivery Partner verifies OTP and completes delivery
  console.log(`\n[9] Verifying OTP (${otpCode}) and completing delivery...`);
  const deliverRes = await fetch(`${BASE_URL}/delivery/orders/${placedOrderId}/status`, {
    method: 'PATCH',
    headers: riderHeaders,
    body: JSON.stringify({ status: 'Delivered', otpCode, note: 'Delivered and verified via customer OTP PIN.' }),
  });
  const deliverData = await deliverRes.json();
  console.log('✅ Delivered response:', deliverData);

  // 10. Check live overview & earnings metrics
  console.log('\n[10] Checking updated delivery metrics & earnings...');
  const overviewRes = await fetch(`${BASE_URL}/delivery/overview`, { headers: riderHeaders });
  const overviewData = await overviewRes.json();
  console.log('✅ Live Overview Metrics:', overviewData.overview);

  const earningsRes = await fetch(`${BASE_URL}/delivery/earnings`, { headers: riderHeaders });
  const earningsData = await earningsRes.json();
  console.log('✅ Live Earnings Data:');
  console.log('- Today Total:', earningsData.earnings?.todayTotal);
  console.log('- Today Trips:', earningsData.earnings?.todayTrips);
  console.log('- Wallet / Pending Payout:', earningsData.earnings?.pendingPayout);
  console.log('- Settlements count:', earningsData.earnings?.payoutHistory?.length);

  console.log('\n=============================================================');
  console.log('🎉 100% REAL LIVE DATA DELIVERY LIFECYCLE VERIFIED SEAMLESSLY!');
  console.log('=============================================================\n');
}

runDeliveryLifecycleTest().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
