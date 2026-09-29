import { v4 as uuidv4 } from 'uuid';
import { query, execute, withTransaction } from '../config/db.js';

/**
 * Place a new order
 * POST /api/orders
 */
export async function createOrder(req, res, next) {
  try {
    const {
      items, // array of { productId, quantity }
      addressText,
      customerLat,
      customerLng,
      paymentMethod = 'UPI',
      couponCode,
      tipAmount = 0,
    } = req.body;

    const customerId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    if (!addressText) {
      return res.status(400).json({ success: false, message: 'Delivery address is required.' });
    }

    // Generate readable Order ID: e.g. ORD-8830
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${randomSuffix}`;

    const orderResult = await withTransaction(async (conn) => {
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const [products] = await conn.execute(
          'SELECT id, name, price, unit, stock, farmer_id FROM products WHERE id = ?',
          [item.productId || item.id]
        );

        if (products.length === 0) {
          throw new Error(`Product ${item.productId || item.id} not found.`);
        }

        const product = products[0];
        const qty = Number(item.quantity) || 1;

        if (product.stock < qty) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${qty}`);
        }

        const itemTotal = Number(product.price) * qty;
        subtotal += itemTotal;

        orderItemsData.push({
          id: uuidv4(),
          orderId,
          productId: product.id,
          farmerId: product.farmer_id,
          productName: product.name,
          quantity: qty,
          unit: product.unit,
          unitPrice: Number(product.price),
          totalPrice: itemTotal,
        });

        // Deduct inventory
        await conn.execute(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [qty, product.id]
        );
      }

      // Handle Coupon Discount
      let discountAmount = 0;
      let couponId = null;
      if (couponCode) {
        const [coupons] = await conn.execute(
          'SELECT * FROM coupons WHERE code = ? AND is_active = 1',
          [couponCode.trim().toUpperCase()]
        );

        if (coupons.length > 0) {
          const coup = coupons[0];
          if (subtotal >= Number(coup.min_order_amount)) {
            couponId = coup.id;
            if (coup.discount_type === 'percentage') {
              discountAmount = (subtotal * Number(coup.discount_value)) / 100;
              if (coup.max_discount_amount) {
                discountAmount = Math.min(discountAmount, Number(coup.max_discount_amount));
              }
            } else {
              discountAmount = Number(coup.discount_value);
            }
          }
        }
      }

      const deliveryFee = subtotal >= 300 ? 0.00 : 30.00;
      const totalAmount = Math.max(0, subtotal + deliveryFee + Number(tipAmount) - discountAmount);

      // Generate random 4-digit OTP for delivery verification
      const otpCode = String(Math.floor(1000 + Math.random() * 9000));

      // 1. Insert Order
      await conn.execute(
        `INSERT INTO orders (
          id, customer_id, address_text, customer_lat, customer_lng,
          status, subtotal, delivery_fee, discount_amount, tip_amount, total_amount,
          payment_method, payment_status, eta, otp_code
        ) VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?, ?, ?, 'Paid', '30-45 mins', ?)`,
        [
          orderId,
          customerId,
          addressText,
          customerLat || 18.5204,
          customerLng || 73.8567,
          subtotal,
          deliveryFee,
          discountAmount,
          Number(tipAmount),
          totalAmount,
          paymentMethod,
          otpCode,
        ]
      );

      // 2. Insert Order Items
      for (const oi of orderItemsData) {
        await conn.execute(
          `INSERT INTO order_items (id, order_id, product_id, farmer_id, product_name, quantity, unit, unit_price, total_price)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [oi.id, oi.orderId, oi.productId, oi.farmerId, oi.productName, oi.quantity, oi.unit, oi.unitPrice, oi.totalPrice]
        );
      }

      // 3. Insert Initial Order Timeline
      await conn.execute(
        `INSERT INTO order_timeline (id, order_id, title, description, actor_id, actor_role)
         VALUES (?, ?, 'Order Placed', 'Order confirmed and sent to local farm cluster for harvest and packing.', ?, 'Customer')`,
        [uuidv4(), orderId, customerId]
      );

      // 4. Record Coupon Redemption if applied
      if (couponId && discountAmount > 0) {
        await conn.execute(
          `INSERT INTO coupon_redemptions (id, coupon_id, order_id, customer_id, discount_applied)
           VALUES (?, ?, ?, ?, ?)`,
          [uuidv4(), couponId, orderId, customerId, discountAmount]
        );
      }

      // 5. Update Customer Loyalty stats
      await conn.execute(
        `UPDATE customer_loyalty
         SET order_count = order_count + 1,
             total_spent = total_spent + ?,
             tier = CASE 
               WHEN total_spent + ? >= 10000 THEN 'Gold'
               WHEN total_spent + ? >= 3000 THEN 'Silver'
               ELSE 'Bronze'
             END
         WHERE customer_id = ?`,
        [totalAmount, totalAmount, totalAmount, customerId]
      );

      return {
        orderId,
        subtotal,
        deliveryFee,
        discountAmount,
        tipAmount,
        totalAmount,
        otpCode,
        status: 'Pending',
      };
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: orderResult,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get authenticated customer's orders
 * GET /api/orders/my-orders
 */
export async function getMyOrders(req, res, next) {
  try {
    const customerId = req.user.id;

    const orders = await query(
      `SELECT 
        o.*,
        u.name AS delivery_partner_name,
        u.phone AS delivery_partner_phone,
        GROUP_CONCAT(CONCAT(oi.product_name, ' (', oi.quantity, ' ', oi.unit, ')') SEPARATOR ', ') AS items_summary,
        COUNT(oi.id) AS items_count
       FROM orders o
       LEFT JOIN users u ON o.delivery_partner_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.customer_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [customerId]
    );

    // Format orders
    const formatted = orders.map((o) => ({
      id: o.id,
      date: new Date(o.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      total: Number(o.total_amount),
      subtotal: Number(o.subtotal),
      deliveryFee: Number(o.delivery_fee),
      discountAmount: Number(o.discount_amount),
      tipAmount: Number(o.tip_amount),
      status: o.status,
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      items: o.items_summary,
      itemsCount: o.items_count,
      eta: o.eta,
      deliveryPartnerName: o.delivery_partner_name,
      deliveryPartnerPhone: o.delivery_partner_phone,
      proofPhotoUrl: o.proof_photo_url,
      otpCode: o.otp_code,
    }));

    res.json({ success: true, count: formatted.length, orders: formatted });
  } catch (error) {
    next(error);
  }
}

/**
 * Track Order with live status & GPS
 * GET /api/orders/:id/track
 */
export async function trackOrder(req, res, next) {
  try {
    const { id } = req.params;

    const orders = await query(
      `SELECT 
        o.*,
        u.name AS rider_name,
        u.phone AS rider_phone,
        u.avatar_url AS rider_avatar,
        dp.vehicle_type,
        dp.vehicle_number,
        dp.rating AS rider_rating
       FROM orders o
       LEFT JOIN users u ON o.delivery_partner_id = u.id
       LEFT JOIN delivery_profiles dp ON o.delivery_partner_id = dp.user_id
       WHERE o.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orders[0];

    // Fetch items
    const items = await query(
      `SELECT oi.*, p.category_id, (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    // Fetch timeline
    const timeline = await query(
      'SELECT id, title, description, actor_role, created_at FROM order_timeline WHERE order_id = ? ORDER BY created_at ASC',
      [id]
    );

    // Fetch live GPS beacon
    const [beacon] = await query(
      'SELECT current_lat, current_lng, speed_kmh, heading_deg, last_beacon_at FROM delivery_tracking WHERE order_id = ?',
      [id]
    );

    res.json({
      success: true,
      tracking: {
        orderId: order.id,
        status: order.status,
        eta: order.eta,
        totalAmount: Number(order.total_amount),
        customerAddress: order.address_text,
        customerCoords: { lat: Number(order.customer_lat), lng: Number(order.customer_lng) },
        rider: order.rider_name
          ? {
              name: order.rider_name,
              phone: order.rider_phone,
              avatar: order.rider_avatar,
              vehicle: `${order.vehicle_type} (${order.vehicle_number})`,
              rating: Number(order.rider_rating || 5.0),
            }
          : null,
        liveCoords: beacon
          ? {
              lat: Number(beacon.current_lat),
              lng: Number(beacon.current_lng),
              speed: Number(beacon.speed_kmh),
              heading: Number(beacon.heading_deg),
              updatedAt: beacon.last_beacon_at,
            }
          : null,
        items,
        timeline,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Orders with optional role/status filters
 * GET /api/orders
 */
export async function getOrders(req, res, next) {
  try {
    const { role, filter, status } = req.query;
    const userId = req.user?.id;
    const userRole = req.user?.role || role || 'Customer';

    let sql = `
      SELECT 
        o.*,
        u.name AS customer_name,
        u.email AS customer_email,
        r.name AS delivery_partner_name,
        GROUP_CONCAT(CONCAT(oi.product_name, ' (', oi.quantity, ' ', oi.unit, ')') SEPARATOR ', ') AS items_summary,
        COUNT(oi.id) AS items_count
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       LEFT JOIN users r ON o.delivery_partner_id = r.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
    `;

    const whereClauses = [];
    const params = [];

    if (userRole === 'Customer' && userId) {
      whereClauses.push('o.customer_id = ?');
      params.push(userId);
    } else if (userRole === 'Farmer' && userId) {
      whereClauses.push('oi.farmer_id = ?');
      params.push(userId);
    } else if (userRole === 'Delivery' && userId) {
      whereClauses.push('(o.delivery_partner_id = ? OR (o.delivery_partner_id IS NULL AND o.status = "Approved"))');
      params.push(userId);
    }

    if (status && status !== 'all') {
      whereClauses.push('o.status = ?');
      params.push(status);
    } else if (filter === 'active') {
      whereClauses.push('o.status IN ("Pending", "Approved", "Packed", "Assigned", "Accepted", "Picked Up", "Out for Delivery")');
    } else if (filter === 'delivered') {
      whereClauses.push('o.status = "Delivered"');
    } else if (filter === 'cancelled') {
      whereClauses.push('o.status IN ("Cancelled", "Failed")');
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    sql += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    const orders = await query(sql, params);

    const formatted = orders.map((o) => ({
      id: o.id,
      date: new Date(o.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      total: Number(o.total_amount),
      subtotal: Number(o.subtotal),
      deliveryFee: Number(o.delivery_fee),
      discountAmount: Number(o.discount_amount),
      tipAmount: Number(o.tip_amount),
      status: o.status,
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      items: o.items_summary,
      itemsCount: o.items_count,
      eta: o.eta,
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      deliveryPartnerName: o.delivery_partner_name,
      proofPhotoUrl: o.proof_photo_url,
      otpCode: o.otp_code,
    }));

    res.json({ success: true, count: formatted.length, orders: formatted });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Order status
 * PATCH /api/orders/:id/status
 */
export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const actorId = req.user?.id || null;
    const actorRole = req.user?.role || 'System';

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    await execute(
      `UPDATE orders
       SET status = ?,
           failure_reason = COALESCE(?, failure_reason)
       WHERE id = ?`,
      [status, reason || null, id]
    );

    await execute(
      'INSERT INTO order_timeline (id, order_id, title, description, actor_id, actor_role) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), id, `Status: ${status}`, reason ? `Reason: ${reason}` : `Advanced to ${status}`, actorId, actorRole]
    );

    res.json({ success: true, message: `Order status updated to ${status}.` });
  } catch (error) {
    next(error);
  }
}

/**
 * Validate Coupon Code
 * POST /api/coupons/validate
 */
export async function validateCoupon(req, res, next) {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const coupons = await query(
      'SELECT * FROM coupons WHERE code = ? AND is_active = 1',
      [code.trim().toUpperCase()]
    );

    if (coupons.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    const coup = coupons[0];

    if (Number(subtotal) < Number(coup.min_order_amount)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for this coupon is ₹${coup.min_order_amount}.`,
      });
    }

    let discount = 0;
    if (coup.discount_type === 'percentage') {
      discount = (Number(subtotal) * Number(coup.discount_value)) / 100;
      if (coup.max_discount_amount) {
        discount = Math.min(discount, Number(coup.max_discount_amount));
      }
    } else {
      discount = Number(coup.discount_value);
    }

    res.json({
      success: true,
      message: `Coupon '${coup.code}' applied successfully!`,
      coupon: {
        code: coup.code,
        discountType: coup.discount_type,
        discountValue: Number(coup.discount_value),
        discountAmount: discount,
      },
    });
  } catch (error) {
    next(error);
  }
}
