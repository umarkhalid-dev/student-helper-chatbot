import { NextResponse } from "next/server";
import { processMessage } from "@/lib/agent";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }
    const response = await processMessage(message);
    if (!response) {
      throw new Error("No response generated");
    }
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      {
        error: "Failed to process your request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
