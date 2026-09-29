import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('🔄 Starting Database Migrations...');
  let connection;

  try {
    // 1. Initial connection without database to ensure DB exists
    connection = await mysql.createConnection({
      host: ENV.DB.HOST,
      port: ENV.DB.PORT,
      user: ENV.DB.USER,
      password: ENV.DB.PASSWORD,
      multipleStatements: true,
    });

    console.log(`🔌 Connected to MySQL server at ${ENV.DB.HOST}:${ENV.DB.PORT}`);

    // 2. Ensure database exists and select it
    console.log(`📜 Creating/selecting database '${ENV.DB.NAME}'...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${ENV.DB.NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${ENV.DB.NAME}\`;`);

    // 3. Read schema.sql and strip static DB creation/use statements
    const schemaPath = path.join(__dirname, 'schema.sql');
    let schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    schemaSql = schemaSql.replace(/CREATE DATABASE IF NOT EXISTS [^;]+;/gi, '');
    schemaSql = schemaSql.replace(/USE [^;]+;/gi, '');

    // 4. Execute migration script
    console.log(`📜 Applying schema to database '${ENV.DB.NAME}'...`);
    await connection.query(schemaSql);

    console.log('✅ Database schema migrated successfully! All 22 tables are ready.');
    return { success: true };
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Auto-run if executed directly via node
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations().then((res) => {
    process.exit(res.success ? 0 : 1);
  });
}
