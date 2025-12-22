import React from 'react';
import PromptBridgeEnhanced from './components/PromptBridgeEnhanced';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      <PromptBridgeEnhanced />
    </div>
  );
};

export default App;
