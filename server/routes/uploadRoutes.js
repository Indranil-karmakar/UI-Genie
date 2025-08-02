// routes/uploadRoutes.js

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import GeneratedUI from '../models/GeneratedUISchema.js';
import { generateReactCodeFromImage } from '../services/geminiService.js';
import { auth } from '../middleware/auth.js';

// Ensure uploads directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const router = express.Router();
const upload = multer({ dest: uploadsDir });

// Debug route
router.get('/debug', (req, res) => {
  const config = {
    cloudinary: {
      name: process.env.CLOUDINARY_NAME ? 'Set' : 'Missing',
      key: process.env.CLOUDINARY_KEY ? 'Set' : 'Missing',
      secret: process.env.CLOUDINARY_SECRET ? 'Set' : 'Missing',
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Missing',
    },
    mongo: {
      uri: process.env.MONGO_URI ? 'Set' : 'Missing',
      connected: mongoose.connection.readyState === 1,
    },
    uploadsDir: {
      exists: fs.existsSync(uploadsDir),
      path: uploadsDir,
    },
  };

  res.json(config);
});

// Upload route
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    console.log('📁 File uploaded:', req.file.path);
    console.log('👤 User ID:', req.user._id);

    console.log('☁️ Uploading to Cloudinary...');
    const uploadedImage = await cloudinary.uploader.upload(req.file.path);
    console.log('✅ Cloudinary upload successful:', uploadedImage.secure_url);

    console.log('🤖 Generating code with Gemini...');
    const code = await generateReactCodeFromImage(req.file.path);
    console.log('✅ Code generation successful, length:', code.length);

    console.log('💾 Saving to MongoDB...');
    const newUI = new GeneratedUI({
      imageUrl: uploadedImage.secure_url,
      generatedCode: code,
      userId: req.user._id,
    });
    await newUI.save();
    console.log('✅ MongoDB save successful');

    fs.unlinkSync(req.file.path);
    console.log('🗑️ Temporary file cleaned up');

    res.status(200).json(newUI);
  } catch (err) {
    console.error('❌ Upload error:', err);
    console.error('❌ Error stack:', err.stack);

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
