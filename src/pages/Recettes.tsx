import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionForm from '@/components/forms/TransactionForm';
import type { Transaction } from '@/types/transaction';

const Recettes = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecette, setSelectedRecette] = useState<Transaction | null>(null);
  const [updateKey, setUpdateKey] = useState(0);

  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions('month', selectedCategory);

  useEffect(() => {
    const handleUpdate = () => {
      setUpdateKey(prev => prev + 1);
    };

    window.addEventListener('transactions-update', handleUpdate);
    window.addEventListener('storage-update', handleUpdate);

    return () => {
      window.removeEventListener('transactions-update', handleUpdate);
      window.removeEventListener('storage-update', handleUpdate);
    };
  }, []);

  const recettes = useMemo(() => 
    transactions.filter(t => t.type === 'recette'),
    [transactions, updateKey]
  );

  const categories = [
    'TFPCA',
    'Taxes établissements de nuit',
    'Recettes marché',
    'Taxes publicité',
    'Location des biens',
  ];

  const handleAddRecette = (data: any) => {
    const newRecette: Omit<Transaction, 'id'> = {
      type: 'recette',
      montant: Number(data.montant),
      date: new Date(data.date),
      category: data.categorie,
      description: data.description,
      contribuable: data.contribuable,
      reference: `REF-${Date.now()}`,
      status: 'pending'
    };
    addTransaction(newRecette);
    setShowTransactionForm(false);
  };

  const handleStatusChange = (recette: Transaction, newStatus: 'pending' | 'completed' | 'cancelled') => {
    updateTransaction(recette.id, { status: newStatus });
  };

  // Calculer les statistiques
  const stats = {
    total: recettes.reduce((sum, r) => r.status === 'completed' ? sum + r.montant : sum, 0),
    count: recettes.length,
    completed: recettes.filter(r => r.status === 'completed').length,
    pending: recettes.filter(r => r.status === 'pending').length,
  };

  // Calculer les statistiques par catégorie
  const recettesByCategory = categories.map(category => {
    const totalRecettes = recettes
      .filter(r => r.category === category && r.status === 'completed')
      .reduce((sum, r) => sum + r.montant, 0);
    return {
      nom: category,
      total: totalRecettes,
      count: recettes.filter(r => r.category === category).length
    };
  });

  // Filtrer les recettes
  const filteredRecettes = recettes.filter(recette => {
    const matchesStatus = filterStatus === 'all' || recette.status === filterStatus;
    const matchesSearch = 
      recette.contribuable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recette.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recette.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Régie des Recettes</h1>
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
              Nouvelle Recette
            </button>
          </div>
        </div>

        {/* Statistiques générales */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
          <Card className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden">
            <dt className="text-sm font-medium text-gray-500 truncate">Total des recettes</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.total.toLocaleString()} FCFA
            </dd>
          </Card>
          <Card className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden">
            <dt className="text-sm font-medium text-gray-500 truncate">Nombre de transactions</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.count}</dd>
          </Card>
          <Card className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden">
            <dt className="text-sm font-medium text-gray-500 truncate">Transactions complétées</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.completed}</dd>
          </Card>
          <Card className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden">
            <dt className="text-sm font-medium text-gray-500 truncate">Transactions en attente</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.pending}</dd>
          </Card>
        </div>

        {/* Statistiques par catégorie */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recettes par Catégorie</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recettesByCategory.map((category) => (
              <Card key={category.nom} className="p-6">
                <h3 className="text-lg font-medium">{category.nom}</h3>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {category.total.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-gray-500">Total collecté</p>
                  <p className="text-lg mt-2">{category.count} transactions</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Liste des transactions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Transactions Récentes</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contribuable
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
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
                {filteredRecettes.map((recette) => (
                  <tr key={recette.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{recette.reference}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{recette.contribuable}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{recette.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {recette.montant.toLocaleString()} FCFA
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(recette.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={recette.status}
                        onChange={(e) => handleStatusChange(recette, e.target.value as any)}
                        className={`text-sm rounded-full px-2 py-1 font-semibold
                          ${recette.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            recette.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
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
                          setSelectedRecette(recette);
                          setShowTransactionForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
                            deleteTransaction(recette.id);
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

      {/* Modal pour le formulaire */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {selectedRecette ? 'Modifier la recette' : 'Nouvelle recette'}
              </h2>
              <button
                onClick={() => {
                  setShowTransactionForm(false);
                  setSelectedRecette(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <TransactionForm
              type="recette"
              onSubmit={(data) => {
                if (selectedRecette) {
                  // Mode modification
                  updateTransaction(selectedRecette.id, {
                    ...selectedRecette,
                    montant: Number(data.montant),
                    date: new Date(data.date),
                    category: data.categorie,
                    description: data.description,
                    contribuable: data.contribuable,
                  });
                  setSelectedRecette(null);
                } else {
                  // Mode ajout
                  handleAddRecette(data);
                }
                setShowTransactionForm(false);
              }}
              initialData={selectedRecette ? {
                montant: selectedRecette.montant.toString(),
                date: new Date(selectedRecette.date).toISOString().split('T')[0],
                categorie: selectedRecette.category,
                description: selectedRecette.description || '',
                contribuable: selectedRecette.contribuable || '',
              } : undefined}
              onCancel={() => {
                setShowTransactionForm(false);
                setSelectedRecette(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recettes;
