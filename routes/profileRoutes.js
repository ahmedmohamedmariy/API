const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getProfile,
  deleteProfileImage
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProfileImage, handleUploadErrors } = require('../middleware/uploadMiddleware');
const { validateUpdateProfile, handleValidationErrors } = require('../utils/validators');

// All routes are protected
router.get('/', protect, getProfile);
router.put('/', 
  protect, 
  uploadProfileImage, 
  handleUploadErrors, 
  validateUpdateProfile, 
  handleValidationErrors, 
  updateProfile
);
router.delete('/image', protect, deleteProfileImage);

module.exports = router;