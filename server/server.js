
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import uploadRoutes from './routes/uploadRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import GeneratedUI from './models/GeneratedUISchema.js';
import fs from 'fs';
import {generateReactCodeFromImage} from './services/geminiService.js';
import path from 'path';
import { fileURLToPath } from 'url';




const app = express();
app.use(cors());
app.use(express.json());
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongoConnected: mongoose.connection.readyState === 1
  });
});

app.use('/api/upload', uploadRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Check if MongoDB URI is provided
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve the index.html file for any other routes
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
