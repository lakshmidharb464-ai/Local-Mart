import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ENV } from '../config/env.js';
import { query, execute, withTransaction } from '../config/db.js';

// Precomputed dummy hash to prevent timing attacks / email enumeration
const DUMMY_PASSWORD_HASH = '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012';

// Standard RFC-5322 compatible email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function sanitizeString(val) {
  if (typeof val !== 'string') return '';
  // Remove non-printable control characters
  return val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  return trimmed.length >= 5 && trimmed.length <= 150 && EMAIL_REGEX.test(trimmed);
}

function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  // Min 6 characters, max 128 characters, cannot be only spaces
  return password.length >= 6 && password.length <= 128 && password.trim().length > 0;
}

function isValidName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  // Min 2 characters, max 100 characters, disallow dangerous HTML script tags
  return trimmed.length >= 2 && trimmed.length <= 100 && !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(trimmed);
}

function getCookieOptions() {
  return {
    httpOnly: true, // Prevents XSS token extraction
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    ENV.JWT.SECRET,
    { expiresIn: ENV.JWT.EXPIRES_IN, algorithm: 'HS256' }
  );
}

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const rawName = sanitizeString(req.body.name);
    const rawEmail = sanitizeString(req.body.email).toLowerCase();
    const rawPassword = typeof req.body.password === 'string' ? req.body.password : '';
    const rawRole = sanitizeString(req.body.role);
    const rawPhone = sanitizeString(req.body.phone);
    const rawFarmName = sanitizeString(req.body.farmName);
    const rawLocation = sanitizeString(req.body.location);
    const rawVehicleType = sanitizeString(req.body.vehicleType);
    const rawVehicleNumber = sanitizeString(req.body.vehicleNumber);
    const rawLicenseNumber = sanitizeString(req.body.licenseNumber);
    const adminSecret = sanitizeString(req.body.adminSecret);

    // 1. Validate required fields & formats
    if (!isValidName(rawName)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid full name (2-100 characters, no invalid symbols).',
      });
    }

    if (!isValidEmail(rawEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address format.',
      });
    }

    if (!isValidPassword(rawPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be between 6 and 128 characters long.',
      });
    }

    // 2. Role validation & Privilege escalation prevention
    const validPublicRoles = ['Customer', 'Farmer', 'Delivery'];
    let normalizedRole = validPublicRoles.find((r) => r.toLowerCase() === rawRole.toLowerCase());

    if (rawRole.toLowerCase() === 'admin') {
      // Prevent unauthorized admin creation
      if (adminSecret && adminSecret === ENV.JWT.SECRET) {
        normalizedRole = 'Admin';
      } else {
        return res.status(403).json({
          success: false,
          message: 'Admin account self-registration is restricted. Please sign up as Customer, Farmer, or Delivery.',
        });
      }
    }

    if (!normalizedRole) {
      normalizedRole = 'Customer';
    }

    // 3. Check if user already exists
    const existingUsers = await query('SELECT id FROM users WHERE email = ?', [rawEmail]);
    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.',
      });
    }

    const userId = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    let roleProfile = null;

    // 4. Transaction for atomic user + role profile creation
    await withTransaction(async (conn) => {
      await conn.execute(
        `INSERT INTO users (id, name, email, password_hash, phone, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [userId, rawName, rawEmail, passwordHash, rawPhone || null, normalizedRole]
      );

      // Create role-specific record
      if (normalizedRole === 'Customer') {
        await conn.execute(
          `INSERT INTO customer_loyalty (customer_id, order_count, total_spent, tier)
           VALUES (?, 0, 0.00, 'Bronze')`,
          [userId]
        );
        roleProfile = { customer_id: userId, order_count: 0, total_spent: 0, tier: 'Bronze' };
      } else if (normalizedRole === 'Farmer') {
        const farm = rawFarmName || `${rawName}'s Farm`;
        const loc = rawLocation || 'Local Area';
        await conn.execute(
          `INSERT INTO farmer_profiles (user_id, farm_name, location_address, approval_status, account_status)
           VALUES (?, ?, ?, 'Approved', 'Active')`,
          [userId, farm, loc]
        );
        roleProfile = { user_id: userId, farm_name: farm, location_address: loc, approval_status: 'Approved', account_status: 'Active' };
      } else if (normalizedRole === 'Delivery') {
        const vType = rawVehicleType || 'Motorcycle';
        const vNum = rawVehicleNumber || 'PENDING';
        const lNum = rawLicenseNumber || 'PENDING';
        await conn.execute(
          `INSERT INTO delivery_profiles (user_id, vehicle_type, vehicle_number, license_number, approval_status)
           VALUES (?, ?, ?, ?, 'Approved')`,
          [userId, vType, vNum, lNum]
        );
        roleProfile = { user_id: userId, vehicle_type: vType, vehicle_number: vNum, license_number: lNum, approval_status: 'Approved' };
      }
    });

    const token = generateToken({ id: userId, email: rawEmail, role: normalizedRole, name: rawName });

    // Store auth_token into database profile
    await execute('UPDATE users SET auth_token = ? WHERE id = ?', [token, userId]);

    // Set secure HTTP-only auth cookie
    res.cookie('localfarm_token', token, getCookieOptions());

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: userId,
        name: rawName,
        email: rawEmail,
        role: normalizedRole,
        phone: rawPhone || null,
        profile: roleProfile,
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
    const rawEmail = sanitizeString(req.body.email).toLowerCase();
    const rawPassword = typeof req.body.password === 'string' ? req.body.password : '';
    const rawRole = sanitizeString(req.body.role);

    if (!isValidEmail(rawEmail) || !rawPassword) {
      return res.status(400).json({
        success: false,
        message: 'Valid email and password are required.',
      });
    }

    const users = await query(
      `SELECT id, name, email, password_hash, phone, role, avatar_url, is_active
       FROM users
       WHERE email = ?`,
      [rawEmail]
    );

    // Anti-timing attack / Anti-enumeration: always run bcrypt comparison even if user doesn't exist
    if (users.length === 0) {
      await bcrypt.compare(rawPassword, DUMMY_PASSWORD_HASH);
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

    // Role check if provided (case-insensitive)
    if (rawRole && user.role.toLowerCase() !== rawRole.toLowerCase() && user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: `Account is registered as a ${user.role}, not a ${rawRole}.`,
      });
    }

    const isMatch = await bcrypt.compare(rawPassword, user.password_hash);
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

    // Save auth_token into database profile
    await execute('UPDATE users SET auth_token = ? WHERE id = ?', [token, user.id]);

    // Set secure HTTP-only auth cookie
    res.cookie('localfarm_token', token, getCookieOptions());

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
 * Logout user
 * POST /api/auth/logout
 */
export async function logout(req, res, next) {
  try {
    if (req.user?.id) {
      // Invalidate token in database
      await execute('UPDATE users SET auth_token = NULL WHERE id = ?', [req.user.id]);
    }
    res.clearCookie('localfarm_token', { path: '/' });
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
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
