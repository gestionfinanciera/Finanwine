
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Transaction, Goal } from "../types";

// Inicialización siguiendo el estándar de seguridad y SDK
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Genera una respuesta de chat contextualizada con los datos del usuario.
 */
export const chatWithGemini = async (
  message: string, 
  context: { transactions: Transaction[], goals: Goal[] }
) => {
  const ai = getAI();
  
  // Construimos un resumen de datos para que la IA sepa de qué habla
  const transactionsSummary = context.transactions
    .slice(-20) // Últimos 20 movimientos
    .map(t => `${new Date(t.date).toLocaleDateString()}: ${t.description} (${t.type}) - $${t.amount} [${t.category}]`)
    .join('\n');

  const goalsSummary = context.goals
    .map(g => `Meta: ${g.title}, Objetivo: $${g.target}, Actual: $${g.current}, Prioridad: ${g.priority}`)
    .join('\n');

  const systemInstruction = `
    Eres Finanwise AI, un consultor financiero de élite. 
    Tienes acceso a los datos reales del usuario. 
    DATOS DEL USUARIO:
    --- TRANSACCIONES RECIENTES ---
    ${transactionsSummary || 'Sin transacciones aún.'}
    --- METAS DE AHORRO ---
    ${goalsSummary || 'Sin metas aún.'}
    
    REGLAS:
    1. Si el usuario pregunta por sus gastos o ingresos, usa los datos de arriba para responder con exactitud.
    2. Da consejos proactivos: si gasta mucho en una categoría, sugiérele cómo ahorrar.
    3. Usa un tono profesional pero cercano, motivador y experto.
    4. Responde SIEMPRE en español.
    5. No inventes datos que no estén en el contexto.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ parts: [{ text: message }] }],
    config: {
      systemInstruction,
      temperature: 0.7,
      topP: 0.95,
    },
  });

  return response.text;
};

/**
 * Analiza imágenes de recibos usando visión artificial avanzada.
 */
export const analyzeFinancialDocument = async (base64Data: string, mimeType: string) => {
  const ai = getAI();
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: 'Extrae los datos de este recibo o factura en formato JSON con los campos: description, amount (número), category (Vivienda, Alimentación, Transporte, Ocio, Salud, Otros), date (YYYY-MM-DD), y type (siempre "expense").' }
      ]
    },
    config: {
        systemInstruction: "Eres un experto en extracción de datos contables. Devuelve solo el JSON limpio.",
        responseMimeType: "application/json"
    }
  });
  return response.text;
};
