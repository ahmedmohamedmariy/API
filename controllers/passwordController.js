const User = require('../models/User');

/**
 * @desc    Change password
 * @route   PUT /api/password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    // Find user with password
    const user = await User.findById(req.user._id).select('+password');
    
    // Check if old password is correct
    const isMatch = await user.matchPassword(oldPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Set new password
    user.password = newPassword;
    
    // Save user
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
};