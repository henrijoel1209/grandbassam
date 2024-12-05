import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import type { Invoice, Supplier, Contract } from '@/types/supplier';

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Invoice, 'id' | 'status'>) => Promise<void>;
  initialData?: Invoice;
  suppliers: Supplier[];
  contracts: Contract[];
}

export default function InvoiceForm({ isOpen, onClose, onSubmit, initialData, suppliers, contracts }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Omit<Invoice, 'id' | 'status'>>({
    supplierId: initialData?.supplierId || '',
    contractId: initialData?.contractId || '',
    number: initialData?.number || '',
    date: initialData?.date || new Date(),
    dueDate: initialData?.dueDate || new Date(),
    amount: initialData?.amount || 0,
  });

  const [selectedSupplier, setSelectedSupplier] = useState<string>(initialData?.supplierId || '');

  const filteredContracts = contracts.filter(
    contract => contract.supplierId === selectedSupplier && contract.status === 'active'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  const handleSupplierChange = (supplierId: string) => {
    setSelectedSupplier(supplierId);
    setFormData(prev => ({
      ...prev,
      supplierId,
      contractId: '', // Reset contract when supplier changes
    }));
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
              {initialData ? 'Modifier la facture' : 'Nouvelle facture'}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.supplierId}
                  onChange={(e) => handleSupplierChange(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700">Contrat (optionnel)</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.contractId}
                  onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
                >
                  <option value="">Sélectionnez un contrat</option>
                  {filteredContracts.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.title} - {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(contract.value)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Numéro de facture</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de facturation</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date d'échéance</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.dueDate.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Montant</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
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
