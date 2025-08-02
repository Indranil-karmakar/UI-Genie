// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const GeneratedUISchema = new mongoose.Schema({
  imageUrl: String,
  generatedCode: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('GeneratedUI', GeneratedUISchema);
