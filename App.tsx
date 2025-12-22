import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, Copy, Check, History, Wand2, Zap, RefreshCw, Download, Upload, Target, Lightbulb, TrendingUp, Code, FileText, Image, BarChart } from 'lucide-react';

// Types
enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

interface PromptVersion {
  id: string;
  input: string;
  output: string;
  timestamp: number;
  score?: number;
}

interface PromptAnalysis {
  clarity: number;
  specificity: number;
  structure: number;
  completeness: number;
  suggestions: string[];
}

interface Template {
  id: string;
  name: string;
  icon: string;
  category: string;
  template: string;
}

const PromptEssenceEnhanced = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [copyStatus, setCopyStatus] = useState(false);
  const [history, setHistory] = useState<PromptVersion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [optimizationMode, setOptimizationMode] = useState<'balanced' | 'creative' | 'precise' | 'coding'>('balanced');
  const [targetAI, setTargetAI] = useState<'general' | 'chatgpt' | 'claude' | 'gemini'>('general');
  const [showTemplates, setShowTemplates] = useState(false);
  const [autoImprove, setAutoImprove] = useState(false);
  const [iterations, setIterations] = useState(1);

  const templates: Template[] = [
    { id: '1', name: 'Code Generation', icon: '💻', category: 'Development', template: 'Create a [language] script that [functionality]. Requirements:\n- [requirement 1]\n- [requirement 2]\nConstraints: [constraints]' },
    { id: '2', name: 'Data Analysis', icon: '📊', category: 'Analysis', template: 'Analyze the following data: [data description]\nFocus on: [key metrics]\nProvide insights on: [analysis goals]' },
    { id: '3', name: 'Content Writing', icon: '✍️', category: 'Writing', template: 'Write a [type] about [topic]\nTone: [tone]\nLength: [length]\nKey points to cover: [points]' },
    { id: '4', name: 'Problem Solving', icon: '🧩', category: 'Strategy', template: 'I need to solve: [problem]\nConstraints: [constraints]\nDesired outcome: [outcome]\nPlease provide step-by-step solutions.' },
    { id: '5', name: 'Learning Path', icon: '🎓', category: 'Education', template: 'Create a learning roadmap for: [skill/topic]\nCurrent level: [beginner/intermediate/advanced]\nTime available: [timeframe]\nGoal: [end goal]' },
    { id: '6', name: 'Brainstorming', icon: '💡', category: 'Creative', template: 'Generate innovative ideas for: [topic]\nContext: [context]\nTarget audience: [audience]\nConstraints: [constraints]' },
  ];

  // Simulate prompt analysis
  const analyzePrompt = useCallback((text: string): PromptAnalysis => {
    const words = text.split(/\s+/).length;
    const hasQuestions = text.includes('?');
    const hasConstraints = /constraint|requirement|must|should|need/i.test(text);
    const hasContext = words > 20;
    const hasStructure = text.includes('\n') || text.includes('-') || text.includes('1.');

    const clarity = Math.min(100, (words / 50) * 100);
    const specificity = (hasQuestions ? 20 : 0) + (hasConstraints ? 30 : 0) + (hasContext ? 30 : 0);
    const structure = hasStructure ? 80 : 40;
    const completeness = (clarity + specificity + structure) / 3;

    const suggestions = [];
    if (clarity < 50) suggestions.push('Add more detail to your request');
    if (!hasConstraints) suggestions.push('Specify constraints or requirements');
    if (!hasStructure) suggestions.push('Use bullet points or numbered lists for clarity');
    if (words < 10) suggestions.push('Provide more context about what you need');

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

  const optimizePrompt = async () => {
    if (!input.trim()) return;

    setStatus(AppStatus.LOADING);

    try {
      // Simulate API call with different optimization modes
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      const modeInstructions = {
        balanced: 'Create a well-structured, clear prompt that balances detail with conciseness.',
        creative: 'Optimize for creative, exploratory responses with room for interpretation.',
        precise: 'Create a highly specific, deterministic prompt with clear constraints.',
        coding: 'Structure as a technical specification with clear requirements and edge cases.'
      };

      const aiInstructions = {
        general: '',
        chatgpt: '\n\nOptimized for ChatGPT\'s conversational style and context handling.',
        claude: '\n\nOptimized for Claude\'s analytical depth and structured reasoning.',
        gemini: '\n\nOptimized for Gemini\'s multimodal capabilities and creative problem-solving.'
      };

      // Simulated optimization
      let optimized = `# Optimized Prompt (${optimizationMode} mode)\n\n`;
      optimized += `## Objective\n${input.split('.')[0] || input.substring(0, 100)}...\n\n`;
      optimized += `## Requirements\n`;
      optimized += `- Clear, actionable output\n`;
      optimized += `- Structured response format\n`;
      optimized += `- Consideration of edge cases\n\n`;
      optimized += `## Context\n${input}\n\n`;
      optimized += `## Expected Output\n[Specify format, length, and key elements needed]\n\n`;
      optimized += `${modeInstructions[optimizationMode]}${aiInstructions[targetAI]}`;

      setOutput(optimized);
      setStatus(AppStatus.SUCCESS);

      // Save to history
      const newVersion: PromptVersion = {
        id: Date.now().toString(),
        input,
        output: optimized,
        timestamp: Date.now(),
        score: Math.round((analysis?.completeness || 50) + Math.random() * 30)
      };
      setHistory(prev => [newVersion, ...prev.slice(0, 9)]);

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
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans selection:bg-accent/30 selection:text-white overflow-x-hidden">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Header />
      <PromptEditor />
    </div>
  );
};

export default PromptEssenceEnhanced;
