const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateChangePassword, // Added validateChangePassword
  handleValidationErrors
} = require('../utils/validators');

// Public routes
router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, forgotPassword);
router.post('/reset-password', validateResetPassword, handleValidationErrors, resetPassword);

// Protected routes
router.get('/profile', protect, getCurrentUser);
router.put('/profile', protect, validateUpdateProfile, handleValidationErrors, updateProfile);
router.put('/change-password', protect, validateChangePassword, handleValidationErrors, changePassword);
router.post('/logout', protect, logout);


module.exports = router;
