"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "You are a travel engine. Output in Markdown. When a disruption is sent, rewrite the existing itinerary to accommodate the change."
});

export async function processTravelRequest(prompt: string, history: any[] = []) {
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return {
    text: response.text(),
    newHistory: await chat.getHistory()
  };
}