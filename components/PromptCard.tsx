import React, { useState } from 'react';
import type { Prompt } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="bg-base rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col h-72 overflow-hidden">
      <div className="p-6 flex flex-col flex-grow min-h-0">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-primary mr-4">{prompt.topic}</h3>
          <button
            onClick={handleCopy}
            className="relative p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent flex-shrink-0"
            aria-label="Copy prompt to clipboard"
          >
            <ClipboardIcon />
            {copied && (
              <span className="absolute -top-8 right-1/2 translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg transition-opacity duration-300">
                Copied!
              </span>
            )}
          </button>
        </div>
        <div className="overflow-y-auto flex-grow pr-2">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{prompt.prompt}</p>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;