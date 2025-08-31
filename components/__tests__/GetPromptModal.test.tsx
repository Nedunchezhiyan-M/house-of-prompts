import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GetPromptModal from '../GetPromptModal';
import { GetPromptModalTestIds } from '../__testids__/GetPromptModal.ids';
import type { Prompt } from '../../types';

// Mock the GoogleGenAI
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: 'Enhanced prompt with better context and specificity'
      })
    }
  }))
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('GetPromptModal', () => {
  const mockPrompt: Prompt = {
    id: 1,
    topic: 'Test Topic',
    prompt: 'This is a test prompt that needs enhancement.'
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderModal = () => {
    return render(
      <GetPromptModal
        prompt={mockPrompt}
        onClose={mockOnClose}
      />
    );
  };

  it('renders modal correctly', () => {
    renderModal();
    
    expect(screen.getByTestId(GetPromptModalTestIds.MODAL)).toBeInTheDocument();
    expect(screen.getByTestId(GetPromptModalTestIds.TITLE)).toHaveTextContent('Get Enhanced Prompt');
    expect(screen.getByTestId(GetPromptModalTestIds.CLOSE_BUTTON)).toBeInTheDocument();
  });

  it('displays all enhancement input fields', () => {
    renderModal();
    
    expect(screen.getByTestId(GetPromptModalTestIds.CONTEXT_INPUT)).toBeInTheDocument();
    expect(screen.getByTestId(GetPromptModalTestIds.AUDIENCE_INPUT)).toBeInTheDocument();
    expect(screen.getByTestId(GetPromptModalTestIds.TONE_INPUT)).toBeInTheDocument();
    expect(screen.getByTestId(GetPromptModalTestIds.SPECIFICITY_INPUT)).toBeInTheDocument();
    expect(screen.getByTestId(GetPromptModalTestIds.CONSTRAINTS_INPUT)).toBeInTheDocument();
  });

  it('displays action buttons', () => {
    renderModal();
    
    expect(screen.getByTestId(GetPromptModalTestIds.COPY_ORIGINAL_BUTTON)).toBeInTheDocument();
    expect(screen.getByTestId(GetPromptModalTestIds.GENERATE_BUTTON)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    renderModal();
    
    const closeButton = screen.getByTestId(GetPromptModalTestIds.CLOSE_BUTTON);
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('copies original prompt when copy original button is clicked', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
    renderModal();
    
    const copyButton = screen.getByTestId(GetPromptModalTestIds.COPY_ORIGINAL_BUTTON);
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockPrompt.prompt);
    
    await waitFor(() => {
      expect(screen.getByTestId(GetPromptModalTestIds.COPY_ORIGINAL_BUTTON)).toHaveTextContent('Copied!');
    });
  });

  it('generates enhanced prompt when generate button is clicked', async () => {
    renderModal();
    
    // Fill in some enhancement fields
    const contextInput = screen.getByTestId(GetPromptModalTestIds.CONTEXT_INPUT);
    fireEvent.change(contextInput, { target: { value: 'Building a React app for healthcare' } });
    
    const generateButton = screen.getByTestId(GetPromptModalTestIds.GENERATE_BUTTON);
    fireEvent.click(generateButton);
    
    // Check that generating state is shown
    expect(screen.getByText('Generating...')).toBeInTheDocument();
    
    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.getByTestId(GetPromptModalTestIds.ENHANCED_PROMPT_TEXT)).toBeInTheDocument();
    });
    
    expect(screen.getByTestId(GetPromptModalTestIds.ENHANCED_PROMPT_TEXT)).toHaveTextContent('Enhanced prompt with better context and specificity');
  });

  it('shows error when generation fails', async () => {
    // Mock the AI to throw an error
    const mockGoogleGenAI = require('@google/genai').GoogleGenAI;
    mockGoogleGenAI.mockImplementation(() => ({
      models: {
        generateContent: jest.fn().mockRejectedValue(new Error('API Error'))
      }
    }));
    
    renderModal();
    
    // Fill in some enhancement fields
    const contextInput = screen.getByTestId(GetPromptModalTestIds.CONTEXT_INPUT);
    fireEvent.change(contextInput, { target: { value: 'Building a React app for healthcare' } });
    
    const generateButton = screen.getByTestId(GetPromptModalTestIds.GENERATE_BUTTON);
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId(GetPromptModalTestIds.ERROR_MESSAGE)).toBeInTheDocument();
    });
    
    expect(screen.getByTestId(GetPromptModalTestIds.ERROR_MESSAGE)).toHaveTextContent('Could not generate enhanced prompt. Please try again.');
  });

  it('disables generate button when no enhancement fields are filled', () => {
    renderModal();
    
    const generateButton = screen.getByTestId(GetPromptModalTestIds.GENERATE_BUTTON);
    expect(generateButton).toBeDisabled();
  });

  it('enables generate button when enhancement fields are filled', () => {
    renderModal();
    
    const contextInput = screen.getByTestId(GetPromptModalTestIds.CONTEXT_INPUT);
    fireEvent.change(contextInput, { target: { value: 'Some context' } });
    
    const generateButton = screen.getByTestId(GetPromptModalTestIds.GENERATE_BUTTON);
    expect(generateButton).not.toBeDisabled();
  });

  it('copies enhanced prompt when copy enhanced button is clicked', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
    renderModal();
    
    // First generate an enhanced prompt
    const contextInput = screen.getByTestId(GetPromptModalTestIds.CONTEXT_INPUT);
    fireEvent.change(contextInput, { target: { value: 'Building a React app for healthcare' } });
    
    const generateButton = screen.getByTestId(GetPromptModalTestIds.GENERATE_BUTTON);
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId(GetPromptModalTestIds.ENHANCED_PROMPT_TEXT)).toBeInTheDocument();
    });
    
    // Now copy the enhanced prompt
    const copyEnhancedButton = screen.getByTestId(GetPromptModalTestIds.COPY_ENHANCED_BUTTON);
    fireEvent.click(copyEnhancedButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Enhanced prompt with better context and specificity');
    
    await waitFor(() => {
      expect(screen.getByTestId(GetPromptModalTestIds.COPY_ENHANCED_BUTTON)).toHaveTextContent('Copied!');
    });
  });

  it('shows appropriate placeholder text for each field', () => {
    renderModal();
    
    const contextInput = screen.getByTestId(GetPromptModalTestIds.CONTEXT_INPUT);
    const audienceInput = screen.getByTestId(GetPromptModalTestIds.AUDIENCE_INPUT);
    const toneInput = screen.getByTestId(GetPromptModalTestIds.TONE_INPUT);
    const specificityInput = screen.getByTestId(GetPromptModalTestIds.SPECIFICITY_INPUT);
    const constraintsInput = screen.getByTestId(GetPromptModalTestIds.CONSTRAINTS_INPUT);
    
    expect(contextInput).toHaveAttribute('placeholder', 'e.g., Building a React app for a healthcare company, need to follow HIPAA guidelines');
    expect(audienceInput).toHaveAttribute('placeholder', 'e.g., Senior developers with 5+ years experience, familiar with TypeScript');
    expect(toneInput).toHaveAttribute('placeholder', 'e.g., Professional, friendly, technical, creative, formal');
    expect(specificityInput).toHaveAttribute('placeholder', 'e.g., High - include exact code examples, step-by-step instructions');
    expect(constraintsInput).toHaveAttribute('placeholder', 'e.g., Must work with React 18+, TypeScript 5.0+, max 100 lines of code');
  });

  it('shows help text for each field', () => {
    renderModal();
    
    expect(screen.getByText('Provide relevant context or background information')).toBeInTheDocument();
    expect(screen.getByText('Who will be using or implementing this?')).toBeInTheDocument();
    expect(screen.getByText('What tone should the output have?')).toBeInTheDocument();
    expect(screen.getByText('How detailed should the response be?')).toBeInTheDocument();
    expect(screen.getByText('Any technical or business constraints?')).toBeInTheDocument();
  });

  it('handles clipboard write failure gracefully', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('Clipboard error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderModal();
    
    const copyButton = screen.getByTestId(GetPromptModalTestIds.COPY_ORIGINAL_BUTTON);
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockPrompt.prompt);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to copy text: ', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});
