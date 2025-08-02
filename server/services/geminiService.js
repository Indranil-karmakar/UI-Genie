
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // ✅ Detect MIME type safely
    let mimeType = mime.lookup(filePath);
    if (!mimeType || !mimeType.startsWith('image/')) {
      console.warn('⚠️ Could not detect MIME type, using image/png as fallback');
      mimeType = 'image/png'; // fallback if detection fails
    }

    const base64Image = fileToBase64(filePath);

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

    return code;
  } catch (err) {
    console.error('Gemini API error:', err);
    return '// ❌ Failed to generate code from image.';
  }
}

