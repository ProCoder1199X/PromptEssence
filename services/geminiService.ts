import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, GEMINI_MODEL } from "../constants";

// Safely retrieve API Key
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

const API_KEY = getApiKey();

// Initialize the Gemini API client only if key exists to prevent immediate crash
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

/**
 * Optimizes the given user prompt using Gemini Flash 2.0 (gemini-2.5-flash).
 * 
 * @param userPrompt The messy prompt text from the user.
 * @returns The optimized prompt text.
 */
export const optimizePrompt = async (userPrompt: string): Promise<string> => {
  if (!ai) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  if (!userPrompt.trim()) {
    throw new Error("Please enter a prompt to optimize.");
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7, // Balance between creativity and strict adherence
      },
      contents: userPrompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
      throw new Error(`Optimization failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while optimizing the prompt.");
  }
};
