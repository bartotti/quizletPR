import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { QuizQuestion } from "../types";

interface QuizModeProps {
  questions: QuizQuestion[];
  onClose: () => void;
}

export function QuizMode({ questions, onClose }: QuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<Record<number, string[]>>({});
  const [showExplanation, setShowExplanation] = useState<
    Record<number, boolean>
  >({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(
    new Set([0])
  );

  const currentQuestion = questions[currentIndex];
  const currentAttempts = attempts[currentIndex] || [];
  const isExplanationVisible = showExplanation[currentIndex] || false;

  const handleAnswer = (answer: string) => {
    if (currentAttempts.length >= 2 || isExplanationVisible) return;

    const newAttempts = {
      ...attempts,
      [currentIndex]: [...currentAttempts, answer],
    };
    setAttempts(newAttempts);

    if (answer === currentQuestion.correct_answer) {
      setShowExplanation({ ...showExplanation, [currentIndex]: true });
    } else if (newAttempts[currentIndex].length >= 2) {
      setShowExplanation({ ...showExplanation, [currentIndex]: true });
    }

    setVisitedQuestions(prev => new Set([...prev, currentIndex]));
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < questions.length) {
      setCurrentIndex(newIndex);
    }
  };

  const getButtonStyle = (letter: string) => {
    if (!isExplanationVisible) {
      return currentAttempts.includes(letter)
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-white hover:bg-gray-50";
    }
    return letter === currentQuestion.correct_answer
      ? "bg-green-100 border-green-500"
      : currentAttempts.includes(letter)
      ? "bg-red-100 border-red-500"
      : "bg-white";
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Question {currentIndex + 1} of {questions.length}
        </h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          Exit Quiz
        </button>
      </div>

      <div className="mb-6">
        <p className="text-lg mb-4">{currentQuestion.question}</p>
        <div className="space-y-3">
          {Object.entries(currentQuestion.choices).map(([letter, choice]) => (
            <button
              key={letter}
              onClick={() => handleAnswer(letter)}
              disabled={
                currentAttempts.includes(letter) || isExplanationVisible
              }
              className={`w-full p-4 text-left border rounded-md transition-colors ${getButtonStyle(
                letter
              )}`}
            >
              <span className="font-medium">{letter}.</span> {choice}
            </button>
          ))}
        </div>
      </div>

      {isExplanationVisible && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <p className="font-medium text-blue-900 mb-2">Explanation:</p>
          <p className="text-blue-800">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {questions.map((_, index) => {
          const isVisited = visitedQuestions.has(index);
          const isAnswered = showExplanation[index];

          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors
          ${
            currentIndex === index
              ? "bg-indigo-600 text-white"
              : isAnswered
              ? "bg-green-500 text-white hover:bg-green-600"
              : isVisited
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-gray-100 hover:bg-gray-200"
          }
        `}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigateQuestion("prev")}
          disabled={currentIndex === 0}
          className="px-4 py-2 flex items-center text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>
        <div className="text-sm text-gray-500">
          Attempts: {currentAttempts.length}/2
        </div>
        <button
          onClick={() => navigateQuestion("next")}
          disabled={currentIndex === questions.length - 1}
          className="px-4 py-2 flex items-center text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}
