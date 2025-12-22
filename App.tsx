import React from 'react';
import PromptBridgeEnhanced from './components/PromptBridgeEnhanced';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full font-sans bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PromptBridgeEnhanced />
      </main>
      <footer className="w-full py-4 text-center text-sm text-gray-500 border-t border-gray-700">
        © 2025 PromptEssence. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
