
import { GoogleGenAI, Modality } from "@google/genai";

// Utility to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};


export const editImageWithGemini = async (imageFiles: File[], prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imageParts = await Promise.all(
    imageFiles.map(async (file) => {
      const data = await fileToBase64(file);
      return {
        inlineData: { data, mimeType: file.type },
      };
    })
  );

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        ...imageParts,
        { text: prompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });
  
  const candidate = response.candidates?.[0];

  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
  }

  // If we reach here, no image was found or the response was blocked.
  if (candidate?.finishReason === 'SAFETY') {
      throw new Error("Gambar tidak dapat dibuat karena melanggar kebijakan keamanan. Coba prompt lain.");
  }

  throw new Error("Tidak ada gambar yang dihasilkan. Coba prompt yang berbeda.");
};