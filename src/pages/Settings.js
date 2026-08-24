import React, { useState } from 'react';
import Layout from '../components/Layout.js';
import { Bell, Lock, Moon, X } from 'lucide-react';

export default function Settings({ onNavigate, onCreateForm }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [passwordNotice, setPasswordNotice] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new) return;
    setPasswordNotice('Password successfully updated!');
    setTimeout(() => {
      setPasswordNotice('');
      setShowPasswordModal(false);
      setPasswords({ current: '', new: '' });
    }, 1200);
  };

  return (
    <Layout currentPath="/settings" onNavigate={onNavigate} onCreateForm={onCreateForm}>
      <h1 className="text-pink-100 text-lg font-medium mb-6">Manage your preferences and application settings</h1>

      <div className="space-y-4">
        <div className="bg-[#291024] border border-pink-950/70 p-6 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-pink-400" />
            <div>
              <p className="text-sm font-semibold text-white">Email Notifications</p>
              <p className="text-xs text-pink-300/60">Receive email updates when a form is submitted</p>
            </div>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full p-1 transition ${notifications ? 'bg-pink-600' : 'bg-pink-950'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="bg-[#291024] border border-pink-950/70 p-6 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Moon className="w-5 h-5 text-pink-400" />
            <div>
              <p className="text-sm font-semibold text-white">Pinkish Dark Theme</p>
              <p className="text-xs text-pink-300/60">Enable dark rose accent background mode</p>
            </div>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full p-1 transition ${darkMode ? 'bg-pink-600' : 'bg-pink-950'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="bg-[#291024] border border-pink-950/70 p-6 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-pink-400" />
            <div>
              <p className="text-sm font-semibold text-white">Password & Security</p>
              <p className="text-xs text-pink-300/60">Update your account password</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="text-xs bg-pink-950 hover:bg-pink-900 border border-pink-800/40 px-3 py-1.5 rounded-lg text-pink-300 font-semibold transition"
          >
            Change
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#250d20] border border-pink-900/60 p-6 rounded-2xl w-full max-w-sm relative">
            <button 
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-pink-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-4">Change Password</h3>
            
            {passwordNotice ? (
              <p className="text-xs text-pink-400 py-4 text-center">{passwordNotice}</p>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-pink-300/80 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full bg-[#180814] text-sm text-white p-2.5 rounded-xl border border-pink-950 focus:border-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-pink-300/80 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full bg-[#180814] text-sm text-white p-2.5 rounded-xl border border-pink-950 focus:border-pink-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-semibold transition mt-2"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
