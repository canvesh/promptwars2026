"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "You are a dynamic travel engine. Output all itineraries in structured Markdown. When a disruption is provided, only rewrite the affected parts of the day while keeping the rest of the trip intact."
});

export async function getTravelResponse(prompt: string, history: any[] = []) {
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return {
    text: response.text(),
    // We send the history back to the client to maintain context for disruptions
    newHistory: await chat.getHistory() 
  };
}