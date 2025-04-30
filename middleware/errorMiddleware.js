/**
 * Error handler middleware
 * Provides detailed error information in development
 * Limited information in production
 */
exports.errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    console.error('\n=== ERROR DETAILS ===');
    console.error(`Route: ${req.method} ${req.originalUrl}`);
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    console.error('=====================\n');
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate field value entered',
        field: Object.keys(err.keyValue)[0]
      });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  
  /**
   * 404 Not Found handler
   */
  exports.notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };