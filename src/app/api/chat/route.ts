import { NextRequest, NextResponse } from "next/server";
import { processMessage } from "@/lib/agent";

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await processMessage(message, history);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
