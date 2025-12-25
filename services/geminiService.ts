
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const chatWithGemini = async (message: string, history: {role: string, parts: {text: string}[]}[] = []) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'Eres un asistente financiero experto llamado Finanwise AI. Ayudas a los usuarios con presupuestos, ahorro, inversión y educación financiera. Eres amable, profesional y motivador. Responde siempre en español.',
    },
  });

  // Since we can't easily pass full history in a simple one-off, 
  // we could use chat.sendMessage, but for this utility we'll simplify.
  const response = await chat.sendMessage({ message });
  return response.text;
};

export const analyzeImage = async (base64Data: string, mimeType: string, prompt: string) => {
  const ai = getAI();
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt || 'Analiza este documento financiero, recibo o factura y extrae los datos clave como monto total, fecha, proveedor y categoría de gasto.' }
      ]
    },
    config: {
        systemInstruction: "Eres un experto en análisis de documentos financieros."
    }
  });
  return response.text;
};

export const analyzeVideo = async (base64Data: string, mimeType: string, prompt: string) => {
    // Note: Video understanding in Gemini often involves URI or multiple frames.
    // For a simple implementation, we treat the video frame/file similarly.
    const ai = getAI();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt || 'Analiza este video de educación financiera y resume los puntos más importantes.' }
        ]
      },
    });
    return response.text;
  };
