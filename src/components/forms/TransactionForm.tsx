import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';

interface TransactionFormProps {
  type: 'recette' | 'depense';
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: {
    montant: string;
    description: string;
    date: string;
    categorie: string;
    contribuable?: string;
    beneficiaire?: string;
  };
}

const TransactionForm = ({ type, onSubmit, onCancel, initialData }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    montant: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    categorie: '',
    contribuable: '',
    beneficiaire: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categoriesRecettes = [
    'TFPCA',
    'Taxes établissements de nuit',
    'Recettes marché',
    'Taxes publicité',
    'Location des biens',
  ];

  const categoriesDepenses = [
    'Salaires et accessoires',
    'Équipements et matériel',
    'Projets de développement',
    'Entretien et maintenance',
    'Dépenses courantes',
  ];

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Modifier la transaction' : (type === 'recette' ? 'Nouvelle Recette' : 'Nouvelle Dépense')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Montant (FCFA)</label>
          <input
            type="number"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={formData.montant}
            onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Catégorie</label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={formData.categorie}
            onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
          >
            <option value="">Sélectionner une catégorie</option>
            {(type === 'recette' ? categoriesRecettes : categoriesDepenses).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {type === 'recette' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Contribuable</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.contribuable}
              onChange={(e) => setFormData({ ...formData, contribuable: e.target.value })}
            />
          </div>
        )}

        {type === 'depense' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Bénéficiaire</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.beneficiaire}
              onChange={(e) => setFormData({ ...formData, beneficiaire: e.target.value })}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            {initialData ? 'Enregistrer les modifications' : (type === 'recette' ? 'Enregistrer la recette' : 'Enregistrer la dépense')}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default TransactionForm;
