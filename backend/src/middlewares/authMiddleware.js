import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { query } from '../config/db.js';

/**
 * Middleware to verify JWT Bearer Token
 */
export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT.SECRET);
    
    // Verify user still exists and is active in DB
    const users = await query('SELECT id, name, email, role, is_active FROM users WHERE id = ?', [decoded.id]);
    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. User not found.',
      });
    }

    const user = users[0];
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
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
 * Optional Authentication (attaches user if valid token exists, doesn't block otherwise)
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT.SECRET);
    const users = await query('SELECT id, name, email, role, is_active FROM users WHERE id = ?', [decoded.id]);
    if (users && users.length > 0 && users[0].is_active) {
      req.user = users[0];
    }
  } catch (err) {
    // Ignore invalid token for optional auth
  }
  next();
}
