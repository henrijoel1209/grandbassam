import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Finances from '@/pages/Finances';
import Recettes from '@/pages/Recettes';
import Depenses from '@/pages/Depenses';
import UserManagement from '@/pages/UserManagement';

// Pages


const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout><Navigate to="/finances" replace /></Layout>} />
      <Route path="/finances" element={<Layout><Finances /></Layout>} />
      <Route path="/recettes" element={<Layout><Recettes /></Layout>} />
      <Route path="/depenses" element={<Layout><Depenses /></Layout>} />
      <Route path="/user-management" element={<Layout><UserManagement /></Layout>} />
      <Route path="*" element={<Layout><Navigate to="/finances" replace /></Layout>} />
    </Routes>
  );
};

export default AppRoutes;
