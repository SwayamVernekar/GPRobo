require('dotenv').config();

console.log('🔍 Testing Configuration...\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('   - PORT:', process.env.PORT || '3000 (default)');
console.log('   - MAX_FILE_SIZE:', process.env.MAX_FILE_SIZE ? '✅ Set' : '⚠️  Using default (20MB)');
console.log('');

// Check required packages
console.log('2. Checking Required Packages:');
const requiredPackages = [
  'express',
  'mongoose',
  'dotenv',
  'cors',
  'multer',
  'express-validator'
];

requiredPackages.forEach(pkg => {
  try {
    require.resolve(pkg);
    console.log(`   - ${pkg}: ✅ Installed`);
  } catch (e) {
    console.log(`   - ${pkg}: ❌ Not installed (run: npm install ${pkg})`);
  }
});
console.log('');

// Test MongoDB connection
console.log('3. Testing MongoDB Connection:');
if (!process.env.MONGODB_URI) {
  console.log('   ❌ MONGODB_URI not set in .env file');
  console.log('   Please configure your .env file with MongoDB Atlas connection string');
} else if (process.env.MONGODB_URI.includes('<username>') || 
           process.env.MONGODB_URI.includes('<password>')) {
  console.log('   ⚠️  Please replace <username> and <password> in your connection string');
} else {
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('   ✅ MongoDB Connected Successfully!');
    console.log('   Database:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    mongoose.connection.close();
    console.log('\n✨ All checks passed! You can run: npm start');
  })
  .catch(err => {
    console.log('   ❌ MongoDB Connection Failed:', err.message);
    console.log('\n   Troubleshooting:');
    console.log('   1. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('   2. Verify username and password are correct');
    console.log('   3. Ensure your cluster is active');
  });
}
