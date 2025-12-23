import React from 'react';
import PromptEssence from './components/PromptEssence';
import Header from './components/Header';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <PromptEssence />
      </main>
      <footer className="w-full py-6 text-center text-sm text-slate-500 border-t border-white/5 relative z-10 glass-panel mt-12 bg-background/50">
        <p>© 2025 PromptEssence. All rights reserved.</p>
      </footer>
    </Layout>
  );
};

export default App;
