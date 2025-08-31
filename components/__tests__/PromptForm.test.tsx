import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PromptForm from '../PromptForm';
import { PromptFormTestIds } from '../__testids__/PromptForm.ids';

// Mock the GoogleGenAI
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: 'Suggested Topic'
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

  const renderForm = (editingPrompt = null) => {
    return render(
      <PromptForm
        onAddPrompt={mockOnAddPrompt}
        onEditPrompt={mockOnEditPrompt}
        onCancel={mockOnCancel}
        editingPrompt={editingPrompt}
      />
    );
  };

  it('renders add prompt form by default', () => {
    renderForm();
    
    expect(screen.getByTestId(PromptFormTestIds.FORM_TITLE)).toHaveTextContent('Add a New Prompt');
    expect(screen.getByTestId(PromptFormTestIds.TOPIC_INPUT)).toBeInTheDocument();
    expect(screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA)).toBeInTheDocument();
    expect(screen.getByTestId(PromptFormTestIds.SUBMIT_BUTTON)).toHaveTextContent('Save Prompt');
  });

  it('renders edit prompt form when editingPrompt is provided', () => {
    const editingPrompt = { id: 1, topic: 'Test Topic', prompt: 'Test prompt text' };
    renderForm(editingPrompt);
    
    expect(screen.getByTestId(PromptFormTestIds.FORM_TITLE)).toHaveTextContent('Edit Prompt');
    expect(screen.getByTestId(PromptFormTestIds.TOPIC_INPUT)).toHaveValue('Test Topic');
    expect(screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA)).toHaveValue('Test prompt text');
    expect(screen.getByTestId(PromptFormTestIds.SUBMIT_BUTTON)).toHaveTextContent('Update Prompt');
  });

  it('calls onAddPrompt when form is submitted with valid data', () => {
    renderForm();
    
    fireEvent.change(screen.getByTestId(PromptFormTestIds.TOPIC_INPUT), { target: { value: 'Test Topic' } });
    fireEvent.change(screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA), { target: { value: 'Test prompt text' } });
    fireEvent.click(screen.getByTestId(PromptFormTestIds.SUBMIT_BUTTON));
    
    expect(mockOnAddPrompt).toHaveBeenCalledWith('Test Topic', 'Test prompt text', '', '', '');
  });

  it('shows error when form is submitted without required fields', () => {
    renderForm();
    
    fireEvent.click(screen.getByTestId(PromptFormTestIds.SUBMIT_BUTTON));
    
    expect(screen.getByTestId(PromptFormTestIds.ERROR_MESSAGE)).toHaveTextContent('Both topic and prompt text are required.');
    expect(mockOnAddPrompt).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is pressed', () => {
    renderForm();
    
    fireEvent.click(screen.getByTestId(PromptFormTestIds.CANCEL_BUTTON));
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('suggests topic when suggest topic button is pressed', async () => {
    renderForm();
    
    fireEvent.change(screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA), { target: { value: 'Test prompt text' } });
    fireEvent.click(screen.getByTestId(PromptFormTestIds.SUGGEST_TOPIC_BUTTON));
    
    await waitFor(() => {
      expect(screen.getByTestId(PromptFormTestIds.TOPIC_INPUT)).toHaveValue('Suggested Topic');
    });
  });

  it('shows error when suggesting topic without prompt text', () => {
    renderForm();
    
    fireEvent.click(screen.getByTestId(PromptFormTestIds.SUGGEST_TOPIC_BUTTON));
    
    expect(screen.getByTestId(PromptFormTestIds.SUGGESTION_ERROR_MESSAGE)).toHaveTextContent('Please enter a prompt before suggesting a topic.');
  });

  it('calls onEditPrompt when editing existing prompt', () => {
    const editingPrompt = { id: 1, topic: 'Test Topic', prompt: 'Test prompt text' };
    renderForm(editingPrompt);
    
    fireEvent.change(screen.getByTestId(PromptFormTestIds.TOPIC_INPUT), { target: { value: 'Updated Topic' } });
    fireEvent.change(screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA), { target: { value: 'Updated prompt text' } });
    fireEvent.click(screen.getByTestId(PromptFormTestIds.SUBMIT_BUTTON));
    
    expect(mockOnEditPrompt).toHaveBeenCalledWith(1, 'Updated Topic', 'Updated prompt text', '', '', '');
    expect(mockOnAddPrompt).not.toHaveBeenCalled();
  });

  it('resets form when editing is cancelled', () => {
    const editingPrompt = { id: 1, topic: 'Test Topic', prompt: 'Test prompt text' };
    renderForm(editingPrompt);
    
    fireEvent.click(screen.getByTestId(PromptFormTestIds.CANCEL_BUTTON));
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('handles which prompt functionality', async () => {
    renderForm();
    
    fireEvent.change(screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA), { target: { value: 'Test prompt text' } });
    fireEvent.click(screen.getByTestId(PromptFormTestIds.WHICH_PROMPT_BUTTON));
    
    // The which functionality should work without errors
    expect(screen.getByTestId(PromptFormTestIds.WHICH_PROMPT_BUTTON)).toBeInTheDocument();
  });

  it('shows error when using which functionality without prompt text', () => {
    renderForm();
    
    fireEvent.click(screen.getByTestId(PromptFormTestIds.WHICH_PROMPT_BUTTON));
    
    expect(screen.getByTestId(PromptFormTestIds.SUGGESTION_ERROR_MESSAGE)).toHaveTextContent('Please enter a prompt before generating enhanced version.');
  });

  it('submits form with all fields including new ones', () => {
    renderForm();
    
    fireEvent.change(screen.getByTestId(PromptFormTestIds.TOPIC_INPUT), { target: { value: 'Test Topic' } });
    fireEvent.change(screen.getByTestId(PromptFormTestIds.PROMPT_TEXTAREA), { target: { value: 'Test prompt text' } });
    
    // Find the new fields by their labels and fill them
    const projectStackInput = screen.getByLabelText('Project Stack');
    const requirementsInput = screen.getByLabelText('Requirements');
    const otherNecessitiesInput = screen.getByLabelText('Other Necessities');
    
    fireEvent.change(projectStackInput, { target: { value: 'React, TypeScript, TailwindCSS' } });
    fireEvent.change(requirementsInput, { target: { value: 'Must be responsive and accessible' } });
    fireEvent.change(otherNecessitiesInput, { target: { value: 'Include error handling and loading states' } });
    
    fireEvent.click(screen.getByTestId(PromptFormTestIds.SUBMIT_BUTTON));
    
    expect(mockOnAddPrompt).toHaveBeenCalledWith(
      'Test Topic', 
      'Test prompt text', 
      'React, TypeScript, TailwindCSS',
      'Must be responsive and accessible',
      'Include error handling and loading states'
    );
  });
});

