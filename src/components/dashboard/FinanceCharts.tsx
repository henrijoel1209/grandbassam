import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '@/utils/format';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FinanceChartsProps {
  recettesData: number[];
  depensesData: number[];
  labels: string[];
}

const FinanceCharts: React.FC<FinanceChartsProps> = ({
  recettesData,
  depensesData,
  labels,
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Recettes',
        data: recettesData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Dépenses',
        data: depensesData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value as number);
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Évolution Financière</h3>
      <Line options={options} data={data} />
    </div>
  );
};

export default FinanceCharts;
