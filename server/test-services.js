import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const cloudinaryV2 = cloudinary.v2;

async function testServices() {
  console.log('🧪 Testing all services...\n');

  // Test 1: Environment Variables
  console.log('1️⃣ Checking environment variables...');
  const requiredVars = [
    'MONGO_URI',
    'JWT_SECRET', 
    'CLOUDINARY_NAME',
    'CLOUDINARY_KEY',
    'CLOUDINARY_SECRET',
    'GEMINI_API_KEY'
  ];

  let allVarsSet = true;
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: Set`);
    } else {
      console.log(`   ❌ ${varName}: Missing`);
      allVarsSet = false;
    }
  });

  if (!allVarsSet) {
    console.log('\n❌ Some environment variables are missing. Please set them in Render.');
    return;
  }

  // Test 2: MongoDB Connection
  console.log('\n2️⃣ Testing MongoDB connection...');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('   ✅ MongoDB connected successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.log('   ❌ MongoDB connection failed:', error.message);
    return;
  }

  // Test 3: Cloudinary Configuration
  console.log('\n3️⃣ Testing Cloudinary configuration...');
  try {
    cloudinaryV2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    console.log('   ✅ Cloudinary configured successfully');
  } catch (error) {
    console.log('   ❌ Cloudinary configuration failed:', error.message);
    return;
  }

  // Test 4: Gemini API
  console.log('\n4️⃣ Testing Gemini API...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('   ✅ Gemini API initialized successfully');
  } catch (error) {
    console.log('   ❌ Gemini API initialization failed:', error.message);
    return;
  }

  console.log('\n🎉 All services are configured correctly!');
  console.log('Your app should work properly now.');
}

testServices().catch(console.error); 