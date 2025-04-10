"use client";
import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to get response");
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content:
          data.type === "text"
            ? data.content
            : data.type === "math"
            ? "Here's the step-by-step solution:"
            : data.type === "quiz"
            ? "Here's a quiz question:"
            : "Here's my response:",
        response: data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // this is to scroll to the bottom of messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[88vh] max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 hide-scrollbar">
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={chatEndRef} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
