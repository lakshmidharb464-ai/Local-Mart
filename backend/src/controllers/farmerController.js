import { v4 as uuidv4 } from 'uuid';
import { query, execute, withTransaction } from '../config/db.js';

/**
 * Farmer Dashboard Overview KPIs
 * GET /api/farmer/overview
 */
export async function getFarmerOverview(req, res, next) {
  try {
    const farmerId = req.user.id;

    // Total products listed
    const [prodStats] = await query(
      'SELECT COUNT(*) as active_listings, SUM(stock) as total_stock FROM products WHERE farmer_id = ? AND status = "Approved"',
      [farmerId]
    );

    // Order items fulfilled by this farmer
    const [orderStats] = await query(
      `SELECT 
        COUNT(DISTINCT oi.order_id) as total_orders,
        SUM(oi.total_price) as gross_revenue
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.farmer_id = ? AND o.status != 'Cancelled'`,
      [farmerId]
    );

    // Profile & Payout status
    const [profile] = await query('SELECT * FROM farmer_profiles WHERE user_id = ?', [farmerId]);
    const [payoutStats] = await query(
      'SELECT SUM(amount) as pending_payouts FROM farmer_payouts WHERE farmer_id = ? AND status = "Pending"',
      [farmerId]
    );

    // Recent orders
    const recentOrders = await query(
      `SELECT 
        o.id, o.created_at, o.status, o.payment_method,
        oi.product_name, oi.quantity, oi.unit, oi.total_price,
        u.name as customer_name
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN users u ON o.customer_id = u.id
       WHERE oi.farmer_id = ?
       ORDER BY o.created_at DESC
       LIMIT 5`,
      [farmerId]
    );

    res.json({
      success: true,
      kpis: {
        activeListings: prodStats?.active_listings || 0,
        totalStock: Number(prodStats?.total_stock || 0),
        totalOrders: orderStats?.total_orders || 0,
        totalRevenue: Number(orderStats?.gross_revenue || profile?.total_earnings || 0),
        pendingPayouts: Number(payoutStats?.pending_payouts || 0),
        rating: Number(profile?.rating || 5.0),
        approvalStatus: profile?.approval_status || 'Approved',
      },
      recentOrders: recentOrders.map((ro) => ({
        id: ro.id,
        date: ro.created_at,
        customerName: ro.customer_name,
        product: `${ro.product_name} (${ro.quantity} ${ro.unit})`,
        amount: Number(ro.total_price),
        status: ro.status,
        paymentMethod: ro.payment_method,
      })),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get farmer's own products
 * GET /api/farmer/products
 */
export async function getMyProducts(req, res, next) {
  try {
    const farmerId = req.user.id;

    const products = await query(
      `SELECT 
        p.*,
        c.name AS category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) AS image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.farmer_id = ?
       ORDER BY p.created_at DESC`,
      [farmerId]
    );

    res.json({
      success: true,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category_name || p.category_id,
        categoryId: p.category_id,
        categoryName: p.category_name || '',
        price: Number(p.price),
        unit: p.unit,
        stock: p.stock,
        isOrganic: Boolean(p.is_organic),
        harvestTag: p.harvest_tag,
        harvestDate: p.harvest_date,
        rating: Number(p.rating),
        reviewsCount: p.reviews_count,
        flashDiscount: Number(p.flash_discount),
        status: p.status,
        image: p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        description: p.description,
      })),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create new product listing
 * POST /api/farmer/products
 */
export async function createProduct(req, res, next) {
  try {
    const farmerId = req.user.id;
    const {
      name,
      categoryId = 'Organic Veggies',
      price,
      unit = 'kg',
      stock = 0,
      isOrganic = true,
      harvestTag = 'Harvested Fresh Today',
      harvestDate,
      description,
      imageUrl,
      images = [],
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Crop name and price are required.' });
    }

    const productId = uuidv4();

    await withTransaction(async (conn) => {
      await conn.execute(
        `INSERT INTO products (
          id, farmer_id, category_id, name, description, price, unit, stock,
          is_organic, harvest_tag, harvest_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
        [
          productId,
          farmerId,
          categoryId,
          name,
          description || '',
          Number(price),
          unit,
          Number(stock),
          isOrganic ? 1 : 0,
          harvestTag,
          harvestDate || 'Today Morning',
        ]
      );

      const allImages = images.length > 0 ? images : [imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'];

      for (let i = 0; i < allImages.length; i++) {
        await conn.execute(
          `INSERT INTO product_images (id, product_id, image_url, is_primary, display_order)
           VALUES (?, ?, ?, ?, ?)`,
          [uuidv4(), productId, allImages[i], i === 0 ? 1 : 0, i]
        );
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product listed successfully!',
      productId,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update crop listing
 * PATCH /api/farmer/products/:id
 */
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const farmerId = req.user.id;
    const { name, categoryId, price, unit, stock, isOrganic, harvestTag, harvestDate, description, flashDiscount } = req.body;

    const result = await execute(
      `UPDATE products
       SET name = COALESCE(?, name),
           category_id = COALESCE(?, category_id),
           price = COALESCE(?, price),
           unit = COALESCE(?, unit),
           stock = COALESCE(?, stock),
           is_organic = COALESCE(?, is_organic),
           harvest_tag = COALESCE(?, harvest_tag),
           harvest_date = COALESCE(?, harvest_date),
           description = COALESCE(?, description),
           flash_discount = COALESCE(?, flash_discount)
       WHERE id = ? AND farmer_id = ?`,
      [
        name,
        categoryId,
        price !== undefined ? Number(price) : null,
        unit,
        stock !== undefined ? Number(stock) : null,
        isOrganic !== undefined ? (isOrganic ? 1 : 0) : null,
        harvestTag,
        harvestDate,
        description,
        flashDiscount !== undefined ? Number(flashDiscount) : null,
        id,
        farmerId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found or unauthorized.' });
    }

    res.json({ success: true, message: 'Product updated successfully.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete product listing
 * DELETE /api/farmer/products/:id
 */
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const farmerId = req.user.id;

    const result = await execute('DELETE FROM products WHERE id = ? AND farmer_id = ?', [id, farmerId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found or unauthorized.' });
    }

    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Farmer Orders
 * GET /api/farmer/orders
 */
export async function getFarmerOrders(req, res, next) {
  try {
    const farmerId = req.user.id;
    const { filter, status } = req.query;

    let sql = `
      SELECT 
        o.id, o.created_at, o.status, o.payment_method, o.payment_status, o.address_text,
        u.name AS customer_name,
        u.phone AS customer_phone,
        oi.id AS item_id, oi.product_name, oi.quantity, oi.unit, oi.unit_price, oi.total_price
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN users u ON o.customer_id = u.id
       WHERE oi.farmer_id = ?
    `;

    const params = [farmerId];

    if (status && status !== 'all') {
      sql += ` AND o.status = ?`;
      params.push(status);
    } else if (filter === 'active') {
      sql += ` AND o.status IN ("Pending", "Approved", "Packed", "Assigned", "Accepted", "Picked Up", "Out for Delivery")`;
    } else if (filter === 'delivered') {
      sql += ` AND o.status = "Delivered"`;
    } else if (filter === 'cancelled') {
      sql += ` AND o.status IN ("Cancelled", "Failed")`;
    }

    sql += ` ORDER BY o.created_at DESC`;

    const orders = await query(sql, params);

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Order status from Farmer end (e.g. Packed / Ready for courier)
 * PATCH /api/farmer/orders/:id/status
 */
export async function updateFarmerOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status = 'Packed', note = 'Produce packed fresh from farm.' } = req.body;
    const farmerId = req.user.id;

    await execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    await execute(
      'INSERT INTO order_timeline (id, order_id, title, description, actor_id, actor_role) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), id, `Order ${status}`, note, farmerId, 'Farmer']
    );

    res.json({ success: true, message: `Order status updated to ${status}.` });
  } catch (error) {
    next(error);
  }
}

/**
 * Harvest Planner Schedules
 * GET /api/farmer/harvest-plans
 */
export async function getHarvestPlans(req, res, next) {
  try {
    const farmerId = req.user.id;
    const plans = await query(
      'SELECT * FROM farmer_harvest_plans WHERE farmer_id = ? ORDER BY start_date DESC',
      [farmerId]
    );
    res.json({ success: true, plans });
  } catch (error) {
    next(error);
  }
}

/**
 * Create Harvest Plan
 * POST /api/farmer/harvest-plans
 */
export async function createHarvestPlan(req, res, next) {
  try {
    const farmerId = req.user.id;
    const { cropName, startDate, endDate, expectedVolume } = req.body;

    if (!cropName || !startDate || !endDate || !expectedVolume) {
      return res.status(400).json({ success: false, message: 'All harvest plan fields are required.' });
    }

    const planId = uuidv4();
    await execute(
      `INSERT INTO farmer_harvest_plans (id, farmer_id, crop_name, start_date, end_date, expected_volume, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Active')`,
      [planId, farmerId, cropName, startDate, endDate, Number(expectedVolume)]
    );

    res.status(201).json({ success: true, message: 'Harvest schedule planned!', planId });
  } catch (error) {
    next(error);
  }
}

/**
 * Broadcast Harvest Alert to Customers
 * POST /api/farmer/harvest-plans/:id/broadcast
 */
export async function broadcastHarvestAlert(req, res, next) {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const farmerId = req.user.id;

    await execute(
      `UPDATE farmer_harvest_plans
       SET buyer_notified = 1, last_broadcast_msg = ?
       WHERE id = ? AND farmer_id = ?`,
      [message || 'Fresh harvest upcoming next week!', id, farmerId]
    );

    res.json({ success: true, message: 'Harvest alert broadcast to nearby subscribers and buyers!' });
  } catch (error) {
    next(error);
  }
}

/**
 * Inventory Batches & Spoilage Log
 * GET /api/farmer/inventory/batches
 */
export async function getBatches(req, res, next) {
  try {
    const farmerId = req.user.id;
    const batches = await query(
      `SELECT ib.*, p.name AS product_name
       FROM inventory_batches ib
       JOIN products p ON ib.product_id = p.id
       WHERE ib.farmer_id = ?
       ORDER BY ib.created_at DESC`,
      [farmerId]
    );
    res.json({ success: true, batches });
  } catch (error) {
    next(error);
  }
}

/**
 * Log Batch Spoilage / Waste
 * POST /api/farmer/inventory/batches
 */
export async function logBatchSpoilage(req, res, next) {
  try {
    const farmerId = req.user.id;
    const { productId, batchNumber, harvestDate, quantity, wasteQuantity = 0, wasteReason } = req.body;

    const batchId = uuidv4();
    await execute(
      `INSERT INTO inventory_batches (id, product_id, farmer_id, batch_number, harvest_date, quantity, waste_quantity, waste_reason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [batchId, productId, farmerId, batchNumber || `BAT-${Date.now().toString().slice(-4)}`, harvestDate || new Date(), Number(quantity), Number(wasteQuantity), wasteReason || 'Grading & sorting']
    );

    res.status(201).json({ success: true, message: 'Batch logged successfully!', batchId });
  } catch (error) {
    next(error);
  }
}

/**
 * Request Payout
 * POST /api/farmer/payouts
 */
export async function requestPayout(req, res, next) {
  try {
    const farmerId = req.user.id;
    const { amount, bankAccountNo, bankIfsc, bankName } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payout amount is required.' });
    }

    const commissionDeducted = (Number(amount) * 5) / 100; // 5% platform commission
    const netPayout = Number(amount) - commissionDeducted;
    const payoutId = uuidv4();

    await execute(
      `INSERT INTO farmer_payouts (id, farmer_id, amount, commission_deducted, net_payout, status, bank_account_no, bank_ifsc, bank_name)
       VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?, ?)`,
      [payoutId, farmerId, Number(amount), commissionDeducted, netPayout, bankAccountNo || 'HDFC0001234', bankIfsc || 'HDFC0001234', bankName || 'Bank']
    );

    res.status(201).json({ success: true, message: 'Payout request initiated!', payoutId, netPayout });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Farmer Profile
 * GET /api/farmer/profile
 */
export async function getFarmerProfile(req, res, next) {
  try {
    const farmerId = req.user.id;
    const [profile] = await query('SELECT * FROM farmer_profiles WHERE user_id = ?', [farmerId]);
    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Farmer Profile
 * PUT /api/farmer/profile
 */
export async function updateFarmerProfile(req, res, next) {
  try {
    const farmerId = req.user.id;
    const { farmName, locationAddress, district, state, experienceYears, specialty, organicCertified, certificateUrl } = req.body;

    await execute(
      `UPDATE farmer_profiles
       SET farm_name = COALESCE(?, farm_name),
           location_address = COALESCE(?, location_address),
           district = COALESCE(?, district),
           state = COALESCE(?, state),
           experience_years = COALESCE(?, experience_years),
           specialty = COALESCE(?, specialty),
           organic_certified = COALESCE(?, organic_certified),
           certificate_url = COALESCE(?, certificate_url)
       WHERE user_id = ?`,
      [
        farmName,
        locationAddress,
        district,
        state,
        experienceYears !== undefined ? Number(experienceYears) : null,
        specialty,
        organicCertified !== undefined ? (organicCertified ? 1 : 0) : null,
        certificateUrl,
        farmerId,
      ]
    );

    res.json({ success: true, message: 'Farmer profile updated.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Submit KYC Verification Document (Cloudinary URL)
 * POST /api/farmer/kyc
 */
export async function submitFarmerKyc(req, res, next) {
  try {
    const farmerId = req.user.id;
    const { docType = 'Organic Farming Certificate', docUrl } = req.body;

    if (!docUrl) {
      return res.status(400).json({ success: false, message: 'docUrl is required.' });
    }

    const kycId = uuidv4();
    await execute(
      'INSERT INTO kyc_documents (id, user_id, doc_type, doc_url, status) VALUES (?, ?, ?, ?, "Pending")',
      [kycId, farmerId, docType, docUrl]
    );

    res.status(201).json({ success: true, message: 'KYC Document submitted for verification!', kycId });
  } catch (error) {
    next(error);
  }
}

/**
 * Get My KYC Documents
 * GET /api/farmer/kyc
 */
export async function getFarmerKyc(req, res, next) {
  try {
    const farmerId = req.user.id;
    const documents = await query('SELECT * FROM kyc_documents WHERE user_id = ? ORDER BY created_at DESC', [farmerId]);
    res.json({ success: true, documents });
  } catch (error) {
    next(error);
  }
}
