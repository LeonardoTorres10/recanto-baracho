import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export const generateContent = async (prompt: string, systemInstruction: string = "Você é um redator publicitário de luxo para o Recanto Baracho, um espaço de eventos premium em Campinas. Escreva textos elegantes, persuasivos e sofisticados.") => {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY não configurada.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Erro ao gerar conteúdo com Gemini:", error);
    throw error;
  }
};
