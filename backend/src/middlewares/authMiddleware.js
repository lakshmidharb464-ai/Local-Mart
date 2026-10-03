import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { query } from '../config/db.js';

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  if (req.cookies && req.cookies.localfarm_token) {
    return req.cookies.localfarm_token;
  }
  return null;
}

/**
 * Middleware to verify JWT Bearer Token or Cookie
 */
export async function verifyToken(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token or session cookie provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT.SECRET);
    
    // Verify user exists and check token in DB
    const users = await query('SELECT id, name, email, role, is_active, auth_token FROM users WHERE id = ?', [decoded.id]);
    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. User not found in database.',
      });
    }

    const user = users[0];
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Database Token Existence Check (Profile-based session validation)
    // If auth_token is NULL (logged out) or does not match current token, session is invalid
    if (!user.auth_token || user.auth_token !== token) {
      return res.status(401).json({
        success: false,
        message: 'Session has been invalidated or expired. Please sign in again.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
}

/**
 * Middleware to guard routes by Role
 * @param  {...string} roles - e.g. 'Farmer', 'Admin', 'Delivery', 'Customer'
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role) && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: `Forbidden. This action requires one of the following roles: [${roles.join(', ')}]`,
      });
    }

    next();
  };
}

/**
 * Optional Authentication (attaches user if valid token exists in headers/cookies and matches DB, doesn't block otherwise)
 */
export async function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT.SECRET);
    const users = await query('SELECT id, name, email, role, is_active, auth_token FROM users WHERE id = ?', [decoded.id]);
    if (users && users.length > 0 && users[0].is_active) {
      // Must have active matching auth_token in DB
      if (users[0].auth_token && users[0].auth_token === token) {
        req.user = users[0];
      }
    }
  } catch (err) {
    // Ignore invalid token for optional auth
  }
  next();
}
