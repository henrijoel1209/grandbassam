import React, { useState } from 'react';
import { exportToPDF, exportToExcel, exportToCSV } from '@/utils/export';
import { Transaction } from '@/hooks/useTransactions';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface ExportOptionsProps {
  transactions: Transaction[];
  title?: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ transactions, title = 'Rapport Financier' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    const exportData = transactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString('fr-FR'),
      Type: t.type === 'recette' ? 'Recette' : 'Dépense',
      Catégorie: t.category,
      Montant: `${t.montant.toLocaleString('fr-FR')} FCFA`,
      Statut: t.status === 'completed' ? 'Complété' : t.status === 'pending' ? 'En attente' : 'Annulé',
      Description: t.description || '-'
    }));

    switch (format) {
      case 'pdf':
        exportToPDF(exportData, title);
        break;
      case 'excel':
        exportToExcel(exportData, title);
        break;
      case 'csv':
        exportToCSV(exportData, title);
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all duration-200"
      >
        <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-gray-400" />
        Exporter
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40 transform opacity-100 scale-100 transition-all duration-200 ease-out origin-top-right">
            <div className="py-1" role="menu">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center space-x-2 transition-colors duration-150"
                role="menuitem"
              >
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3C6.44772 3 6 3.44772 6 4V16C6 16.5523 6.44772 17 7 17H13C13.5523 17 14 16.5523 14 16V7.41421C14 7.149 13.8946 6.89464 13.7071 6.70711L10.2929 3.29289C10.1054 3.10536 9.851 3 9.58579 3H7Z" />
                </svg>
                <span>Exporter en PDF</span>
              </button>
              
              <button
                onClick={() => handleExport('excel')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center space-x-2 transition-colors duration-150"
                role="menuitem"
              >
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3C6.44772 3 6 3.44772 6 4V16C6 16.5523 6.44772 17 7 17H13C13.5523 17 14 16.5523 14 16V7.41421C14 7.149 13.8946 6.89464 13.7071 6.70711L10.2929 3.29289C10.1054 3.10536 9.851 3 9.58579 3H7Z" />
                </svg>
                <span>Exporter en Excel</span>
              </button>
              
              <button
                onClick={() => handleExport('csv')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center space-x-2 transition-colors duration-150"
                role="menuitem"
              >
                <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3C6.44772 3 6 3.44772 6 4V16C6 16.5523 6.44772 17 7 17H13C13.5523 17 14 16.5523 14 16V7.41421C14 7.149 13.8946 6.89464 13.7071 6.70711L10.2929 3.29289C10.1054 3.10536 9.851 3 9.58579 3H7Z" />
                </svg>
                <span>Exporter en CSV</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportOptions;
