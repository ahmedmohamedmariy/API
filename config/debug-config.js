// For debugging only - add to server.js
const dotenv = require('dotenv');
dotenv.config();

console.log('Environment variables check:');
console.log('- MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('- EMAIL_FROM exists:', !!process.env.EMAIL_FROM);
console.log('- EMAIL_SERVICE exists:', !!process.env.EMAIL_SERVICE);
console.log('- EMAIL_USER exists:', !!process.env.EMAIL_USER);
console.log('- EMAIL_PASS exists:', !!process.env.EMAIL_PASS);

// Add line below to server.js temporarily
// require('./config/debug-config');