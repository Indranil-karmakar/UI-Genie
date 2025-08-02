// routes/uploadRoutes.js

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from 'cloudinary';
const cloudinaryV2 = cloudinary.v2;
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

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // Check if required environment variables are set
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
      console.error('Missing Cloudinary environment variables');
      return res.status(500).json({ error: 'Cloudinary configuration is missing' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('Missing Gemini API key');
      return res.status(500).json({ error: 'Gemini API configuration is missing' });
    }

    // ✅ Upload image to Cloudinary
    const uploadedImage = await cloudinaryV2.uploader.upload(req.file.path);

    // ✅ Generate React code using Gemini API
    const code = await generateReactCodeFromImage(req.file.path);

    // ✅ Save result in MongoDB
    const newUI = new GeneratedUI({
      imageUrl: uploadedImage.secure_url,
      generatedCode: code,
      userId: req.user._id,
    });
    await newUI.save();

    // ✅ Remove temporary file
    fs.unlinkSync(req.file.path);

    res.status(200).json(newUI);
  } catch (err) {
    console.error('Upload error:', err);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error('Failed to cleanup uploaded file:', cleanupErr);
      }
    }
    
    res.status(500).json({ error: 'Image upload or code generation failed', details: err.message });
  }
});

export default router;
