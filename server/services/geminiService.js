
import fs from 'fs';
import mime from 'mime-types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToBase64(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString('base64');
}

export async function generateReactCodeFromImage(filePath) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    console.log('🤖 Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // ✅ Detect MIME type safely
    let mimeType = mime.lookup(filePath);
    if (!mimeType || !mimeType.startsWith('image/')) {
      console.warn('⚠️ Could not detect MIME type, using image/png as fallback');
      mimeType = 'image/png'; // fallback if detection fails
    }

    console.log('📸 Converting image to base64...');
    const base64Image = fileToBase64(filePath);
    console.log('📊 Image size:', Math.round(base64Image.length / 1024), 'KB');

    console.log('🚀 Sending request to Gemini...');
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      {
        text: `Convert this UI design into clean React + Tailwind CSS code.
Put everything in a single functional component (index.jsx). Return only the code.`,
      },
    ]);

    const response = await result.response;
    const code = await response.text();

    console.log('✅ Gemini response received, code length:', code.length);
    return code;
  } catch (err) {
    console.error('❌ Gemini API error:', err);
    console.error('❌ Error details:', {
      message: err.message,
      code: err.code,
      status: err.status
    });
    
    // Provide more specific error messages
    if (err.message.includes('API key')) {
      throw new Error('Gemini API key is invalid or missing');
    } else if (err.message.includes('quota')) {
      throw new Error('Gemini API quota exceeded');
    } else if (err.message.includes('network')) {
      throw new Error('Network error connecting to Gemini API');
    } else {
      throw new Error(`Gemini API error: ${err.message}`);
    }
  }
}

