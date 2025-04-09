import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const MathStepsSchema = z
  .object({
    type: z.enum(["math"]),
    steps: z.array(
      z.object({
        stepNumber: z.number(),
        explanation: z.string(),
        substeps: z.array(z.string()).optional(),
      })
    ),
  })
  .describe("Step by step explanation of a math problem");

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
  model: "gemini-2.5-pro-exp-03-25",
  maxOutputTokens: 2048,
  temperature: 0.7,
});

const structuredModel = model.withStructuredOutput(MathStepsSchema, {
  name: "MathSteps",
});

export const showMathStepsTool = async (input: { question: string }) => {
  const { question } = input;
  try {
    const prompt = `Please solve this math problem step by step: ${question}`;
    const result = await structuredModel.invoke(prompt);
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
