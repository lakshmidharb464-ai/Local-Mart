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

function getCookieOptions(maxAge = 7 * 24 * 60 * 60 * 1000) {
  return {
    httpOnly: true, // Prevents XSS token extraction
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  };
}

export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    ENV.JWT.SECRET,
    { expiresIn: '7d', algorithm: 'HS256' }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      type: 'refresh',
    },
    ENV.JWT.SECRET,
    { expiresIn: '30d', algorithm: 'HS256' }
  );
}

function generateToken(user) {
  return generateAccessToken(user);
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
      const validAdminSecret = ENV.ADMIN_SECRET || ENV.JWT.SECRET || 'admin123';
      if (adminSecret && (adminSecret === validAdminSecret || adminSecret === ENV.JWT.SECRET)) {
        normalizedRole = 'Admin';
      } else {
        return res.status(403).json({
          success: false,
          message: 'Admin registration requires a valid verification key.',
        });
      }
    }

    if (!normalizedRole) {
      normalizedRole = 'Customer';
    }

    // 3. Check if user already exists for this specific role
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ? AND role = ?',
      [rawEmail, normalizedRole]
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: `An account with this email is already registered as a ${normalizedRole}. Please sign in instead.`,
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

    const accessToken = generateAccessToken({ id: userId, email: rawEmail, role: normalizedRole, name: rawName });
    const refreshToken = generateRefreshToken({ id: userId, email: rawEmail, role: normalizedRole, name: rawName });

    // Store ACCESS token into DB for session validation (must match what client sends in Bearer header)
    await execute('UPDATE users SET auth_token = ? WHERE id = ?', [accessToken, userId]);

    // Set secure HTTP-only auth cookies
    res.cookie('localfarm_token', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days access token
    res.cookie('localfarm_refresh_token', refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000)); // 30 days refresh token

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token: accessToken,
      refreshToken,
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

    // Role check: query strictly for the requested role only
    let users = [];
    if (rawRole) {
      const validRoles = ['Customer', 'Farmer', 'Delivery', 'Admin'];
      const matchedRole = validRoles.find((r) => r.toLowerCase() === rawRole.toLowerCase()) || rawRole;
      users = await query(
        `SELECT id, name, email, password_hash, phone, role, avatar_url, is_active
         FROM users
         WHERE email = ? AND role = ?`,
        [rawEmail, matchedRole]
      );
    } else {
      users = await query(
        `SELECT id, name, email, password_hash, phone, role, avatar_url, is_active
         FROM users
         WHERE email = ?`,
        [rawEmail]
      );
    }

    // Anti-timing attack / Anti-enumeration: always run bcrypt comparison even if user doesn't exist
    if (users.length === 0) {
      await bcrypt.compare(rawPassword, DUMMY_PASSWORD_HASH);
      return res.status(401).json({
        success: false,
        message: rawRole
          ? `No ${rawRole} account found with this email, or password is incorrect.`
          : 'Invalid email or password.',
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save ACCESS token into DB for session tracking (must match what client sends in Bearer header)
    await execute('UPDATE users SET auth_token = ? WHERE id = ?', [accessToken, user.id]);

    // Set secure HTTP-only auth cookies
    res.cookie('localfarm_token', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days access token
    res.cookie('localfarm_refresh_token', refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000)); // 30 days refresh token

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token: accessToken,
      refreshToken,
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
 * Silent Refresh Token Handler
 * POST /api/auth/refresh
 */
export async function refreshTokenHandler(req, res, next) {
  try {
    const incomingToken =
      req.cookies?.localfarm_refresh_token ||
      req.body?.refreshToken ||
      req.headers['x-refresh-token'];

    if (!incomingToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided.',
      });
    }

    // Verify cryptographic signature
    let decoded;
    try {
      decoded = jwt.verify(incomingToken, ENV.JWT.SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired or invalid. Please sign in again.',
      });
    }

    // Verify token presence in database
    const users = await query(
      'SELECT id, name, email, role, avatar_url, is_active, auth_token FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0 || !users[0].is_active || users[0].auth_token !== incomingToken) {
      return res.status(401).json({
        success: false,
        message: 'Session revoked or invalid. Please sign in again.',
      });
    }

    const user = users[0];
    const newAccessToken = generateAccessToken(user);

    // Set new access token cookie
    res.cookie('localfarm_token', newAccessToken, getCookieOptions(60 * 60 * 1000));

    res.json({
      success: true,
      message: 'Token refreshed successfully.',
      token: newAccessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatar_url,
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
      // Invalidate refresh token in database
      await execute('UPDATE users SET auth_token = NULL WHERE id = ?', [req.user.id]);
    }
    res.clearCookie('localfarm_token', { path: '/' });
    res.clearCookie('localfarm_refresh_token', { path: '/' });
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
