import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Sparkles, Copy, Check, History, Wand2, Zap, RefreshCw, Download, Upload, Target, Lightbulb, TrendingUp, BarChart, X, ChevronRight, Settings2 } from 'lucide-react';
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

  useEffect(() => {
    try {
      localStorage.setItem('promptbridge_history', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('promptbridge_mode', optimizationMode);
      localStorage.setItem('promptbridge_target', targetAI);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [optimizationMode, targetAI]);

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
      const configBlock = `[[CONFIG]]
mode: ${optimizationMode}
target_model: ${targetAI}
[[/CONFIG]]

${input}`;

      const optimized = await optimizePrompt(configBlock);

      setOutput(optimized);
      setStatus(AppStatus.SUCCESS);

      const newVersion: PromptVersion = {
        id: Date.now().toString(),
        input,
        output: optimized,
        timestamp: Date.now(),
        score: analysis ? Math.round(analysis.completeness + Math.random() * 20) : undefined
      };
      setHistory(prev => [newVersion, ...prev.slice(0, 49)]);

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
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-400">{label}</span>
        <span className={color}>{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-out ${color.replace('text-', 'bg-')}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Input/Output Area */}
      <div className="lg:col-span-8 space-y-6">
        {/* Input Section */}
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h2 className="font-semibold flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-accent" />
              Input Prompt
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono">{input.length} chars</span>
              <div className="h-4 w-px bg-white/10" />
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                Templates
              </button>
            </div>
          </div>
          <div className="flex-1 relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you need optimized..."
              className="w-full h-full bg-transparent text-slate-200 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed placeholder:text-slate-600"
            />
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-slate-500 bg-black/50 px-2 py-1 rounded border border-white/5">
                Ctrl + Enter to optimize
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-4">
          <Button
            onClick={optimizePromptWithAI}
            disabled={!input.trim() || status === AppStatus.LOADING}
            className="flex-1 py-4 text-base shadow-xl shadow-accent/20"
            isLoading={status === AppStatus.LOADING}
            icon={<Wand2 className="w-5 h-5" />}
          >
            {status === AppStatus.LOADING ? 'Optimizing...' : 'Optimize Prompt'}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowHistory(!showHistory)}
              icon={<History className="w-5 h-5" />}
              title="History"
            />
            <Button
              variant="secondary"
              onClick={handleExport}
              icon={<Download className="w-5 h-5" />}
              title="Export"
            />
            <label className="cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white">
                <Upload className="w-5 h-5" />
              </div>
            </label>
          </div>
        </div>

        {/* Output Section */}
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[400px] relative">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h2 className="font-semibold flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Optimized Result
            </h2>
            {output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className={copyStatus ? 'text-green-400' : ''}
                icon={copyStatus ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copyStatus ? 'Copied!' : 'Copy'}
              </Button>
            )}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={output}
              readOnly
              placeholder="AI optimized output will appear here..."
              className="w-full h-full bg-transparent text-slate-200 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed placeholder:text-slate-600"
            />

            {status === AppStatus.LOADING && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center space-y-3">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-accent animate-spin" />
                    <div className="absolute inset-4 rounded-full bg-accent/20 blur-sm" />
                  </div>
                  <p className="text-sm font-medium text-accent animate-pulse">Optimizing...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        {/* Controls */}
        <div className="glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-300">
            <Settings2 className="w-4 h-4" />
            Configuration
          </div>

          <div className="space-y-3">
            <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Optimization Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {(['balanced', 'creative', 'precise', 'coding'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setOptimizationMode(mode)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${optimizationMode === mode
                      ? 'bg-accent/10 border-accent text-accent shadow-[0_0_10px_rgba(45,125,255,0.2)]'
                      : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-slate-200'
                    }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Target Model</label>
            <div className="grid grid-cols-2 gap-2">
              {(['general', 'chatgpt', 'claude', 'gemini'] as const).map(ai => (
                <button
                  key={ai}
                  onClick={() => setTargetAI(ai)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${targetAI === ai
                      ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                      : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-slate-200'
                    }`}
                >
                  {ai.charAt(0).toUpperCase() + ai.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Auto-Improve</span>
              <div className={`w-10 h-5 rounded-full transition-colors relative ${autoImprove ? 'bg-accent' : 'bg-white/10'}`}>
                <input
                  type="checkbox"
                  checked={autoImprove}
                  onChange={(e) => setAutoImprove(e.target.checked)}
                  className="hidden"
                />
                <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${autoImprove ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>
        </div>

        {/* Analysis */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-slate-300">
            <BarChart className="w-4 h-4" />
            Quality Analysis
          </div>

          {analysis ? (
            <div className="space-y-5">
              <ScoreBar label="Clarity" value={analysis.clarity} color="text-blue-400" />
              <ScoreBar label="Specificity" value={analysis.specificity} color="text-purple-400" />
              <ScoreBar label="Structure" value={analysis.structure} color="text-green-400" />
              <ScoreBar label="Completeness" value={analysis.completeness} color="text-yellow-400" />

              {analysis.suggestions.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/5">
                  <h4 className="text-xs font-semibold mb-3 text-slate-400 uppercase tracking-wider">Suggestions</h4>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                        <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0 text-accent" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              <p>Type at least 10 characters to see analysis...</p>
            </div>
          )}
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTemplates(false)}>
          <div className="glass-panel rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-lg font-bold">Prompt Templates</h2>
              <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => loadTemplate(template)}
                  className="text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-accent transition-colors">{template.name}</h3>
                      <p className="text-xs text-slate-500 mb-2">{template.category}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 font-mono bg-black/20 p-2 rounded">{template.template}</p>
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
        <div className="fixed inset-y-0 right-0 w-80 bg-[#0A0A0A] border-l border-white/10 p-6 overflow-y-auto z-50 shadow-2xl transform transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">History</h2>
            <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {history.map(version => (
              <button
                key={version.id}
                onClick={() => restoreVersion(version)}
                className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">
                    {new Date(version.timestamp).toLocaleTimeString()}
                  </span>
                  {version.score && (
                    <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                      {version.score}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 font-mono">{version.input}</p>
              </button>
            ))}
            {history.length === 0 && (
              <p className="text-center text-slate-500 py-8 text-sm">No history yet</p>
            )}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-4 right-4 max-w-md bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-slide-up z-50">
          <X className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{errorMessage}</p>
          <button onClick={() => setErrorMessage(null)} className="ml-auto hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PromptBridgeEnhanced;
