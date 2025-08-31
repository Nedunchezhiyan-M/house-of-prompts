import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SparklesIcon } from './icons/SparklesIcon';
import type { Prompt, EditingPrompt } from '../types';
import { PromptFormTestIds } from './__testids__/PromptForm.ids';

interface PromptFormProps {
  onAddPrompt: (topic: string, prompt: string) => void;
  onEditPrompt: (id: number, topic: string, prompt: string) => void;
  onCancel: () => void;
  editingPrompt?: EditingPrompt | null;
}

const PromptForm: React.FC<PromptFormProps> = ({ onAddPrompt, onEditPrompt, onCancel, editingPrompt }) => {
  const [topic, setTopic] = useState('');
  const [promptText, setPromptText] = useState('');
  const [error, setError] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');

  // Update form when editingPrompt changes
  useEffect(() => {
    if (editingPrompt) {
      setTopic(editingPrompt.topic);
      setPromptText(editingPrompt.prompt);
    } else {
      setTopic('');
      setPromptText('');
    }
    setError('');
    setSuggestionError('');
  }, [editingPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !promptText.trim()) {
      setError('Both topic and prompt text are required.');
      return;
    }
    
    if (editingPrompt) {
      onEditPrompt(editingPrompt.id, topic, promptText);
    } else {
      onAddPrompt(topic, promptText);
    }
    
    setTopic('');
    setPromptText('');
    setError('');
  };

  const handleCancel = () => {
    setTopic('');
    setPromptText('');
    setError('');
    setSuggestionError('');
    onCancel();
  };

  const handleSuggestTopic = async () => {
    if (!promptText.trim()) {
      setSuggestionError('Please enter a prompt before suggesting a topic.');
      return;
    }
    setIsSuggesting(true);
    setSuggestionError('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Generate a short, sweet, and easily understandable topic for the following prompt. The topic should be 1 to 3 words. Keep it simple and clear.

Prompt: "${promptText}"

Suggested Topic:`
      });
      const suggestedTopic = response.text.trim().replace(/"/g, ''); // Clean up quotes
      setTopic(suggestedTopic);
    } catch (err) {
      console.error('Error suggesting topic:', err);
      setSuggestionError('Could not suggest a topic. Please try again.');
    } finally {
      setIsSuggesting(false);
    }
  };


  return (
    <div className="bg-base p-6 rounded-lg shadow-lg animate-fade-in-down">
        <h2 className="text-2xl font-bold text-primary mb-4" data-testid={PromptFormTestIds.FORM_TITLE}>
          {editingPrompt ? 'Edit Prompt' : 'Add a New Prompt'}
        </h2>
        {error && <p className="text-red-500 mb-4" data-testid={PromptFormTestIds.ERROR_MESSAGE}>{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4" data-testid={PromptFormTestIds.FORM}>
        <div>
            <label htmlFor="topic" className="block text-sm font-medium text-text-primary mb-1" data-testid={PromptFormTestIds.TOPIC_LABEL}>
            Topic
            </label>
            <div className="flex items-center gap-2">
                <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Creative Writing"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                data-testid={PromptFormTestIds.TOPIC_INPUT}
                />
                {!editingPrompt && (
                  <button
                      type="button"
                      onClick={handleSuggestTopic}
                      disabled={!promptText.trim() || isSuggesting}
                      className="flex items-center justify-center p-2 bg-accent text-white rounded-lg hover:bg-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      title="Suggest Topic"
                      aria-label="Suggest a topic based on the prompt text"
                      data-testid={PromptFormTestIds.SUGGEST_TOPIC_BUTTON}
                  >
                      {isSuggesting ? (
                           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                      ) : (
                          <SparklesIcon className="h-5 w-5"/>
                      )}
                  </button>
                )}
            </div>
            {suggestionError && <p className="text-red-500 text-sm mt-1" data-testid={PromptFormTestIds.SUGGESTION_ERROR_MESSAGE}>{suggestionError}</p>}
        </div>
        <div>
            <label htmlFor="promptText" className="block text-sm font-medium text-text-primary mb-1" data-testid={PromptFormTestIds.PROMPT_LABEL}>
            Prompt Text
            </label>
            <textarea
            id="promptText"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Enter the prompt text here..."
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
            data-testid={PromptFormTestIds.PROMPT_TEXTAREA}
            />
        </div>
        <div className="flex justify-end gap-4">
             <button
                type="button"
                onClick={handleCancel}
                className="py-2 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                data-testid={PromptFormTestIds.CANCEL_BUTTON}
            >
                Cancel
            </button>
            <button
                type="submit"
                className="py-2 px-6 bg-accent text-white font-semibold rounded-lg hover:bg-secondary transition-colors"
                data-testid={PromptFormTestIds.SUBMIT_BUTTON}
            >
                {editingPrompt ? 'Update Prompt' : 'Save Prompt'}
            </button>
        </div>
        </form>
    </div>
  );
};

export default PromptForm;