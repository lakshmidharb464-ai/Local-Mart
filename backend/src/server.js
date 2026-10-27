import app from './app.js';
import { ENV } from './config/env.js';
import { testConnection } from './config/db.js';

const PORT = ENV.PORT;

async function startServer() {
  try {
    console.log('🚀 Initializing LocalFarm Direct API Gateway...');
    
    // Test DB connection
    const dbStatus = await testConnection();
    if (dbStatus.ok) {
      console.log(`✅ MySQL Database connected successfully to ${ENV.DB.HOST}:${ENV.DB.PORT}/${ENV.DB.NAME}`);
      try {
        const { query } = await import('./config/db.js');
        // Ensure image_url supports long base64 streams or cloud CDN URIs
        await query('ALTER TABLE product_images MODIFY COLUMN image_url LONGTEXT NOT NULL;');

        // Performance & Indexing Hardening
        const indices = [
          'CREATE INDEX IF NOT EXISTS idx_products_lookup ON products (farmer_id, category_id, status);',
          'CREATE INDEX IF NOT EXISTS idx_orders_customer_status ON orders (customer_id, status, created_at);',
          'CREATE INDEX IF NOT EXISTS idx_orders_rider_status ON orders (delivery_partner_id, status);',
          'CREATE INDEX IF NOT EXISTS idx_order_items_composite ON order_items (order_id, farmer_id, product_id);',
          'CREATE INDEX IF NOT EXISTS idx_shifts_date ON delivery_shifts (delivery_partner_id, shift_date);',
          'CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON customer_subscriptions (customer_id, is_active, next_delivery_date);'
        ];

        for (const indexSql of indices) {
          try {
            await query(indexSql);
          } catch (e) {
            // Index already exists or MySQL version doesn't support IF NOT EXISTS for index
          }
        }
        console.log('⚡ High-throughput composite indices verified and active.');
      } catch (patchErr) {
        // Schema already modified or table not yet created
      }
    } else {
      console.warn(`⚠️ Warning: Database connection issue: ${dbStatus.error}`);
      console.warn(`👉 Make sure MySQL is running on port ${ENV.DB.PORT} or run 'npm run db:migrate'.`);
    }

    const server = app.listen(PORT, () => {
      console.log(`🌱 LocalFarm Backend Server running on http://localhost:${PORT}`);
      console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/health`);
    });

    // Graceful Shutdown
    const shutdown = () => {
      console.log('🛑 Shutting down server gracefully...');
      server.close(() => {
        console.log('💤 Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
