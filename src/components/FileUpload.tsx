import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import type { QuizQuestion } from "../types";

interface FileUploadProps {
  onUpload: (questions: QuizQuestion[]) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseQuestions = (text: string): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];
    const questionBlocks = text
      .split(/(?=\n\d+\.\s+)/g) // FIX: Ensures numbers like 11, 12, etc., are correctly recognized
      .map(block => block.trim())
      .filter(block => block);

    for (const block of questionBlocks) {
      const lines = block.split("\n").map(line => line.trim());
      const questionMatch = lines[0].match(/^\d+\.\s+(.+)$/);
      const question = questionMatch
        ? questionMatch[1].trim()
        : lines[0].trim();
      const choices: Record<string, string> = {};
      let correct_answer: "A" | "B" | "C" | "D" = "A";
      let explanation = "";

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (/^[A-D]\.\s+/.test(line)) {
          const [letter, ...rest] = line.split(". ");
          choices[letter] = rest.join(". ").trim();
        } else if (line.startsWith("Correct Answer:")) {
          correct_answer = line.split(":")[1].trim() as "A" | "B" | "C" | "D";
        } else if (line.startsWith("Explanation:")) {
          explanation = line.split(":")[1].trim();
        }
      }

      if (question && Object.keys(choices).length === 4 && explanation) {
        questions.push({
          question,
          choices: choices as { A: string; B: string; C: string; D: string },
          correct_answer,
          explanation,
        });
      }
    }

    return questions;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      const questions = parseQuestions(text);
      if (questions.length > 0) {
        onUpload(questions);
      } else {
        toast.error("No valid questions found in the file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500">
            TXT file containing quiz questions
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
}
