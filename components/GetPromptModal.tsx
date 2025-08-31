import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Prompt } from '../types';

interface GetPromptModalProps {
  prompt: Prompt;
  onClose: () => void;
}

const GetPromptModal: React.FC<GetPromptModalProps> = ({ prompt, onClose }) => {
  const [context, setContext] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('');
  const [specificity, setSpecificity] = useState('');
  const [constraints, setConstraints] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateEnhancedPrompt = async () => {
    setIsGenerating(true);
    setError('');
    setEnhancedPrompt('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      // Build the enhancement request based on filled fields
      let enhancementRequest = `Enhance the following prompt to make it more effective and specific.`;
      
      if (context.trim()) {
        enhancementRequest += `\n\nContext: ${context}`;
      }
      if (audience.trim()) {
        enhancementRequest += `\n\nTarget Audience: ${audience}`;
      }
      if (tone.trim()) {
        enhancementRequest += `\n\nDesired Tone: ${tone}`;
      }
      if (specificity.trim()) {
        enhancementRequest += `\n\nLevel of Specificity: ${specificity}`;
      }
      if (constraints.trim()) {
        enhancementRequest += `\n\nConstraints: ${constraints}`;
      }

      enhancementRequest += `\n\nOriginal Prompt: "${prompt.prompt}"`;

      enhancementRequest += `\n\nPlease enhance this prompt following these best practices:
1. Be specific and detailed
2. Include clear instructions and expectations
3. Use active voice and clear language
4. Break down complex tasks into steps if applicable
5. Specify the desired output format
6. Include any relevant context or examples
7. Make it actionable and measurable

Enhanced Prompt:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: enhancementRequest
      });
      
      const enhanced = response.text.trim();
      setEnhancedPrompt(enhanced);
      
    } catch (err) {
      console.error('Error generating enhanced prompt:', err);
      setError('Could not generate enhanced prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(prompt.prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleCopyEnhanced = () => {
    navigator.clipboard.writeText(enhancedPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const hasEnhancementFields = context.trim() || audience.trim() || tone.trim() || specificity.trim() || constraints.trim();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">
              Get Enhanced Prompt
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Close modal"
            
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Enhancement Fields */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Enhancement Options (Optional)</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Fill in any of these fields to generate a more specific and effective prompt. Leave empty to copy the original.
                </p>
              </div>

              <div>
                <label htmlFor="context" className="block text-sm font-medium text-text-primary mb-2">
                  Context & Background
                </label>
                <textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., Building a React app for a healthcare company, need to follow HIPAA guidelines"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                
                />
                <p className="text-xs text-text-secondary mt-1">Provide relevant context or background information</p>
              </div>

              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-text-primary mb-2">
                  Target Audience
                </label>
                <textarea
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g., Senior developers with 5+ years experience, familiar with TypeScript"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                
                />
                <p className="text-xs text-text-secondary mt-1">Who will be using or implementing this?</p>
              </div>

              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-text-primary mb-2">
                  Desired Tone & Style
                </label>
                <textarea
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g., Professional, friendly, technical, creative, formal"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                
                />
                <p className="text-xs text-text-secondary mt-1">What tone should the output have?</p>
              </div>

              <div>
                <label htmlFor="specificity" className="block text-sm font-medium text-text-primary mb-2">
                  Level of Specificity
                </label>
                <textarea
                  id="specificity"
                  value={specificity}
                  onChange={(e) => setSpecificity(e.target.value)}
                  placeholder="e.g., High - include exact code examples, step-by-step instructions"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                
                />
                <p className="text-xs text-text-secondary mt-1">How detailed should the response be?</p>
              </div>

              <div>
                <label htmlFor="constraints" className="block text-sm font-medium text-text-primary mb-2">
                  Constraints & Limitations
                </label>
                <textarea
                  id="constraints"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="e.g., Must work with React 18+, TypeScript 5.0+, max 100 lines of code"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                
                />
                <p className="text-xs text-text-secondary mt-1">Any technical or business constraints?</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCopyOriginal}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                
                >
                  {copied ? 'Copied!' : 'Copy Original'}
                </button>
                
                <button
                  onClick={handleGenerateEnhancedPrompt}
                  disabled={!hasEnhancementFields || isGenerating}
                  className="flex-1 py-2 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </div>
                  ) : (
                    'Generate Enhanced'
                  )}
                </button>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Results</h3>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {enhancedPrompt && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-2">Enhanced Prompt</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                          {enhancedPrompt}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCopyEnhanced}
                      className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    
                    >
                      {copied ? 'Copied!' : 'Copy Enhanced Prompt'}
                    </button>
                  </div>
                )}

                {!enhancedPrompt && !error && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="text-text-secondary">
                      {hasEnhancementFields 
                        ? 'Click "Generate Enhanced" to create an improved prompt'
                        : 'Fill in enhancement fields above or copy the original prompt'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetPromptModal;
