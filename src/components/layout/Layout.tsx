import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login' && 
                    location.pathname !== '/forgot-password' && 
                    location.pathname !== '/reset-password';

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <div className="flex">
        <main className={`flex-1 ${showNavbar ? 'pt-16' : ''} min-h-screen`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
