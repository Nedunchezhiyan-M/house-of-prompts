# Prompt Library Features

## Core Functionality

### Add Prompts
- Create new prompts with custom topics and text
- AI-powered topic suggestions using Google Gemini
- Form validation for required fields

### Edit Prompts
- Click the edit button (pencil icon) on any prompt card
- Form automatically populates with existing prompt data
- Update topic and prompt text
- Save changes to update the prompt

### Delete Prompts
- Click the delete button (trash icon) on any prompt card
- Double confirmation required for safety:
  1. First click opens confirmation modal
  2. Type "delete" (case-insensitive) to confirm
  3. Click "Delete Prompt" button
- Cannot be undone

### Copy Prompts
- Click the copy button (clipboard icon) to copy prompt text
- Visual feedback shows "Copied!" message
- Automatically disappears after 2 seconds

### Search Prompts
- Search through prompts by topic
- Real-time filtering as you type
- Case-insensitive search

## User Interface

### Prompt Cards
- Clean, modern card design
- Hover effects with enhanced shadows
- Responsive layout for different screen sizes
- Action buttons for edit, delete, and copy

### Form Interface
- Modal-style form for adding/editing prompts
- Responsive design with proper spacing
- Clear visual feedback for errors
- Smooth animations and transitions

### Delete Confirmation
- Modal overlay with warning message
- Input field requiring "delete" confirmation
- Disabled confirm button until correct text is entered
- Cancel option to abort deletion

## Technical Features

### TypeScript Support
- Full type safety throughout the application
- Proper interface definitions for all data structures
- Type-safe event handlers and props

### State Management
- React hooks for local state management
- Persistent storage using localStorage
- Optimistic updates for better user experience

### Testing
- Comprehensive test coverage for all components
- Test IDs for reliable element selection
- Unit tests for all major functionality
- Jest and React Testing Library setup

### Accessibility
- Proper ARIA labels for screen readers
- Keyboard navigation support
- Focus management for modals
- Semantic HTML structure

## File Structure

```
components/
├── PromptForm.tsx          # Add/Edit prompt form
├── PromptCard.tsx          # Individual prompt display
├── SearchBar.tsx           # Search functionality
├── icons/                  # SVG icon components
├── __tests__/             # Test files
│   ├── PromptForm.test.tsx
│   └── PromptCard.test.tsx
└── __testids__/           # Test ID constants
    ├── PromptForm.ids.ts
    └── PromptCard.ids.ts
```

## Getting Started

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Run tests: `npm test`
4. Build for production: `npm run build`

## Testing

The application includes comprehensive testing setup:

- **Unit Tests**: Test individual component functionality
- **Integration Tests**: Test component interactions
- **Test IDs**: Consistent element identification for tests
- **Mocking**: Proper mocking of external dependencies

Run tests with:
- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode

