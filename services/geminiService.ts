import { GoogleGenAI } from "@google/genai";

// Ensure API key is present
const API_KEY = process.env.API_KEY || '';

if (!API_KEY) {
  console.error("Missing API_KEY in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Sends an image and a prompt to Gemini to edit/remove effects.
 * Uses gemini-2.5-flash-image for efficient image editing.
 */
export const removeVisualEffects = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';
    
    // Construct the request parts: Image + Text Prompt
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image output
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          // Return valid data URL
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Helper to convert File to Base64 raw string (no data prefix)
 */
export const fileToRawBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};