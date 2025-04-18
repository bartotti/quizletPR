import React from 'react';
import { Trash2 } from 'lucide-react';
import type { QuizQuestion } from '../types';

interface QuestionListProps {
  questions: QuizQuestion[];
  onDelete: (id: string) => void;
}

export function QuestionList({ questions, onDelete }: QuestionListProps) {
  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
            <button
              onClick={() => question.id && onDelete(question.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-4 space-y-2">
            {Object.entries(question.choices).map(([letter, choice]) => (
              <div
                key={letter}
                className={`p-2 rounded ${
                  letter === question.correct_answer
                    ? 'bg-green-100 border border-green-400'
                    : 'bg-gray-50'
                }`}
              >
                <span className="font-medium">{letter}.</span> {choice}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Explanation:</span> {question.explanation}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}