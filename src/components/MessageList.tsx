import { ChatMessage } from "@/types/chat";
import MathSteps from "./MathSteps";
import QuizCard from "./QuizCard";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.length == 0 && (
        <h1 className="text-center text-2xl text-gray-400 py-8">
          What can I help with?
        </h1>
      )}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.role === "user"
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {message.role === "user" ? (
              <p>{message.content}</p>
            ) : (
              <div>
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
                {message.response?.type === "math" && (
                  <MathSteps steps={message.response.steps} />
                )}
                {message.response?.type === "quiz" && (
                  <QuizCard
                    question={message.response.question}
                    choices={message.response.choices}
                    correctAnswer={message.response.correctAnswer}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 text-gray-900">
            <p className="animate-pulse text-gray-400">Thinking...</p>
          </div>
        </div>
      )}
    </div>
  );
}
