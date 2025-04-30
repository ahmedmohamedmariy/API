const nodemailer = require('nodemailer');
const config = require('../config/config');

/**
 * Initialize nodemailer transporter
 */
const transporter = nodemailer.createTransport({
  service: config.emailService,
  auth: {
    user: config.emailUser,
    pass: config.emailPass
  }
});

/**
 * Send reset password code to user's email
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} resetCode - Password reset code
 * @returns {Promise} - Email sending result
 */
exports.sendResetPasswordCode = async (to, name, resetCode) => {
  try {
    // Email options
    const mailOptions = {
      from: `"Authentication App" <${config.emailFrom}>`,
      to,
      subject: 'Password Reset Code',
      html: `
        <h1>Password Reset</h1>
        <p>Hello ${name},</p>
        <p>You requested a password reset. Please use the following code to reset your password:</p>
        <h2 style="background-color: #f4f4f4; padding: 10px; display: inline-block;">${resetCode}</h2>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>Thank you,</p>
        <p>Authentication App Team</p>
      `
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Error sending email');
  }
};