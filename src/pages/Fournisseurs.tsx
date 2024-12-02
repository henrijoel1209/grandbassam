import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Page } from '@/components/ui/Page';
import { Card } from '@/components/ui/Card';
import { useSuppliers } from '@/hooks/useSuppliers';
import { Button } from '@/components/ui/Button';
import { cn } from "@/lib/utils";
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';

interface SupplierFormData {
  name: string;
  description: string;
  contact: string;
  email: string;
}

const Fournisseurs: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { 
    suppliers, 
    contracts, 
    invoices,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    viewContract,
    downloadInvoice 
  } = useSuppliers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    description: '',
    contact: '',
    email: '',
  });

  const tabs = [
    { name: 'Fournisseurs', count: suppliers.length },
    { name: 'Contrats', count: contracts.length },
    { name: 'Factures', count: invoices.length },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSupplier) {
        await updateSupplier(selectedSupplier.id, formData);
        toast.success('Fournisseur mis à jour avec succès');
      } else {
        await addSupplier(formData);
        toast.success('Fournisseur ajouté avec succès');
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  const handleEdit = (supplier: any) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      description: supplier.description,
      contact: supplier.contact,
      email: supplier.email,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      try {
        await deleteSupplier(id);
        toast.success('Fournisseur supprimé avec succès');
      } catch (error) {
        toast.error('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setSelectedSupplier(null);
    setFormData({
      name: '',
      description: '',
      contact: '',
      email: '',
    });
  };

  return (
    <Page
      title="Gestion des Fournisseurs"
      description="Gérez vos fournisseurs, contrats et factures"
      actions={
        <Button 
          variant="default" 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter
        </Button>
      }
    >
      <Card>
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 border-b border-border">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  cn(
                    'px-4 py-2.5 text-sm font-medium leading-5',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-green-400 ring-white ring-opacity-60',
                    selected
                      ? 'border-b-2 border-green-500 text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:border-border'
                  )
                }
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className="ml-2 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {tab.count}
                  </span>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <div className="space-y-4">
                {suppliers.map((supplier) => (
                  <Card
                    key={supplier.id}
                    title={supplier.name}
                    description={supplier.description}
                    actions={
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(supplier)}
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Éditer
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(supplier.id)}
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Contact</h4>
                        <p className="mt-1 text-foreground">{supplier.contact}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                        <p className="mt-1 text-foreground">{supplier.email}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <Card
                    key={contract.id}
                    title={`Contrat ${contract.reference}`}
                    description={`Fournisseur: ${contract.supplierName}`}
                    actions={
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewContract(contract.id)}
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Date de début</h4>
                        <p className="mt-1 text-foreground">
                          {new Date(contract.startDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Date de fin</h4>
                        <p className="mt-1 text-foreground">
                          {new Date(contract.endDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <Card
                    key={invoice.id}
                    title={`Facture ${invoice.reference}`}
                    description={`Fournisseur: ${invoice.supplierName}`}
                    actions={
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadInvoice(invoice.id)}
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Montant</h4>
                        <p className="mt-1 text-foreground">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XOF',
                          }).format(invoice.amount)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                        <p className="mt-1 text-foreground">
                          {new Date(invoice.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Card>

      {/* Modal pour ajouter/éditer un fournisseur */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />

          <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              {selectedSupplier ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {selectedSupplier ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </Page>
  );
};

export default Fournisseurs;
