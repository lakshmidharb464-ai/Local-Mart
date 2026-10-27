import bcrypt from 'bcryptjs';
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
 * Get all products for moderation & catalog
 * GET /api/admin/products
 */
export async function getAdminProducts(req, res, next) {
  try {
    const rawProducts = await query(
      `SELECT 
        p.*,
        u.name AS farmer_name,
        c.name AS category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) AS image
       FROM products p
       LEFT JOIN users u ON p.farmer_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );

    const products = rawProducts.map(p => ({
      ...p,
      farmerName: p.farmer_name || 'Verified Farm',
      categoryName: p.category_name || 'Fresh Organic',
      category: p.category_name || p.category_id,
      imageUrl: p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
      image: p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
      price: Number(p.price || 0),
      stock: Number(p.stock || 0),
      rating: Number(p.rating || 5.0),
      isOrganic: Boolean(p.is_organic),
    }));

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
}

/**
 * Create Product as Admin
 * POST /api/admin/products
 */
export async function createAdminProduct(req, res, next) {
  try {
    const { 
      name, 
      farmerId, 
      categoryId, 
      category, 
      price, 
      unit = 'kg', 
      stock = 50, 
      description = '', 
      isOrganic = true, 
      status = 'Approved', 
      image, 
      imageUrl 
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Product name and price are required.' });
    }

    let resolvedFarmerId = farmerId;
    if (!resolvedFarmerId) {
      const [firstFarmer] = await query('SELECT id FROM users WHERE role = "Farmer" LIMIT 1');
      resolvedFarmerId = firstFarmer?.id || 'f1';
    }

    let resolvedCatId = categoryId || category || 'vegetables';
    const [catExists] = await query('SELECT id FROM categories WHERE id = ?', [resolvedCatId]);
    if (!catExists) {
      const [firstCat] = await query('SELECT id FROM categories LIMIT 1');
      resolvedCatId = firstCat?.id || 'vegetables';
    }

    const productId = `prod_${uuidv4().substring(0, 8)}`;
    const resolvedImg = image || imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';

    await withTransaction(async (conn) => {
      await conn.execute(
        `INSERT INTO products (id, farmer_id, category_id, name, description, price, unit, stock, is_organic, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [productId, resolvedFarmerId, resolvedCatId, name.trim(), description, Number(price), unit, Number(stock), isOrganic ? 1 : 0, status]
      );

      await conn.execute(
        `INSERT INTO product_images (id, product_id, image_url, is_primary, display_order)
         VALUES (?, ?, ?, 1, 0)`,
        [uuidv4(), productId, resolvedImg]
      );
    });

    const [created] = await query(
      `SELECT p.*, u.name AS farmer_name, c.name AS category_name, ? AS image
       FROM products p
       LEFT JOIN users u ON p.farmer_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [resolvedImg, productId]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: {
        ...created,
        farmerName: created?.farmer_name || 'Verified Farm',
        categoryName: created?.category_name || resolvedCatId,
        category: created?.category_name || resolvedCatId,
        image: resolvedImg,
        imageUrl: resolvedImg,
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Product
 * PUT /api/admin/products/:id
 */
export async function updateAdminProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, price, stock, unit, status, isOrganic, categoryId, category, description, image, imageUrl } = req.body;

    const [existing] = await query('SELECT * FROM products WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const resolvedName = name !== undefined ? name : existing.name;
    const resolvedPrice = price !== undefined ? Number(price) : existing.price;
    const resolvedStock = stock !== undefined ? Number(stock) : existing.stock;
    const resolvedUnit = unit !== undefined ? unit : existing.unit;
    const resolvedStatus = status !== undefined ? status : existing.status;
    const resolvedOrganic = isOrganic !== undefined ? (isOrganic ? 1 : 0) : existing.is_organic;
    const resolvedCatId = categoryId || category || existing.category_id;
    const resolvedDesc = description !== undefined ? description : existing.description;

    await execute(
      `UPDATE products 
       SET name = ?, price = ?, stock = ?, unit = ?, status = ?, is_organic = ?, category_id = ?, description = ?
       WHERE id = ?`,
      [resolvedName, resolvedPrice, resolvedStock, resolvedUnit, resolvedStatus, resolvedOrganic, resolvedCatId, resolvedDesc, id]
    );

    const imgToUpdate = image || imageUrl;
    if (imgToUpdate) {
      await execute('UPDATE product_images SET image_url = ? WHERE product_id = ? AND is_primary = 1', [imgToUpdate, id]);
    }

    res.json({ success: true, message: 'Product updated successfully.' });
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
 * Delete Product
 * DELETE /api/admin/products/:id
 */
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    await withTransaction(async (conn) => {
      await conn.execute('DELETE FROM product_images WHERE product_id = ?', [id]);
      await conn.execute('DELETE FROM products WHERE id = ?', [id]);
    });

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `Product deleted (${id})`, `products:${id}`, req.ip]
    );

    res.json({ success: true, message: 'Product removed from catalog.' });
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
    const { status, filter } = req.query;

    let sql = `
      SELECT 
        o.*,
        cu.name AS customer_name,
        cu.email AS customer_email,
        ru.name AS delivery_partner_name,
        COUNT(oi.id) AS items_count,
        COALESCE(GROUP_CONCAT(CONCAT(oi.product_name, ' (', oi.quantity, ' ', oi.unit, ')') SEPARATOR ', '), 'Fresh Produce Basket') AS items_summary,
        COALESCE(MAX(fu.name), 'Verified Producer Farm') AS farmer_name
       FROM orders o
       JOIN users cu ON o.customer_id = cu.id
       LEFT JOIN users ru ON o.delivery_partner_id = ru.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN users fu ON oi.farmer_id = fu.id
    `;

    const whereClauses = [];
    const params = [];

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

    sql += ` GROUP BY o.id, cu.name, cu.email, ru.name ORDER BY o.created_at DESC`;

    const rawOrders = await query(sql, params);

    const orders = rawOrders.map(o => ({
      ...o,
      customerName: o.customer_name || 'Direct Consumer',
      customerEmail: o.customer_email || '',
      farmerName: o.farmer_name || 'Verified Producer Farm',
      deliveryPartnerName: o.delivery_partner_name || 'Unassigned',
      items: o.items_summary || 'Fresh Farm Items',
      items_summary: o.items_summary || 'Fresh Farm Items',
      total: Number(o.total_amount || 0),
      total_amount: Number(o.total_amount || 0),
      date: new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      deliveryAddress: o.address_text || 'Customer Delivery Address',
    }));

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Order Status
 * PATCH /api/admin/orders/:id/status
 */
export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    await execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    await execute(
      'INSERT INTO order_timeline (id, order_id, title, description, actor_id, actor_role) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), id, `Admin updated status to ${status}`, `Order status manually modified by Admin`, adminId, 'Admin']
    );

    res.json({ success: true, message: `Order ${id} status updated to ${status}.` });
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
    const rawFarmers = await query(
      `SELECT 
        u.id, u.name, u.email, u.phone, u.avatar_url, u.is_active, u.created_at,
        fp.farm_name, fp.location_address, fp.district, fp.state, fp.experience_years, fp.specialty,
        fp.rating, fp.total_earnings, fp.approval_status, fp.account_status, fp.badge,
        COUNT(p.id) AS products_count
       FROM users u
       JOIN farmer_profiles fp ON u.id = fp.user_id
       LEFT JOIN products p ON u.id = p.farmer_id
       WHERE u.role = 'Farmer'
       GROUP BY u.id, u.name, u.email, u.phone, u.avatar_url, u.is_active, u.created_at,
                fp.farm_name, fp.location_address, fp.district, fp.state, fp.experience_years, 
                fp.specialty, fp.rating, fp.total_earnings, fp.approval_status, fp.account_status, fp.badge
       ORDER BY u.created_at DESC`
    );

    const farmers = rawFarmers.map(f => {
      const isActive = f.is_active === 1 || f.account_status === 'Active';
      return {
        ...f,
        farmName: f.farm_name,
        location: f.location_address,
        experience: f.experience_years ? `${f.experience_years} Years Organic Farming` : '5 Years Experience',
        totalEarnings: Number(f.total_earnings || 0),
        productsCount: Number(f.products_count || 0),
        approvalStatus: f.approval_status || 'Approved',
        accountStatus: isActive ? 'Active' : 'Inactive',
        isActive: isActive,
        rating: Number(f.rating || 5.0),
        image: f.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        joinedDate: new Date(f.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      };
    });

    res.json({ success: true, farmers });
  } catch (error) {
    next(error);
  }
}

/**
 * Create Farmer (Admin)
 * POST /api/admin/farmers
 */
export async function createAdminFarmer(req, res, next) {
  try {
    const {
      name,
      email,
      phone,
      password = 'password123',
      farmName,
      location,
      experience,
      specialty,
      badge = 'Certified Producer',
      approvalStatus = 'Approved',
      accountStatus = 'Active',
      image
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Farmer name and phone are required.' });
    }

    const resolvedEmail = email && email.trim() !== '' 
      ? email.trim().toLowerCase() 
      : `${name.trim().toLowerCase().replace(/\s+/g, '.')}.${Date.now().toString().slice(-4)}@localfarm.in`;

    const [existing] = await query('SELECT id FROM users WHERE email = ? AND role = "Farmer"', [resolvedEmail]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'A farmer with this email already exists.' });
    }

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    const expYears = parseInt(experience, 10) || 5;
    const avatar = image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';
    const isAct = (accountStatus === 'Active') ? 1 : 0;

    await withTransaction(async (conn) => {
      await conn.execute(
        `INSERT INTO users (id, name, email, password_hash, phone, role, avatar_url, is_active)
         VALUES (?, ?, ?, ?, ?, 'Farmer', ?, ?)`,
        [userId, name.trim(), resolvedEmail, passwordHash, phone.trim(), avatar, isAct]
      );

      await conn.execute(
        `INSERT INTO farmer_profiles (user_id, farm_name, location_address, district, state, experience_years, specialty, badge, approval_status, account_status)
         VALUES (?, ?, ?, 'Pune Hub', 'Maharashtra', ?, ?, ?, ?, ?)`,
        [userId, farmName || `${name.trim()} Farm`, location || 'Pune Rural Hub', expYears, specialty || 'Organic Fruits & Vegetables', badge, approvalStatus, accountStatus]
      );
    });

    const newFarmer = {
      id: userId,
      name: name.trim(),
      email: resolvedEmail,
      phone: phone.trim(),
      farm_name: farmName || `${name.trim()} Farm`,
      farmName: farmName || `${name.trim()} Farm`,
      location_address: location || 'Pune Rural Hub',
      location: location || 'Pune Rural Hub',
      experience_years: expYears,
      experience: `${expYears} Years Organic Farming`,
      specialty: specialty || 'Organic Fruits & Vegetables',
      badge,
      approval_status: approvalStatus,
      approvalStatus,
      account_status: accountStatus,
      accountStatus,
      is_active: isAct,
      isActive: isAct === 1,
      rating: 5.0,
      total_earnings: 0,
      totalEarnings: 0,
      products_count: 0,
      productsCount: 0,
      avatar_url: avatar,
      image: avatar,
    };

    res.status(201).json({ success: true, message: 'Farmer account created successfully.', farmer: newFarmer });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Farmer Details (Admin)
 * PUT /api/admin/farmers/:id
 */
export async function updateAdminFarmer(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone, farmName, location, experience, specialty, badge, approvalStatus, accountStatus } = req.body;

    const [user] = await query('SELECT * FROM users WHERE id = ? AND role = "Farmer"', [id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }

    await withTransaction(async (conn) => {
      if (name || email || phone) {
        await conn.execute(
          `UPDATE users SET 
            name = COALESCE(?, name),
            email = COALESCE(?, email),
            phone = COALESCE(?, phone)
           WHERE id = ?`,
          [name || null, email || null, phone || null, id]
        );
      }

      const expYears = experience !== undefined ? (parseInt(experience, 10) || 5) : null;
      await conn.execute(
        `UPDATE farmer_profiles SET 
          farm_name = COALESCE(?, farm_name),
          location_address = COALESCE(?, location_address),
          experience_years = COALESCE(?, experience_years),
          specialty = COALESCE(?, specialty),
          badge = COALESCE(?, badge),
          approval_status = COALESCE(?, approval_status),
          account_status = COALESCE(?, account_status)
         WHERE user_id = ?`,
        [farmName || null, location || null, expYears, specialty || null, badge || null, approvalStatus || null, accountStatus || null, id]
      );
    });

    res.json({ success: true, message: 'Farmer profile updated successfully.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Verify / Approve / Toggle Active Farmer
 * PATCH /api/admin/farmers/:id/verify
 */
export async function verifyFarmer(req, res, next) {
  try {
    const { id } = req.params;
    const { approvalStatus, accountStatus, badge, status, isActive } = req.body;
    const resolvedApprovalStatus = approvalStatus || (status === 'Approved' || status === 'Rejected' ? status : null);
    const adminId = req.user.id;

    let isAct = null;
    let resolvedAccountStatus = accountStatus;
    if (isActive !== undefined) {
      isAct = isActive ? 1 : 0;
      resolvedAccountStatus = isActive ? 'Active' : 'Inactive';
    } else if (accountStatus !== undefined) {
      isAct = (accountStatus === 'Active' || accountStatus === 'active') ? 1 : 0;
      resolvedAccountStatus = accountStatus;
    } else if (status === 'Active' || status === 'Inactive') {
      isAct = status === 'Active' ? 1 : 0;
      resolvedAccountStatus = status;
    }

    await execute(
      `UPDATE farmer_profiles
       SET approval_status = COALESCE(?, approval_status),
           account_status = COALESCE(?, account_status),
           badge = COALESCE(?, badge)
       WHERE user_id = ?`,
      [resolvedApprovalStatus, resolvedAccountStatus || null, badge || null, id]
    );

    if (isAct !== null) {
      await execute('UPDATE users SET is_active = ? WHERE id = ?', [isAct, id]);
    }

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `Farmer status updated (${resolvedApprovalStatus || resolvedAccountStatus || 'Updated'})`, `farmer_profiles:${id}`, req.ip]
    );

    res.json({ success: true, message: 'Farmer status updated successfully.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete / Remove Farmer
 * DELETE /api/admin/farmers/:id
 */
export async function deleteFarmer(req, res, next) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    await withTransaction(async (conn) => {
      await conn.execute('DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE farmer_id = ?)', [id]);
      await conn.execute('DELETE FROM products WHERE farmer_id = ?', [id]);
      await conn.execute('DELETE FROM farmer_profiles WHERE user_id = ?', [id]);
      await conn.execute('DELETE FROM users WHERE id = ?', [id]);
    });

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `Farmer deleted (${id})`, `users:${id}`, req.ip]
    );

    res.json({ success: true, message: 'Farmer removed successfully.' });
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
    const rawCustomers = await query(
      `SELECT 
        u.id, u.name, u.email, u.phone, u.is_active, u.created_at,
        cl.order_count, cl.total_spent, cl.tier,
        ca.address_line, ca.city, ca.pincode
       FROM users u
       LEFT JOIN customer_loyalty cl ON u.id = cl.customer_id
       LEFT JOIN customer_addresses ca ON u.id = ca.customer_id AND ca.is_default = 1
       WHERE u.role = 'Customer'
       ORDER BY u.created_at DESC`
    );

    const customers = rawCustomers.map(c => {
      const isActive = c.is_active === 1;
      const addr = [c.address_line, c.city, c.pincode].filter(Boolean).join(', ');
      return {
        ...c,
        status: isActive ? 'Active' : 'Inactive',
        isActive,
        ordersCount: Number(c.order_count || 0),
        order_count: Number(c.order_count || 0),
        totalSpent: Number(c.total_spent || 0),
        total_spent: Number(c.total_spent || 0),
        tier: c.tier || 'Bronze',
        address: addr || 'Kothrud, Pune 411038',
        joinedDate: new Date(c.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
    });

    res.json({ success: true, customers });
  } catch (error) {
    next(error);
  }
}

/**
 * Create Customer (Admin)
 * POST /api/admin/customers
 */
export async function createAdminCustomer(req, res, next) {
  try {
    const { name, email, phone, address = 'Kothrud, Pune 411038', password = 'password123', status = 'Active' } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone number are required.' });
    }

    const [existing] = await query('SELECT id FROM users WHERE email = ? AND role = "Customer"', [email.trim().toLowerCase()]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'A customer with this email already exists.' });
    }

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    const isAct = (status === 'Active' || status === true) ? 1 : 0;

    await withTransaction(async (conn) => {
      await conn.execute(
        `INSERT INTO users (id, name, email, password_hash, phone, role, is_active)
         VALUES (?, ?, ?, ?, ?, 'Customer', ?)`,
        [userId, name.trim(), email.trim().toLowerCase(), passwordHash, phone.trim(), isAct]
      );

      await conn.execute(
        `INSERT INTO customer_loyalty (customer_id, order_count, total_spent, tier)
         VALUES (?, 0, 0.00, 'Bronze')`,
        [userId]
      );

      await conn.execute(
        `INSERT INTO customer_addresses (id, customer_id, label, address_line, city, state, pincode, is_default)
         VALUES (?, ?, 'Home', ?, 'Pune', 'Maharashtra', '411038', 1)`,
        [uuidv4(), userId, address]
      );
    });

    const newCustomer = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address,
      ordersCount: 0,
      order_count: 0,
      totalSpent: 0,
      total_spent: 0,
      tier: 'Bronze',
      status: isAct ? 'Active' : 'Inactive',
      is_active: isAct,
      isActive: isAct === 1,
      joinedDate: 'Today',
    };

    res.status(201).json({ success: true, message: 'Customer account created successfully.', customer: newCustomer });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Customer (Admin)
 * PUT /api/admin/customers/:id
 */
export async function updateAdminCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone, address, status } = req.body;

    const [user] = await query('SELECT * FROM users WHERE id = ? AND role = "Customer"', [id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    await withTransaction(async (conn) => {
      if (name || email || phone || status !== undefined) {
        const isAct = status !== undefined ? (status === 'Active' || status === true ? 1 : 0) : null;
        await conn.execute(
          `UPDATE users SET 
            name = COALESCE(?, name),
            email = COALESCE(?, email),
            phone = COALESCE(?, phone),
            is_active = COALESCE(?, is_active)
           WHERE id = ?`,
          [name || null, email || null, phone || null, isAct, id]
        );
      }

      if (address) {
        await conn.execute(
          `UPDATE customer_addresses SET address_line = ? WHERE customer_id = ? AND is_default = 1`,
          [address, id]
        );
      }
    });

    res.json({ success: true, message: 'Customer profile updated successfully.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle Customer status (Active / Inactive)
 * PATCH /api/admin/customers/:id/status
 */
export async function setCustomerStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { isActive, status } = req.body;
    const adminId = req.user.id;

    const resolvedActive = isActive !== undefined 
      ? (isActive ? 1 : 0) 
      : (status === 'Active' || status === 'active' || status === true ? 1 : 0);

    await execute('UPDATE users SET is_active = ? WHERE id = ?', [resolvedActive, id]);

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `Customer account ${resolvedActive ? 'Activated' : 'Deactivated'}`, `users:${id}`, req.ip]
    );

    res.json({ success: true, message: `Customer account ${resolvedActive ? 'Activated' : 'Deactivated'}.` });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete Customer
 * DELETE /api/admin/customers/:id
 */
export async function deleteCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    await withTransaction(async (conn) => {
      await conn.execute('DELETE FROM customer_addresses WHERE customer_id = ?', [id]);
      await conn.execute('DELETE FROM customer_loyalty WHERE customer_id = ?', [id]);
      await conn.execute('DELETE FROM users WHERE id = ?', [id]);
    });

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `Customer deleted (${id})`, `users:${id}`, req.ip]
    );

    res.json({ success: true, message: 'Customer removed successfully.' });
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
    const rawFleet = await query(
      `SELECT 
        u.id, u.name, u.email, u.phone, u.avatar_url, u.is_active, u.created_at,
        dp.vehicle_type, dp.vehicle_number, dp.license_number,
        dp.is_online, dp.rating, dp.total_deliveries, dp.wallet_balance, dp.approval_status
       FROM users u
       JOIN delivery_profiles dp ON u.id = dp.user_id
       WHERE u.role = 'Delivery'
       ORDER BY u.created_at DESC`
    );

    const fleet = rawFleet.map(p => {
      const isActive = p.is_active === 1 && p.approval_status !== 'Inactive';
      return {
        ...p,
        vehicleType: p.vehicle_type || 'EV Scooter (Ather 450X)',
        vehicleNumber: p.vehicle_number || 'MH-12-EV-9821',
        licenseNumber: p.license_number || 'DL-MH12-20230098',
        hubLocation: 'Chittoor District AP Hub',
        isOnline: Boolean(p.is_online),
        rating: Number(p.rating || 5.0),
        totalDeliveries: Number(p.total_deliveries || 0),
        approvalStatus: p.approval_status || 'Approved',
        accountStatus: isActive ? 'Active' : 'Inactive',
        isActive,
        avatar: p.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80',
        joinedDate: new Date(p.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
    });

    res.json({ success: true, fleet, riders: fleet, deliveryPartners: fleet });
  } catch (error) {
    next(error);
  }
}

/**
 * Create Delivery Partner (Admin)
 * POST /api/admin/delivery-partners
 */
export async function createAdminDeliveryPartner(req, res, next) {
  try {
    const {
      name,
      email,
      phone,
      password = 'password123',
      vehicleType = 'EV Scooter (Ather 450X)',
      vehicleNumber = 'MH-12-EV-9821',
      licenseNumber = 'DL-MH12-20230098',
      approvalStatus = 'Approved',
      accountStatus = 'Active',
      isOnline = false,
      avatar
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Driver name and phone number are required.' });
    }

    const resolvedEmail = email && email.trim() !== ''
      ? email.trim().toLowerCase()
      : `${name.trim().toLowerCase().replace(/\s+/g, '.')}.${Date.now().toString().slice(-4)}@localfarm.in`;

    const [existing] = await query('SELECT id FROM users WHERE email = ?', [resolvedEmail]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'A user with this email address already exists.' });
    }

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    const isAct = (accountStatus === 'Active' && approvalStatus !== 'Inactive') ? 1 : 0;
    const avatarUrl = avatar || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80';

    await withTransaction(async (conn) => {
      await conn.execute(
        `INSERT INTO users (id, name, email, password_hash, phone, role, avatar_url, is_active)
         VALUES (?, ?, ?, ?, ?, 'Delivery', ?, ?)`,
        [userId, name.trim(), resolvedEmail, passwordHash, phone.trim(), avatarUrl, isAct]
      );

      await conn.execute(
        `INSERT INTO delivery_profiles (user_id, vehicle_type, vehicle_number, license_number, is_online, rating, total_deliveries, approval_status)
         VALUES (?, ?, ?, ?, ?, 5.00, 0, ?)`,
        [userId, vehicleType, vehicleNumber, licenseNumber, isOnline ? 1 : 0, approvalStatus]
      );
    });

    const newPartner = {
      id: userId,
      name: name.trim(),
      email: resolvedEmail,
      phone: phone.trim(),
      vehicleType,
      vehicle_type: vehicleType,
      vehicleNumber,
      vehicle_number: vehicleNumber,
      licenseNumber,
      license_number: licenseNumber,
      hubLocation: 'Chittoor District AP Hub',
      isOnline: Boolean(isOnline),
      is_online: Boolean(isOnline),
      rating: 5.0,
      totalDeliveries: 0,
      total_deliveries: 0,
      approvalStatus,
      approval_status: approvalStatus,
      accountStatus,
      is_active: isAct,
      isActive: isAct === 1,
      avatar: avatarUrl,
      joinedDate: 'Today',
    };

    res.status(201).json({ success: true, message: 'Delivery partner created successfully.', rider: newPartner, partner: newPartner });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Delivery Partner (Admin)
 * PUT /api/admin/delivery-partners/:id
 */
export async function updateAdminDeliveryPartner(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone, vehicleType, vehicleNumber, licenseNumber, approvalStatus, isOnline } = req.body;

    const [user] = await query('SELECT * FROM users WHERE id = ? AND role = "Delivery"', [id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Delivery partner not found.' });
    }

    await withTransaction(async (conn) => {
      if (name || email || phone) {
        await conn.execute(
          `UPDATE users SET 
            name = COALESCE(?, name),
            email = COALESCE(?, email),
            phone = COALESCE(?, phone)
           WHERE id = ?`,
          [name || null, email || null, phone || null, id]
        );
      }

      const onlineVal = isOnline !== undefined ? (isOnline ? 1 : 0) : null;
      await conn.execute(
        `UPDATE delivery_profiles SET 
          vehicle_type = COALESCE(?, vehicle_type),
          vehicle_number = COALESCE(?, vehicle_number),
          license_number = COALESCE(?, license_number),
          approval_status = COALESCE(?, approval_status),
          is_online = COALESCE(?, is_online)
         WHERE user_id = ?`,
        [vehicleType || null, vehicleNumber || null, licenseNumber || null, approvalStatus || null, onlineVal, id]
      );
    });

    res.json({ success: true, message: 'Delivery partner updated successfully.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle Delivery Partner Status (Active / Inactive)
 * PATCH /api/admin/delivery-partners/:id/status
 */
export async function setDeliveryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { approvalStatus, status, isActive } = req.body;
    const resolvedStatus = approvalStatus || status || (isActive ? 'Approved' : 'Inactive');
    const isAct = (resolvedStatus === 'Approved' || resolvedStatus === 'Active' || isActive === true) ? 1 : 0;
    const adminId = req.user.id;

    await execute(
      `UPDATE delivery_profiles
       SET approval_status = ?
       WHERE user_id = ?`,
      [resolvedStatus, id]
    );

    await execute('UPDATE users SET is_active = ? WHERE id = ?', [isAct, id]);

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `Delivery partner status updated to ${resolvedStatus}`, `delivery_profiles:${id}`, req.ip]
    );

    res.json({ success: true, message: `Delivery partner status updated to ${resolvedStatus}.` });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete Delivery Partner
 * DELETE /api/admin/delivery-partners/:id
 */
export async function deleteDeliveryPartner(req, res, next) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    await withTransaction(async (conn) => {
      await conn.execute('DELETE FROM delivery_shifts WHERE delivery_partner_id = ?', [id]);
      await conn.execute('DELETE FROM delivery_profiles WHERE user_id = ?', [id]);
      await conn.execute('DELETE FROM users WHERE id = ?', [id]);
    });

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `Delivery partner deleted (${id})`, `users:${id}`, req.ip]
    );

    res.json({ success: true, message: 'Delivery partner removed successfully.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Platform Reports & Analytics (Real DB Calculations)
 * GET /api/admin/reports
 */
export async function getAdminReports(req, res, next) {
  try {
    // 1. Monthly sales calculated from live orders
    const monthlyStats = await query(`
      SELECT 
        DATE_FORMAT(created_at, '%b') AS month,
        MONTH(created_at) AS month_num,
        COALESCE(SUM(total_amount), 0) AS revenue,
        COUNT(id) AS orders
      FROM orders
      WHERE status != 'Cancelled'
      GROUP BY month, month_num
      ORDER BY month_num ASC
    `);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthStatsMap = new Map();
    monthlyStats.forEach(m => {
      monthStatsMap.set(m.month, { revenue: Number(m.revenue || 0), orders: Number(m.orders || 0) });
    });

    const monthlySales = monthNames.map(m => {
      const stats = monthStatsMap.get(m);
      return {
        month: m,
        revenue: stats ? stats.revenue : 0,
        orders: stats ? stats.orders : 0,
      };
    });

    // 2. Top-selling produce calculated from live order items & active product catalog
    const dbTopProducts = await query(`
      SELECT 
        oi.product_name AS name,
        CONCAT(SUM(oi.quantity), ' ', MAX(oi.unit)) AS sales,
        SUM(oi.total_price) AS revenue
      FROM order_items oi
      GROUP BY oi.product_name
      ORDER BY revenue DESC
      LIMIT 6
    `);

    let topProducts = [];
    if (dbTopProducts.length > 0) {
      topProducts = dbTopProducts.map(p => ({
        name: p.name,
        sales: p.sales,
        revenue: Number(p.revenue || 0)
      }));
    } else {
      const liveCatalogProducts = await query(`
        SELECT p.name, CONCAT(p.stock, ' ', p.unit, ' stock') AS sales, (p.price * p.stock) AS revenue
        FROM products p
        ORDER BY p.price DESC
        LIMIT 6
      `);
      topProducts = liveCatalogProducts.map(p => ({
        name: p.name,
        sales: p.sales,
        revenue: Number(p.revenue || 0)
      }));
    }

    // 3. Real registered farmer performers from live farmer profiles
    const dbTopFarmers = await query(`
      SELECT 
        u.name,
        fp.location_address AS area,
        fp.rating,
        COALESCE(fp.total_earnings, 0) AS total_earnings,
        COUNT(DISTINCT oi.order_id) AS totalOrders
      FROM users u
      JOIN farmer_profiles fp ON u.id = fp.user_id
      LEFT JOIN order_items oi ON u.id = oi.farmer_id
      WHERE u.role = 'Farmer'
      GROUP BY u.id, u.name, fp.location_address, fp.rating, fp.total_earnings
      ORDER BY totalOrders DESC, fp.total_earnings DESC, fp.rating DESC
      LIMIT 6
    `);

    const farmerPerformers = dbTopFarmers.map(f => ({
      name: f.name,
      area: f.area ? f.area.split(',')[0].trim() : 'Local Farm Hub',
      rating: Number(f.rating || 5.0),
      totalOrders: Number(f.totalOrders || 0)
    }));

    res.json({
      success: true,
      reports: {
        monthlySales,
        topProducts,
        farmerPerformers,
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
      if (typeof s.setting_value === 'string') {
        try {
          config[s.setting_key] = JSON.parse(s.setting_value);
        } catch {
          config[s.setting_key] = s.setting_value;
        }
      } else {
        config[s.setting_key] = s.setting_value;
      }
    });
    res.json({ success: true, settings: config });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminSettings(req, res, next) {
  try {
    const settingsObj = req.body.settings || req.body || {};
    const adminId = req.user.id;

    for (const [key, val] of Object.entries(settingsObj)) {
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
    const { status, decision, notes, remark, adminNotes } = req.body;
    const resolvedStatus = status || decision;
    const resolvedNotes = notes || remark || adminNotes || null;
    const adminId = req.user.id;

    if (!resolvedStatus) {
      return res.status(400).json({ success: false, message: 'Status or decision is required.' });
    }

    await execute(
      'UPDATE kyc_documents SET status = ?, admin_notes = ? WHERE id = ?',
      [resolvedStatus, resolvedNotes, id]
    );

    await execute(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, req.user.name, `KYC Document marked as ${resolvedStatus}`, `kyc_documents:${id}`, req.ip]
    );

    res.json({ success: true, message: `Document has been ${resolvedStatus}.` });
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
