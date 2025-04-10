import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

function stripCodeFences(html: string): string {
  return html
    .replace(/^```html\s*\n?/i, "")
    .replace(/\n?```[\s\n]*$/i, "")
    .trim();
}

export async function generalInfo({ topic }: { topic: string }) {
  try {
    const prompt = `
      You are a helpful student assistant. Please provide detailed information about the following topic: ${topic}
      Return in html format which i can display in a div using dangerouslySetInnerHTML
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return {
      type: "text",
      content:
        stripCodeFences(response.text as string) ||
        "I couldn't find information on that topic. Could you try rephrasing your question?",
    };
  } catch (error) {
    console.error("Error providing general info:", error);
    return {
      type: "text",
      content:
        "I encountered an error while trying to provide information on that topic. Please try again.",
    };
  }
}
