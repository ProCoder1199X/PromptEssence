export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface OptimizationResult {
  output: string;
}

export interface PromptState {
  input: string;
  output: string;
  status: AppStatus;
  errorMessage?: string;
}

export interface PromptVersion {
  id: string;
  input: string;
  output: string;
  timestamp: number;
  score?: number;
}

export interface PromptAnalysis {
  clarity: number;
  specificity: number;
  structure: number;
  completeness: number;
  suggestions: string[];
}

export interface Template {
  id: string;
  name: string;
  icon: string;
  category: string;
  template: string;
}

export type OptimizationMode = 'balanced' | 'creative' | 'precise' | 'coding';
export type TargetAI = 'general' | 'chatgpt' | 'claude' | 'gemini';