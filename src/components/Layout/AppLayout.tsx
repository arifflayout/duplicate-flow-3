import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';

interface AppLayoutProps {
  currentView: string;
  onViewChange: (view: string) => void;
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ currentView, onViewChange, children }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar currentView={currentView} onViewChange={onViewChange} />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-surface-50">
          {children}
        </main>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation currentView={currentView} onViewChange={onViewChange} />
    </div>
  );
};

export default AppLayout;