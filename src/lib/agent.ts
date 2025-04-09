import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { showMathStepsTool } from "./tools/mathStepsTool";
import { askQuizQuestionTool } from "./tools/quizQuestionTool";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
  model: "gemini-2.0-flash",
  maxOutputTokens: 2048,
  temperature: 0.7,
});

const containsKeyword = (message: string, keywords: string[]): boolean => {
  const lower = message.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
};

function stripCodeFences(html: string): string {
  return html.replace(/^```html\s*|\s*```$/g, "").trim();
}

export async function processMessage(message: string) {
  try {
    if (containsKeyword(message, ["solve", "math", "equation", "calculate"])) {
      const mathTool = await showMathStepsTool({ question: message });
      return mathTool;
    }

    if (containsKeyword(message, ["quiz", "question", "test"])) {
      const quizTool = await askQuizQuestionTool({ topic: message });
      return quizTool;
    }

    const prompt = `Please answer the following question in HTML format which i can display in a div using dangerouslySetInnerHTML: ${message}`;
    const response = await model.invoke(prompt);
    console.log("response => ", response.content);

    return {
      type: "text",
      content: stripCodeFences(response.content as string),
    };
  } catch (error) {
    console.error("Error processing message:", error);
    return {
      type: "text",
      content:
        "I encountered an error processing your request. Please try again.",
    };
  }
}
