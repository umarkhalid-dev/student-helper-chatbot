import { useState } from "react";

interface QuizCardProps {
  question: string;
  choices: string[];
  correctAnswer: number;
}

export default function QuizCard({ question, choices, correctAnswer }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{question}</h3>
      <div className="space-y-2">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={showFeedback}
            className={`w-full p-3 text-left rounded-lg border transition-colors ${
              showFeedback
                ? index === correctAnswer
                  ? "bg-green-100 border-green-500"
                  : selectedAnswer === index
                  ? "bg-red-100 border-red-500"
                  : "bg-gray-50"
                : "hover:bg-gray-50"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
      {showFeedback && (
        <div className="mt-4 text-center">
          <p className={`font-semibold ${
            selectedAnswer === correctAnswer ? "text-green-600" : "text-red-600"
          }`}>
            {selectedAnswer === correctAnswer ? "Correct!" : "Incorrect!"}
          </p>
          {selectedAnswer !== correctAnswer && (
            <p className="mt-2 text-gray-600">
              The correct answer is: {choices[correctAnswer]}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 