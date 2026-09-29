import mysql from 'mysql2/promise';
import { ENV } from './env.js';

let pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: ENV.DB.HOST,
      port: ENV.DB.PORT,
      user: ENV.DB.USER,
      password: ENV.DB.PASSWORD,
      database: ENV.DB.NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

/**
 * Direct execute query helper
 */
export async function query(sql, params = []) {
  const connectionPool = getPool();
  const [results] = await connectionPool.query(sql, params);
  return results;
}

/**
 * Direct execute statement helper (for inserts/updates/deletes)
 */
export async function execute(sql, params = []) {
  const connectionPool = getPool();
  const [result] = await connectionPool.execute(sql, params);
  return result;
}

/**
 * Execute in transaction helper
 */
export async function withTransaction(callback) {
  const connectionPool = getPool();
  const connection = await connectionPool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Test DB Connection
 */
export async function testConnection() {
  try {
    const connectionPool = getPool();
    const [rows] = await connectionPool.query('SELECT 1 + 1 AS solution');
    return { ok: true, solution: rows[0].solution };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export default {
  getPool,
  query,
  execute,
  withTransaction,
  testConnection,
};
