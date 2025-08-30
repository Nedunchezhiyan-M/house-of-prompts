import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Prompt } from './types';
import { getPrompts, savePrompts } from './services/promptService';
import PromptCard from './components/PromptCard';
import SearchBar from './components/SearchBar';
import PromptForm from './components/PromptForm';
import { PlusIcon } from './components/icons/PlusIcon';

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    setPrompts(getPrompts());
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      savePrompts(prompts);
    }
  }, [prompts, isInitialLoad]);

  const handleAddPrompt = useCallback((topic: string, promptText: string) => {
    const newPrompt: Prompt = {
      id: Date.now(),
      topic,
      prompt: promptText,
    };
    setPrompts(prevPrompts => [newPrompt, ...prevPrompts]);
    setIsFormVisible(false);
  }, []);

  const filteredPrompts = useMemo(() => {
    if (!searchTerm) {
      return prompts;
    }
    return prompts.filter(p =>
      p.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [prompts, searchTerm]);

  return (
    <div className="min-h-screen bg-neutral text-text-primary font-sans">
      <header className="bg-primary shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Prompt Library
          </h1>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="flex items-center gap-2 bg-accent hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            aria-label={isFormVisible ? 'Close prompt form' : 'Open prompt form'}
          >
            <PlusIcon />
            <span className="hidden sm:inline">Add Prompt</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isFormVisible && (
          <div className="mb-8">
            <PromptForm onAddPrompt={handleAddPrompt} onCancel={() => setIsFormVisible(false)} />
          </div>
        )}

        <div className="mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {filteredPrompts.length > 0 ? (
          <div className="max-h-[36rem] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
            {filteredPrompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-text-secondary">No Prompts Found</h2>
            <p className="mt-2 text-text-secondary">
              {searchTerm ? 'Try a different search term.' : 'Add a new prompt to get started!'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;