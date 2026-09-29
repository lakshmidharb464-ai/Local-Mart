import { v4 as uuidv4 } from 'uuid';
import { query, execute, withTransaction } from '../config/db.js';

/**
 * Platform Metrics & Sparkline Stats
 * GET /api/admin/metrics
 */
export async function getPlatformMetrics(req, res, next) {
  try {
    const [farmerCount] = await query('SELECT COUNT(*) as total FROM users WHERE role = "Farmer"');
    const [customerCount] = await query('SELECT COUNT(*) as total FROM users WHERE role = "Customer"');
    const [deliveryCount] = await query('SELECT COUNT(*) as total FROM users WHERE role = "Delivery"');
    const [productCount] = await query('SELECT COUNT(*) as total FROM products WHERE status = "Approved"');
    const [orderStats] = await query('SELECT COUNT(*) as total_orders, SUM(total_amount) as total_revenue FROM orders WHERE status != "Cancelled"');

    res.json({
      success: true,
      metrics: {
        totalFarmers: farmerCount?.total ?? 0,
        totalCustomers: customerCount?.total ?? 0,
        totalRiders: deliveryCount?.total ?? 0,
        totalProducts: productCount?.total ?? 0,
        totalOrders: orderStats?.total_orders ?? 0,
        totalRevenue: Number(orderStats?.total_revenue ?? 0),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all products for moderation
 * GET /api/admin/products
 */
export async function getAdminProducts(req, res, next) {
  try {
    const products = await query(
      `SELECT 
        p.*,
        u.name AS farmer_name,
        c.name AS category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
       FROM products p
       JOIN users u ON p.farmer_id = u.id
       JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
}

/**
 * Moderate Product (Approve / Reject / Inactive)
 * PATCH /api/admin/products/:id/moderate
 */
export async function moderateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;
    const adminId = req.user.id;

    await execute('UPDATE products SET status = ? WHERE id = ?', [status, id]);

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `Product Status changed to ${status} (${remark || ''})`, `products:${id}`, req.ip]
    );

    res.json({ success: true, message: `Product marked as ${status}.` });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all platform orders
 * GET /api/admin/orders
 */
export async function getAdminOrders(req, res, next) {
  try {
    const orders = await query(
      `SELECT 
        o.*,
        cu.name AS customer_name,
        cu.email AS customer_email,
        ru.name AS delivery_partner_name,
        COUNT(oi.id) AS items_count,
        GROUP_CONCAT(CONCAT(oi.product_name, ' (', oi.quantity, ' ', oi.unit, ')') SEPARATOR ', ') AS items_summary
       FROM orders o
       JOIN users cu ON o.customer_id = cu.id
       LEFT JOIN users ru ON o.delivery_partner_id = ru.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

/**
 * Override Dispatch / Assign Rider
 * PATCH /api/admin/orders/:id/dispatch
 */
export async function overrideDispatch(req, res, next) {
  try {
    const { id } = req.params;
    const { riderId } = req.body;
    const adminId = req.user.id;

    await execute('UPDATE orders SET delivery_partner_id = ?, status = "Assigned" WHERE id = ?', [riderId, id]);

    await execute(
      'INSERT INTO order_timeline (id, order_id, title, description, actor_id, actor_role) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), id, 'Admin Reassigned Dispatch', `Dispatch assigned to rider ${riderId}`, adminId, 'Admin']
    );

    res.json({ success: true, message: 'Courier dispatch assigned successfully.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all farmers for admin management
 * GET /api/admin/farmers
 */
export async function getAdminFarmers(req, res, next) {
  try {
    const farmers = await query(
      `SELECT 
        u.id, u.name, u.email, u.phone, u.avatar_url, u.created_at,
        fp.farm_name, fp.location_address, fp.experience_years, fp.specialty,
        fp.rating, fp.total_earnings, fp.approval_status, fp.account_status, fp.badge,
        COUNT(p.id) AS products_count
       FROM users u
       JOIN farmer_profiles fp ON u.id = fp.user_id
       LEFT JOIN products p ON u.id = p.farmer_id
       WHERE u.role = 'Farmer'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );

    res.json({ success: true, farmers });
  } catch (error) {
    next(error);
  }
}

/**
 * Verify / Approve Farmer
 * PATCH /api/admin/farmers/:id/verify
 */
export async function verifyFarmer(req, res, next) {
  try {
    const { id } = req.params;
    const { approvalStatus, accountStatus, badge } = req.body;
    const adminId = req.user.id;

    await execute(
      `UPDATE farmer_profiles
       SET approval_status = COALESCE(?, approval_status),
           account_status = COALESCE(?, account_status),
           badge = COALESCE(?, badge)
       WHERE user_id = ?`,
      [approvalStatus, accountStatus, badge, id]
    );

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `Farmer verification updated (${approvalStatus || accountStatus})`, `farmer_profiles:${id}`, req.ip]
    );

    res.json({ success: true, message: 'Farmer status updated successfully.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all Customers
 * GET /api/admin/customers
 */
export async function getAdminCustomers(req, res, next) {
  try {
    const customers = await query(
      `SELECT 
        u.id, u.name, u.email, u.phone, u.is_active, u.created_at,
        cl.order_count, cl.total_spent, cl.tier
       FROM users u
       LEFT JOIN customer_loyalty cl ON u.id = cl.customer_id
       WHERE u.role = 'Customer'
       ORDER BY u.created_at DESC`
    );

    res.json({ success: true, customers });
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle Customer status
 * PATCH /api/admin/customers/:id/status
 */
export async function setCustomerStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const adminId = req.user.id;

    await execute('UPDATE users SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id]);

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `Customer account ${isActive ? 'Activated' : 'Deactivated'}`, `users:${id}`, req.ip]
    );

    res.json({ success: true, message: 'Customer account status updated.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Delivery Fleet
 * GET /api/admin/delivery-partners
 */
export async function getAdminDeliveryFleet(req, res, next) {
  try {
    const fleet = await query(
      `SELECT 
        u.id, u.name, u.email, u.phone, u.avatar_url,
        dp.vehicle_type, dp.vehicle_number, dp.license_number,
        dp.is_online, dp.rating, dp.total_deliveries, dp.wallet_balance, dp.approval_status
       FROM users u
       JOIN delivery_profiles dp ON u.id = dp.user_id
       WHERE u.role = 'Delivery'
       ORDER BY u.created_at DESC`
    );

    res.json({ success: true, fleet });
  } catch (error) {
    next(error);
  }
}

/**
 * Platform Reports & Analytics
 * GET /api/admin/reports
 */
export async function getAdminReports(req, res, next) {
  try {
    res.json({
      success: true,
      reports: {
        monthlySales: [
          { month: 'Jan', revenue: 142000, orders: 340 },
          { month: 'Feb', revenue: 168000, orders: 410 },
          { month: 'Mar', revenue: 210000, orders: 520 },
          { month: 'Apr', revenue: 195000, orders: 480 },
          { month: 'May', revenue: 245000, orders: 610 },
          { month: 'Jun', revenue: 280000, orders: 720 },
          { month: 'Jul', revenue: 315000, orders: 840 },
          { month: 'Aug', revenue: 348000, orders: 910 },
        ],
        topProducts: [
          { name: 'Pure A2 Gir Cow Milk', sales: '1,420 units', revenue: 113600 },
          { name: 'Devgad Alphonso Mangoes', sales: '520 dozen', revenue: 338000 },
          { name: 'Fresh Farm Organic Tomatoes', sales: '2,100 kg', revenue: 84000 },
          { name: 'Handcrafted Bilona Ghee', sales: '380 jars', revenue: 361000 },
        ],
        farmerPerformers: [
          { name: 'Mahesh Deshmukh', area: 'Satara', rating: 4.98, totalOrders: 420 },
          { name: 'Rajesh Kumar', area: 'Pune Hub', rating: 4.90, totalOrders: 380 },
          { name: 'Sunita Patil', area: 'Nashik', rating: 4.95, totalOrders: 310 },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * System Settings
 * GET /api/admin/settings
 * PUT /api/admin/settings
 */
export async function getAdminSettings(req, res, next) {
  try {
    const settings = await query('SELECT * FROM system_settings');
    const config = {};
    settings.forEach((s) => {
      config[s.setting_key] = typeof s.setting_value === 'string' ? JSON.parse(s.setting_value) : s.setting_value;
    });
    res.json({ success: true, settings: config });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminSettings(req, res, next) {
  try {
    const { settings } = req.body;
    const adminId = req.user.id;

    for (const [key, val] of Object.entries(settings)) {
      await execute(
        'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, JSON.stringify(val), JSON.stringify(val)]
      );
    }

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, 'Updated System Settings', 'system_settings', req.ip]
    );

    res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (error) {
    next(error);
  }
}

/**
 * KYC Verification Queue
 * GET /api/admin/kyc-queue
 */
export async function getKycQueue(req, res, next) {
  try {
    const queue = await query(
      `SELECT 
        kd.*,
        u.name AS user_name,
        u.email AS user_email,
        u.role AS user_role,
        u.phone AS user_phone
       FROM kyc_documents kd
       JOIN users u ON kd.user_id = u.id
       ORDER BY kd.created_at DESC`
    );

    res.json({ success: true, queue });
  } catch (error) {
    next(error);
  }
}

/**
 * KYC Decision (Approve / Reject)
 * PATCH /api/admin/kyc-queue/:id/decision
 */
export async function decideKyc(req, res, next) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const adminId = req.user.id;

    await execute(
      'UPDATE kyc_documents SET status = ?, admin_notes = ? WHERE id = ?',
      [status, notes || null, id]
    );

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `KYC Document marked as ${status}`, `kyc_documents:${id}`, req.ip]
    );

    res.json({ success: true, message: `Document has been ${status}.` });
  } catch (error) {
    next(error);
  }
}

/**
 * Immutable Audit Logs
 * GET /api/admin/audit-logs
 */
export async function getAuditLogs(req, res, next) {
  try {
    const logs = await query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
}
