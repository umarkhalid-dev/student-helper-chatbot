import { GoogleGenAI, Type } from "@google/genai";
import { showMathStepsTool } from "./tools/mathStepsTool";
import { askQuizQuestionTool } from "./tools/quizQuestionTool";
import { generalInfo } from "./tools/generalTool";
import { ChatMessage } from "@/types/chat";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

const mathFunctionDeclaration = {
  name: "showMathSteps",
  description:
    "Use this function when the user asks for help with math problems, equations, or calculations",
  parameters: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The math question to solve",
      },
    },
    required: ["question"],
  },
};

const quizFunctionDeclaration = {
  name: "askQuizQuestion",
  description:
    "Use this function when the user asks for a quiz, test, or wants to be tested on a topic",
  parameters: {
    type: Type.OBJECT,
    properties: {
      topic: {
        type: Type.STRING,
        description: "The subject or topic for the quiz question",
      },
    },
    required: ["topic"],
  },
};

const generalInfoFunctionDeclaration = {
  name: "generalInfo",
  description:
    "Use this function when the user asks for information, explanations, or help with any academic topic that is not a math problem or quiz request",
  parameters: {
    type: Type.OBJECT,
    properties: {
      topic: {
        type: Type.STRING,
        description: "The topic or subject the user is asking about",
      },
    },
    required: ["topic"],
  },
};

export async function processMessage(
  message: string,
  history: ChatMessage[] = []
) {
  try {
    const formattedHistory = history
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const promptWithHistory = formattedHistory
      ? `Previous conversation:\n${formattedHistory}\n\nCurrent message: ${message}`
      : message;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: promptWithHistory,
      config: {
        tools: [
          {
            functionDeclarations: [
              mathFunctionDeclaration,
              quizFunctionDeclaration,
              generalInfoFunctionDeclaration,
            ],
          },
        ],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0];

      if (functionCall.name === "showMathSteps" && functionCall.args) {
        const question = functionCall.args.question as string;
        return await showMathStepsTool({ question });
      } else if (functionCall.name === "askQuizQuestion" && functionCall.args) {
        const topic = functionCall.args.topic as string;
        return await askQuizQuestionTool({ topic });
      } else if (functionCall.name === "generalInfo" && functionCall.args) {
        const topic = functionCall.args.topic as string;
        return await generalInfo({ topic });
      }
    }

    return {
      type: "text",
      content:
        response.text ||
        "I'm not sure how to help with that. Could you try rephrasing your question?",
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
