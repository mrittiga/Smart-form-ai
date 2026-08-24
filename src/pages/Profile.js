import React, { useState } from 'react';
import Layout from '../components/Layout.js';
import { Mail, User, Check, X, Calendar } from 'lucide-react';

export default function Profile({ onNavigate, onCreateForm }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Mrittiga M',
    email: 'mrittigam@gmail.com',
    createdAt: 'January 2025'
  });

  const [formData, setFormData] = useState({ ...profile });

  const handleSave = (e) => {
    e.preventDefault();
    setProfile({ ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  const initial = profile.name.trim() ? profile.name.trim().charAt(0).toUpperCase() : 'U';

  return (
    <Layout currentPath="/profile" onNavigate={onNavigate} onCreateForm={onCreateForm}>
      <h1 className="text-pink-100 text-lg font-medium mb-6">Manage your account information</h1>

      <div className="space-y-4 max-w-lg">
        {/* Main Card */}
        <div className="bg-[#291024] border border-pink-950/70 p-6 rounded-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-pink-950/80 border border-pink-800/40 text-pink-300 font-bold text-2xl flex items-center justify-center mb-4">
            {initial}
          </div>

          {!isEditing ? (
            <>
              <h2 className="text-xl font-bold text-white mb-1">{profile.name}</h2>
              <div className="flex items-center space-x-1.5 text-xs text-pink-300/80 mb-6">
                <Mail className="w-3.5 h-3.5 text-pink-400" />
                <span>{profile.email}</span>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-6 py-2 bg-[#180814] hover:bg-pink-950 text-pink-300 border border-pink-800/40 rounded-xl text-xs font-semibold transition"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSave} className="w-full space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold text-pink-200 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-pink-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#180814] text-sm text-white pl-9 pr-3 py-2.5 rounded-xl border border-pink-950 focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-pink-200 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-pink-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#180814] text-sm text-white pl-9 pr-3 py-2.5 rounded-xl border border-pink-950 focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-1 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-semibold transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center space-x-1 py-2.5 bg-pink-950/80 hover:bg-pink-900/60 text-pink-300 rounded-xl text-xs font-semibold border border-pink-800/40 transition"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Details Card */}
        <div className="bg-[#291024] border border-pink-950/70 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-pink-400">Account Information</h3>

          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-pink-300/60 uppercase">Email Address</p>
              <p className="text-xs text-white mt-0.5">{profile.email}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-wider text-pink-300/60 uppercase">Account Created</p>
              <div className="flex items-center space-x-1.5 text-xs text-white mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                <span>{profile.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
