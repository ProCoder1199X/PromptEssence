import React from 'react';
import Header from './components/Header';
import PromptEditor from './components/PromptEditor';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans selection:bg-accent/30 selection:text-white overflow-x-hidden">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Header />
      <PromptEditor />
    </div>
  );
};

export default App;
