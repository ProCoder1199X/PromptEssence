import React from 'react';
import { Sparkles, Zap, LayoutTemplate, History } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full py-4 px-6 sticky top-0 z-50 glass-panel border-b border-white/5 backdrop-blur-xl bg-background/70"
    >
      <div className="container mx-auto flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20 group-hover:rotate-6 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-accent transition-all">
              Prompt<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-tertiary">Essence</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">AI Optimization Suite</span>
          </div>
        </motion.div>

        <nav className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
          {[
            { name: 'Editor', icon: Zap },
            { name: 'Templates', icon: LayoutTemplate },
            { name: 'History', icon: History }
          ].map((item, index) => (
            <motion.button
              key={item.name}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-1.5 text-sm font-medium rounded-full flex items-center gap-2 transition-colors ${index === 0 ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white'}`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </motion.button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="h-6 w-px bg-white/10" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 flex items-center justify-center border border-white/10 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-green-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] z-10" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
