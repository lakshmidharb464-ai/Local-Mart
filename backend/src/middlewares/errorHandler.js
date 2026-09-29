/**
 * Centralized Global Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, {
    status: statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
