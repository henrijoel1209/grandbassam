import React from 'react';
import { useBudgets } from '@/hooks/useBudgets';

const BudgetTracker: React.FC = () => {
  const { budgets, totalAllocated, totalSpent } = useBudgets();
  
  // Log des valeurs pour le débogage
  console.log('Budgets:', budgets);
  console.log('Total Allocated:', totalAllocated);
  console.log('Total Spent:', totalSpent);
  
  // Calculer le pourcentage des dépenses
  const spendingPercentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  const remainingBudget = totalAllocated - totalSpent;

  // Formater les montants en FCFA
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Suivi du Budget</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Budget Total</span>
            <span className="text-sm font-medium text-gray-900">{formatAmount(totalAllocated)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `100%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Dépenses</span>
            <span className="text-sm font-medium text-gray-900">{formatAmount(totalSpent)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                spendingPercentage > 90 ? 'bg-red-500' : 
                spendingPercentage > 70 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Budget restant</span>
            <span className={`font-medium ${
              remainingBudget < 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatAmount(remainingBudget)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
