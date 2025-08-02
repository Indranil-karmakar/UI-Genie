// routes/uploadRoutes.js

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import GeneratedUI from '../models/GeneratedUISchema.js';
import { generateReactCodeFromImage } from '../services/geminiService.js';
import { auth } from '../middleware/auth.js';

// Ensure uploads directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Cloudinary only if environment variables are present
if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_KEY && process.env.CLOUDINARY_SECRET) {
  cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
}

const router = express.Router();
const upload = multer({ dest: uploadsDir });

// Debug endpoint to check configuration
router.get('/debug', (req, res) => {
  const config = {
    cloudinary: {
      name: process.env.CLOUDINARY_NAME ? 'Set' : 'Missing',
      key: process.env.CLOUDINARY_KEY ? 'Set' : 'Missing',
      secret: process.env.CLOUDINARY_SECRET ? 'Set' : 'Missing'
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Missing'
    },
    mongo: {
      uri: process.env.MONGO_URI ? 'Set' : 'Missing',
      connected: mongoose.connection.readyState === 1
    },
    uploadsDir: {
      exists: fs.existsSync(uploadsDir),
      path: uploadsDir
    }
  };
  
  res.json(config);
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    console.log('📁 File uploaded:', req.file.path);
    console.log('👤 User ID:', req.user._id);

    // Check if required environment variables are set
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
      console.error('❌ Missing Cloudinary environment variables');
      return res.status(500).json({ 
        error: 'Cloudinary configuration is missing',
        details: {
          name: !!process.env.CLOUDINARY_NAME,
          key: !!process.env.CLOUDINARY_KEY,
          secret: !!process.env.CLOUDINARY_SECRET
        }
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ Missing Gemini API key');
      return res.status(500).json({ error: 'Gemini API configuration is missing' });
    }

    console.log('☁️ Uploading to Cloudinary...');
    // ✅ Upload image to Cloudinary
    const uploadedImage = await cloudinaryV2.uploader.upload(req.file.path);
    console.log('✅ Cloudinary upload successful:', uploadedImage.secure_url);

    console.log('🤖 Generating code with Gemini...');
    // ✅ Generate React code using Gemini API
    const code = await generateReactCodeFromImage(req.file.path);
    console.log('✅ Code generation successful, length:', code.length);

    console.log('💾 Saving to MongoDB...');
    // ✅ Save result in MongoDB
    const newUI = new GeneratedUI({
      imageUrl: uploadedImage.secure_url,
      generatedCode: code,
      userId: req.user._id,
    });
    await newUI.save();
    console.log('✅ MongoDB save successful');

    // ✅ Remove temporary file
    fs.unlinkSync(req.file.path);
    console.log('🗑️ Temporary file cleaned up');

    res.status(200).json(newUI);
  } catch (err) {
    console.error('❌ Upload error:', err);
    console.error('❌ Error stack:', err.stack);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Cleaned up uploaded file after error');
      } catch (cleanupErr) {
        console.error('❌ Failed to cleanup uploaded file:', cleanupErr);
      }
    }
    
    res.status(500).json({ 
      error: 'Image upload or code generation failed', 
      details: err.message,
      step: err.message.includes('Cloudinary') ? 'cloudinary' : 
            err.message.includes('Gemini') ? 'gemini' : 
            err.message.includes('MongoDB') ? 'mongodb' : 'unknown'
    });
  }
});

export default router;
