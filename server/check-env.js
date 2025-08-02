import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLOUDINARY_NAME',
  'CLOUDINARY_KEY',
  'CLOUDINARY_SECRET',
  'GEMINI_API_KEY'
];

console.log('🔍 Checking environment variables...\n');

let allSet = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allSet = false;
  }
});

console.log('\n' + (allSet ? '🎉 All environment variables are set!' : '⚠️  Some environment variables are missing!'));

if (!allSet) {
  console.log('\nPlease set the missing environment variables in your Render dashboard.');
  process.exit(1);
} 