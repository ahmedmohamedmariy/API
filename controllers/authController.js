const User = require('../models/User');
const { sendResetPasswordCode } = require('../utils/emailService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, emergencyPhone } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email is already registered'
    });
  }
  
  // Create new user
  const user = new User({
    name,
    email,
    password,
    emergencyPhone
  });
  
  // Save user to DB
  await user.save();
  
  // Generate JWT token
  const token = user.generateAuthToken();
  
  // Send response without password
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emergencyPhone: user.emergencyPhone,
        profileImage: user.profileImage
      },
      token
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = user.generateAuthToken();
    
    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emergencyPhone: user.emergencyPhone,
          profileImage: user.profileImage
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * @desc    Forgot password - Send reset code
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with this email does not exist'
      });
    }
    
    // Generate reset code
    const resetCode = user.generateResetPasswordCode();
    
    // Save user with reset code information
    await user.save();
    
    // Send reset code to user's email
    await sendResetPasswordCode(user.email, user.name, resetCode);
    
    res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error sending password reset code'
    });
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if reset code exists and is valid
    if (
      !user.resetPasswordCode ||
      !user.resetPasswordCode.code ||
      user.resetPasswordCode.code !== code
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset code'
      });
    }
    
    // Check if code is expired
    if (user.resetPasswordCode.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Reset code has expired'
      });
    }
    
    // Update password
    user.password = newPassword;
    
    // Clear reset code
    user.resetPasswordCode = undefined;
    
    // Save user
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        emergencyPhone: user.emergencyPhone,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};