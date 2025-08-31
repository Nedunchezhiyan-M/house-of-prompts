export interface Prompt {
  id: number;
  topic: string;
  prompt: string;
  projectStack?: string;
  requirements?: string;
  otherNecessities?: string;
}

export interface EditingPrompt {
  id: number;
  topic: string;
  prompt: string;
  projectStack?: string;
  requirements?: string;
  otherNecessities?: string;
}
