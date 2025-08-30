import type { Prompt } from '../types';

const STORAGE_KEY = 'promptLibrary';

const DEFAULT_PROMPTS: Prompt[] = [
  {
    id: 1,
    topic: 'UI Design',
    prompt: 'Generate a modern and minimalist login screen design for a mobile banking app. Include fields for username, password, a "Forgot Password" link, and a prominent login button. The color scheme should be professional and trustworthy.'
  }
];

export const getPrompts = (): Prompt[] => {
  try {
    const storedPrompts = localStorage.getItem(STORAGE_KEY);
    if (storedPrompts) {
      return JSON.parse(storedPrompts);
    } else {
      // If no prompts are in storage, save and return the default ones
      savePrompts(DEFAULT_PROMPTS);
      return DEFAULT_PROMPTS;
    }
  } catch (error) {
    console.error('Failed to retrieve prompts from localStorage:', error);
    // Fallback to default prompts in case of parsing error
    return DEFAULT_PROMPTS;
  }
};

export const savePrompts = (prompts: Prompt[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  } catch (error) {
    console.error('Failed to save prompts to localStorage:', error);
  }
};
