import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ENV } from '../config/env.js';
import { query, execute, withTransaction } from '../config/db.js';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    ENV.JWT.SECRET,
    { expiresIn: ENV.JWT.EXPIRES_IN }
  );
}

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const { name, email, password, role = 'Customer', phone, farmName, location, vehicleType, vehicleNumber, licenseNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    // Check if user already exists
    const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const userId = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const normalizedRole = ['Customer', 'Farmer', 'Delivery', 'Admin'].includes(role) ? role : 'Customer';

    // Transaction for atomic user + role profile creation
    await withTransaction(async (conn) => {
      await conn.execute(
        `INSERT INTO users (id, name, email, password_hash, phone, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [userId, name, email.toLowerCase().trim(), passwordHash, phone || null, normalizedRole]
      );

      // Create role-specific record
      if (normalizedRole === 'Customer') {
        await conn.execute(
          `INSERT INTO customer_loyalty (customer_id, order_count, total_spent, tier)
           VALUES (?, 0, 0.00, 'Bronze')`,
          [userId]
        );
      } else if (normalizedRole === 'Farmer') {
        await conn.execute(
          `INSERT INTO farmer_profiles (user_id, farm_name, location_address, approval_status, account_status)
           VALUES (?, ?, ?, 'Pending', 'Active')`,
          [userId, farmName || `${name}'s Farm`, location || 'Local Area']
        );
      } else if (normalizedRole === 'Delivery') {
        await conn.execute(
          `INSERT INTO delivery_profiles (user_id, vehicle_type, vehicle_number, license_number, approval_status)
           VALUES (?, ?, ?, ?, 'Approved')`,
          [userId, vehicleType || 'Motorcycle', vehicleNumber || 'PENDING', licenseNumber || 'PENDING']
        );
      }
    });

    const token = generateToken({ id: userId, email: email.toLowerCase().trim(), role: normalizedRole, name });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: userId,
        name,
        email: email.toLowerCase().trim(),
        role: normalizedRole,
        phone: phone || null,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const users = await query(
      `SELECT id, name, email, password_hash, phone, role, avatar_url, is_active
       FROM users
       WHERE email = ?`,
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    // Role check if provided
    if (role && user.role !== role && user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: `Account is registered as a ${user.role}, not a ${role}.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Fetch additional role specific data
    let roleProfile = null;
    if (user.role === 'Farmer') {
      const [farmer] = await query('SELECT * FROM farmer_profiles WHERE user_id = ?', [user.id]);
      roleProfile = farmer || null;
    } else if (user.role === 'Delivery') {
      const [delivery] = await query('SELECT * FROM delivery_profiles WHERE user_id = ?', [user.id]);
      roleProfile = delivery || null;
    } else if (user.role === 'Customer') {
      const [loyalty] = await query('SELECT * FROM customer_loyalty WHERE customer_id = ?', [user.id]);
      roleProfile = loyalty || null;
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        profile: roleProfile,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user (stateless JWT — client must clear its token)
 * POST /api/auth/logout
 */
export async function logout(req, res) {
  // JWT is stateless — the client clears the token from localStorage.
  // This endpoint provides a clean API contract and audit trail.
  res.json({ success: true, message: 'Logged out successfully.' });
}

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export async function getMe(req, res, next) {
  try {
    const users = await query(
      `SELECT id, name, email, phone, role, avatar_url, is_active, created_at
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = users[0];
    let roleProfile = null;

    if (user.role === 'Farmer') {
      const [farmer] = await query('SELECT * FROM farmer_profiles WHERE user_id = ?', [user.id]);
      roleProfile = farmer || null;
    } else if (user.role === 'Delivery') {
      const [delivery] = await query('SELECT * FROM delivery_profiles WHERE user_id = ?', [user.id]);
      roleProfile = delivery || null;
    } else if (user.role === 'Customer') {
      const [loyalty] = await query('SELECT * FROM customer_loyalty WHERE customer_id = ?', [user.id]);
      const addresses = await query('SELECT * FROM customer_addresses WHERE customer_id = ?', [user.id]);
      roleProfile = { ...(loyalty || {}), addresses };
    }

    res.json({
      success: true,
      user: {
        ...user,
        profile: roleProfile,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update authenticated user profile
 * PUT /api/auth/profile
 */
export async function updateProfile(req, res, next) {
  try {
    const { name, phone, avatarUrl } = req.body;
    
    await execute(
      `UPDATE users
       SET name = COALESCE(?, name),
           phone = COALESCE(?, phone),
           avatar_url = COALESCE(?, avatar_url)
       WHERE id = ?`,
      [name, phone, avatarUrl, req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.',
    });
  } catch (error) {
    next(error);
  }
}
