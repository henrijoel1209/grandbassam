import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatCardProps {
  title: string;
  value: number;
  trend?: { trend: 'up' | 'down'; value: string };
  type: 'recette' | 'depense';
  status?: 'pending' | 'completed';
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  type,
  status,
  isLoading = false
}) => {
  const getBackgroundColor = () => {
    if (type === 'recette') {
      return status === 'pending' ? 'bg-green-50' : 'bg-gradient-to-br from-green-50 to-emerald-50';
    }
    return status === 'pending' ? 'bg-red-50' : 'bg-gradient-to-br from-red-50 to-rose-50';
  };

  const getTextColor = () => {
    return type === 'recette' ? 'text-green-600' : 'text-red-600';
  };

  const getBorderColor = () => {
    if (type === 'recette') {
      return status === 'pending' ? 'border-green-200' : 'border-green-100';
    }
    return status === 'pending' ? 'border-red-200' : 'border-red-100';
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className={`rounded-xl border ${getBorderColor()} ${getBackgroundColor()} p-6 animate-pulse`}>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        {trend && <div className="h-4 bg-gray-200 rounded w-1/3"></div>}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${getBorderColor()} ${getBackgroundColor()} p-6 hover:shadow-md transition-all duration-200 relative overflow-hidden group`}>
      <div className="relative z-10">
        <h3 className="text-gray-500 text-sm font-medium mb-3">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <p className={`text-2xl font-bold tracking-tight ${getTextColor()}`}>
            {formatValue(value)}
          </p>
        </div>
        {trend && (
          <div className="mt-3 flex items-center text-sm font-medium">
            {trend.trend === 'up' ? (
              <div className="flex items-center text-green-600">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span>+{trend.value}%</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                <span>-{trend.value}%</span>
              </div>
            )}
          </div>
        )}
        {status === 'pending' && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              En attente
            </span>
          </div>
        )}
      </div>
      
      {/* Effet de fond animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
    </div>
  );
};

export default StatCard;
