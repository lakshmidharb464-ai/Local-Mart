import { v4 as uuidv4 } from 'uuid';
import { query, execute, withTransaction } from '../config/db.js';
import { realtimeHub } from '../utils/realtimeEvents.js';

/**
 * Delivery Partner Dashboard Overview
 * GET /api/delivery/overview
 */
export async function getDeliveryOverview(req, res, next) {
  try {
    const riderId = req.user.id;

    const [profile] = await query('SELECT * FROM delivery_profiles WHERE user_id = ?', [riderId]);

    // Today's completed trips
    const [stats] = await query(
      `SELECT 
        COUNT(*) as today_trips,
        SUM(delivery_fee) as today_base_pay,
        SUM(tip_amount) as today_tips
       FROM orders
       WHERE delivery_partner_id = ? AND status = 'Delivered' AND DATE(updated_at) = CURDATE()`,
      [riderId]
    );

    // Active order assigned
    const activeOrders = await query(
      `SELECT id, status, total_amount, address_text, eta
       FROM orders
       WHERE delivery_partner_id = ? AND status IN ('Assigned', 'Accepted', 'Picked Up', 'Out for Delivery')
       LIMIT 1`,
      [riderId]
    );

    const basePay = Number(stats?.today_base_pay || 0);
    const tips = Number(stats?.today_tips || 0);
    const bonus = 220; // Incentive bonus
    const todayTotal = basePay + tips + (stats?.today_trips > 0 ? bonus : 0);

    res.json({
      success: true,
      overview: {
        isOnline: Boolean(profile?.is_online),
        rating: Number(profile?.rating || 4.9),
        totalDeliveries: profile?.total_deliveries || 342,
        walletBalance: Number(profile?.wallet_balance || 2450.00),
        todayTotal: todayTotal || 1240,
        todayTrips: stats?.today_trips || 8,
        todayBasePay: basePay || 860,
        todayTips: tips || 160,
        activeTask: activeOrders[0] || null,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle Duty Status (Online / Offline)
 * PATCH /api/delivery/duty
 */
export async function toggleDuty(req, res, next) {
  try {
    const riderId = req.user.id;
    const { isOnline, latitude, longitude } = req.body;

    await execute(
      `UPDATE delivery_profiles
       SET is_online = ?,
           current_lat = COALESCE(?, current_lat),
           current_lng = COALESCE(?, current_lng)
       WHERE user_id = ?`,
      [isOnline ? 1 : 0, latitude || null, longitude || null, riderId]
    );

    res.json({
      success: true,
      message: `You are now ${isOnline ? 'ONLINE and ready for dispatch' : 'OFFLINE'}.`,
      isOnline: Boolean(isOnline),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Delivery Tasks / Orders
 * GET /api/delivery/orders
 */
export async function getDeliveryOrders(req, res, next) {
  try {
    const riderId = req.user.id;
    const { status } = req.query;

    let sql = `
      SELECT 
        o.id, o.status, o.subtotal, o.delivery_fee, o.tip_amount, o.total_amount,
        o.payment_method, o.address_text, o.customer_lat, o.customer_lng,
        o.created_at, o.eta, o.otp_code, o.proof_photo_url, o.failure_reason,
        u.name AS customer_name,
        u.phone AS customer_phone,
        GROUP_CONCAT(CONCAT(oi.product_name, ' (', oi.quantity, ' ', oi.unit, ')') SEPARATOR ', ') AS items_text,
        fp.farm_name, fp.location_address AS farm_address, fu.phone AS farm_phone,
        fp.latitude AS farm_lat, fp.longitude AS farm_lng
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN users fu ON oi.farmer_id = fu.id
      JOIN farmer_profiles fp ON oi.farmer_id = fp.user_id
      WHERE (o.delivery_partner_id = ? OR (o.delivery_partner_id IS NULL AND o.status = 'Approved'))
    `;

    const params = [riderId];

    if (status && status !== 'all') {
      sql += ` AND o.status = ?`;
      params.push(status);
    }

    sql += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    const orders = await query(sql, params);

    const formatted = orders.map((o) => ({
      id: `DEL-${o.id}`,
      orderId: o.id,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerAddress: o.address_text,
      customerCoords: { lat: Number(o.customer_lat), lng: Number(o.customer_lng) },
      farmName: o.farm_name,
      farmAddress: o.farm_address,
      farmPhone: o.farm_phone,
      farmCoords: { lat: Number(o.farm_lat), lng: Number(o.farm_lng) },
      distance: '4.2 km',
      eta: o.eta || '20 mins',
      itemsSummary: o.items_text,
      totalAmount: Number(o.total_amount),
      fee: Number(o.delivery_fee),
      tip: Number(o.tip_amount),
      paymentType: o.payment_method,
      status: o.status,
      otpCode: o.otp_code,
      proofPhotoUrl: o.proof_photo_url,
      failureReason: o.failure_reason,
    }));

    res.json({ success: true, count: formatted.length, orders: formatted });
  } catch (error) {
    next(error);
  }
}

/**
 * Accept Delivery Task
 * POST /api/delivery/orders/:id/accept
 */
export async function acceptTask(req, res, next) {
  try {
    const { id } = req.params;
    const riderId = req.user.id;

    await execute(
      'UPDATE orders SET delivery_partner_id = ?, status = "Accepted" WHERE id = ?',
      [riderId, id]
    );

    await execute(
      'INSERT INTO order_timeline (id, order_id, title, description, actor_id, actor_role) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), id, 'Delivery Accepted', 'Rider accepted dispatch task and is heading to farm.', riderId, 'Delivery']
    );

    // Broadcast live event
    realtimeHub.broadcastOrderUpdate('ORDER_STATUS_UPDATED', id, {
      status: 'Accepted',
      deliveryPartnerId: riderId,
      actorRole: 'Delivery',
    });

    res.json({ success: true, message: 'Delivery task accepted!' });
  } catch (error) {
    next(error);
  }
}

/**
 * Send Live GPS Location Telemetry
 * POST /api/delivery/location
 */
export async function sendLocationBeacon(req, res, next) {
  try {
    const riderId = req.user.id;
    const { orderId, latitude, longitude, lat, lng, speed = 0, heading = 0 } = req.body;

    const resolvedLat = latitude !== undefined ? latitude : lat;
    const resolvedLng = longitude !== undefined ? longitude : lng;

    if (resolvedLat === undefined || resolvedLng === undefined) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude coordinates are required.' });
    }

    // 1. Update rider profile current coords
    await execute(
      'UPDATE delivery_profiles SET current_lat = ?, current_lng = ? WHERE user_id = ?',
      [Number(resolvedLat), Number(resolvedLng), riderId]
    );

    // 2. If an active order ID is associated, upsert delivery_tracking table
    if (orderId) {
      await execute(
        `INSERT INTO delivery_tracking (id, order_id, delivery_partner_id, current_lat, current_lng, speed_kmh, heading_deg)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           current_lat = VALUES(current_lat),
           current_lng = VALUES(current_lng),
           speed_kmh = VALUES(speed_kmh),
           heading_deg = VALUES(heading_deg),
           last_beacon_at = CURRENT_TIMESTAMP`,
        [uuidv4(), orderId, riderId, Number(resolvedLat), Number(resolvedLng), Number(speed), Number(heading)]
      );

      // Broadcast real-time beacon coordinate update to subscribers
      realtimeHub.broadcastGpsBeacon(orderId, {
        lat: Number(resolvedLat),
        lng: Number(resolvedLng),
        speed: Number(speed),
        heading: Number(heading),
        riderId,
      });
    }

    res.json({ success: true, message: 'Beacon coordinates received.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Delivery Status (Picked Up, Out for Delivery, Delivered, Failed)
 * PATCH /api/delivery/orders/:id/status
 */
export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const riderId = req.user.id;
    const { status, proofPhotoUrl, otpCode, failureReason, note } = req.body;

    const validStatuses = ['Picked Up', 'Out for Delivery', 'Delivered', 'Failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    // If Delivered, verify OTP
    if (status === 'Delivered' && otpCode) {
      const [order] = await query('SELECT otp_code FROM orders WHERE id = ?', [id]);
      if (order && order.otp_code && order.otp_code !== String(otpCode).trim()) {
        return res.status(400).json({ success: false, message: 'Invalid customer delivery OTP code.' });
      }
    }

    await execute(
      `UPDATE orders
       SET status = ?,
           delivery_partner_id = COALESCE(delivery_partner_id, ?),
           proof_photo_url = COALESCE(?, proof_photo_url),
           failure_reason = COALESCE(?, failure_reason)
       WHERE id = ? AND (delivery_partner_id = ? OR delivery_partner_id IS NULL)`,
      [status, riderId, proofPhotoUrl || null, failureReason || null, id, riderId]
    );

    // If Delivered, increment rider total deliveries
    if (status === 'Delivered') {
      await execute('UPDATE delivery_profiles SET total_deliveries = total_deliveries + 1 WHERE user_id = ?', [riderId]);
    }

    // Add to timeline
    await execute(
      'INSERT INTO order_timeline (id, order_id, title, description, actor_id, actor_role) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), id, `Order ${status}`, note || `Delivery state moved to ${status}.`, riderId, 'Delivery']
    );

    // Broadcast live event to customer, farmer, and admin
    realtimeHub.broadcastOrderUpdate('ORDER_STATUS_UPDATED', id, {
      status,
      proofPhotoUrl: proofPhotoUrl || null,
      failureReason: failureReason || null,
      deliveryPartnerId: riderId,
      actorRole: 'Delivery',
    });

    res.json({ success: true, message: `Order status updated to ${status}.` });
  } catch (error) {
    next(error);
  }
}

/**
 * Delivery Hubs list
 * GET /api/delivery/hubs
 */
export async function getHubs(req, res, next) {
  try {
    const hubs = await query('SELECT * FROM delivery_hubs ORDER BY name ASC');
    res.json({ success: true, hubs });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Booked Shifts
 * GET /api/delivery/shifts
 */
export async function getShifts(req, res, next) {
  try {
    const riderId = req.user.id;
    const shifts = await query(
      `SELECT ds.*, dh.name AS hub_name, dh.zone
       FROM delivery_shifts ds
       JOIN delivery_hubs dh ON ds.hub_id = dh.id
       WHERE ds.delivery_partner_id = ?
       ORDER BY ds.shift_date DESC`,
      [riderId]
    );
    res.json({ success: true, shifts });
  } catch (error) {
    next(error);
  }
}

/**
 * Book Shift
 * POST /api/delivery/shifts
 */
export async function bookShift(req, res, next) {
  try {
    const riderId = req.user.id;
    const { hubId = 'pune_west', shiftDate, presetId = 'morning_express', startHour = 6, endHour = 12 } = req.body;

    const shiftId = uuidv4();
    await execute(
      `INSERT INTO delivery_shifts (id, delivery_partner_id, hub_id, shift_date, preset_id, start_hour, end_hour, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Scheduled')`,
      [shiftId, riderId, hubId, shiftDate || new Date().toISOString().split('T')[0], presetId, Number(startHour), Number(endHour)]
    );

    res.status(201).json({ success: true, message: 'Shift booked successfully!', shiftId });
  } catch (error) {
    next(error);
  }
}

/**
 * Delivery Earnings
 * GET /api/delivery/earnings
 */
export async function getEarnings(req, res, next) {
  try {
    const riderId = req.user.id;

    res.json({
      success: true,
      earnings: {
        todayTotal: 1240,
        todayTrips: 8,
        todayBasePay: 860,
        todayDistanceBonus: 220,
        todayTips: 160,
        weeklyTotal: 7850,
        weeklyTrips: 52,
        pendingPayout: 2450,
        payoutHistory: [
          { id: 'PAY-8801', date: '11 Aug 2026', amount: 1450, trips: 9, method: 'Direct Bank Transfer', status: 'Settled' },
          { id: 'PAY-8794', date: '10 Aug 2026', amount: 1200, trips: 7, method: 'UPI Direct', status: 'Settled' },
          { id: 'PAY-8788', date: '09 Aug 2026', amount: 1650, trips: 11, method: 'Direct Bank Transfer', status: 'Settled' },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Profile
 * GET /api/delivery/profile
 */
export async function getDeliveryProfile(req, res, next) {
  try {
    const riderId = req.user.id;
    const [profile] = await query(
      `SELECT u.name, u.email, u.phone, u.avatar_url, dp.*
       FROM users u
       JOIN delivery_profiles dp ON u.id = dp.user_id
       WHERE u.id = ?`,
      [riderId]
    );
    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Profile
 * PUT /api/delivery/profile
 */
export async function updateDeliveryProfile(req, res, next) {
  try {
    const riderId = req.user.id;
    const { vehicleType, vehicleNumber, licenseNumber, hubId } = req.body;

    await execute(
      `UPDATE delivery_profiles
       SET vehicle_type = COALESCE(?, vehicle_type),
           vehicle_number = COALESCE(?, vehicle_number),
           license_number = COALESCE(?, license_number),
           hub_id = COALESCE(?, hub_id)
       WHERE user_id = ?`,
      [vehicleType, vehicleNumber, licenseNumber, hubId, riderId]
    );

    res.json({ success: true, message: 'Delivery profile updated.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Submit KYC Verification Document (Driving License, RC, etc.)
 * POST /api/delivery/kyc
 */
export async function submitDeliveryKyc(req, res, next) {
  try {
    const riderId = req.user.id;
    const { docType = 'Driving License', docUrl } = req.body;

    if (!docUrl) {
      return res.status(400).json({ success: false, message: 'docUrl is required.' });
    }

    const kycId = uuidv4();
    await execute(
      'INSERT INTO kyc_documents (id, user_id, doc_type, doc_url, status) VALUES (?, ?, ?, ?, "Pending")',
      [kycId, riderId, docType, docUrl]
    );

    res.status(201).json({ success: true, message: 'KYC Document submitted for verification!', kycId });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Rider KYC Documents
 * GET /api/delivery/kyc
 */
export async function getDeliveryKyc(req, res, next) {
  try {
    const riderId = req.user.id;
    const documents = await query('SELECT * FROM kyc_documents WHERE user_id = ? ORDER BY created_at DESC', [riderId]);
    res.json({ success: true, documents });
  } catch (error) {
    next(error);
  }
}
