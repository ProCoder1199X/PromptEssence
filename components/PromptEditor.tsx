import React, { useState, useCallback, useEffect } from 'react';
import { AppStatus, PromptState } from '../types';
import { optimizePrompt } from '../services/geminiService';
import Button from './Button';

type OptimizationMode = 'balanced' | 'creative' | 'precise' | 'coding';
type TargetModel = 'general' | 'chatgpt' | 'claude' | 'gemini';

const PromptEditor: React.FC = () => {
  const [state, setState] = useState<PromptState>({
    input: '',
    output: '',
    status: AppStatus.IDLE,
  });

  const [mode, setMode] = useState<OptimizationMode>('balanced');
  const [targetModel, setTargetModel] = useState<TargetModel>('general');

  const handleOptimize = useCallback(async () => {
    if (!state.input.trim()) return;

    setState(prev => ({ ...prev, status: AppStatus.LOADING, errorMessage: undefined }));

    try {
      // Add a lightweight config header so the AI can adapt style/model
      const payload = `[[CONFIG]]
mode: ${mode}
target_model: ${targetModel}
[[/CONFIG]]

${state.input}`;

      const optimizedText = await optimizePrompt(state.input);
      setState(prev => ({
        ...prev,
        output: optimizedText,
        status: AppStatus.SUCCESS,
      }));
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Something went wrong";
      setState(prev => ({
        ...prev,
        status: AppStatus.ERROR,
        errorMessage: msg,
      }));
    }
  }, [mode, targetModel, state.input]);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Prompt Editor</h2>
      <textarea
        className="w-full p-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your prompt here..."
        value={state.input}
        onChange={(e) => setState({ ...state, input: e.target.value })}
      />
      <div className="flex justify-between items-center mt-4">
        <select
          className="bg-gray-800 text-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={mode}
          onChange={(e) => setMode(e.target.value as OptimizationMode)}
        >
          <option value="balanced">Balanced</option>
          <option value="creative">Creative</option>
          <option value="precise">Precise</option>
          <option value="coding">Coding</option>
        </select>
        <Button variant="primary" onClick={handleOptimize} isLoading={state.status === AppStatus.LOADING}>
          Optimize
        </Button>
      </div>
      {state.output && (
        <div className="mt-4 p-4 bg-gray-800 text-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Output</h3>
          <p>{state.output}</p>
        </div>
      )}
    </div>
  );
};

export default PromptEditor;
