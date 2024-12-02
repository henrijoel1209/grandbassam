export type Role = 'admin' | 'finance_manager' | 'recettes_agent' | 'depenses_agent' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  fullName: string;
  department: string;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const ROLES_PERMISSIONS = {
  admin: ['all'],
  finance_manager: ['view_all', 'edit_all', 'approve_transactions'],
  recettes_agent: ['view_recettes', 'edit_recettes'],
  depenses_agent: ['view_depenses', 'edit_depenses'],
  viewer: ['view_all']
} as const;
