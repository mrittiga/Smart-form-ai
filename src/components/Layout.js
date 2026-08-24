import React, { useState } from 'react';
import { Menu, Plus } from 'lucide-react';
import Sidebar from './Sidebar.js';

export default function Layout({ children, currentPath, onNavigate, onCreateForm }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#180814] text-pink-50 flex flex-col font-sans">
      <header className="flex items-center justify-between px-6 py-4 border-b border-pink-950/60 bg-[#200b1b]/80 backdrop-blur-md">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="text-pink-200 hover:text-white focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3">
          <button 
            onClick={onCreateForm}
            className="flex items-center space-x-1.5 bg-pink-600 hover:bg-pink-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-lg shadow-pink-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Form</span>
          </button>

          <div className="w-8 h-8 rounded-full bg-pink-900/60 flex items-center justify-center text-sm font-semibold text-pink-100 border border-pink-700/40">
            U
          </div>
        </div>
      </header>

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentPath={currentPath}
        onNavigate={onNavigate}
      />

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
