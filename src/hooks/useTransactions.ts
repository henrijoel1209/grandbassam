import { useMemo, useState } from 'react';
import { formatCurrency } from '@/utils/format';
import { useLocalStorage } from './useLocalStorage';

export interface Transaction {
  id: string;
  type: 'recette' | 'depense';
  montant: number;
  date: Date;
  category: string;
  status: 'pending' | 'completed' | 'cancelled';
  description?: string;
}

interface TransactionStats {
  totalRecettes: number;
  totalDepenses: number;
  pendingRecettes: number;
  pendingDepenses: number;
}

interface TransactionTrends {
  recettes: { trend: 'up' | 'down'; value: string };
  depenses: { trend: 'up' | 'down'; value: string };
}

interface ChartData {
  recettesData: { x: string; y: number; label: string }[];
  depensesData: { x: string; y: number; label: string }[];
  labels: string[];
}

export const useTransactions = (period: 'day' | 'week' | 'month' | 'year', selectedCategory: string) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Log des transactions enregistrées pour le débogage
  console.log('Stored Transactions:', transactions);

  // Filtrer les transactions en fonction de la période et de la catégorie
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const matchesDate = transactionDate >= startDate && transactionDate <= now;
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      const isCompleted = transaction.status === 'completed';
      return matchesDate && matchesCategory && isCompleted;
    });
  }, [transactions, period, selectedCategory]);

  // Log des transactions filtrées pour le débogage
  console.log('Filtered Transactions:', filteredTransactions);

  // Calculer les statistiques
  const stats = useMemo<TransactionStats>(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        const amount = transaction.montant;
        if (transaction.type === 'recette') {
          if (transaction.status === 'completed') {
            acc.totalRecettes += amount;
          } else if (transaction.status === 'pending') {
            acc.pendingRecettes += amount;
          }
        } else {
          if (transaction.status === 'completed') {
            acc.totalDepenses += amount;
          } else if (transaction.status === 'pending') {
            acc.pendingDepenses += amount;
          }
        }
        return acc;
      },
      {
        totalRecettes: 0,
        totalDepenses: 0,
        pendingRecettes: 0,
        pendingDepenses: 0,
      }
    );
  }, [filteredTransactions]);

  // Log des statistiques calculées pour le débogage
  console.log('Transaction Stats:', stats);

  // Calculer les tendances
  const trends: TransactionTrends = useMemo(() => {
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return { trend: 'up' as const, value: '0' };
      const percentChange = ((current - previous) / previous) * 100;
      return {
        trend: percentChange >= 0 ? ('up' as const) : ('down' as const),
        value: percentChange.toFixed(2) + '%',
      };
    };

    const previousStats = { totalRecettes: 0, totalDepenses: 0 }; // Placeholder for previous stats

    return {
      recettes: calculateTrend(stats.totalRecettes, previousStats.totalRecettes),
      depenses: calculateTrend(stats.totalDepenses, previousStats.totalDepenses),
    };
  }, [stats]);

  // Log des tendances calculées pour le débogage
  console.log('Transaction Trends:', trends);

  // Préparer les données pour les graphiques
  const chartData: ChartData = useMemo(() => {
    const recettesTransactions = filteredTransactions
      .filter(t => t.type === 'recette' && t.status === 'completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const depensesTransactions = filteredTransactions
      .filter(t => t.type === 'depense' && t.status === 'completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const recettesData = recettesTransactions.map(t => ({
      x: new Date(t.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      y: t.montant,
      label: `${t.category}: ${t.montant.toLocaleString('fr-FR')} FCFA`
    }));

    const depensesData = depensesTransactions.map(t => ({
      x: new Date(t.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      y: t.montant,
      label: `${t.category}: ${t.montant.toLocaleString('fr-FR')} FCFA`
    }));

    return {
      recettesData,
      depensesData,
      labels: [...new Set([
        ...recettesData.map(d => d.x),
        ...depensesData.map(d => d.x)
      ])].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    };
  }, [filteredTransactions]);

  // Obtenir les catégories uniques
  const categories = useMemo(() => 
    [...new Set(transactions.map(t => t.category))],
    [transactions]
  );

  // Ajouter une nouvelle transaction
  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    try {
      setIsLoading(true);
      const newTransaction: Transaction = {
        ...transactionData,
        id: crypto.randomUUID(),
        date: new Date(transactionData.date),
        status: 'completed'
      };
      setTransactions([...transactions, newTransaction]);
      setError(null);
    } catch (err) {
      setError("Erreur lors de l'ajout de la transaction");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour une transaction
  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    try {
      setIsLoading(true);
      const updatedTransactions = transactions.map(transaction =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      );
      setTransactions(updatedTransactions);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la mise à jour de la transaction");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une transaction
  const deleteTransaction = (id: string) => {
    try {
      setIsLoading(true);
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la suppression de la transaction");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transactions: filteredTransactions,
    isLoading,
    error,
    stats,
    trends,
    chartData,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
