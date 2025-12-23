import React from 'react';
import PromptBridgeEnhanced from './components/PromptBridgeEnhanced';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full font-sans bg-background text-white overflow-x-hidden selection:bg-accent/30 selection:text-accent">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background pointer-events-none" />
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <PromptBridgeEnhanced />
      </main>
      <footer className="w-full py-6 text-center text-sm text-slate-500 border-t border-white/5 relative z-10">
        <p>© 2025 PromptEssence. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
