import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { PlusIcon, PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useSuppliers } from '@/hooks/useSuppliers';
import type { Supplier, Contract, Invoice, SupplierEvaluation } from '@/types/supplier';
import SupplierForm from '@/components/forms/SupplierForm';
import ContractForm from '@/components/forms/ContractForm';
import InvoiceForm from '@/components/forms/InvoiceForm';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Fournisseurs() {
  const {
    suppliers,
    contracts,
    invoices,
    evaluations,
    loading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addContract,
    updateContract,
    deleteContract,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addEvaluation,
  } = useSuppliers();

  const [selectedTab, setSelectedTab] = useState(0);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [isAddingContract, setIsAddingContract] = useState(false);
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [isAddingEvaluation, setIsAddingEvaluation] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleAddSupplier = async (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addSupplier(data);
      setIsAddingSupplier(false);
      toast.success('Fournisseur ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du fournisseur');
    }
  };

  const handleUpdateSupplier = async (id: string, data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await updateSupplier(id, data);
      setEditingItem(null);
      toast.success('Fournisseur mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du fournisseur');
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      await deleteSupplier(id);
      toast.success('Fournisseur supprimé avec succès');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression du fournisseur');
    }
  };

  const handleAddContract = async (data: Omit<Contract, 'id' | 'documents'>) => {
    try {
      await addContract(data);
      setIsAddingContract(false);
      toast.success('Contrat ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du contrat');
    }
  };

  const handleUpdateContract = async (id: string, data: Omit<Contract, 'id' | 'documents'>) => {
    try {
      await updateContract(id, data);
      setEditingItem(null);
      toast.success('Contrat mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du contrat');
    }
  };

  const handleDeleteContract = async (id: string) => {
    try {
      await deleteContract(id);
      toast.success('Contrat supprimé avec succès');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression du contrat');
    }
  };

  const handleAddInvoice = async (data: Omit<Invoice, 'id' | 'status'>) => {
    try {
      await addInvoice(data);
      setIsAddingInvoice(false);
      toast.success('Facture ajoutée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la facture');
    }
  };

  const handleUpdateInvoice = async (id: string, data: Omit<Invoice, 'id' | 'status'>) => {
    try {
      await updateInvoice(id, data);
      setEditingItem(null);
      toast.success('Facture mise à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la facture');
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      await deleteInvoice(id);
      toast.success('Facture supprimée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression de la facture');
    }
  };

  const handleAddEvaluation = async (data: Omit<SupplierEvaluation, 'id' | 'date' | 'overallScore'>) => {
    try {
      await addEvaluation(data);
      setIsAddingEvaluation(false);
      toast.success('Évaluation ajoutée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'évaluation');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Chargement...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des Fournisseurs</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez vos fournisseurs, contrats, factures et évaluations
          </p>
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mt-6">
          <Tab className={({ selected }) =>
            classNames(
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            )
          }>
            Fournisseurs
          </Tab>
          <Tab className={({ selected }) =>
            classNames(
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            )
          }>
            Contrats
          </Tab>
          <Tab className={({ selected }) =>
            classNames(
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            )
          }>
            Factures
          </Tab>
          <Tab className={({ selected }) =>
            classNames(
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            )
          }>
            Évaluations
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => setIsAddingSupplier(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nouveau Fournisseur
              </button>
            </div>

            <div className="mt-4 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Nom
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Contact
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Email
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Note
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Statut
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {suppliers.map((supplier) => (
                          <tr key={supplier.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {supplier.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {supplier.contactPerson}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {supplier.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <StarIcon
                                  className={classNames(
                                    supplier.rating >= 4 ? 'text-yellow-400' : 'text-gray-300',
                                    'h-5 w-5 flex-shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                                <span className="ml-1">{supplier.rating?.toFixed(1) || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span className={classNames(
                                'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                                supplier.status === 'active' ? 'bg-green-100 text-green-800' :
                                supplier.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              )}>
                                {supplier.status}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => setEditingItem(supplier)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                              <button
                                onClick={() => handleDeleteSupplier(supplier.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Contrats Panel */}
          <Tab.Panel>
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => setIsAddingContract(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nouveau Contrat
              </button>
            </div>

            <div className="mt-4 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Fournisseur
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Titre
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Valeur
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Date début
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Date fin
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Statut
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {contracts.map((contract) => {
                          const supplier = suppliers.find(s => s.id === contract.supplierId);
                          return (
                            <tr key={contract.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {supplier?.name || 'N/A'}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {contract.title}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(contract.value)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(contract.startDate).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(contract.endDate).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span className={classNames(
                                  'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                                  contract.status === 'active' ? 'bg-green-100 text-green-800' :
                                  contract.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                )}>
                                  {contract.status}
                                </span>
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                  onClick={() => setEditingItem(contract)}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                  onClick={() => handleDeleteContract(contract.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Factures Panel */}
          <Tab.Panel>
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => setIsAddingInvoice(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nouvelle Facture
              </button>
            </div>

            <div className="mt-4 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Fournisseur
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Numéro
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Montant
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Date
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Échéance
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Statut
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {invoices.map((invoice) => {
                          const supplier = suppliers.find(s => s.id === invoice.supplierId);
                          return (
                            <tr key={invoice.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {supplier?.name || 'N/A'}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {invoice.number}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(invoice.amount)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(invoice.date).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(invoice.dueDate).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span className={classNames(
                                  'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                )}>
                                  {invoice.status}
                                </span>
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                  onClick={() => setEditingItem(invoice)}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                  onClick={() => handleDeleteInvoice(invoice.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Évaluations Panel */}
          <Tab.Panel>
            {/* Similar structure to Suppliers panel */}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Modals */}
      <SupplierForm
        isOpen={isAddingSupplier}
        onClose={() => setIsAddingSupplier(false)}
        onSubmit={handleAddSupplier}
      />

      {editingItem && selectedTab === 0 && (
        <SupplierForm
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(data) => handleUpdateSupplier(editingItem.id, data)}
          initialData={editingItem}
        />
      )}

      <ContractForm
        isOpen={isAddingContract}
        onClose={() => setIsAddingContract(false)}
        onSubmit={handleAddContract}
        suppliers={suppliers}
      />

      {editingItem && selectedTab === 1 && (
        <ContractForm
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(data) => handleUpdateContract(editingItem.id, data)}
          initialData={editingItem}
          suppliers={suppliers}
        />
      )}

      <InvoiceForm
        isOpen={isAddingInvoice}
        onClose={() => setIsAddingInvoice(false)}
        onSubmit={handleAddInvoice}
        suppliers={suppliers}
        contracts={contracts}
      />

      {editingItem && selectedTab === 2 && (
        <InvoiceForm
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(data) => handleUpdateInvoice(editingItem.id, data)}
          initialData={editingItem}
          suppliers={suppliers}
          contracts={contracts}
        />
      )}
    </div>
  );
}
