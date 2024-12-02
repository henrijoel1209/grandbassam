import React, { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useNotifications } from '@/hooks/useNotifications';
import { useBudgets } from '@/hooks/useBudgets';
import StatCard from '@/components/dashboard/StatCard';
import TransactionForm from '@/components/forms/TransactionForm';
import ExportOptions from '@/components/dashboard/ExportOptions';
import BudgetTracker from '@/components/budget/BudgetTracker';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState<'recette' | 'depense'>('recette');

  const {
    transactions,
    isLoading,
    stats,
    trends,
    chartData,
    categories,
    addTransaction,
  } = useTransactions(period, selectedCategory);

  const {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
  } = useNotifications();

  const {
    budgets,
    addBudget,
    updateBudget,
  } = useBudgets();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.raw.label;
          }
        }
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: '600'
        },
        padding: {
          top: 10,
          bottom: 10
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `${value.toLocaleString('fr-FR')} FCFA`
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  const recettesChartConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Recettes',
        data: chartData.recettesData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgb(34, 197, 94)',
        borderWidth: 0,
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false
      }
    ]
  };

  const depensesChartConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Dépenses',
        data: chartData.depensesData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgb(239, 68, 68)',
        borderWidth: 0,
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false
      }
    ]
  };

  const handleAddTransaction = async (transaction: any) => {
    await addTransaction(transaction);
    addNotification({
      title: 'Nouvelle Transaction',
      message: `${transaction.type === 'recette' ? 'Recette' : 'Dépense'} de ${transaction.amount}€ ajoutée avec succès`,
      type: 'success',
    });
    setShowTransactionForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Tableau de Bord</h1>
            <div className="flex items-center space-x-4">
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as typeof period)}
                    className="appearance-none bg-white pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-all duration-200"
                  >
                    <option value="day">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="year">Cette année</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-white pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-all duration-200"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>

                <ExportOptions
                  transactions={transactions}
                  title={`Rapport Financier - ${selectedCategory === 'all' ? 'Toutes Catégories' : selectedCategory}`}
                />
              </div>
              
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onClearAll={clearAll}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Recettes Totales"
              value={stats.totalRecettes}
              trend={trends.recettes}
              type="recette"
              isLoading={isLoading}
            />
            <StatCard
              title="Dépenses Totales"
              value={stats.totalDepenses}
              trend={trends.depenses}
              type="depense"
              isLoading={isLoading}
            />
            <StatCard
              title="Recettes en Attente"
              value={stats.pendingRecettes}
              type="recette"
              status="pending"
              isLoading={isLoading}
            />
            <StatCard
              title="Dépenses en Attente"
              value={stats.pendingDepenses}
              type="depense"
              status="pending"
              isLoading={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Transactions - Recettes</h3>
              <Line options={chartOptions} data={recettesChartConfig} />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Transactions - Dépenses</h3>
              <Line options={chartOptions} data={depensesChartConfig} />
            </div>
          </div>

          <div className="mb-8">
            <BudgetTracker
              budgets={budgets}
              categories={categories}
              onAddBudget={addBudget}
              onUpdateBudget={updateBudget}
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                setTransactionType('recette');
                setShowTransactionForm(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Nouvelle Recette
            </button>
            <button
              onClick={() => {
                setTransactionType('depense');
                setShowTransactionForm(true);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Nouvelle Dépense
            </button>
          </div>
        </div>
      </div>

      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <TransactionForm
              type={transactionType}
              onSubmit={handleAddTransaction}
              onCancel={() => setShowTransactionForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
