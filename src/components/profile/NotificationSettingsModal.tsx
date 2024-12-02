import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'transactions',
      label: 'Notifications de transactions',
      description: 'Recevoir des notifications pour les nouvelles transactions',
      enabled: true,
    },
    {
      id: 'reports',
      label: 'Rapports financiers',
      description: 'Recevoir des notifications pour les nouveaux rapports',
      enabled: true,
    },
    {
      id: 'updates',
      label: 'Mises à jour du système',
      description: 'Recevoir des notifications pour les mises à jour importantes',
      enabled: true,
    },
    {
      id: 'alerts',
      label: 'Alertes de sécurité',
      description: 'Recevoir des notifications pour les alertes de sécurité',
      enabled: true,
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const handleSave = () => {
    // TODO: Sauvegarder les préférences dans le backend
    console.log('Saving notification settings:', settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Préférences de notification</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-medium text-gray-900">{setting.label}</h4>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleToggle(setting.id)}
                  className={`
                    relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
                    transition-colors ease-in-out duration-200 focus:outline-none
                    ${setting.enabled ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
                      transition ease-in-out duration-200
                      ${setting.enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Enregistrer les préférences
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsModal;
