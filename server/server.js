// const cors = require('cors');
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const uploadRoutes = require('./routes/uploadRoutes');
// const downloadRoutes = require('./routes/downloadRoutes');
// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const hfService = require('./services/geminiService.js');
// const GeneratedUI = require('./models/GeneratedUISchema');
// const fs = require('fs');
// const {generateReactCodeFromImage} = require('./services/geminiService.js');
// const path = require('path');
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
app.use('/api/upload', uploadRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve the index.html file for any other routes
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
