const express = require('express');
const router = express.Router();
const { sendResetPasswordCode } = require('../utils/emailService');
const asyncHandler = require('../utils/asyncHandler');

// Test email endpoint
router.post('/email', asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  try {
    await sendResetPasswordCode(email, 'Test User', '123456');
    
    res.status(200).json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    console.error('Email test error:', error);
    throw new Error(`Email test failed: ${error.message}`);
  }
}));

// Test DB connection
router.get('/db', asyncHandler(async (req, res) => {
  const connectionState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  res.status(200).json({
    success: true,
    connection: states[connectionState],
    host: mongoose.connection.host,
    status: connectionState === 1 ? 'healthy' : 'unhealthy'
  });
}));

module.exports = router;