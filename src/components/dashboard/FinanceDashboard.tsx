import React from 'react';
import { Card } from '../ui/card';

const DashboardCard = ({ title, value, subtitle, trend }: { 
  title: string; 
  value: string; 
  subtitle?: string;
  trend?: { value: number; label: string };
}) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    {trend && (
      <div className={`flex items-center mt-2 ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        <span className="text-sm font-medium">
          {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
        </span>
      </div>
    )}
  </Card>
);

const FinanceDashboard = () => {
  const summary = {
    totalBudget: 50000000,
    totalRecettes: 25000000,
    totalDepenses: 15000000,
    balance: 10000000,
    trends: {
      recettes: 12,
      depenses: -5,
      balance: 8
    }
  };

  const performance = {
    recouvrementTFPCA: 75,
    executionBudget: 45,
    tauxRecouvrement: 65
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord Financier</h2>
        <div className="flex space-x-4">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
            <option>Année 2024</option>
            <option>Année 2023</option>
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Générer Rapport
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Budget Total"
          value={`${summary.totalBudget.toLocaleString()} FCFA`}
          subtitle="Budget annuel"
        />
        <DashboardCard
          title="Recettes"
          value={`${summary.totalRecettes.toLocaleString()} FCFA`}
          subtitle="Total des recettes"
          trend={{ value: summary.trends.recettes, label: 'vs mois dernier' }}
        />
        <DashboardCard
          title="Dépenses"
          value={`${summary.totalDepenses.toLocaleString()} FCFA`}
          subtitle="Total des dépenses"
          trend={{ value: summary.trends.depenses, label: 'vs mois dernier' }}
        />
        <DashboardCard
          title="Balance"
          value={`${summary.balance.toLocaleString()} FCFA`}
          subtitle="Balance actuelle"
          trend={{ value: summary.trends.balance, label: 'vs mois dernier' }}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Indicateurs de Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h4 className="text-sm font-medium text-gray-500">Taux de Recouvrement TFPCA</h4>
            <div className="mt-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold">{performance.recouvrementTFPCA}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${performance.recouvrementTFPCA}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-sm font-medium text-gray-500">Taux d'Exécution du Budget</h4>
            <div className="mt-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold">{performance.executionBudget}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${performance.executionBudget}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-sm font-medium text-gray-500">Taux de Recouvrement Global</h4>
            <div className="mt-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold">{performance.tauxRecouvrement}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${performance.tauxRecouvrement}%` }}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
