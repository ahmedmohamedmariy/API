const express = require('express');
const router = express.Router();
const { changePassword } = require('../controllers/passwordController');
const { protect } = require('../middleware/authMiddleware');
const { validateChangePassword, handleValidationErrors } = require('../utils/validators');

// All routes are protected
router.put('/', protect, validateChangePassword, handleValidationErrors, changePassword);

module.exports = router;