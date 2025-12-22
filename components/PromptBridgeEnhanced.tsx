import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Sparkles, Copy, Check, History, Wand2, Zap, RefreshCw, Download, Upload, Target, Lightbulb, TrendingUp, BarChart, X } from 'lucide-react';
import { AppStatus, PromptVersion, PromptAnalysis, Template, OptimizationMode, TargetAI } from '../types';
import { optimizePrompt } from '../services/geminiService';
import Button from './Button';

const PromptBridgeEnhanced: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [copyStatus, setCopyStatus] = useState(false);
  const [history, setHistory] = useState<PromptVersion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [optimizationMode, setOptimizationMode] = useState<OptimizationMode>('balanced');
  const [targetAI, setTargetAI] = useState<TargetAI>('general');
  const [showTemplates, setShowTemplates] = useState(false);
  const [autoImprove, setAutoImprove] = useState(false);
  const [iterations, setIterations] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates: Template[] = [
    { id: '1', name: 'Code Generation', icon: '💻', category: 'Development', template: 'Create a [language] script that [functionality]. Requirements:\n- [requirement 1]\n- [requirement 2]\nConstraints: [constraints]' },
    { id: '2', name: 'Data Analysis', icon: '📊', category: 'Analysis', template: 'Analyze the following data: [data description]\nFocus on: [key metrics]\nProvide insights on: [analysis goals]' },
    { id: '3', name: 'Content Writing', icon: '✍️', category: 'Writing', template: 'Write a [type] about [topic]\nTone: [tone]\nLength: [length]\nKey points to cover: [points]' },
    { id: '4', name: 'Problem Solving', icon: '🧩', category: 'Strategy', template: 'I need to solve: [problem]\nConstraints: [constraints]\nDesired outcome: [outcome]\nPlease provide step-by-step solutions.' },
    { id: '5', name: 'Learning Path', icon: '🎓', category: 'Education', template: 'Create a learning roadmap for: [skill/topic]\nCurrent level: [beginner/intermediate/advanced]\nTime available: [timeframe]\nGoal: [end goal]' },
    { id: '6', name: 'Brainstorming', icon: '💡', category: 'Creative', template: 'Generate innovative ideas for: [topic]\nContext: [context]\nTarget audience: [audience]\nConstraints: [constraints]' },
  ];

  // Load history and settings from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('promptbridge_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory) as PromptVersion[];
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }

      const savedMode = localStorage.getItem('promptbridge_mode') as OptimizationMode | null;
      if (savedMode && ['balanced', 'creative', 'precise', 'coding'].includes(savedMode)) {
        setOptimizationMode(savedMode);
      }

      const savedTarget = localStorage.getItem('promptbridge_target') as TargetAI | null;
      if (savedTarget && ['general', 'chatgpt', 'claude', 'gemini'].includes(savedTarget)) {
        setTargetAI(savedTarget);
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('promptbridge_history', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, [history]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('promptbridge_mode', optimizationMode);
      localStorage.setItem('promptbridge_target', targetAI);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [optimizationMode, targetAI]);

  // Simulate prompt analysis
  const analyzePrompt = useCallback((text: string): PromptAnalysis => {
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const hasQuestions = text.includes('?');
    const hasConstraints = /constraint|requirement|must|should|need|limit|only|avoid|don't|do not/i.test(text);
    const hasContext = words > 20;
    const hasStructure = text.includes('\n') || text.includes('-') || /\d\./.test(text);

    const clarity = Math.min(100, Math.max(0, (words / 50) * 100));
    const specificity = Math.min(100, Math.max(0, 
      (hasQuestions ? 20 : 0) + 
      (hasConstraints ? 30 : 0) + 
      (hasContext ? 30 : 0) +
      (words > 50 ? 20 : 0)
    ));
    const structure = hasStructure ? 80 : 40;
    const completeness = Math.round((clarity + specificity + structure) / 3);

    const suggestions: string[] = [];
    if (clarity < 50) suggestions.push('Add more detail to your request');
    if (!hasConstraints) suggestions.push('Specify constraints or requirements');
    if (!hasStructure) suggestions.push('Use bullet points or numbered lists for clarity');
    if (words < 10) suggestions.push('Provide more context about what you need');
    if (words > 200 && !hasStructure) suggestions.push('Consider organizing your request with sections or lists');

    return { clarity, specificity, structure, completeness, suggestions };
  }, []);

  useEffect(() => {
    if (input.trim().length > 10) {
      const timer = setTimeout(() => {
        setAnalysis(analyzePrompt(input));
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAnalysis(null);
    }
  }, [input, analyzePrompt]);

  const optimizePromptWithAI = async () => {
    if (!input.trim()) return;

    setStatus(AppStatus.LOADING);
    setErrorMessage(null);

    try {
      // Build the prompt with configuration
      const configBlock = `[[CONFIG]]
mode: ${optimizationMode}
target_model: ${targetAI}
[[/CONFIG]]

${input}`;

      const optimized = await optimizePrompt(configBlock);
      
      setOutput(optimized);
      setStatus(AppStatus.SUCCESS);

      // Save to history
      const newVersion: PromptVersion = {
        id: Date.now().toString(),
        input,
        output: optimized,
        timestamp: Date.now(),
        score: analysis ? Math.round(analysis.completeness + Math.random() * 20) : undefined
      };
      setHistory(prev => [newVersion, ...prev.slice(0, 49)]); // Keep last 50

      // Auto-improve feature
      if (autoImprove && iterations < 3) {
        setTimeout(() => {
          setInput(optimized);
          setIterations(prev => prev + 1);
        }, 2000);
      } else {
        setIterations(1);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(message);
      setStatus(AppStatus.ERROR);
      console.error('Optimization error:', error);
    }
  };

  const handleCopy = useCallback(() => {
    if (!output) return;
    
    navigator.clipboard.writeText(output).then(() => {
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    }).catch((err) => {
      console.error('Failed to copy:', err);
      setErrorMessage('Failed to copy to clipboard');
    });
  }, [output]);

  const handleExport = () => {
    try {
      const data = {
        input,
        output,
        analysis,
        mode: optimizationMode,
        targetAI,
        timestamp: new Date().toISOString(),
        history
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `promptbridge-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      setErrorMessage('Failed to export data');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.input) setInput(data.input);
        if (data.output) setOutput(data.output);
        if (data.history && Array.isArray(data.history)) {
          setHistory(data.history);
        }
        if (data.mode) setOptimizationMode(data.mode);
        if (data.targetAI) setTargetAI(data.targetAI);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Import failed:', error);
        setErrorMessage('Failed to import: Invalid file format');
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read file');
    };
    reader.readAsText(file);
  };

  const loadTemplate = (template: Template) => {
    setInput(template.template);
    setShowTemplates(false);
  };

  const restoreVersion = (version: PromptVersion) => {
    setInput(version.input);
    setOutput(version.output);
    setShowHistory(false);
    setStatus(AppStatus.SUCCESS);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && input.trim() && status !== AppStatus.LOADING) {
      e.preventDefault();
      optimizePromptWithAI();
    }
  };

  const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className={`font-medium ${color}`}>{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          role="progressbar"
          aria-valuenow={Math.round(value)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${Math.round(value)}%`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PromptBridge Pro
              </h1>
              <p className="text-sm text-slate-400">AI-Powered Prompt Optimization Suite</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative"
              title="History"
              aria-label={`${showHistory ? 'Hide' : 'Show'} history`}
            >
              <History className="w-5 h-5" aria-hidden="true" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>
            <button
              onClick={handleExport}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Export"
              aria-label="Export data"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
            </button>
            <label className="p-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Import" aria-label="Import data">
              <Upload className="w-5 h-5" aria-hidden="true" />
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".json" 
                onChange={handleImport} 
                className="hidden" 
                aria-label="Import JSON file"
              />
            </label>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-800 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-400 mb-2 block">Optimization Mode</label>
              <div className="grid grid-cols-4 gap-2">
                {(['balanced', 'creative', 'precise', 'coding'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setOptimizationMode(mode)}
                    className={`px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                      optimizationMode === mode
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    aria-pressed={optimizationMode === mode}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-400 mb-2 block">Target AI</label>
              <div className="grid grid-cols-4 gap-2">
                {(['general', 'chatgpt', 'claude', 'gemini'] as const).map(ai => (
                  <button
                    key={ai}
                    onClick={() => setTargetAI(ai)}
                    className={`px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                      targetAI === ai
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    aria-pressed={targetAI === ai}
                  >
                    {ai}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoImprove}
                onChange={(e) => setAutoImprove(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
                aria-label="Enable auto-improve"
              />
              <span className="text-sm text-slate-300">Auto-Improve (3 iterations)</span>
            </label>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
              aria-label="Show templates"
            >
              <Lightbulb className="w-4 h-4" aria-hidden="true" />
              Templates
            </button>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto mb-4 p-4 bg-red-900/20 border border-red-800/50 rounded-lg flex items-center justify-between">
          <span className="text-red-400 text-sm">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-300"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowTemplates(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Templates"
        >
          <div 
            className="bg-slate-900 rounded-xl border border-slate-800 max-w-3xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900">
              <h2 className="text-xl font-bold">Prompt Templates</h2>
              <button 
                onClick={() => setShowTemplates(false)} 
                className="text-slate-400 hover:text-white"
                aria-label="Close templates"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => loadTemplate(template)}
                  className="text-left p-4 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-blue-500 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden="true">{template.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{template.name}</h3>
                      <p className="text-xs text-slate-400 mb-2">{template.category}</p>
                      <p className="text-sm text-slate-500 line-clamp-2">{template.template}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Sidebar */}
      {showHistory && (
        <div className="fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-800 p-6 overflow-auto z-40 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">History</h2>
            <button 
              onClick={() => setShowHistory(false)} 
              className="text-slate-400 hover:text-white"
              aria-label="Close history"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {history.map(version => (
              <button
                key={version.id}
                onClick={() => restoreVersion(version)}
                className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-blue-500 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">
                    {new Date(version.timestamp).toLocaleTimeString()}
                  </span>
                  {version.score && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                      {version.score}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 line-clamp-2">{version.input}</p>
              </button>
            ))}
            {history.length === 0 && (
              <p className="text-center text-slate-500 py-8">No history yet</p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                <h2 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" aria-hidden="true" />
                  Your Input
                </h2>
                <span className="text-xs text-slate-500">{input.length} chars</span>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you need... Be as detailed or as rough as you want. PromptBridge will structure it perfectly.

Example: 'need python code to read csv file and make graphs showing sales trends by month also save the graphs as png files'

💡 Tip: Press Ctrl+Enter to optimize"
                className="w-full h-64 bg-slate-900 text-slate-100 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm"
                aria-label="Input prompt"
              />
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                <h2 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" aria-hidden="true" />
                  Optimized Output
                </h2>
                <div className="flex gap-2">
                  {output && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors"
                      aria-label={copyStatus ? 'Copied to clipboard' : 'Copy to clipboard'}
                    >
                      {copyStatus ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                      {copyStatus ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={output}
                  readOnly
                  placeholder="Your optimized prompt will appear here..."
                  className="w-full h-64 bg-slate-900 text-slate-100 p-4 resize-none focus:outline-none font-mono text-sm"
                  aria-label="Optimized output"
                />
                {status === AppStatus.LOADING && (
                  <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" aria-hidden="true" />
                      <p className="text-sm text-slate-400">Optimizing your prompt...</p>
                      {autoImprove && <p className="text-xs text-slate-500 mt-1">Iteration {iterations}/3</p>}
                    </div>
                  </div>
                )}
                {status === AppStatus.ERROR && (
                  <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center text-red-400">
                      <p className="text-sm font-medium">Optimization failed</p>
                      <p className="text-xs mt-1">{errorMessage || 'Unknown error'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={optimizePromptWithAI}
              disabled={!input.trim() || status === AppStatus.LOADING}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:hover:shadow-lg"
              aria-label={status === AppStatus.LOADING ? 'Optimizing...' : 'Optimize prompt'}
            >
              <Wand2 className="w-5 h-5" aria-hidden="true" />
              {status === AppStatus.LOADING ? 'Optimizing...' : 'Optimize Prompt'}
            </Button>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* Real-time Analysis */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-green-400" aria-hidden="true" />
                Prompt Quality Analysis
              </h3>
              {analysis ? (
                <div className="space-y-4">
                  <ScoreBar label="Clarity" value={analysis.clarity} color="text-blue-400" />
                  <ScoreBar label="Specificity" value={analysis.specificity} color="text-purple-400" />
                  <ScoreBar label="Structure" value={analysis.structure} color="text-green-400" />
                  <ScoreBar label="Completeness" value={analysis.completeness} color="text-yellow-400" />
                  
                  {analysis.suggestions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <h4 className="text-sm font-semibold mb-2 text-slate-300">Suggestions:</h4>
                      <ul className="space-y-2">
                        {analysis.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                            <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-400" aria-hidden="true" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">Start typing to see analysis...</p>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-800/30 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1" aria-hidden="true">•</span>
                  <span>Use templates for common tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1" aria-hidden="true">•</span>
                  <span>Enable auto-improve for iterative refinement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1" aria-hidden="true">•</span>
                  <span>Choose target AI for optimized results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1" aria-hidden="true">•</span>
                  <span>Export your best prompts for reuse</span>
                </li>
              </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                <div className="text-2xl font-bold text-blue-400">{history.length}</div>
                <div className="text-xs text-slate-400">Prompts Optimized</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                <div className="text-2xl font-bold text-purple-400">
                  {history.length > 0 ? Math.round(history.reduce((acc, h) => acc + (h.score || 0), 0) / history.length) : 0}%
                </div>
                <div className="text-xs text-slate-400">Avg Quality Score</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PromptBridgeEnhanced;

