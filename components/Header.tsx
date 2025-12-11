import React from 'react';
import { APP_TITLE } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="w-full py-8 px-6 flex flex-col items-center justify-center relative z-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        {/* Logo Placeholder */}
        <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
          <span className="text-xl font-bold text-white">PB</span>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {APP_TITLE.replace(' ⚡', '')}
          <span className="text-accent ml-1">⚡</span>
        </h1>
      </div>
      
      <p className="text-slate-400 text-sm font-medium tracking-wide uppercase opacity-80 mt-1">
        AI understands you now.
      </p>
    </header>
  );
};

export default Header;
