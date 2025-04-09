import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const QuizQuestionSchema = z
  .object({
    type: z.enum(["quiz"]),
    question: z.string(),
    choices: z.array(z.string()).length(4),
    correctAnswer: z.number().int().min(0).max(3),
  })
  .describe("Multiple-choice quiz question with four options");

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
  model: "gemini-2.5-pro-exp-03-25",
  maxOutputTokens: 2048,
  temperature: 0.7,
});

const structuredModel = model.withStructuredOutput(QuizQuestionSchema, {
  name: "QuizQuestion",
});

export const askQuizQuestionTool = async (input: { topic: string }) => {
  const { topic } = input;

  try {
    const prompt = `Generate a multiple-choice questions about the topic: ${topic}.`;
    const result = await structuredModel.invoke(prompt);
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
