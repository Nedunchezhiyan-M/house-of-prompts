import type { Prompt } from '../types';

const STORAGE_KEY = 'promptLibrary';

const DEFAULT_PROMPTS: Prompt[] = [
  {
    id: 1,
    topic: 'UI Design',
    prompt: 'Generate a modern and minimalist login screen design for a mobile banking app. Include fields for username, password, a "Forgot Password" link, and a prominent login button. The color scheme should be professional and trustworthy.'
  },
  {
    id: 2,
    topic: 'API Testing',
    prompt: 'Create a comprehensive set of Postman test cases for a REST API endpoint that handles user registration. The endpoint is POST /api/users. Tests should cover success cases (201 Created), validation errors (400 Bad Request) for missing fields, duplicate email, and invalid password format.'
  },
  {
    id: 3,
    topic: 'Creative Writing',
    prompt: 'Write a short story opening about a detective who discovers a mysterious, glowing artifact in a dusty antique shop. The story should establish a noir tone and introduce an element of the supernatural.'
  },
  {
    id: 4,
    topic: 'Code Generation',
    prompt: 'Write a Python function that takes a list of URLs as input, scrapes the title tag from each URL asynchronously, and returns a dictionary mapping each URL to its title. Handle potential request errors gracefully.'
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
