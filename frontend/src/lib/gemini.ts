import { GoogleGenAI } from "@google/genai";

export const vertexAI = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
});

export const MODEL_PRO = "gemini-2.5-pro";
export const MODEL_FLASH = "gemini-2.5-flash";
