import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionForm from '@/components/forms/TransactionForm';
import type { Transaction } from '@/types/transaction';

const Depenses = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions('month', selectedCategory);

  const depenses = transactions.filter(t => t.type === 'depense');

  const categories = [
    { id: 1, nom: 'Salaires et accessoires', budget: 5000000 },
    { id: 2, nom: 'Équipements et matériel', budget: 2000000 },
    { id: 3, nom: 'Projets de développement', budget: 3000000 },
    { id: 4, nom: 'Entretien et maintenance', budget: 1000000 },
    { id: 5, nom: 'Dépenses courantes', budget: 800000 }
  ];

  const handleAddDepense = (data: any) => {
    const newDepense: Omit<Transaction, 'id'> = {
      type: 'depense',
      montant: Number(data.montant),
      date: new Date(data.date),
      category: data.categorie,
      description: data.description,
      beneficiaire: data.beneficiaire,
      status: 'pending'
    };
    addTransaction(newDepense);
    setShowTransactionForm(false);
    setSelectedTransaction(null);
  };

  const handleUpdateDepense = (data: any) => {
    if (selectedTransaction) {
      const updatedDepense = {
        ...selectedTransaction,
        montant: Number(data.montant),
        date: new Date(data.date),
        category: data.categorie,
        description: data.description,
        beneficiaire: data.beneficiaire,
      };
      updateTransaction(selectedTransaction.id, updatedDepense);
      setShowTransactionForm(false);
      setSelectedTransaction(null);
    }
  };

  const handleStatusChange = (depense: Transaction, newStatus: 'pending' | 'completed' | 'cancelled') => {
    updateTransaction(depense.id, { status: newStatus });
  };

  // Calculer les statistiques par catégorie
  const depensesByCategory = categories.map(category => {
    const totalDepenses = depenses
      .filter(d => d.category === category.nom && d.status === 'completed')
      .reduce((sum, d) => sum + d.montant, 0);
    const percentage = (totalDepenses / category.budget) * 100;
    return {
      ...category,
      totalDepenses,
      percentage: Math.min(percentage, 100)
    };
  });

  // Filtrer les dépenses
  const filteredDepenses = depenses.filter(depense => {
    const matchesStatus = filterStatus === 'all' || depense.status === filterStatus;
    const matchesSearch = 
      (depense.beneficiaire ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      depense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (depense.description ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Régie des Dépenses</h1>
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Complété</option>
              <option value="cancelled">Annulé</option>
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <button
              onClick={() => setShowTransactionForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Nouvelle Dépense
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Catégories de Dépenses</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {depensesByCategory.map((category) => (
              <Card key={category.id} className="p-6">
                <h3 className="text-lg font-medium">{category.nom}</h3>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {category.budget.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-gray-500">Budget alloué</p>
                  <p className="text-lg font-semibold text-gray-700 mt-1">
                    {category.totalDepenses.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-gray-500">Dépenses réalisées</p>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        category.percentage > 90 ? 'bg-red-600' :
                        category.percentage > 70 ? 'bg-yellow-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{category.percentage.toFixed(1)}% utilisé</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Dépenses Récentes</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bénéficiaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDepenses.map((depense) => (
                  <tr key={depense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{depense.category}</div>
                      <div className="text-sm text-gray-500">{depense.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{depense.beneficiaire ?? 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {depense.montant.toLocaleString()} FCFA
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(depense.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={depense.status}
                        onChange={(e) => handleStatusChange(depense, e.target.value as any)}
                        className={`text-sm rounded-full px-2 py-1 font-semibold
                          ${depense.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            depense.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}
                      >
                        <option value="pending">En attente</option>
                        <option value="completed">Complété</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedTransaction(depense);
                          setShowTransactionForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
                            deleteTransaction(depense.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <TransactionForm
              type="depense"
              onSubmit={selectedTransaction ? handleUpdateDepense : handleAddDepense}
              onCancel={() => {
                setShowTransactionForm(false);
                setSelectedTransaction(null);
              }}
              initialData={selectedTransaction ? {
                montant: selectedTransaction.montant.toString(),
                description: selectedTransaction.description || '',
                date: new Date(selectedTransaction.date).toISOString().split('T')[0],
                categorie: selectedTransaction.category,
                beneficiaire: selectedTransaction.beneficiaire || '',
              } : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Depenses;
