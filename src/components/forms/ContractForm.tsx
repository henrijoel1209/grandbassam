import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import type { Contract, Supplier } from '@/types/supplier';

interface ContractFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Contract, 'id' | 'documents'>) => Promise<void>;
  initialData?: Contract;
  suppliers: Supplier[];
}

export default function ContractForm({ isOpen, onClose, onSubmit, initialData, suppliers }: ContractFormProps) {
  const [formData, setFormData] = useState<Omit<Contract, 'id' | 'documents'>>({
    supplierId: initialData?.supplierId || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || new Date(),
    endDate: initialData?.endDate || new Date(),
    value: initialData?.value || 0,
    status: initialData?.status || 'draft',
    terms: initialData?.terms || '',
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
              {initialData ? 'Modifier le contrat' : 'Nouveau contrat'}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                >
                  <option value="">Sélectionnez un fournisseur</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Titre</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de début</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.startDate.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.endDate.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Valeur</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) => setFormData({
                    ...formData,
                    status: e.target.value as 'draft' | 'active' | 'completed' | 'terminated'
                  })}
                >
                  <option value="draft">Brouillon</option>
                  <option value="active">Actif</option>
                  <option value="completed">Terminé</option>
                  <option value="terminated">Résilié</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Conditions</label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
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
