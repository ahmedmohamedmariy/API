/**
 * Async handler to wrap async route handlers
 * This eliminates the need for try-catch blocks in each controller
 * @param {Function} fn - Async function to execute
 * @returns {Function} - Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  module.exports = asyncHandler;