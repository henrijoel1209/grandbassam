import { useState } from 'react';
import { Role, User } from '@/types/auth';

// Liste des utilisateurs valides (à remplacer par une API réelle)
const VALID_USERS = [
  {
    id: '1',
    email: 'admin@grandbassam.ci',
    password: 'admin123', // Dans une vraie application, les mots de passe seraient hachés
    username: 'admin',
    role: 'admin' as Role,
    fullName: 'Administrateur',
    department: 'Administration',
    lastLogin: new Date(),
  },
  {
    id: '2',
    email: 'finance@grandbassam.ci',
    password: 'finance123',
    username: 'finance',
    role: 'finance' as Role,
    fullName: 'Agent Financier',
    department: 'Finance',
    lastLogin: new Date(),
  },
];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Trouver l'utilisateur correspondant
    const foundUser = VALID_USERS.find(u => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Créer un token (dans une vraie application, ceci serait fait côté serveur)
    const token = btoa(`${email}:${new Date().getTime()}`);

    // Mettre à jour le stockage local
    const { password: _, ...userWithoutPassword } = foundUser;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('token', token);

    // Mettre à jour l'état
    setUser(userWithoutPassword);
    setToken(token);

    return { user: userWithoutPassword, token };
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = (): boolean => {
    return !!user && !!token;
  };

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated,
  };
};
