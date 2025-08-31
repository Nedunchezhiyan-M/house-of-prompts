import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PromptForm from '../PromptForm';
import { PromptFormTestIds } from '../__testids__/PromptForm.ids';
import type { EditingPrompt } from '../../types';

// Mock the GoogleGenAI
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: 'Creative Writing'
      })
    }
  }))
}));

describe('PromptForm', () => {
  const mockOnAddPrompt = jest.fn();
  const mockOnEditPrompt = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Add Mode', () => {
    it('renders add form correctly', () => {
      render(
        <PromptForm
          onAddPrompt={mockOnAddPrompt}
          onEditPrompt={mockOnEditPrompt}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByTestId(PromptFormTestIds.FORM_TITLE)).toHaveTextContent('Add a New Prompt');
      expect(screen.getByTestId(PromptFormTestIds.TOPIC_INPUT)).toBeInTheDocument();
      expect(screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA)).toBeInTheDocument();
      expect(screen.getByTestId(PromptFormTestIds.SUBMIT_BUTTON)).toHaveTextContent('Save Prompt');
      expect(screen.getByTestId(PromptFormTestIds.SUGGEST_TOPIC_BUTTON)).toBeInTheDocument();
    });

    it('handles form submission for new prompt', () => {
      render(
        <PromptForm
          onAddPrompt={mockOnAddPrompt}
          onEditPrompt={mockOnEditPrompt}
          onCancel={mockOnCancel}
        />
      );

      const topicInput = screen.getByTestId(PromptFormTestIds.TOPIC_INPUT);
      const promptTextarea = screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA);
      const submitButton = screen.getByTestId(PromptFormTestIds.SUBMIT_BUTTON);

      fireEvent.change(topicInput, { target: { value: 'Test Topic' } });
      fireEvent.change(promptTextarea, { target: { value: 'Test prompt text' } });
      fireEvent.click(submitButton);

      expect(mockOnAddPrompt).toHaveBeenCalledWith('Test Topic', 'Test prompt text');
    });

    it('shows error when form is submitted without required fields', () => {
      render(
        <PromptForm
          onAddPrompt={mockOnAddPrompt}
          onEditPrompt={mockOnEditPrompt}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByTestId(PromptFormTestIds.SUBMIT_BUTTON);
      fireEvent.click(submitButton);

      expect(screen.getByTestId(PromptFormTestIds.ERROR_MESSAGE)).toHaveTextContent('Both topic and prompt text are required.');
      expect(mockOnAddPrompt).not.toHaveBeenCalled();
    });

    it('handles topic suggestion', async () => {
      render(
        <PromptForm
          onAddPrompt={mockOnAddPrompt}
          onEditPrompt={mockOnEditPrompt}
          onCancel={mockOnCancel}
        />
      );

      const promptTextarea = screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA);
      const suggestButton = screen.getByTestId(PromptFormTestIds.SUGGEST_TOPIC_BUTTON);

      fireEvent.change(promptTextarea, { target: { value: 'Write a creative story' } });
      fireEvent.click(suggestButton);

      await waitFor(() => {
        expect(screen.getByTestId(PromptFormTestIds.TOPIC_INPUT)).toHaveValue('Creative Writing');
      });
    });

    it('handles cancel action', () => {
      render(
        <PromptForm
          onAddPrompt={mockOnAddPrompt}
          onEditPrompt={mockOnEditPrompt}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByTestId(PromptFormTestIds.CANCEL_BUTTON);
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    const mockEditingPrompt: EditingPrompt = {
      id: 1,
      topic: 'Original Topic',
      prompt: 'Original prompt text'
    };

    it('renders edit form correctly', () => {
      render(
        <PromptForm
          onAddPrompt={mockOnAddPrompt}
          onEditPrompt={mockOnEditPrompt}
          onCancel={mockOnCancel}
          editingPrompt={mockEditingPrompt}
        />
      );

      expect(screen.getByTestId(PromptFormTestIds.FORM_TITLE)).toHaveTextContent('Edit Prompt');
      expect(screen.getByTestId(PromptFormTestIds.TOPIC_INPUT)).toHaveValue('Original Topic');
      expect(screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA)).toHaveValue('Original prompt text');
      expect(screen.getByTestId(PromptFormTestIds.SUBMIT_BUTTON)).toHaveTextContent('Update Prompt');
    });

    it('does not show suggest topic button in edit mode', () => {
      render(
        <PromptForm
          onAddPrompt={mockOnAddPrompt}
          onEditPrompt={mockOnEditPrompt}
          onCancel={mockOnCancel}
          editingPrompt={mockEditingPrompt}
        />
      );

      expect(screen.queryByTestId(PromptFormTestIds.SUGGEST_TOPIC_BUTTON)).not.toBeInTheDocument();
    });

    it('handles form submission for editing prompt', () => {
      render(
        <PromptForm
          onAddPrompt={mockOnAddPrompt}
          onEditPrompt={mockOnEditPrompt}
          onCancel={mockOnCancel}
          editingPrompt={mockEditingPrompt}
        />
      );

      const topicInput = screen.getByTestId(PromptFormTestIds.TOPIC_INPUT);
      const promptTextarea = screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA);
      const submitButton = screen.getByTestId(PromptFormTestIds.SUBMIT_BUTTON);

      fireEvent.change(topicInput, { target: { value: 'Updated Topic' } });
      fireEvent.change(promptTextarea, { target: { value: 'Updated prompt text' } });
      fireEvent.click(submitButton);

      expect(mockOnEditPrompt).toHaveBeenCalledWith(1, 'Updated Topic', 'Updated prompt text');
      expect(mockOnAddPrompt).not.toHaveBeenCalled();
    });

    it('clears form when switching between add and edit modes', () => {
      const { rerender } = render(
        <PromptForm
          onAddPrompt={mockOnAddPrompt}
          onEditPrompt={mockOnEditPrompt}
          onCancel={mockOnCancel}
          editingPrompt={mockEditingPrompt}
        />
      );

      // Switch to add mode
      rerender(
        <PromptForm
          onAddPrompt={mockOnAddPrompt}
          onEditPrompt={mockOnEditPrompt}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByTestId(PromptFormTestIds.TOPIC_INPUT)).toHaveValue('');
      expect(screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA)).toHaveValue('');
    });
  });
});

