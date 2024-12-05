import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import NotificationProvider from '@/contexts/NotificationContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Loading from '@/components/common/Loading';
import Navbar from '@/components/layout/Navbar';

// Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import UserManagement from '@/pages/UserManagement';
import Unauthorized from '@/pages/Unauthorized';
import Recettes from '@/pages/Recettes';
import Depenses from '@/pages/Depenses';
import Profile from '@/pages/Profile';
import Welcome from '@/pages/Welcome';
import Fournisseurs from '@/pages/Fournisseurs';
import Budget from '@/pages/Budget';
import NotFound from '@/pages/NotFound';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          {!isLoginPage && <Navbar />}
          <main className={`container mx-auto px-4 ${isLoginPage ? '' : 'py-8'}`}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
              <Route path="/recettes" element={<ProtectedRoute requiredRole={['admin', 'finance_manager', 'recettes_agent']}><Recettes /></ProtectedRoute>} />
              <Route path="/depenses" element={<ProtectedRoute requiredRole={['admin', 'finance_manager', 'depenses_agent']}><Depenses /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/fournisseurs" element={<ProtectedRoute requiredRole={['admin', 'finance_manager']}><Fournisseurs /></ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute requiredRole={['admin', 'finance_manager']}><Budget /></ProtectedRoute>} />
              
              {/* 404 and fallback routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
};

const App: React.FC = () => (
  <Router>
    <Suspense fallback={<Loading />}>
      <AppContent />
    </Suspense>
  </Router>
);

export default App;