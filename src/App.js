import React, { useState } from 'react';
import { FormProvider } from './context/FormContext.js';
import Dashboard from './pages/Dashboard.js';
import Forms from './pages/Forms.js';
import FormBuilder from './pages/FormBuilder.js';
import Submissions from './pages/Submissions.js';
import Analytics from './pages/Analytics.js';
import Profile from './pages/Profile.js';
import Settings from './pages/Settings.js';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/dashboard');

  const handleNavigate = (path) => {
    setCurrentPath(path);
  };

  const renderScreen = () => {
    switch (currentPath) {
      case '/builder':
        return <FormBuilder onBack={() => setCurrentPath('/dashboard')} />;
      case '/forms':
        return <Forms onNavigate={handleNavigate} onCreateForm={() => setCurrentPath('/builder')} />;
      case '/submissions':
        return <Submissions onNavigate={handleNavigate} onCreateForm={() => setCurrentPath('/builder')} />;
      case '/analytics':
        return <Analytics onNavigate={handleNavigate} onCreateForm={() => setCurrentPath('/builder')} />;
      case '/profile':
        return <Profile onNavigate={handleNavigate} onCreateForm={() => setCurrentPath('/builder')} />;
      case '/settings':
        return <Settings onNavigate={handleNavigate} onCreateForm={() => setCurrentPath('/builder')} />;
      case '/dashboard':
      default:
        return <Dashboard onNavigate={handleNavigate} onCreateForm={() => setCurrentPath('/builder')} />;
    }
  };

  return (
    <FormProvider>
      {renderScreen()}
    </FormProvider>
  );
}
