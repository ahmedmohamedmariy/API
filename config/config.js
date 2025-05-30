module.exports = {
    // JWT configuration
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: '7d',
    
    // Password reset token configuration
    resetCodeExpire: 10 * 60 * 1000, // 10 minutes in milliseconds
    
    // Email configuration (for nodemailer)
    emailFrom: process.env.EMAIL_FROM,
    emailHost: process.env.EMAIL_HOST, // Added
    emailPort: process.env.EMAIL_PORT, // Added
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    
    // File upload configuration
    uploadPath: './uploads/profiles/',
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  };
