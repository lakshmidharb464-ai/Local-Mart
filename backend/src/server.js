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
