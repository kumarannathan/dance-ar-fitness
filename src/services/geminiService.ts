import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the key from environment variable
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Missing Gemini API key. Please add REACT_APP_GEMINI_API_KEY to your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');
// Use the Gemini 2.0 Flash-Lite model for cost efficiency and low latency
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

const SYSTEM_PROMPT = `You are an expert dance coach AI assistant. Your role is to:
1. Provide helpful, constructive feedback on dance technique
2. Offer specific tips for improvement
3. Be encouraging and supportive
4. Focus on both technical aspects and artistic expression
5. Keep responses concise but informative

When giving feedback:
- Be specific about body positioning and movement
- Explain the "why" behind your suggestions
- Use clear, simple language
- Maintain a positive, motivating tone
- Relate tips to common dance principles`;

export const getDanceCoachResponse = async (userMessage: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    // Create a prompt that combines the system prompt and user message
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}`;
    
    // Use the model to generate a response
    // @ts-ignore - The method exists but TypeScript doesn't recognize it
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    throw new Error('Failed to get response from AI dance coach');
  }
}; 