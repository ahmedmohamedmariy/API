const User = require('../models/User');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Update user profile
 * @route   PUT /api/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, emergencyPhone } = req.body;
    
    // Get user
    const user = await User.findById(req.user._id);
    
    // Update fields if provided
    if (name) user.name = name;
    if (emergencyPhone) user.emergencyPhone = emergencyPhone;
    
    // Handle profile image upload
    if (req.file) {
      // Delete previous profile image if it's not the default
      if (user.profileImage !== 'default-profile.png') {
        const prevImagePath = path.join(__dirname, '../uploads/profiles', user.profileImage);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(prevImagePath)) {
          fs.unlinkSync(prevImagePath);
        }
      }
      
      // Set new profile image
      user.profileImage = req.file.filename;
    }
    
    // Save updated user
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        emergencyPhone: user.emergencyPhone,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/profile
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        emergencyPhone: user.emergencyPhone,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

/**
 * @desc    Delete profile image and set to default
 * @route   DELETE /api/profile/image
 * @access  Private
 */
exports.deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Only delete if not the default image
    if (user.profileImage !== 'default-profile.png') {
      const imagePath = path.join(__dirname, '../uploads/profiles', user.profileImage);
      
      // Check if file exists before attempting to delete
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      
      // Set back to default
      user.profileImage = 'default-profile.png';
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile image deleted successfully',
      data: {
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Delete profile image error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error deleting profile image'
    });
  }
};