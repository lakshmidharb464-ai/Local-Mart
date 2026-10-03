import { v4 as uuidv4 } from 'uuid';

/**
 * Server-Sent Events (SSE) Real-Time Event Hub
 * Dispatches live updates to Customer, Farmer, Delivery Rider, and Admin clients.
 */
class RealtimeEventHub {
  constructor() {
    this.clients = new Map(); // clientId -> { res, userId, role, orderId, keepAliveTimer }
  }

  /**
   * Register a new SSE subscriber client
   */
  registerClient(res, { userId = null, role = 'Customer', orderId = null } = {}) {
    const clientId = uuidv4();

    // Headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    res.flushHeaders?.();

    // Initial greeting event
    res.write(`event: connected\ndata: ${JSON.stringify({ clientId, timestamp: new Date().toISOString() })}\n\n`);

    // Periodic keep-alive ping to prevent connection timeout through proxies
    const keepAliveTimer = setInterval(() => {
      try {
        res.write(': keepalive\n\n');
      } catch (err) {
        this.unregisterClient(clientId);
      }
    }, 25000);

    this.clients.set(clientId, {
      res,
      userId,
      role,
      orderId,
      keepAliveTimer,
    });

    // Cleanup on disconnect
    res.on('close', () => {
      this.unregisterClient(clientId);
    });

    return clientId;
  }

  /**
   * Unregister an SSE subscriber client
   */
  unregisterClient(clientId) {
    const client = this.clients.get(clientId);
    if (client) {
      clearInterval(client.keepAliveTimer);
      this.clients.delete(clientId);
    }
  }

  /**
   * Broadcast an event to matching clients
   * @param {string} eventName - e.g. 'ORDER_STATUS_UPDATED', 'ORDER_CREATED', 'GPS_BEACON_UPDATED'
   * @param {object} payload - Event data
   * @param {function} [filterFn] - Optional client filter predicate: (client) => boolean
   */
  broadcast(eventName, payload, filterFn = null) {
    const message = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
    
    for (const [clientId, client] of this.clients.entries()) {
      try {
        if (!filterFn || filterFn(client)) {
          client.res.write(message);
        }
      } catch (err) {
        this.unregisterClient(clientId);
      }
    }
  }

  /**
   * Broadcast specific order event to all parties (Customer, Farmer, Rider, Admin, or Order Watchers)
   */
  broadcastOrderUpdate(eventName, orderId, orderData) {
    this.broadcast(eventName, { orderId, ...orderData, timestamp: new Date().toISOString() }, (client) => {
      // If client is subscribed to this specific order
      if (client.orderId === orderId) return true;
      // Admins receive all updates
      if (client.role === 'Admin') return true;
      // If client matches customer or farmer or rider
      if (orderData.customerId && client.userId === orderData.customerId) return true;
      if (orderData.farmerId && client.userId === orderData.farmerId) return true;
      if (orderData.deliveryPartnerId && client.userId === orderData.deliveryPartnerId) return true;
      // Default allow for general order subscribers
      return !client.orderId;
    });
  }

  /**
   * Broadcast live GPS beacon to order tracking subscribers
   */
  broadcastGpsBeacon(orderId, beaconData) {
    this.broadcast('GPS_BEACON_UPDATED', { orderId, ...beaconData, timestamp: new Date().toISOString() }, (client) => {
      return client.orderId === orderId || client.role === 'Admin';
    });
  }
}

export const realtimeHub = new RealtimeEventHub();
