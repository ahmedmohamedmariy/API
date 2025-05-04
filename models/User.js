const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Import uuid
const config = require('../config/config');

const UserSchema = new mongoose.Schema({
  id: { // Add the new id field
    type: String,
    unique: true,
    select: false // Don't return id in queries by default
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    lowercase: true
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  
  emergencyPhone: {
    type: String,
    required: [true, 'Please provide an emergency phone number'],
    match: [/^\+?[0-9]{10,15}$/, 'Please provide a valid phone number']
  },
  
  profileImage: {
    type: String,
    default: 'default-profile.png'
  },
  
  resetPasswordCode: {
    code: String,
    expiresAt: Date
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate ID and hash password/ID before saving
UserSchema.pre('save', async function(next) {
  try {
    // Generate salt once for both hashing operations
    const salt = await bcrypt.genSalt(10);

    // Generate and hash ID if it's a new document
    if (this.isNew) {
      const rawId = uuidv4(); // Generate UUID
      this.id = await bcrypt.hash(rawId, salt); // Hash the generated ID
    }

    // Only hash the password if it's modified (or new)
    if (this.isModified('password')) {
      // Hash password with the same salt
      this.password = await bcrypt.hash(this.password, salt);
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id }, 
    config.jwtSecret, 
    { expiresIn: config.jwtExpire }
  );
};

// Method to generate a reset password code
UserSchema.methods.generateResetPasswordCode = function() {
  // Generate a random 6-digit code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiration time (10 minutes from now)
  this.resetPasswordCode = {
    code: resetCode,
    expiresAt: Date.now() + config.resetCodeExpire
  };
  
  return resetCode;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
