// routes/uploadRoutes.js

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import cloudinary from 'cloudinary';
const cloudinaryV2 = cloudinary.v2;
import GeneratedUI from '../models/GeneratedUISchema.js';
import { generateReactCodeFromImage } from '../services/geminiService.js';
import { auth } from '../middleware/auth.js';

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

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
    res.status(500).json({ error: 'Image upload or code generation failed' });
  }
});

export default router;
