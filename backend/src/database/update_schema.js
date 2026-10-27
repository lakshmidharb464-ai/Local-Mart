import mysql from 'mysql2/promise';
import { ENV } from '../config/env.js';

async function updateSchema() {
  const connection = await mysql.createConnection({
    host: ENV.DB.HOST,
    port: ENV.DB.PORT,
    user: ENV.DB.USER,
    password: ENV.DB.PASSWORD,
    database: ENV.DB.NAME,
  });

  console.log('Modifying columns to support full Active/Inactive states...');
  try {
    await connection.query(`
      ALTER TABLE farmer_profiles 
      MODIFY COLUMN account_status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
      MODIFY COLUMN approval_status ENUM('Pending', 'Approved', 'Rejected', 'Inactive') DEFAULT 'Pending'
    `);
    console.log('✅ farmer_profiles modified.');
  } catch (e) {
    console.warn('farmer_profiles modify warning:', e.message);
  }

  try {
    await connection.query(`
      ALTER TABLE delivery_profiles 
      MODIFY COLUMN approval_status ENUM('Pending', 'Approved', 'Rejected', 'Inactive') DEFAULT 'Approved'
    `);
    console.log('✅ delivery_profiles modified.');
  } catch (e) {
    console.warn('delivery_profiles modify warning:', e.message);
  }

  await connection.end();
  console.log('Schema update complete.');
}

updateSchema().catch(console.error);
