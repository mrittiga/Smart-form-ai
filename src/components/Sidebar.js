import React from 'react';
import { 
  X, LayoutDashboard, FileText, CheckSquare, 
  BarChart3, User, Settings, LogOut 
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, currentPath, onNavigate }) {
  if (!isOpen) return null;

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Forms', icon: FileText, path: '/forms' },
    { name: 'Submissions', icon: CheckSquare, path: '/submissions' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-72 bg-[#250d20] h-full p-5 flex flex-col justify-between z-10 shadow-2xl border-r border-pink-950/40">
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={onClose} className="text-pink-300 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    onNavigate(item.path);
                    onClose();
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive 
                      ? 'bg-pink-600/30 text-pink-300 border-r-4 border-pink-500' 
                      : 'text-pink-200/80 hover:bg-pink-950/40 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <div className="bg-[#33142c] p-3 rounded-xl flex items-center space-x-3 border border-pink-900/30">
            <div className="w-10 h-10 rounded-lg bg-pink-900/60 flex items-center justify-center font-bold text-white">
              M
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">Mrittiga M</p>
              <p className="text-xs text-pink-300/70 truncate">mrittigam@gmail.com</p>
            </div>
          </div>

          <button className="w-full flex items-center justify-center space-x-2 py-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-200 rounded-xl text-sm font-medium transition border border-red-900/40">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
