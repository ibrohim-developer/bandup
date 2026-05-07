import { config } from 'dotenv';
config({ path: '.env.local' });
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
});

console.log('Calling Gemini...');

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'In one sentence, what is IELTS?',
});

console.log('Full response:', JSON.stringify(response, null, 2));
console.log('Text:', response.text);
console.log('Candidates:', response.candidates?.[0]?.content?.parts?.[0]?.text);