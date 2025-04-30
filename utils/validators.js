const { check, validationResult } = require('express-validator');

/**
 * Validate signup request fields
 */
exports.validateSignup = [
  check('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 20 }).withMessage('Name cannot be more than 20 characters'),
    
  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
  check('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    
  check('emergencyPhone')
    .notEmpty().withMessage('Emergency phone is required')
    .matches(/^\+?[0-9]{10,15}$/).withMessage('Please provide a valid phone number')
];

/**
 * Validate login request fields
 */
exports.validateLogin = [
  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
    
  check('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Validate forgot password request
 */
exports.validateForgotPassword = [
  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
];

/**
 * Validate reset password request
 */
exports.validateResetPassword = [
  check('code')
    .notEmpty().withMessage('Reset code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Reset code must be 6 digits'),
    
  check('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
  check('confirmNewPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

/**
 * Validate update profile request
 */
exports.validateUpdateProfile = [
  check('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty if provided')
    .isLength({ max: 20 }).withMessage('Name cannot be more than 20 characters'),
    
  check('emergencyPhone')
    .optional()
    .notEmpty().withMessage('Emergency phone cannot be empty if provided')
    .matches(/^\+?[0-9]{10,15}$/).withMessage('Please provide a valid phone number')
];

/**
 * Validate change password request
 */
exports.validateChangePassword = [
  check('oldPassword')
    .notEmpty().withMessage('Current password is required'),
    
  check('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error('New password must be different from the current password');
      }
      return true;
    }),
    
  check('confirmNewPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

/**
 * Middleware to handle validation errors
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }))
    });
  }
  
  next();
};