import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserCircleIcon, BellIcon } from '@heroicons/react/24/outline';
import KeyIcon from '@heroicons/react/24/outline/KeyIcon';
import CogIcon from '@heroicons/react/24/outline/CogIcon';
import ChangePasswordModal from '@/components/profile/ChangePasswordModal';
import NotificationSettingsModal from '@/components/profile/NotificationSettingsModal';
import AccountSettingsModal from '@/components/profile/AccountSettingsModal';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    role: user?.role || '',
    department: user?.department || '',
  });

  // États pour les modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la mise à jour du profil avec le backend
    console.log('Mise à jour du profil:', formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'finance':
        return 'Agent Financier';
      case 'recettes_agent':
        return 'Agent des Recettes';
      case 'depenses_agent':
        return 'Agent des Dépenses';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* En-tête du profil */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-lg px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                <UserCircleIcon className="h-20 w-20 text-gray-400" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user?.fullName}</h1>
                <p className="text-green-100">{getRoleName(user?.role || '')}</p>
                <p className="text-green-100">{user?.department}</p>
              </div>
            </div>
          </div>

          {/* Contenu du profil */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Informations personnelles */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Informations Personnelles
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        {isEditing ? 'Annuler' : 'Modifier'}
                      </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          id="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                          Département
                        </label>
                        <input
                          type="text"
                          name="department"
                          id="department"
                          value={formData.department}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Rôle
                        </label>
                        <input
                          type="text"
                          name="role"
                          id="role"
                          value={getRoleName(formData.role)}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                        />
                      </div>

                      {isEditing && (
                        <div className="flex justify-end mt-4">
                          <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Enregistrer les modifications
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <KeyIcon className="h-5 w-5 mr-3 text-gray-400" />
                      Changer le mot de passe
                    </button>
                    <button
                      onClick={() => setIsNotificationModalOpen(true)}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <BellIcon className="h-5 w-5 mr-3 text-gray-400" />
                      Préférences de notification
                    </button>
                    <button
                      onClick={() => setIsAccountSettingsModalOpen(true)}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <CogIcon className="h-5 w-5 mr-3 text-gray-400" />
                      Paramètres du compte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
      <AccountSettingsModal
        isOpen={isAccountSettingsModalOpen}
        onClose={() => setIsAccountSettingsModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
