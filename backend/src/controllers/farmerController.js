import { v4 as uuidv4 } from 'uuid';
import { query, execute, withTransaction } from '../config/db.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

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

function resolveCategoryId(cat) {
  if (!cat) return 'Organic Veggies';
  const c = String(cat).toLowerCase();
  if (c.includes('veg') || c.includes('vegetable')) return 'Organic Veggies';
  if (c.includes('fruit') || c.includes('season') || c.includes('apple') || c.includes('mango')) return 'Seasonal Picks';
  if (c.includes('milk') || c.includes('dairy') || c.includes('egg')) return 'Dairy & Eggs';
  if (c.includes('bulk') || c.includes('box')) return 'Bulk Farm Boxes';
  if (c.includes('groc') || c.includes('oil') || c.includes('grain') || c.includes('pulse') || c.includes('honey')) return 'Grocery & Oils';
  return cat;
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
      categoryId,
      category,
      price,
      unit = 'kg',
      stock = 0,
      isOrganic = true,
      harvestTag = 'Harvested Fresh Today',
      harvestDate,
      description,
      imageUrl,
      image,
      images = [],
    } = req.body;

    if (!name || price === undefined || price === null || price === '') {
      return res.status(400).json({ success: false, message: 'Crop name and price are required.' });
    }

    const targetCategoryId = resolveCategoryId(categoryId || category);
    const productId = uuidv4();

    await withTransaction(async (conn) => {
      await conn.execute(
        `INSERT INTO products (
          id, farmer_id, category_id, name, description, price, unit, stock,
          is_organic, harvest_tag, harvest_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Approved')`,
        [
          productId,
          farmerId,
          targetCategoryId,
          name,
          description || 'Fresh farm harvest directly from verified local fields.',
          Number(price),
          unit,
          Number(stock),
          isOrganic ? 1 : 0,
          harvestTag || 'Harvested Today 5:30 AM',
          harvestDate || 'Today Morning',
        ]
      );

      const chosenImage = imageUrl || image || (images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80');
      const allImages = images.length > 0 ? images : [chosenImage];

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
    const { 
      name, 
      categoryId, 
      category, 
      price, 
      unit, 
      stock, 
      isOrganic, 
      harvestTag, 
      harvestDate, 
      description, 
      flashDiscount,
      status,
      imageUrl,
      image,
      images,
    } = req.body;

    const targetCategoryId = (categoryId || category) ? resolveCategoryId(categoryId || category) : null;

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
           flash_discount = COALESCE(?, flash_discount),
           status = COALESCE(?, status)
       WHERE id = ? AND farmer_id = ?`,
      [
        name ?? null,
        targetCategoryId ?? null,
        price !== undefined && price !== null ? Number(price) : null,
        unit ?? null,
        stock !== undefined && stock !== null ? Number(stock) : null,
        isOrganic !== undefined && isOrganic !== null ? (isOrganic ? 1 : 0) : null,
        harvestTag ?? null,
        harvestDate ?? null,
        description ?? null,
        flashDiscount !== undefined && flashDiscount !== null ? Number(flashDiscount) : null,
        status ?? null,
        id,
        farmerId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found or unauthorized.' });
    }

    // Update image if provided
    const newImage = imageUrl || image || (Array.isArray(images) && images.length > 0 ? images[0] : null);
    if (newImage) {
      const [existing] = await query('SELECT id FROM product_images WHERE product_id = ? AND is_primary = 1 LIMIT 1', [id]);
      if (existing) {
        await execute('UPDATE product_images SET image_url = ? WHERE id = ?', [newImage, existing.id]);
      } else {
        await execute(
          'INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, 1, 0)',
          [uuidv4(), id, newImage]
        );
      }
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

    // 1. Fetch associated Cloudinary images to clean up
    const images = await query(
      'SELECT cloudinary_public_id, image_url FROM product_images WHERE product_id = ?',
      [id]
    );

    // 2. Delete product record from database (cascades to product_images)
    const result = await execute('DELETE FROM products WHERE id = ? AND farmer_id = ?', [id, farmerId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found or unauthorized.' });
    }

    // 3. Asynchronously purge assets from Cloudinary
    if (images && images.length > 0) {
      Promise.all(
        images.map((img) => {
          if (img.cloudinary_public_id) {
            return deleteFromCloudinary(img.cloudinary_public_id);
          }
          return Promise.resolve();
        })
      ).catch((err) => console.warn('Cloudinary asset cleanup notice:', err.message));
    }

    res.json({ success: true, message: 'Product and associated media deleted successfully.' });
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
 * Get Farmer Payouts History
 * GET /api/farmer/payouts
 */
export async function getFarmerPayouts(req, res, next) {
  try {
    const farmerId = req.user.id;
    const payouts = await query(
      'SELECT * FROM farmer_payouts WHERE farmer_id = ? ORDER BY created_at DESC',
      [farmerId]
    );
    res.json({ success: true, payouts });
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
    const [profile] = await query(
      `SELECT u.name, u.email, u.phone, u.avatar_url, fp.*
       FROM users u
       LEFT JOIN farmer_profiles fp ON u.id = fp.user_id
       WHERE u.id = ?`,
      [farmerId]
    );
    res.json({ success: true, profile: profile || null });
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
    const { name, email, phone, avatar, avatar_url, farmName, locationAddress, district, state, experienceYears, specialty, organicCertified, certificateUrl } = req.body;

    if (name || email || phone || avatar || avatar_url) {
      await execute(
        `UPDATE users
         SET name = COALESCE(?, name),
             email = COALESCE(?, email),
             phone = COALESCE(?, phone),
             avatar_url = COALESCE(?, avatar_url)
         WHERE id = ?`,
        [name || null, email || null, phone || null, avatar || avatar_url || null, farmerId]
      );
    }

    const [existing] = await query('SELECT user_id FROM farmer_profiles WHERE user_id = ?', [farmerId]);
    if (!existing) {
      await execute(
        `INSERT INTO farmer_profiles (user_id, farm_name, location_address, district, state, experience_years, specialty, organic_certified, certificate_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [farmerId, farmName || 'My Farm', locationAddress || 'Local Farm Area', district || 'Pune', state || 'Maharashtra', experienceYears || 5, specialty || 'Organic Produce', organicCertified ? 1 : 0, certificateUrl || null]
      );
    } else {
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
          farmName || null,
          locationAddress || null,
          district || null,
          state || null,
          experienceYears !== undefined ? Number(experienceYears) : null,
          specialty || null,
          organicCertified !== undefined ? (organicCertified ? 1 : 0) : null,
          certificateUrl || null,
          farmerId,
        ]
      );
    }

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

/**
 * Delete Harvest Plan
 * DELETE /api/farmer/harvest-plans/:id
 */
export async function deleteHarvestPlan(req, res, next) {
  try {
    const { id } = req.params;
    const farmerId = req.user.id;
    await execute('DELETE FROM farmer_harvest_plans WHERE id = ? AND farmer_id = ?', [id, farmerId]);
    res.json({ success: true, message: 'Harvest schedule removed from database.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Broadcast harvest / seasonal announcement to customers
 * POST /api/farmer/broadcast
 */
export async function postBroadcast(req, res, next) {
  try {
    const farmerId = req.user.id;
    const { message, title = 'Fresh Harvest Alert' } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Broadcast message is required.' });
    }
    const customers = await query("SELECT id FROM users WHERE role = 'Customer'");
    for (const cust of customers) {
      await execute(
        "INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, 'harvest')",
        [uuidv4(), cust.id, title, message]
      );
    }
    res.json({ success: true, message: 'Notification broadcast successfully saved to database.' });
  } catch (error) {
    next(error);
  }
}

