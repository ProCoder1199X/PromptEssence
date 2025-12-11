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
  
  // Optimization: Derived state instead of useEffect
  const charCount = state.input.length;

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
    
    // Simple clipboard write
    navigator.clipboard.writeText(state.output).then(() => {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
  }, [state.output]);

  const handleClear = () => {
    setState({
      input: '',
      output: '',
      status: AppStatus.IDLE,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to optimize
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleOptimize();
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 flex flex-col animate-slide-up z-10">
      
      {/* Cards Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 min-h-[500px]">
        
        {/* Left Card: Input */}
        <div className="glass-panel rounded-xl p-1 flex flex-col transition-all duration-300 glow-hover group h-full">
          <div className="bg-[#161616] rounded-t-[1rem] px-6 py-4 border-b border-[#222] flex items-center justify-between">
            <h2 className="text-slate-300 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span>
              Your Messy Thought
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 font-mono">{charCount} chars</span>
              {state.input && (
                <button
                  onClick={handleClear}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 hover:bg-white/5 rounded"
                  title="Clear all text"
                  aria-label="Clear input"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 relative p-4 bg-[#111111] rounded-b-[1rem]">
            <textarea
              id="messy-prompt"
              className="w-full h-full bg-transparent border-none text-slate-200 placeholder-slate-600 focus:ring-0 resize-none font-mono text-base leading-relaxed p-2"
              placeholder="Dump your raw ideas here...
e.g. 'I need a python script to scan a pdf and extract names but make it handle errors and save to csv'

💡 Pro tip: Press Ctrl+Enter to optimize instantly"
              value={state.input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Right Card: Output */}
        <div className="glass-panel rounded-xl p-1 flex flex-col transition-all duration-300 glow-hover group h-full relative overflow-hidden">
          <div className="bg-[#161616] rounded-t-[1rem] px-6 py-4 border-b border-[#222] flex items-center justify-between">
            <h2 className="text-accent font-medium flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                state.status === AppStatus.SUCCESS 
                  ? 'bg-accent shadow-[0_0_8px_rgba(45,125,255,0.8)]' 
                  : state.status === AppStatus.LOADING
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-slate-700'
              }`}></span>
              Optimized Prompt
            </h2>
            <div className="flex items-center gap-3">
              {state.output && (
                <span className="text-xs text-green-400/60 font-mono">
                  {state.output.length} chars
                </span>
              )}
              <span className="text-xs text-slate-600 font-mono uppercase tracking-wider">Output</span>
            </div>
          </div>
          
          <div className="flex-1 relative p-4 bg-[#111111] rounded-b-[1rem]">
            {/* Empty State */}
            {state.status === AppStatus.IDLE && !state.output && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 select-none pointer-events-none">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-sm">Your optimized prompt will appear here</p>
              </div>
            )}

            {/* Loading State */}
            {state.status === AppStatus.LOADING && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-10">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-700 border-t-accent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm mt-6 animate-pulse font-medium text-slate-400">Refining logic...</p>
              </div>
            )}
            
            <textarea
              id="optimized-prompt"
              readOnly
              className={`w-full h-full bg-transparent border-none text-white focus:ring-0 resize-none font-mono text-base leading-relaxed p-2 transition-opacity duration-300 ${
                state.status === AppStatus.LOADING ? 'opacity-0' : 'opacity-100'
              }`}
              value={state.output}
            />

            {/* Floating Copy Button */}
            {state.output && state.status === AppStatus.SUCCESS && (
              <div className="absolute bottom-6 right-6 animate-fade-in z-20">
                <Button 
                  onClick={handleCopy} 
                  variant="secondary"
                  className="shadow-lg backdrop-blur-md bg-[#222]/90 border border-slate-700/50"
                  aria-label="Copy to clipboard"
                >
                  {copyStatus === 'copied' ? (
                    <span className="flex items-center gap-2 text-green-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Prompt
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Error Overlay */}
            {state.status === AppStatus.ERROR && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-b-[1rem] z-30">
                <div className="text-red-400 text-center px-6 py-4 bg-[#1a1111] border border-red-900/50 rounded-xl shadow-2xl max-w-md mx-4">
                  <svg className="w-12 h-12 mx-auto mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="font-bold mb-2 text-lg text-red-200">Optimization Failed</p>
                  <p className="text-sm text-red-300/70 mb-4">{state.errorMessage}</p>
                  <button
                    onClick={() => setState(prev => ({ ...prev, status: AppStatus.IDLE }))}
                    className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 rounded-lg text-sm text-red-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Action Button */}
      <div className="flex flex-col items-center justify-center pb-8 gap-3">
        <Button 
          onClick={handleOptimize} 
          isLoading={state.status === AppStatus.LOADING}
          disabled={!state.input.trim()}
          className="w-full sm:w-auto min-w-[240px] transform hover:-translate-y-1"
        >
          {state.status === AppStatus.LOADING ? 'Refining Logic...' : 'Optimize Prompt ✨'}
        </Button>
        
        {state.input && !state.output && (
          <span className="hidden sm:block text-xs text-slate-600 animate-fade-in">
            Pro tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-400">Ctrl + Enter</kbd> to optimize
          </span>
        )}
      </div>
      
      {/* Quick Tips Section (Only visible when idle and empty) */}
      {state.status === AppStatus.IDLE && !state.input && (
        <div className="mt-4 p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/20 rounded-xl border border-slate-800/50 backdrop-blur-sm animate-fade-in">
          <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to use PromptBridge
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-400">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-xl shrink-0">💭</span>
              <div>
                <p className="font-medium text-slate-200 mb-1">Write Naturally</p>
                <p className="leading-relaxed opacity-80">Just dump your raw thoughts. Don't worry about format or grammar.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-xl shrink-0">🎯</span>
              <div>
                <p className="font-medium text-slate-200 mb-1">Be Specific</p>
                <p className="leading-relaxed opacity-80">Include constraints like "no external libraries" or "JSON format".</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-xl shrink-0">⚡</span>
              <div>
                <p className="font-medium text-slate-200 mb-1">Instant Polish</p>
                <p className="leading-relaxed opacity-80">We restructure your request into the perfect LLM instruction.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </main>
  );
};

export default PromptEditor;
