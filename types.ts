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
