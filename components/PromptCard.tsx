import React, { useState } from 'react';
import type { Prompt } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { PromptCardTestIds } from './__testids__/PromptCard.ids';
import GetPromptModal from './GetPromptModal';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: number) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showGetPromptModal, setShowGetPromptModal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleEdit = () => {
    onEdit(prompt);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setDeleteConfirmation('');
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.toLowerCase() === 'delete') {
      onDelete(prompt.id);
      setShowDeleteConfirm(false);
      setDeleteConfirmation('');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteConfirmation('');
  };

  const handleGetPrompt = () => {
    setShowGetPromptModal(true);
  };

  const handleCloseGetPromptModal = () => {
    setShowGetPromptModal(false);
  };

  return (
    <>
      <div className="bg-base rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col" data-testid={PromptCardTestIds.CARD}>
        <div className="p-6 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-primary mr-4" data-testid={PromptCardTestIds.TOPIC_HEADING}>{prompt.topic}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                aria-label="Edit prompt"
                title="Edit prompt"
                data-testid={PromptCardTestIds.EDIT_BUTTON}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleGetPrompt}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 flex-shrink-0"
                aria-label="Get enhanced prompt"
                title="Get enhanced prompt"
                data-testid={PromptCardTestIds.GET_PROMPT_BUTTON}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 flex-shrink-0"
                aria-label="Delete prompt"
                title="Delete prompt"
                data-testid={PromptCardTestIds.DELETE_BUTTON}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              {/*
               <button
                onClick={handleCopy}
                className="relative p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent flex-shrink-0"
                aria-label="Copy prompt to clipboard"
                title="Copy to clipboard"
                data-testid={PromptCardTestIds.COPY_BUTTON}
              >
                <ClipboardIcon />
                {copied && (
                  <span className="absolute -top-8 right-1/2 translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg transition-opacity duration-300" data-testid={PromptCardTestIds.COPIED_MESSAGE}>
                    Copied!
                  </span>
                )}
              </button>
              */}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">Prompt</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap" data-testid={PromptCardTestIds.PROMPT_TEXT}>{prompt.prompt}</p>
              </div>
            </div>
            
            {prompt.projectStack && (
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">Project Stack</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{prompt.projectStack}</p>
                </div>
              </div>
            )}
            
            {prompt.requirements && (
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">Requirements</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{prompt.requirements}</p>
                </div>
              </div>
            )}
            
            {prompt.otherNecessities && (
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">Other Necessities</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{prompt.otherNecessities}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Get Prompt Modal */}
      {showGetPromptModal && (
        <GetPromptModal
          prompt={prompt}
          onClose={handleCloseGetPromptModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid={PromptCardTestIds.DELETE_MODAL}>
          <div className="bg-base rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Delete Prompt</h3>
                <p className="text-sm text-text-secondary" data-testid={PromptCardTestIds.DELETE_WARNING_TEXT}>This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-text-secondary mb-2">
                Type <span className="font-mono font-bold text-red-600">delete</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type 'delete' to confirm"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                autoFocus
                data-testid={PromptCardTestIds.DELETE_CONFIRMATION_INPUT}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                data-testid={PromptCardTestIds.DELETE_CANCEL_BUTTON}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmation.toLowerCase() !== 'delete'}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                data-testid={PromptCardTestIds.DELETE_CONFIRM_BUTTON}
              >
                Delete Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromptCard;