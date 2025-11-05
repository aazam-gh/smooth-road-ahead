import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { VehicleProfile, EnvironmentalData, PredictionResult, Recommendation } from '../../types';

// Centralize API key handling and lazy client creation to avoid crashes when missing
const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) || undefined;
const HAS_KEY = Boolean(API_KEY);
let _client: GoogleGenAI | null = null;
const getClient = () => {
  if (!HAS_KEY) return null;
  if (_client) return _client;
  _client = new GoogleGenAI({ apiKey: API_KEY! });
  return _client;
};

export const calculatePrrScore = async (vehicle: VehicleProfile, environment: EnvironmentalData): Promise<PredictionResult> => {
  let score = 100;
  const alerts: string[] = [];
  const today = new Date();

  // Rule A (SandSense Filter Predictor)
  // FIX: Coerce potential empty string values from forms to numbers for calculation.
  const milesSinceFilterChange = Number(vehicle.odometer) - Number(vehicle.lastAirFilterChangeMiles);
  if (Number(environment.sandstorm_Events_Last_30Days) > 5 && milesSinceFilterChange > 2000) {
    score -= 10;
    alerts.push("Air Filter Check needed due to high dust exposure.");
  }

  // Rule B (Thermal Stress Analyzer)
  // FIX: Coerce potential empty string value from form to a number for comparison.
  if (Number(environment.daysAbove_45C_Last_90Days) > 30) {
    score -= 5;
    if (score < 90) {
      alerts.push("Battery/Coolant Inspection needed due to sustained extreme heat.");
    }
  }

  // Rule C (Compliance/PRR)
  // FIX: Handle case where lastOilChangeDate might be an empty string from the form.
  const lastOilChange = vehicle.lastOilChangeDate ? new Date(vehicle.lastOilChangeDate) : null;
  const monthsSinceOilChange = lastOilChange
    ? (today.getFullYear() - lastOilChange.getFullYear()) * 12 + (today.getMonth() - lastOilChange.getMonth())
    : 0;
  // FIX: Coerce potential empty string values from forms to numbers for calculation.
  const milesSinceOilChange = Number(vehicle.odometer) - Number(vehicle.lastOilChangeMileage);
  if ((monthsSinceOilChange > 7 && lastOilChange) || milesSinceOilChange > 5000) {
    score -= 15;
    alerts.push("Overdue Oil Change.");
  }
  
  const finalScore = Math.max(0, score); // Ensure score doesn't go below 0

  const prompt = `
    Analyze the following vehicle and environmental data to provide a detailed assessment and maintenance recommendations.
    
    Vehicle Data:
    - Odometer: ${vehicle.odometer} miles
    - Miles Since Last Oil Change: ${milesSinceOilChange}
    - Months Since Last Oil Change: ${monthsSinceOilChange.toFixed(1)}
    - Miles Since Last Air Filter Change: ${milesSinceFilterChange}
    - Location Zip Code: ${vehicle.zipCode}
    
    Environmental Data:
    - Recent Sandstorm Events (30 days): ${environment.sandstorm_Events_Last_30Days}
    - Extreme Heat Days (>45C in 90 days): ${environment.daysAbove_45C_Last_90Days}
    
    Calculated PRR Score: ${finalScore}
    Triggered Alerts: ${alerts.join(', ') || 'None'}
    
    Based on this information:
    1.  Provide a concise 'overallAssessment' (1-2 sentences) of the vehicle's current health.
    2.  Provide a list of specific, actionable 'recommendations'. Each recommendation should be an object with 'component', 'recommendationText', and 'urgency' ('High', 'Medium', or 'Low'). Prioritize recommendations based on the triggered alerts.
    
    Return the response as a JSON object with the keys "overallAssessment" and "recommendations".
  `;

  // If no API key, return a deterministic, useful fallback (demo mode)
  if (!HAS_KEY) {
    const fallbackRecs: Recommendation[] = [];
    if (alerts.includes("Overdue Oil Change.")) {
      fallbackRecs.push({
        component: "Engine Oil",
        recommendationText: "Schedule an oil and filter change. Consider synthetic oil for high-heat environments.",
        urgency: "High",
      });
    }
    if (alerts.find(a => a.includes("Air Filter"))) {
      fallbackRecs.push({
        component: "Air Filter",
        recommendationText: "Inspect and replace engine and cabin air filters due to dust exposure.",
        urgency: "Medium",
      });
    }
    if (fallbackRecs.length === 0) {
      fallbackRecs.push({
        component: "General Maintenance",
        recommendationText: "No critical issues detected. Follow regular service intervals and monitor fluids.",
        urgency: "Low",
      });
    }

    return {
      prrScore: Math.max(0, score),
      overallAssessment: "Demo mode: AI analysis unavailable without API key. Showing rules-based assessment only.",
      recommendations: fallbackRecs,
      alerts,
    };
  }

  try {
    const client = getClient();
    const response: GenerateContentResponse = await client!.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        // FIX: Added responseSchema to ensure robust JSON output format.
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallAssessment: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  component: { type: Type.STRING },
                  recommendationText: { type: Type.STRING },
                  urgency: { type: Type.STRING },
                },
                required: ['component', 'recommendationText', 'urgency'],
              },
            },
          },
          required: ['overallAssessment', 'recommendations'],
        },
      }
    });
    // Handle either response.text() function or .text string property
    const textGetter: any = (response as any).text;
    const text: string = typeof textGetter === 'function' ? await textGetter.call(response) : (textGetter ?? '');
    const result = JSON.parse(text);

    return {
      prrScore: finalScore,
      overallAssessment: result.overallAssessment,
      recommendations: result.recommendations,
      alerts: alerts,
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a fallback response if the API fails
    return {
      prrScore: finalScore,
      overallAssessment: "Could not retrieve detailed analysis from AI. Please check the triggered alerts.",
      recommendations: [],
      alerts: alerts,
    };
  }
};

// Utility function to format text for better readability
const formatStreamedText = (text: string): string => {
  return text
    // Ensure proper spacing after bullet points
    .replace(/•\s*/g, '• ')
    // Ensure proper spacing after numbered lists
    .replace(/(\d+\.)\s*/g, '$1 ')
    // Add line breaks before section headers (words followed by colon)
    .replace(/([A-Z][a-zA-Z\s]+:)/g, '\n$1')
    // Clean up multiple consecutive spaces
    .replace(/\s{3,}/g, '  ')
    // Ensure proper line breaks
    .replace(/\n{3,}/g, '\n\n');
};

// For Chatbot (streaming). Provide a graceful demo-mode stream when no API key.
let chat: any = null;
if (HAS_KEY) {
  try {
    chat = getClient()!.chats.create({ model: 'gemini-2.5-flash' });
  } catch (e) {
    console.warn('Chat initialization failed; will use fallback stream.', e);
  }
}

export const chatService = {
  sendMessageStream: async function* (message: string): AsyncGenerator<string> {
    if (!HAS_KEY || !chat) {
      // Demo mode: simple simulated streaming response
      const parts = [
        "(Demo mode) No API key configured. ",
        "To enable full AI chat and voice, set GEMINI_API_KEY in a .env file and restart. ",
        `You asked: "${message}". Here's a generic tip: `,
        "Check oil and filters regularly, especially in hot or dusty climates."
      ];
      for (const p of parts) {
        await new Promise(r => setTimeout(r, 250));
        yield p;
      }
      return;
    }

    // Enhanced prompt for better, more structured responses
    const enhancedPrompt = `${message}

Please provide a clear, concise, and well-structured response following these guidelines:

FORMATTING:
• Use bullet points (•) for lists and key points
• Keep paragraphs short (2-3 sentences max)
• Use clear section headers when appropriate
• Add proper spacing between sections
• Be direct and actionable

CONTENT:
• Provide practical, actionable information
• Include specific examples when helpful
• Prioritize the most important information first
• Use simple, clear language
• Avoid unnecessary jargon

Please format your response to be easily scannable and helpful.`;

    const stream = await chat.sendMessageStream({ message: enhancedPrompt });
    for await (const chunk of stream) {
      // Some SDKs expose chunk.text or chunk.text()
      const t = typeof (chunk as any).text === 'function' ? await (chunk as any).text() : (chunk as any).text;
      if (t) {
        const formattedText = formatStreamedText(t);
        yield formattedText;
      }
    }
  }
};



// For Maps Grounding - with fallback to regular search
export const getMapsGroundedResponse = async (latitude: number, longitude: number): Promise<GenerateContentResponse> => {
  if (!HAS_KEY) {
    // Minimal object with the fields the UI reads via optional chains
    return {
      text: "(Demo mode) Unable to call Maps grounding without API key. Try enabling location and setting GEMINI_API_KEY to see nearby garages.",
      candidates: [],
    } as unknown as GenerateContentResponse;
  }
  
  const client = getClient()!;
  
  // First try with Maps grounding
  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the top 5 nearest car repair garages and auto service centers near latitude ${latitude}, longitude ${longitude}. For each garage, include their name, address, phone number if available, and a brief description. Limit results to exactly 5 locations maximum.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: latitude,
              longitude: longitude
            }
          }
        }
      },
    });
    return response;
  } catch (mapsError) {
    console.warn("Maps grounding failed, trying regular search:", mapsError);
    
    // Fallback to regular Gemini without Maps grounding
    try {
      const fallbackResponse = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on the coordinates ${latitude}, ${longitude}, provide information about the top 5 nearest car repair garages and auto service centers in the area. Include general advice about finding reputable auto repair shops. Limit to maximum 5 suggestions.`,
      });
      return fallbackResponse;
    } catch (fallbackError) {
      console.error("Both Maps and fallback failed:", fallbackError);
      return {
        text: `I found your location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}, but I'm having trouble accessing location data right now. Here are some general tips for finding nearby auto repair shops:\n\n• Search for "auto repair near me" in your maps app\n• Look for certified mechanics (ASE certified)\n• Check online reviews and ratings\n• Ask for recommendations from friends or family\n• Consider dealership service centers for warranty work`,
        candidates: [],
      } as unknown as GenerateContentResponse;
    }
  }
};