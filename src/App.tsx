import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Brain, Play } from 'lucide-react';
import { QuestionForm } from './components/QuestionForm';
import { FileUpload } from './components/FileUpload';
import { QuestionList } from './components/QuestionList';
import { QuizMode } from './components/QuizMode';
import { supabase } from './lib/supabase';
import type { QuizQuestion } from './types';

function App() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizMode, setIsQuizMode] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: true }); // Changed to ascending to maintain question order

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async (question: QuizQuestion) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([question])
        .select()
        .single();

      if (error) throw error;
      
      // Fetch all questions again to maintain correct order
      await fetchQuestions();
      toast.success('Question added successfully');
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
    }
  };

  const handleFileUpload = async (uploadedQuestions: QuizQuestion[]) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(uploadedQuestions)
        .select();

      if (error) throw error;
      
      // Fetch all questions again to maintain correct order
      await fetchQuestions();
      toast.success(`${uploadedQuestions.length} questions uploaded successfully`);
    } catch (error) {
      console.error('Error uploading questions:', error);
      toast.error('Failed to upload questions');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Fetch all questions again to maintain correct order
      await fetchQuestions();
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const startQuiz = () => {
    if (questions.length === 0) {
      toast.error('No questions available for the quiz');
      return;
    }
    setIsQuizMode(true);
  };

  if (isQuizMode && questions.length > 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <QuizMode
          questions={questions}
          onClose={() => setIsQuizMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Quiz Question Manager</h1>
            </div>
            {questions.length > 0 && (
              <button
                onClick={startQuiz}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Quiz ({questions.length} Questions)
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium mb-4">Add New Question</h2>
                <QuestionForm onSubmit={handleQuestionSubmit} />
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-4">Upload Questions File</h2>
                <FileUpload onUpload={handleFileUpload} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Question List ({questions.length})</h2>
              {isLoading ? (
                <div className="text-center py-8">Loading questions...</div>
              ) : (
                <QuestionList questions={questions} onDelete={handleDelete} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;