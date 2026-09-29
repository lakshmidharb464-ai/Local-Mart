import { v4 as uuidv4 } from 'uuid';
import { query, execute } from '../config/db.js';

/**
 * Get all categories
 * GET /api/categories
 */
export async function getCategories(req, res, next) {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY name ASC');
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
}

/**
 * List products with filters, search, and pagination
 * GET /api/products
 */
export async function getProducts(req, res, next) {
  try {
    const { category, search, organic, featured, minPrice, maxPrice, sort = 'created_at', order = 'DESC', farmerId } = req.query;

    let sql = `
      SELECT 
        p.*,
        c.name AS category_name,
        u.name AS farmer_name,
        fp.location_address AS farmer_location,
        fp.rating AS farmer_rating,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) AS image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.farmer_id = u.id
      LEFT JOIN farmer_profiles fp ON p.farmer_id = fp.user_id
      WHERE p.status = 'Approved'
    `;

    const params = [];

    if (category && category !== 'all' && category !== 'All Produce') {
      sql += ` AND (p.category_id = ? OR c.name = ?)`;
      params.push(category, category);
    }

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ? OR u.name LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (organic === 'true' || organic === true) {
      sql += ` AND p.is_organic = 1`;
    }

    if (farmerId) {
      sql += ` AND p.farmer_id = ?`;
      params.push(farmerId);
    }

    if (minPrice) {
      sql += ` AND p.price >= ?`;
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      sql += ` AND p.price <= ?`;
      params.push(Number(maxPrice));
    }

    // Sort order
    const allowedSorts = ['price', 'rating', 'created_at', 'name'];
    const sortColumn = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortDir = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    sql += ` ORDER BY p.${sortColumn} ${sortDir}`;

    // Pagination
    const pageNum = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    // Get total count using a safe wrapper subquery (avoids regex mangling the inner SELECT in subqueries)
    const countSql = `SELECT COUNT(*) as total FROM (${sql}) AS _count_wrapper`;
    const [countResult] = await query(countSql, params);
    const totalCount = countResult?.total || 0;

    sql += ` LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    const products = await query(sql, params);

    // Format fields to match frontend expectations
    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category_name || p.category_id,
      categoryId: p.category_id,
      categoryName: p.category_name || '',
      price: Number(p.price),
      unit: p.unit,
      farmerId: p.farmer_id,
      farmerName: p.farmer_name,
      farmerLocation: p.farmer_location,
      image: p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      stock: p.stock,
      organic: Boolean(p.is_organic),
      harvestDate: p.harvest_date || p.harvest_tag,
      harvestTag: p.harvest_tag,
      status: p.status,
      description: p.description,
      rating: Number(p.rating),
      reviewsCount: p.reviews_count,
      flashDiscount: Number(p.flash_discount),
    }));

    res.json({
      success: true,
      count: formatted.length,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      products: formatted,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single product by ID with images and reviews
 * GET /api/products/:id
 */
export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;

    const products = await query(
      `SELECT 
        p.*,
        c.name AS category_name,
        u.name AS farmer_name,
        u.phone AS farmer_phone,
        fp.location_address AS farmer_location,
        fp.rating AS farmer_rating,
        fp.experience_years,
        fp.specialty
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.farmer_id = u.id
       LEFT JOIN farmer_profiles fp ON p.farmer_id = fp.user_id
       WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const p = products[0];

    // Fetch images
    const images = await query(
      'SELECT id, image_url, is_primary, display_order FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC',
      [id]
    );

    // Fetch reviews
    const reviews = await query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS reviewer_name, u.avatar_url
       FROM reviews r
       JOIN users u ON r.customer_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      product: {
        id: p.id,
        name: p.name,
        category: p.category_name || p.category_id,
        categoryId: p.category_id,
        categoryName: p.category_name || '',
        price: Number(p.price),
        unit: p.unit,
        farmerId: p.farmer_id,
        farmerName: p.farmer_name,
        farmerPhone: p.farmer_phone,
        farmerLocation: p.farmer_location,
        farmerExperience: p.experience_years,
        farmerSpecialty: p.specialty,
        image: images[0]?.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        images: images.map((img) => img.image_url),
        stock: p.stock,
        organic: Boolean(p.is_organic),
        harvestDate: p.harvest_date || p.harvest_tag,
        harvestTag: p.harvest_tag,
        status: p.status,
        description: p.description,
        rating: Number(p.rating),
        reviewsCount: p.reviews_count,
        flashDiscount: Number(p.flash_discount),
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get farm public profile
 * GET /api/farms/:farmerId
 */
export async function getFarmProfile(req, res, next) {
  try {
    const { farmerId } = req.params;

    const farmers = await query(
      `SELECT 
        u.id, u.name, u.email, u.phone, u.avatar_url,
        fp.farm_name, fp.location_address, fp.district, fp.state,
        fp.latitude, fp.longitude, fp.experience_years, fp.specialty,
        fp.organic_certified, fp.certificate_url, fp.rating, fp.badge
       FROM users u
       JOIN farmer_profiles fp ON u.id = fp.user_id
       WHERE u.id = ? AND u.role = 'Farmer'`,
      [farmerId]
    );

    if (farmers.length === 0) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const farmer = farmers[0];

    // Fetch listed crops
    const products = await query(
      `SELECT p.*, (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
       FROM products p
       WHERE p.farmer_id = ? AND p.status = 'Approved'`,
      [farmerId]
    );

    res.json({
      success: true,
      farm: {
        id: farmer.id,
        name: farmer.name,
        farmName: farmer.farm_name,
        email: farmer.email,
        phone: farmer.phone,
        location: farmer.location_address,
        district: farmer.district,
        state: farmer.state,
        experience: `${farmer.experience_years} Years Experience`,
        specialty: farmer.specialty,
        rating: Number(farmer.rating),
        badge: farmer.badge,
        image: farmer.avatar_url,
        organicCertified: Boolean(farmer.organic_certified),
        certificateUrl: farmer.certificate_url,
        productsCount: products.length,
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category_id,
          price: Number(p.price),
          unit: p.unit,
          stock: p.stock,
          organic: Boolean(p.is_organic),
          image: p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
          harvestDate: p.harvest_date,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Add a review for a product
 * POST /api/products/:id/reviews
 */
export async function addReview(req, res, next) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const customerId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    const reviewId = uuidv4();
    await execute(
      'INSERT INTO reviews (id, product_id, customer_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [reviewId, id, customerId, rating, comment || null]
    );

    // Recalculate average rating for product
    const [stats] = await query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE product_id = ?',
      [id]
    );

    if (stats) {
      await execute(
        'UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?',
        [Number(stats.avg_rating).toFixed(2), stats.total_reviews, id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      reviewId,
    });
  } catch (error) {
    next(error);
  }
}
