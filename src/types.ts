export interface QuizQuestion {
  id?: string;
  question: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: 'A' | 'B' | 'C' | 'D';  // Changed from correctAnswer to correct_answer
  explanation: string;
  created_at?: string;
}