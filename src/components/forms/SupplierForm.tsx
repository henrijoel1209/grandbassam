import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import type { Supplier } from '@/types/supplier';

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Supplier;
}

export default function SupplierForm({ isOpen, onClose, onSubmit, initialData }: SupplierFormProps) {
  const [formData, setFormData] = useState<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>({
    name: initialData?.name || '',
    registrationNumber: initialData?.registrationNumber || '',
    contactPerson: initialData?.contactPerson || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    },
    status: initialData?.status || 'active',
    category: initialData?.category || [],
    rating: initialData?.rating || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <div className="relative bg-white rounded-lg w-full max-w-md mx-4">
          <div className="p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              {initialData ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Numéro d'enregistrement</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Personne de contact</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-900">Adresse</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rue</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.address.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ville</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Code postal</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.address.postalCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, postalCode: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pays</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.address.country}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) => setFormData({
                    ...formData,
                    status: e.target.value as 'active' | 'inactive' | 'blacklisted'
                  })}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="blacklisted">Liste noire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Catégories</label>
                <input
                  type="text"
                  placeholder="Séparez les catégories par des virgules"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.category.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    category: e.target.value.split(',').map(cat => cat.trim()).filter(Boolean)
                  })}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {initialData ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
