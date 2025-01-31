import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { QuizQuestion } from '../types';

interface QuestionFormProps {
  onSubmit: (question: QuizQuestion) => void;
}

export function QuestionForm({ onSubmit }: QuestionFormProps) {
  const [formData, setFormData] = useState<QuizQuestion>({
    question: '',
    choices: { A: '', B: '', C: '', D: '' },
    correct_answer: 'A',
    explanation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      question: '',
      choices: { A: '', B: '', C: '', D: '' },
      correct_answer: 'A',
      explanation: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question</label>
        <textarea
          required
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-h-[100px]"
        />
      </div>

      {Object.entries(formData.choices).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700">Choice {key}</label>
          <input
            type="text"
            required
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                choices: { ...formData.choices, [key]: e.target.value },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
        <select
          value={formData.correct_answer}
          onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value as 'A' | 'B' | 'C' | 'D' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Explanation</label>
        <textarea
          required
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-h-[100px]"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Question
      </button>
    </form>
  );
}