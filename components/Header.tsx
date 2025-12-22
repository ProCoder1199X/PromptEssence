import React from 'react';
import { APP_TITLE } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 bg-gray-800 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-white">PE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {APP_TITLE.replace(' ⚡', '')}
            <span className="text-blue-400 ml-1">⚡</span>
          </h1>
        </div>
        <nav className="flex gap-4 text-gray-300">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
