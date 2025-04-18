export interface QuizQuestion {
  id?: string;
  question: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string;
  };
  correct_answer: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  created_at?: string;
}