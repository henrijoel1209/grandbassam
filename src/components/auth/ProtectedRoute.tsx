import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/auth';
import Layout from '../layout/Layout';

interface ProtectedRouteProps {
  requiredRole?: Role | Role[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Rediriger vers la page de connexion si non authentifié
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasPermission = user.role === 'admin' || roles.includes(user.role);

    if (!hasPermission) {
      // Rediriger vers la page non autorisée si l'utilisateur n'a pas le rôle requis
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Envelopper le contenu dans le Layout pour avoir la navigation
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
