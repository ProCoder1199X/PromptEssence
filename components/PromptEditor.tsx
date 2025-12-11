import React, { useState, useCallback } from 'react';
import { AppStatus, PromptState } from '../types';
import { optimizePrompt } from '../services/geminiService';
import Button from './Button';

const PromptEditor: React.FC = () => {
  const [state, setState] = useState<PromptState>({
    input: '',
    output: '',
    status: AppStatus.IDLE,
  });

  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prev => ({ ...prev, input: e.target.value }));
  };

  const handleOptimize = async () => {
    if (!state.input.trim()) return;

    setState(prev => ({ ...prev, status: AppStatus.LOADING, errorMessage: undefined }));

    try {
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
  };

  const handleCopy = useCallback(() => {
    if (!state.output) return;
    navigator.clipboard.writeText(state.output);
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  }, [state.output]);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 flex flex-col animate-slide-up z-10">
      
      {/* Cards Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 min-h-[500px]">
        
        {/* Left Card: Input */}
        <div className="glass-panel rounded-xl p-1 flex flex-col transition-all duration-300 glow-hover group h-full">
          <div className="bg-[#161616] rounded-t-[1rem] px-6 py-4 border-b border-[#222] flex items-center justify-between">
            <h2 className="text-slate-300 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
              Your Messy Thought
            </h2>
            <span className="text-xs text-slate-600 font-mono uppercase tracking-wider">Input</span>
          </div>
          
          <div className="flex-1 relative p-4 bg-[#111111] rounded-b-[1rem]">
            <textarea
              id="messy-prompt"
              className="w-full h-full bg-transparent border-none text-slate-200 placeholder-slate-600 focus:ring-0 resize-none font-mono text-base leading-relaxed p-2"
              placeholder="Dump your raw ideas here...
e.g. 'I need a python script to scan a pdf and extract names but make it handle errors and save to csv'"
              value={state.input}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Right Card: Output */}
        <div className="glass-panel rounded-xl p-1 flex flex-col transition-all duration-300 glow-hover group h-full relative overflow-hidden">
          <div className="bg-[#161616] rounded-t-[1rem] px-6 py-4 border-b border-[#222] flex items-center justify-between">
            <h2 className="text-accent font-medium flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${state.status === AppStatus.SUCCESS ? 'bg-accent shadow-[0_0_8px_rgba(45,125,255,0.8)]' : 'bg-slate-700'}`}></span>
              Optimized Prompt
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 font-mono uppercase tracking-wider">Output</span>
            </div>
          </div>
          
          <div className="flex-1 relative p-4 bg-[#111111] rounded-b-[1rem]">
            {state.status === AppStatus.IDLE && !state.output && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 select-none pointer-events-none">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p className="text-sm">Ready to optimize</p>
              </div>
            )}
            
            <textarea
              id="optimized-prompt"
              readOnly
              className={`w-full h-full bg-transparent border-none text-white focus:ring-0 resize-none font-mono text-base leading-relaxed p-2 transition-opacity duration-300 ${state.status === AppStatus.LOADING ? 'opacity-30' : 'opacity-100'}`}
              value={state.output}
            />

            {/* Floating Copy Button */}
            {state.output && (
              <div className="absolute bottom-6 right-6 animate-fade-in">
                <Button 
                  onClick={handleCopy} 
                  variant="secondary"
                  className="shadow-lg backdrop-blur-md bg-[#222]/90"
                >
                  {copyStatus === 'copied' ? (
                    <span className="flex items-center gap-2 text-green-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      Copy Prompt
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Error Overlay */}
            {state.status === AppStatus.ERROR && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-b-[1rem] z-20">
                <div className="text-red-400 text-center px-6 py-4 bg-[#1a1111] border border-red-900/50 rounded-xl shadow-2xl">
                  <p className="font-bold mb-1">Optimization Failed</p>
                  <p className="text-sm text-red-300/70">{state.errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Action Button */}
      <div className="flex justify-center items-center pb-8">
        <Button 
          onClick={handleOptimize} 
          isLoading={state.status === AppStatus.LOADING}
          disabled={!state.input.trim()}
          className="w-full sm:w-auto min-w-[240px] transform hover:-translate-y-1"
        >
          {state.status === AppStatus.LOADING ? 'Refining Logic...' : 'Optimize Prompt ✨'}
        </Button>
      </div>
      
    </main>
  );
};

export default PromptEditor;
