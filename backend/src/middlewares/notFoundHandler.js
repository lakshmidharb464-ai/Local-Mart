/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' not found.`,
  });
}
