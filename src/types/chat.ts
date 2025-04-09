export type MessageType = "text" | "math" | "quiz";

export interface MathStep {
  stepNumber: number;
  explanation: string;
  substeps?: string[];
}

export interface MathResponse {
  type: "math";
  steps: MathStep[];
}

export interface QuizResponse {
  type: "quiz";
  question: string;
  choices: string[];
  correctAnswer: number;
}

export interface TextResponse {
  type: "text";
  content: string;
}

export type ChatResponse = MathResponse | QuizResponse | TextResponse;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  response?: ChatResponse;
} 