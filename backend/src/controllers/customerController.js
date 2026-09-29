import { v4 as uuidv4 } from 'uuid';
import { query, execute } from '../config/db.js';

/**
 * Get Loyalty Tier and Order metrics
 * GET /api/customers/tier
 */
export async function getLoyaltyTier(req, res, next) {
  try {
    const customerId = req.user.id;

    const [loyalty] = await query(
      'SELECT order_count, total_spent, tier FROM customer_loyalty WHERE customer_id = ?',
      [customerId]
    );

    res.json({
      success: true,
      tier: loyalty?.tier || 'Bronze',
      orderCount: loyalty?.order_count || 0,
      totalSpent: Number(loyalty?.total_spent || 0),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Customer Wishlist
 * GET /api/customers/wishlist
 */
export async function getWishlist(req, res, next) {
  try {
    const customerId = req.user.id;

    const items = await query(
      `SELECT p.*, (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
       FROM customer_wishlists cw
       JOIN products p ON cw.product_id = p.id
       WHERE cw.customer_id = ?`,
      [customerId]
    );

    res.json({
      success: true,
      wishlist: items.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        unit: p.unit,
        category: p.category_id,
        image: p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        stock: p.stock,
        isOrganic: Boolean(p.is_organic),
      })),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle Product in Wishlist
 * POST /api/customers/wishlist
 */
export async function toggleWishlist(req, res, next) {
  try {
    const customerId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required.' });
    }

    const existing = await query(
      'SELECT id FROM customer_wishlists WHERE customer_id = ? AND product_id = ?',
      [customerId, productId]
    );

    if (existing.length > 0) {
      await execute(
        'DELETE FROM customer_wishlists WHERE customer_id = ? AND product_id = ?',
        [customerId, productId]
      );
      return res.json({ success: true, action: 'removed', message: 'Product removed from wishlist.' });
    }

    await execute(
      'INSERT INTO customer_wishlists (id, customer_id, product_id) VALUES (?, ?, ?)',
      [uuidv4(), customerId, productId]
    );

    res.json({ success: true, action: 'added', message: 'Product added to wishlist.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Saved Addresses
 * GET /api/customers/addresses
 */
export async function getAddresses(req, res, next) {
  try {
    const customerId = req.user.id;
    const addresses = await query(
      'SELECT * FROM customer_addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC',
      [customerId]
    );
    res.json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
}

/**
 * Add New Address
 * POST /api/customers/addresses
 */
export async function addAddress(req, res, next) {
  try {
    const customerId = req.user.id;
    const { label = 'Home', addressLine, landmark, city, state, pincode, latitude, longitude, isDefault = false } = req.body;

    if (!addressLine || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'Address line, city, state, and pincode are required.' });
    }

    const addressId = uuidv4();

    if (isDefault) {
      await execute('UPDATE customer_addresses SET is_default = 0 WHERE customer_id = ?', [customerId]);
    }

    await execute(
      `INSERT INTO customer_addresses (id, customer_id, label, address_line, landmark, city, state, pincode, latitude, longitude, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [addressId, customerId, label, addressLine, landmark || null, city, state, pincode, latitude || null, longitude || null, isDefault ? 1 : 0]
    );

    res.status(201).json({ success: true, message: 'Address saved successfully!', addressId });
  } catch (error) {
    next(error);
  }
}

/**
 * Customer Recurring Subscriptions
 * GET /api/subscriptions
 */
export async function getSubscriptions(req, res, next) {
  try {
    const customerId = req.user.id;

    const subs = await query(
      `SELECT 
        cs.*,
        p.name AS product_name,
        p.unit,
        (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image,
        u.name AS farmer_name
       FROM customer_subscriptions cs
       JOIN products p ON cs.product_id = p.id
       JOIN users u ON cs.farmer_id = u.id
       WHERE cs.customer_id = ?
       ORDER BY cs.created_at DESC`,
      [customerId]
    );

    res.json({
      success: true,
      subscriptions: subs.map((s) => ({
        id: s.id,
        productId: s.product_id,
        productName: s.product_name,
        farmerName: s.farmer_name,
        quantity: s.quantity,
        frequency: s.frequency,
        price: Number(s.price),
        nextDeliveryDate: s.next_delivery_date,
        isActive: Boolean(s.is_active),
        skipNext: Boolean(s.skip_next),
        whatsappNotify: Boolean(s.whatsapp_notify),
        streakCount: s.streak_count,
        image: s.image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      })),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new subscription
 * POST /api/subscriptions
 */
export async function createSubscription(req, res, next) {
  try {
    const customerId = req.user.id;
    const { productId, quantity, frequency = 'Daily', nextDeliveryDate } = req.body;

    const [product] = await query('SELECT id, name, price, farmer_id FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const subId = uuidv4();
    const deliveryDate = nextDeliveryDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];

    await execute(
      `INSERT INTO customer_subscriptions (id, customer_id, product_id, farmer_id, quantity, frequency, price, next_delivery_date, is_active, streak_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)`,
      [subId, customerId, product.id, product.farmer_id, quantity || '1 Unit', frequency, Number(product.price), deliveryDate]
    );

    res.status(201).json({ success: true, message: 'Subscription started successfully!', subscriptionId: subId });
  } catch (error) {
    next(error);
  }
}

/**
 * Update / Skip Subscription
 * PATCH /api/subscriptions/:id
 */
export async function updateSubscription(req, res, next) {
  try {
    const { id } = req.params;
    const customerId = req.user.id;
    const { frequency, isActive, skipNext, whatsappNotify } = req.body;

    await execute(
      `UPDATE customer_subscriptions
       SET frequency = COALESCE(?, frequency),
           is_active = COALESCE(?, is_active),
           skip_next = COALESCE(?, skip_next),
           whatsapp_notify = COALESCE(?, whatsapp_notify)
       WHERE id = ? AND customer_id = ?`,
      [
        frequency,
        isActive !== undefined ? (isActive ? 1 : 0) : null,
        skipNext !== undefined ? (skipNext ? 1 : 0) : null,
        whatsappNotify !== undefined ? (whatsappNotify ? 1 : 0) : null,
        id,
        customerId,
      ]
    );

    res.json({ success: true, message: 'Subscription updated successfully.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete / Cancel Subscription
 * DELETE /api/subscriptions/:id
 */
export async function deleteSubscription(req, res, next) {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    await execute('DELETE FROM customer_subscriptions WHERE id = ? AND customer_id = ?', [id, customerId]);
    res.json({ success: true, message: 'Subscription cancelled.' });
  } catch (error) {
    next(error);
  }
}
