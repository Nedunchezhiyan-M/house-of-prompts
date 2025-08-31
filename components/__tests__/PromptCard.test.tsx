import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PromptCard from '../PromptCard';
import { PromptCardTestIds } from '../__testids__/PromptCard.ids';
import type { Prompt } from '../../types';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('PromptCard', () => {
  const mockPrompt: Prompt = {
    id: 1,
    topic: 'Test Topic',
    prompt: 'This is a test prompt text that should be displayed in the card.'
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders prompt card correctly', () => {
    render(
      <PromptCard
        prompt={mockPrompt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId(PromptCardTestIds.CARD)).toBeInTheDocument();
    expect(screen.getByTestId(PromptCardTestIds.TOPIC_HEADING)).toHaveTextContent('Test Topic');
    expect(screen.getByTestId(PromptCardTestIds.PROMPT_TEXT)).toHaveTextContent('This is a test prompt text that should be displayed in the card.');
  });

  it('handles edit button click', () => {
    render(
      <PromptCard
        prompt={mockPrompt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTestId(PromptCardTestIds.EDIT_BUTTON);
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockPrompt);
  });

  it('handles copy button click successfully', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);

    render(
      <PromptCard
        prompt={mockPrompt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const copyButton = screen.getByTestId(PromptCardTestIds.COPY_BUTTON);
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockPrompt.prompt);
    
    await waitFor(() => {
      expect(screen.getByTestId(PromptCardTestIds.COPIED_MESSAGE)).toBeInTheDocument();
    });

    // Wait for the copied message to disappear
    await waitFor(() => {
      expect(screen.queryByTestId(PromptCardTestIds.COPIED_MESSAGE)).not.toBeInTheDocument();
    }, { timeout: 2500 });
  });

  it('handles copy button click failure', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('Copy failed'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <PromptCard
        prompt={mockPrompt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const copyButton = screen.getByTestId(PromptCardTestIds.COPY_BUTTON);
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockPrompt.prompt);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to copy text: ', expect.any(Error));

    consoleSpy.mockRestore();
  });

  describe('Delete functionality', () => {
    it('shows delete confirmation modal when delete button is clicked', () => {
      render(
        <PromptCard
          prompt={mockPrompt}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByTestId(PromptCardTestIds.DELETE_BUTTON);
      fireEvent.click(deleteButton);

      expect(screen.getByTestId(PromptCardTestIds.DELETE_MODAL)).toBeInTheDocument();
      expect(screen.getByTestId(PromptCardTestIds.DELETE_CONFIRMATION_INPUT)).toBeInTheDocument();
      expect(screen.getByTestId(PromptCardTestIds.DELETE_CONFIRM_BUTTON)).toBeInTheDocument();
      expect(screen.getByTestId(PromptCardTestIds.DELETE_CANCEL_BUTTON)).toBeInTheDocument();
    });

    it('enables delete confirm button only when "delete" is typed', () => {
      render(
        <PromptCard
          prompt={mockPrompt}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByTestId(PromptCardTestIds.DELETE_BUTTON);
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByTestId(PromptCardTestIds.DELETE_CONFIRM_BUTTON);
      const confirmationInput = screen.getByTestId(PromptCardTestIds.DELETE_CONFIRMATION_INPUT);

      // Initially disabled
      expect(confirmButton).toBeDisabled();

      // Type something other than "delete"
      fireEvent.change(confirmationInput, { target: { value: 'cancel' } });
      expect(confirmButton).toBeDisabled();

      // Type "delete" (case insensitive)
      fireEvent.change(confirmationInput, { target: { value: 'delete' } });
      expect(confirmButton).not.toBeDisabled();

      // Type "DELETE" (uppercase)
      fireEvent.change(confirmationInput, { target: { value: 'DELETE' } });
      expect(confirmButton).not.toBeDisabled();
    });

    it('calls onDelete when confirmation is successful', () => {
      render(
        <PromptCard
          prompt={mockPrompt}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByTestId(PromptCardTestIds.DELETE_BUTTON);
      fireEvent.click(deleteButton);

      const confirmationInput = screen.getByTestId(PromptCardTestIds.DELETE_CONFIRMATION_INPUT);
      const confirmButton = screen.getByTestId(PromptCardTestIds.DELETE_CONFIRM_BUTTON);

      fireEvent.change(confirmationInput, { target: { value: 'delete' } });
      fireEvent.click(confirmButton);

      expect(mockOnDelete).toHaveBeenCalledWith(mockPrompt.id);
      expect(screen.queryByTestId(PromptCardTestIds.DELETE_MODAL)).not.toBeInTheDocument();
    });

    it('closes modal when cancel is clicked', () => {
      render(
        <PromptCard
          prompt={mockPrompt}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByTestId(PromptCardTestIds.DELETE_BUTTON);
      fireEvent.click(deleteButton);

      const cancelButton = screen.getByTestId(PromptCardTestIds.DELETE_CANCEL_BUTTON);
      fireEvent.click(cancelButton);

      expect(screen.queryByTestId(PromptCardTestIds.DELETE_MODAL)).not.toBeInTheDocument();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });

    it('clears confirmation input when modal is closed', () => {
      render(
        <PromptCard
          prompt={mockPrompt}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByTestId(PromptCardTestIds.DELETE_BUTTON);
      fireEvent.click(deleteButton);

      const confirmationInput = screen.getByTestId(PromptCardTestIds.DELETE_CONFIRMATION_INPUT);
      fireEvent.change(confirmationInput, { target: { value: 'delete' } });

      const cancelButton = screen.getByTestId(PromptCardTestIds.DELETE_CANCEL_BUTTON);
      fireEvent.click(cancelButton);

      // Reopen modal
      fireEvent.click(deleteButton);
      const newConfirmationInput = screen.getByTestId(PromptCardTestIds.DELETE_CONFIRMATION_INPUT);
      expect(newConfirmationInput).toHaveValue('');
    });
  });

  it('displays all action buttons with correct tooltips', () => {
    render(
      <PromptCard
        prompt={mockPrompt}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTestId(PromptCardTestIds.EDIT_BUTTON);
    const deleteButton = screen.getByTestId(PromptCardTestIds.DELETE_BUTTON);
    const copyButton = screen.getByTestId(PromptCardTestIds.COPY_BUTTON);

    expect(editButton).toHaveAttribute('title', 'Edit prompt');
    expect(deleteButton).toHaveAttribute('title', 'Delete prompt');
    expect(copyButton).toHaveAttribute('title', 'Copy to clipboard');
  });
});

