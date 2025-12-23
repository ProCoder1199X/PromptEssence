import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 sticky top-0 z-50 glass-panel border-b border-white/5">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-accent blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-accent transition-colors">
              PromptBridge
              <span className="text-accent ml-1">Pro</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">AI Optimization Suite</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
          {['Editor', 'Templates', 'History'].map((item) => (
            <button
              key={item}
              className="px-4 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="h-8 w-px bg-white/10 mx-2" />
          <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5">
            <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
