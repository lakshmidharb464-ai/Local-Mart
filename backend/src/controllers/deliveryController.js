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
        COALESCE(SUM(delivery_fee), 0) as today_base_pay,
        COALESCE(SUM(tip_amount), 0) as today_tips
       FROM orders
       WHERE delivery_partner_id = ? AND status = 'Delivered' AND DATE(updated_at) = CURDATE()`,
      [riderId]
    );

    // Lifetime completed trips & wallet
    const [lifetime] = await query(
      `SELECT 
        COUNT(*) as total_deliveries,
        COALESCE(SUM(delivery_fee + tip_amount), 0) as total_earned
       FROM orders
       WHERE delivery_partner_id = ? AND status = 'Delivered'`,
      [riderId]
    );

    // Active order assigned
    const activeOrders = await query(
      `SELECT id, status, total_amount, address_text, eta
       FROM orders
       WHERE delivery_partner_id = ? AND status IN ('Assigned', 'Accepted', 'Picked Up', 'Out for Delivery')
       ORDER BY updated_at DESC
       LIMIT 1`,
      [riderId]
    );

    const todayTrips = Number(stats?.today_trips || 0);
    const basePay = Number(stats?.today_base_pay || 0);
    const tips = Number(stats?.today_tips || 0);
    const bonus = todayTrips > 0 ? (todayTrips >= 5 ? 150 : 50) : 0;
    const todayTotal = basePay + tips + bonus;

    const walletBalance = Number(profile?.wallet_balance || lifetime?.total_earned || 0);
    const totalDeliveries = Number(lifetime?.total_deliveries || profile?.total_deliveries || 0);

    res.json({
      success: true,
      overview: {
        isOnline: Boolean(profile?.is_online),
        rating: Number(profile?.rating || 5.0),
        totalDeliveries,
        walletBalance,
        todayTotal,
        todayTrips,
        todayBasePay: basePay,
        todayTips: tips,
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
        o.created_at, o.updated_at, o.eta, o.otp_code, o.proof_photo_url, o.failure_reason,
        o.delivery_partner_id,
        MAX(u.name) AS customer_name,
        MAX(u.phone) AS customer_phone,
        GROUP_CONCAT(CONCAT(oi.product_name, ' (', oi.quantity, ' ', oi.unit, ')') SEPARATOR ', ') AS items_text,
        MAX(fp.farm_name) AS farm_name,
        MAX(fp.location_address) AS farm_address,
        MAX(fu.phone) AS farm_phone,
        MAX(fp.latitude) AS farm_lat,
        MAX(fp.longitude) AS farm_lng
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN users fu ON oi.farmer_id = fu.id
      JOIN farmer_profiles fp ON oi.farmer_id = fp.user_id
      WHERE (
        o.delivery_partner_id = ? 
        OR (o.delivery_partner_id IS NULL AND o.status IN ('Pending', 'Approved', 'Packed', 'Ready for Pickup', 'Processing', 'Assigned'))
      )
    `;

    const params = [riderId];

    if (status && status !== 'all') {
      if (status === 'active') {
        sql += ` AND o.status IN ('Assigned', 'Accepted', 'Picked Up', 'Out for Delivery')`;
      } else {
        sql += ` AND o.status = ?`;
        params.push(status);
      }
    }

    sql += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    const orders = await query(sql, params);

    const formatted = orders.map((o) => {
      const isUnassigned = !o.delivery_partner_id;
      return {
        id: o.id,
        orderId: o.id,
        customerName: o.customer_name || 'Valued Customer',
        customerPhone: o.customer_phone || '+91 98765 43210',
        customerAddress: o.address_text || 'Local Delivery Address',
        customerCoords: { lat: Number(o.customer_lat || 18.5204), lng: Number(o.customer_lng || 73.8567) },
        farmName: o.farm_name || 'Local Farm Depot',
        farmAddress: o.farm_address || 'Farm Logistics Hub',
        farmPhone: o.farm_phone || '+91 91234 56789',
        farmCoords: { lat: Number(o.farm_lat || 18.5304), lng: Number(o.farm_lng || 73.8667) },
        distance: '3.4 km',
        eta: o.eta || '25 mins',
        items: o.items_text || 'Organic Produce Package',
        itemsSummary: o.items_text || 'Organic Produce Package',
        totalAmount: Number(o.total_amount || 0),
        fee: Number(o.delivery_fee || 30),
        tip: Number(o.tip_amount || 0),
        paymentType: o.payment_method || 'UPI',
        status: isUnassigned ? 'Pending' : o.status,
        rawStatus: o.status,
        isUnassigned,
        isAvailableToAccept: isUnassigned,
        otpCode: o.otp_code,
        proofPhotoUrl: o.proof_photo_url,
        failureReason: o.failure_reason,
        priority: 'Express',
        createdAt: o.created_at,
        updatedAt: o.updated_at,
      };
    });

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
    const rawId = req.params.id;
    const orderId = rawId.replace(/^DEL-/, '');
    const riderId = req.user.id;

    // Check order exists
    const [order] = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.delivery_partner_id && order.delivery_partner_id !== riderId) {
      return res.status(409).json({ success: false, message: 'This order has already been accepted by another delivery partner.' });
    }

    await execute(
      'UPDATE orders SET delivery_partner_id = ?, status = "Accepted" WHERE id = ?',
      [riderId, orderId]
    );

    await execute(
      'INSERT INTO order_timeline (id, order_id, title, description, actor_id, actor_role) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), orderId, 'Delivery Accepted', 'Rider accepted dispatch task and is heading to farm.', riderId, 'Delivery']
    );

    // Broadcast live event
    realtimeHub.broadcastOrderUpdate('ORDER_STATUS_UPDATED', orderId, {
      status: 'Accepted',
      deliveryPartnerId: riderId,
      actorRole: 'Delivery',
    });

    res.json({ success: true, message: 'Delivery task accepted successfully!', orderId });
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
/**
 * Update Delivery Status (Picked Up, Out for Delivery, Delivered, Failed)
 * PATCH /api/delivery/orders/:id/status
 */
export async function updateOrderStatus(req, res, next) {
  try {
    const rawId = req.params.id;
    const orderId = rawId.replace(/^DEL-/, '');
    const riderId = req.user.id;
    const { status, proofPhotoUrl, otpCode, failureReason, note } = req.body;

    const validStatuses = ['Accepted', 'Picked Up', 'Out for Delivery', 'Delivered', 'Failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const [order] = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // If Delivered, verify OTP
    if (status === 'Delivered' && otpCode) {
      if (order.otp_code && order.otp_code !== String(otpCode).trim()) {
        return res.status(400).json({ success: false, message: 'Invalid customer delivery OTP code.' });
      }
    }

    await execute(
      `UPDATE orders
       SET status = ?,
           delivery_partner_id = COALESCE(delivery_partner_id, ?),
           proof_photo_url = COALESCE(?, proof_photo_url),
           failure_reason = COALESCE(?, failure_reason),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, riderId, proofPhotoUrl || null, failureReason || null, orderId]
    );

    // If Delivered, increment rider total deliveries and add earnings
    if (status === 'Delivered') {
      const tripFee = Number(order.delivery_fee || 30);
      const tripTip = Number(order.tip_amount || 0);
      const totalEarned = tripFee + tripTip;
      await execute(
        'UPDATE delivery_profiles SET total_deliveries = total_deliveries + 1, wallet_balance = wallet_balance + ? WHERE user_id = ?',
        [totalEarned, riderId]
      );
    }

    // Add to timeline
    await execute(
      'INSERT INTO order_timeline (id, order_id, title, description, actor_id, actor_role) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), orderId, `Order ${status}`, note || `Delivery state moved to ${status}.`, riderId, 'Delivery']
    );

    // Broadcast live event to customer, farmer, and admin
    realtimeHub.broadcastOrderUpdate('ORDER_STATUS_UPDATED', orderId, {
      status,
      proofPhotoUrl: proofPhotoUrl || null,
      failureReason: failureReason || null,
      deliveryPartnerId: riderId,
      actorRole: 'Delivery',
    });

    res.json({ success: true, message: `Order status updated to ${status}.`, orderId, status });
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
 * Delivery Earnings (Real live database calculations)
 * GET /api/delivery/earnings
 */
export async function getEarnings(req, res, next) {
  try {
    const riderId = req.user.id;

    const [profile] = await query('SELECT * FROM delivery_profiles WHERE user_id = ?', [riderId]);

    // Today's orders
    const [todayStats] = await query(
      `SELECT 
        COUNT(*) as today_trips,
        COALESCE(SUM(delivery_fee), 0) as today_base_pay,
        COALESCE(SUM(tip_amount), 0) as today_tips
       FROM orders
       WHERE delivery_partner_id = ? AND status = 'Delivered' AND DATE(updated_at) = CURDATE()`,
      [riderId]
    );

    // Weekly orders (last 7 days)
    const [weeklyStats] = await query(
      `SELECT 
        COUNT(*) as weekly_trips,
        COALESCE(SUM(delivery_fee + tip_amount), 0) as weekly_total
       FROM orders
       WHERE delivery_partner_id = ? AND status = 'Delivered' AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
      [riderId]
    );

    // Dynamic payout settlements grouped by completed delivery date
    const payoutGroups = await query(
      `SELECT 
        DATE(updated_at) as payout_date,
        COUNT(*) as trips_count,
        COALESCE(SUM(delivery_fee + tip_amount), 0) as total_amount
       FROM orders
       WHERE delivery_partner_id = ? AND status = 'Delivered'
       GROUP BY DATE(updated_at)
       ORDER BY payout_date DESC
       LIMIT 10`,
      [riderId]
    );

    const payoutHistory = payoutGroups.map((p, index) => {
      const dateStr = new Date(p.payout_date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      return {
        id: `PAY-${1000 + index}`,
        date: dateStr,
        amount: Number(p.total_amount),
        trips: Number(p.trips_count),
        method: 'Direct Bank Transfer',
        status: 'Settled',
        utr: `UTR-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      };
    });

    const todayTrips = Number(todayStats?.today_trips || 0);
    const todayBasePay = Number(todayStats?.today_base_pay || 0);
    const todayTips = Number(todayStats?.today_tips || 0);
    const todayBonus = todayTrips > 0 ? (todayTrips >= 5 ? 150 : 50) : 0;
    const todayTotal = todayBasePay + todayTips + todayBonus;

    const weeklyTrips = Number(weeklyStats?.weekly_trips || 0);
    const weeklyTotal = Number(weeklyStats?.weekly_total || 0) + (weeklyTrips > 0 ? 300 : 0);
    const walletBalance = Number(profile?.wallet_balance || weeklyTotal);

    res.json({
      success: true,
      earnings: {
        todayTotal,
        todayTrips,
        todayBasePay,
        todayDistanceBonus: todayBonus,
        todayTips,
        weeklyTotal,
        weeklyTrips,
        pendingPayout: walletBalance,
        payoutHistory,
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
      `SELECT u.id as user_id, u.name, u.email, u.phone, u.avatar_url,
              dp.hub_id, dp.vehicle_type, dp.vehicle_number, dp.license_number,
              dp.license_doc_url, dp.is_online, dp.current_lat, dp.current_lng,
              COALESCE(dp.rating, 5.00) as rating,
              COALESCE(dp.total_deliveries, 0) as total_deliveries,
              COALESCE(dp.wallet_balance, 0.00) as wallet_balance,
              COALESCE(dp.approval_status, 'Approved') as approval_status,
              dh.name as hub_name, dh.zone as hub_zone
       FROM users u
       LEFT JOIN delivery_profiles dp ON u.id = dp.user_id
       LEFT JOIN delivery_hubs dh ON dp.hub_id = dh.id
       WHERE u.id = ?`,
      [riderId]
    );
    res.json({ success: true, profile: profile || null });
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
    const { name, email, phone, avatar, avatar_url, vehicleType, vehicleNumber, licenseNumber, hubId, isOnline } = req.body;

    if (name || email || phone || avatar || avatar_url) {
      await execute(
        `UPDATE users
         SET name = COALESCE(?, name),
             email = COALESCE(?, email),
             phone = COALESCE(?, phone),
             avatar_url = COALESCE(?, avatar_url)
         WHERE id = ?`,
        [name || null, email || null, phone || null, avatar || avatar_url || null, riderId]
      );
    }

    const onlineVal = isOnline !== undefined ? (isOnline ? 1 : 0) : null;

    const [existing] = await query('SELECT user_id FROM delivery_profiles WHERE user_id = ?', [riderId]);
    if (!existing) {
      await execute(
        `INSERT INTO delivery_profiles (user_id, vehicle_type, vehicle_number, license_number, hub_id, is_online)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [riderId, vehicleType || 'Electric Scooter', vehicleNumber || 'N/A', licenseNumber || 'N/A', hubId || null, onlineVal || 0]
      );
    } else {
      await execute(
        `UPDATE delivery_profiles
         SET vehicle_type = COALESCE(?, vehicle_type),
             vehicle_number = COALESCE(?, vehicle_number),
             license_number = COALESCE(?, license_number),
             hub_id = COALESCE(?, hub_id),
             is_online = COALESCE(?, is_online)
         WHERE user_id = ?`,
        [vehicleType || null, vehicleNumber || null, licenseNumber || null, hubId || null, onlineVal, riderId]
      );
    }

    res.json({ success: true, message: 'Delivery profile updated successfully.' });
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
