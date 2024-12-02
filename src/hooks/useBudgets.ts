import { useState } from 'react';

interface Budget {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  type: 'recette' | 'depense';
  category: string;
  fiscalYear: number;
}

export const useBudgets = (year: number = new Date().getFullYear()) => {
  // Données statiques pour le suivi du budget
  const staticBudgets: Budget[] = [
    {
      id: '1',
      name: 'Budget Principal',
      allocated: 10000000,
      spent: 4500000,
      type: 'depense',
      category: 'Général',
      fiscalYear: year
    }
  ];

  return {
    budgets: staticBudgets,
    totalAllocated: 10000000,
    totalSpent: 4500000,
    loading: false,
    error: null
  };
};

export default useBudgets;
