import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';

interface Budget {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  type: 'recette' | 'depense';
  category: string;
  fiscalYear: number;
}

interface Category {
  id: number;
  nom: string;
  budget: number;
}

export const useBudgets = (year: number = new Date().getFullYear()) => {
  // Catégories de dépenses avec leurs budgets
  const categories: Category[] = [
    { id: 1, nom: 'Salaires et accessoires', budget: 5000000 },
    { id: 2, nom: 'Équipements et matériel', budget: 2000000 },
    { id: 3, nom: 'Projets de développement', budget: 3000000 },
    { id: 4, nom: 'Entretien et maintenance', budget: 1000000 },
    { id: 5, nom: 'Dépenses courantes', budget: 800000 }
  ];

  // Calcul du budget total à partir des catégories
  const totalAllocated = categories.reduce((sum, category) => sum + category.budget, 0);

  const { transactions } = useTransactions('year');

  // Calcul des dépenses totales à partir des transactions
  const totalSpent = transactions
    .filter(transaction => transaction.type === 'depense' && new Date(transaction.date).getFullYear() === year)
    .reduce((sum, transaction) => sum + transaction.montant, 0);

  // Log des dépenses calculées pour le débogage
  console.log('Total Spent Calculated:', totalSpent);

  return {
    budgets: categories,
    totalAllocated,
    totalSpent,
    loading: false,
    error: null
  };
};

export default useBudgets;
