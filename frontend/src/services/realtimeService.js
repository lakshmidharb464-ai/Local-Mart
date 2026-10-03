import { API_BASE_URL } from './apiClient';

/**
 * Realtime Event Service using Server-Sent Events (SSE)
 * Provides automatic reconnect with exponential backoff and event subscription.
 */
class RealtimeService {
  constructor() {
    this.eventSource = null;
    this.listeners = new Map(); // eventName -> Set of callback functions
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 30000;
    this.orderEventSources = new Map(); // orderId -> EventSource
  }

  /**
   * Connect to global SSE stream
   */
  connect() {
    if (this.eventSource && (this.eventSource.readyState === EventSource.OPEN || this.eventSource.readyState === EventSource.CONNECTING)) {
      return;
    }

    try {
      this.isConnecting = true;
      const streamUrl = `${API_BASE_URL}/orders/live/stream`;
      
      this.eventSource = new EventSource(streamUrl, { withCredentials: true });

      this.eventSource.addEventListener('connected', (e) => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      });

      this.eventSource.addEventListener('ORDER_CREATED', (e) => {
        try {
          const data = JSON.parse(e.data);
          this.emit('ORDER_CREATED', data);
        } catch (err) {
          console.error('[RealtimeService] Failed to parse ORDER_CREATED payload:', err);
        }
      });

      this.eventSource.addEventListener('ORDER_STATUS_UPDATED', (e) => {
        try {
          const data = JSON.parse(e.data);
          this.emit('ORDER_STATUS_UPDATED', data);
        } catch (err) {
          console.error('[RealtimeService] Failed to parse ORDER_STATUS_UPDATED payload:', err);
        }
      });

      this.eventSource.addEventListener('GPS_BEACON_UPDATED', (e) => {
        try {
          const data = JSON.parse(e.data);
          this.emit('GPS_BEACON_UPDATED', data);
        } catch (err) {
          console.error('[RealtimeService] Failed to parse GPS_BEACON_UPDATED payload:', err);
        }
      });

      this.eventSource.onerror = () => {
        this.isConnecting = false;
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }

        // Exponential backoff reconnect
        const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), this.maxReconnectDelay);
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), delay);
      };
    } catch (err) {
      console.warn('[RealtimeService] SSE Connection failed to initialize:', err);
    }
  }

  /**
   * Subscribe to specific order tracking stream (e.g. for customer live map)
   */
  subscribeToOrder(orderId, onBeaconUpdate, onStatusUpdate) {
    if (!orderId) return () => {};

    const streamUrl = `${API_BASE_URL}/orders/${orderId}/live/stream`;
    let source = null;

    try {
      source = new EventSource(streamUrl, { withCredentials: true });

      if (onBeaconUpdate) {
        source.addEventListener('GPS_BEACON_UPDATED', (e) => {
          try {
            const data = JSON.parse(e.data);
            onBeaconUpdate(data);
          } catch (err) {}
        });
      }

      if (onStatusUpdate) {
        source.addEventListener('ORDER_STATUS_UPDATED', (e) => {
          try {
            const data = JSON.parse(e.data);
            onStatusUpdate(data);
          } catch (err) {}
        });
      }
    } catch (err) {
      console.warn(`[RealtimeService] Failed to subscribe to order ${orderId}:`, err);
    }

    // Return unsubscribe cleanup function
    return () => {
      if (source) {
        source.close();
      }
    };
  }

  /**
   * Register event listener
   */
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);

    // Ensure connection is active
    if (!this.eventSource) {
      this.connect();
    }

    return () => this.off(eventName, callback);
  }

  /**
   * Unregister event listener
   */
  off(eventName, callback) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).delete(callback);
    }
  }

  /**
   * Emit event internally to subscribers
   */
  emit(eventName, payload) {
    if (this.listeners.has(eventName)) {
      for (const callback of this.listeners.get(eventName)) {
        try {
          callback(payload);
        } catch (err) {
          console.error(`[RealtimeService] Error executing listener for ${eventName}:`, err);
        }
      }
    }
  }

  /**
   * Disconnect and cleanup
   */
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.listeners.clear();
  }
}

export const realtimeService = new RealtimeService();
