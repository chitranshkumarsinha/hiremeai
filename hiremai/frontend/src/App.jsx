import React, { useState } from 'react';
import { Send, Loader2, ServerCrash, Bot, User } from 'lucide-react';

export default function App() {
  // Configurable backend URL
  const BACKEND_URL = 'http://localhost:8000';

  // State management
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;

    setIsLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Attempting to gracefully handle common backend response formats
      // If your backend returns something specific like {"output": "..."} change this accordingly.
      const responseText = data.answer || data.response || data.output || data.message || JSON.stringify(data, null, 2);
      
      setAnswer(responseText);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to connect to the backend. Is FastAPI running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white text-center">
          <Bot className="w-12 h-12 mx-auto mb-3 text-indigo-200" />
          <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-indigo-200 text-sm mt-1">Ask any question and get an instant response.</p>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          
          {/* Question Form */}
          <form onSubmit={handleSubmit} className="relative">
            <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-2">
              Your Question
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                disabled={isLoading}
                className="block w-full pl-10 pr-24 py-3 sm:text-sm border-slate-300 rounded-lg border focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 disabled:bg-slate-100 disabled:text-slate-500 transition-colors"
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  ) : (
                    <Send className="w-4 h-4 mr-1.5" />
                  )}
                  {isLoading ? 'Asking...' : 'Ask'}
                </button>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start border border-red-200">
              <ServerCrash className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Answer Area */}
          {answer && !error && (
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-semibold text-slate-900">Response</h2>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-700 shadow-inner">
                {answer}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}