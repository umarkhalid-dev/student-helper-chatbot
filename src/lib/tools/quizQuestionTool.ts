import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

export const askQuizQuestionTool = async (input: { topic: string }) => {
  const { topic } = input;

  try {
    const prompt = `
      Generate a multiple-choice question about the topic: ${topic}
      Return a JSON object with the following structure:
      {
        "type": "quiz",
        "question": string,
        "choices": string[] (exactly 4 choices),
        "correctAnswer": number (0-3, representing the index of the correct answer)
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const responseText = response.text || "";
    let result;

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        return {
          type: "text",
          content:
            "I couldn't parse the quiz question. Here's the raw response: " +
            responseText,
        };
      }
    } catch (error) {
      console.error("Error parsing quiz question:", error);
      return {
        type: "text",
        content:
          "I encountered an error parsing the quiz question. Here's the raw response: " +
          responseText,
      };
    }

    return result;
  } catch (error) {
    console.error("Error in askQuizQuestionTool:", error);
    return {
      type: "text",
      content:
        "I encountered an error generating the quiz question. Please try again.",
    };
  }
};
