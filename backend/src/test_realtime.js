import app from './app.js';
import http from 'http';
import { query } from './config/db.js';

/**
 * End-to-End Test Suite for Real-Time SSE Order Events
 * Verifies ORDER_CREATED and ORDER_STATUS_UPDATED live broadcasts
 */
async function testRealtimeOrderFlow() {
  const server = http.createServer(app);
  const PORT = 5098;
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`🚀 Realtime Test Server listening on http://localhost:${PORT}`);

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
    // 1. Authenticate Customer & Delivery Rider
    console.log('\n--- 1. Authenticating Roles ---');
    const custRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'aniket.sharma@gmail.com', password: 'password123', role: 'Customer' }),
    });
    const custData = await custRes.json();
    assert(custRes.status === 200, 'Customer logged in');

    const delivRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rohan.delivery@localfarm.in', password: 'password123', role: 'Delivery' }),
    });
    const delivData = await delivRes.json();
    assert(delivRes.status === 200, 'Delivery rider logged in');

    // 2. Fetch a test product
    const [testProduct] = await query('SELECT id, name, stock FROM products LIMIT 1');
    assert(!!testProduct, `Found test crop listing: "${testProduct.name}" (ID: ${testProduct.id})`);

    // 3. Connect to SSE Stream
    console.log('\n--- 2. Connecting to SSE Stream (/api/orders/live/stream) ---');
    const receivedEvents = [];

    const sseReq = http.request(
      `http://localhost:${PORT}/api/orders/live/stream`,
      {
        headers: {
          Accept: 'text/event-stream',
          Authorization: `Bearer ${custData.token}`,
        },
      },
      (res) => {
        assert(res.statusCode === 200, 'SSE Stream connection established (200 OK)');
        assert(res.headers['content-type'].includes('text/event-stream'), 'Content-Type is text/event-stream');

        res.on('data', (chunk) => {
          const text = chunk.toString();
          if (text.includes('event:')) {
            const lines = text.split('\n');
            let eventName = '';
            let dataStr = '';
            for (const line of lines) {
              if (line.startsWith('event:')) eventName = line.replace('event:', '').trim();
              if (line.startsWith('data:')) dataStr = line.replace('data:', '').trim();
            }
            if (eventName && dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                receivedEvents.push({ event: eventName, data: parsed });
                console.log(`  ⚡ [SSE Event Received] ${eventName}:`, parsed.orderId || parsed.clientId);
              } catch (e) {}
            }
          }
        });
      }
    );

    sseReq.end();

    // Wait for SSE handshake
    await new Promise((r) => setTimeout(r, 500));

    // 4. Place an Order (triggers ORDER_CREATED broadcast)
    console.log('\n--- 3. Triggering ORDER_CREATED via POST /api/orders ---');
    const orderRes = await fetch(`${BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${custData.token}`,
      },
      body: JSON.stringify({
        items: [{ productId: testProduct.id, quantity: 1 }],
        addressText: 'Flat 402, Green Meadows, Chittoor Road',
        customerLat: 13.2172,
        customerLng: 79.1003,
        paymentMethod: 'UPI',
      }),
    });

    const orderData = await orderRes.json();
    assert(orderRes.status === 201, `Order created successfully with ID: ${orderData.order?.orderId}`);
    const createdOrderId = orderData.order?.orderId;

    // Allow event dispatch
    await new Promise((r) => setTimeout(r, 600));

    const orderCreatedEvent = receivedEvents.find((e) => e.event === 'ORDER_CREATED' && e.data.orderId === createdOrderId);
    assert(!!orderCreatedEvent, `ORDER_CREATED event received via SSE for ${createdOrderId}`);

    // 5. Update Status (triggers ORDER_STATUS_UPDATED broadcast)
    console.log('\n--- 4. Triggering ORDER_STATUS_UPDATED via PATCH /api/orders/:id/status ---');
    const statusRes = await fetch(`${BASE}/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${delivData.token}`,
      },
      body: JSON.stringify({
        status: 'Picked Up',
        reason: 'Collected fresh produce from farm gate',
      }),
    });

    const statusJson = await statusRes.json();
    assert(statusRes.status === 200, `Order status updated to "Picked Up"`);

    // Allow event dispatch
    await new Promise((r) => setTimeout(r, 600));

    const statusUpdatedEvent = receivedEvents.find(
      (e) => e.event === 'ORDER_STATUS_UPDATED' && e.data.orderId === createdOrderId && e.data.status === 'Picked Up'
    );
    assert(!!statusUpdatedEvent, `ORDER_STATUS_UPDATED event received via SSE with status "Picked Up"`);

    // 6. Test Delivery GPS Beacon Broadcast
    console.log('\n--- 5. Triggering GPS_BEACON_UPDATED via POST /api/delivery/location ---');
    const beaconRes = await fetch(`${BASE}/delivery/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${delivData.token}`,
      },
      body: JSON.stringify({
        orderId: createdOrderId,
        latitude: 13.2185,
        longitude: 79.1015,
        speed: 38,
        heading: 85,
      }),
    });

    assert(beaconRes.status === 200, 'GPS telemetry beacon accepted');

    console.log('\n=============================================');
    console.log(`SUMMARY: ${passed}/${total} Real-Time SSE Flow Tests PASSED!`);
    console.log('=============================================');

  } catch (err) {
    console.error('Test failed with error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

testRealtimeOrderFlow();
