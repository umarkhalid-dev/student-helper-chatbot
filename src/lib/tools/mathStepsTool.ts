import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

export const showMathStepsTool = async (input: { question: string }) => {
  const { question } = input;
  try {
    const prompt = `
      Please solve this math problem step by step: ${question}
      Return a JSON object with the following structure:
      {
        "type": "math",
        "steps": [
          {
            "stepNumber": number,
            "explanation": string,
            "substeps": string[] (optional)
          }
        ]
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
            "I couldn't parse the math solution. Here's the raw response: " +
            responseText,
        };
      }
    } catch (error) {
      console.error("Error parsing math solution:", error);
      return {
        type: "text",
        content:
          "I encountered an error parsing the math solution. Here's the raw response: " +
          responseText,
      };
    }

    return result;
  } catch (error) {
    console.error("Error in showMathStepsTool:", error);
    return {
      type: "text",
      content:
        "I encountered an error solving the math problem. Please try again.",
    };
  }
};
